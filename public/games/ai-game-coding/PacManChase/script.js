// Game Engine - Pure JavaScript Implementation
class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = new GameState();
        this.audioManager = new AudioManager();
        this.maze = new Maze();
        this.pacman = new PacMan(this.maze.getStartPosition());
        this.ghosts = this.createGhosts();
        
        // Performance tracking
        this.animationId = 0;
        this.lastTime = 0;
        this.frameCount = 0;
        this.fpsDisplay = 0;
        this.fpsTimer = 0;
        this.inputBuffer = [];
        
        // UI elements
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.livesElement = document.getElementById('lives');
        this.finalScoreElement = document.getElementById('finalScore');
        this.readyScreen = document.getElementById('readyScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        
        this.initializeEventListeners();
        
        console.log('GameEngine initialized');
    }
    
    createGhosts() {
        const ghostPositions = this.maze.getGhostStartPositions();
        return [
            new Ghost(ghostPositions[0], 'red', 'blinky'),
            new Ghost(ghostPositions[1], 'pink', 'pinky'),
            new Ghost(ghostPositions[2], 'cyan', 'inky'),
            new Ghost(ghostPositions[3], 'orange', 'clyde')
        ];
    }
    
    initializeEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            event.preventDefault();
            this.inputBuffer.push(event.code);
        }, { passive: false });
        
        // Start button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.gameState.start();
            this.readyScreen.classList.add('hidden');
        });
        
        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.gameState.restart();
            this.gameOverScreen.classList.add('hidden');
            this.readyScreen.classList.remove('hidden');
        });
        
        // Mute button
        document.getElementById('muteBtn').addEventListener('click', () => {
            this.audioManager.toggleMute();
            document.getElementById('muteBtn').textContent = this.audioManager.isMuted ? '🔇' : '🔊';
        });
        
        // Mobile controls
        document.querySelectorAll('.mobile-btn').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const direction = btn.dataset.direction;
                this.handleDirection(direction);
            }, { passive: false });
            
            btn.addEventListener('click', (e) => {
                const direction = btn.dataset.direction;
                this.handleDirection(direction);
            });
        });
    }
    
    start() {
        console.log('Starting game engine');
        this.gameLoop(0);
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    gameLoop = (currentTime) => {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Cap deltaTime to prevent large jumps
        const cappedDeltaTime = Math.min(deltaTime, 16.67); // ~60fps minimum
        
        // Process input buffer immediately
        this.processInputBuffer();
        
        // Calculate FPS
        this.frameCount++;
        this.fpsTimer += deltaTime;
        if (this.fpsTimer >= 1000) {
            this.fpsDisplay = Math.round(this.frameCount * 1000 / this.fpsTimer);
            this.frameCount = 0;
            this.fpsTimer = 0;
        }
        
        this.update(cappedDeltaTime);
        this.render();
        this.updateUI();
        
        this.animationId = requestAnimationFrame(this.gameLoop);
    };
    
    processInputBuffer() {
        while (this.inputBuffer.length > 0) {
            const keyCode = this.inputBuffer.shift();
            
            if (this.gameState.phase !== 'playing') continue;
            
            switch (keyCode) {
                case 'ArrowUp':
                    this.pacman.setDirection('up');
                    break;
                case 'ArrowDown':
                    this.pacman.setDirection('down');
                    break;
                case 'ArrowLeft':
                    this.pacman.setDirection('left');
                    break;
                case 'ArrowRight':
                    this.pacman.setDirection('right');
                    break;
            }
        }
    }
    
    handleDirection(direction) {
        if (this.gameState.phase !== 'playing') return;
        this.pacman.setDirection(direction);
    }
    
    update(deltaTime) {
        if (this.gameState.phase !== 'playing') return;
        
        // Update Pac-Man
        this.pacman.update(deltaTime, this.maze);
        
        // Check dot collection
        const pacmanPos = this.pacman.getPosition();
        if (this.maze.collectDot(pacmanPos.x, pacmanPos.y)) {
            this.gameState.addScore(10);
            this.audioManager.playEat();
        }
        
        // Check power pellet collection
        if (this.maze.collectPowerPellet(pacmanPos.x, pacmanPos.y)) {
            this.gameState.addScore(50);
            this.ghosts.forEach(ghost => ghost.setFrightened(true));
            this.audioManager.playPowerUp();
            
            // Power pellet effect lasts 8 seconds
            setTimeout(() => {
                this.ghosts.forEach(ghost => ghost.setFrightened(false));
            }, 8000);
        }
        
        // Update ghosts
        this.ghosts.forEach(ghost => {
            ghost.update(deltaTime, this.maze, this.pacman.getPosition());
        });
        
        // Check collisions with ghosts
        this.ghosts.forEach(ghost => {
            if (this.checkCollision(this.pacman.getPosition(), ghost.getPosition())) {
                if (ghost.isFrightened()) {
                    // Eat ghost
                    this.gameState.addScore(200);
                    ghost.reset();
                    this.audioManager.playEatGhost();
                } else {
                    // Pac-Man dies
                    this.gameState.loseLife();
                    this.audioManager.playDeath();
                    
                    if (this.gameState.lives <= 0) {
                        this.gameState.end();
                        this.gameOverScreen.classList.remove('hidden');
                    } else {
                        // Reset positions
                        this.pacman.reset(this.maze.getStartPosition());
                        this.ghosts.forEach(ghost => ghost.reset());
                    }
                }
            }
        });
        
        // Check level completion
        if (this.maze.isComplete()) {
            this.gameState.nextLevel();
            this.maze.reset();
            this.pacman.reset(this.maze.getStartPosition());
            this.ghosts.forEach(ghost => ghost.reset());
            this.audioManager.playLevelComplete();
        }
    }
    
    checkCollision(pos1, pos2) {
        const distance = Math.sqrt(
            Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
        );
        return distance < 15;
    }
    
    render() {
        // Use performance optimized rendering
        this.ctx.save();
        
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render maze
        this.maze.render(this.ctx);
        
        // Render Pac-Man
        this.pacman.render(this.ctx);
        
        // Render ghosts
        this.ghosts.forEach(ghost => ghost.render(this.ctx));
        
        // Render FPS counter
        this.ctx.fillStyle = '#00FF00';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`FPS: ${this.fpsDisplay}`, 10, 25);
        
        this.ctx.restore();
    }
    
    updateUI() {
        this.scoreElement.textContent = this.gameState.score.toLocaleString();
        this.levelElement.textContent = this.gameState.level;
        this.livesElement.textContent = '●'.repeat(Math.max(0, this.gameState.lives));
        this.finalScoreElement.textContent = this.gameState.score.toLocaleString();
    }
}

// Game State Management
class GameState {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.phase = 'ready'; // 'ready', 'playing', 'ended'
    }
    
    start() {
        this.phase = 'playing';
    }
    
    restart() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.phase = 'ready';
    }
    
    end() {
        this.phase = 'ended';
    }
    
    addScore(points) {
        this.score += points;
    }
    
    loseLife() {
        this.lives--;
    }
    
    nextLevel() {
        this.level++;
    }
}

// Audio Manager
class AudioManager {
    constructor() {
        this.isMuted = false;
        this.sounds = {};
        this.initializeSounds();
    }
    
    initializeSounds() {
        // Create simple audio feedback using Web Audio API
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
    }
    
    playTone(frequency, duration, volume = 0.1) {
        if (this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playEat() {
        this.playTone(800, 0.1, 0.05);
    }
    
    playPowerUp() {
        this.playTone(523, 0.2, 0.1);
        setTimeout(() => this.playTone(659, 0.2, 0.1), 100);
        setTimeout(() => this.playTone(784, 0.2, 0.1), 200);
    }
    
    playEatGhost() {
        this.playTone(200, 0.3, 0.08);
    }
    
    playDeath() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.playTone(400 - (i * 50), 0.15, 0.06);
            }, i * 100);
        }
    }
    
    playLevelComplete() {
        const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.2, 0.08), i * 100);
        });
    }
}

// Maze Class
class Maze {
    constructor() {
        this.width = 25;
        this.height = 19;
        this.cellSize = 20;
        this.initializeMaze();
    }
    
    initializeMaze() {
        // Initialize arrays
        this.walls = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
        this.dots = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
        this.powerPellets = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
        
        this.createMazeLayout();
        this.placeDots();
        this.placePowerPellets();
    }
    
    createMazeLayout() {
        // Outer walls
        for (let x = 0; x < this.width; x++) {
            this.walls[0][x] = true;
            this.walls[this.height - 1][x] = true;
        }
        for (let y = 0; y < this.height; y++) {
            this.walls[y][0] = true;
            this.walls[y][this.width - 1] = true;
        }
        
        // Internal maze structure
        const mazePattern = [
            "█████████████████████████",
            "█ ████   ██  ██   ████ █",
            "█                     █",
            "█ ██ ███ ██ ███ ██ ██ █",
            "█    █          █     █",
            "████ █ ████████ █ ████",
            "   █ █    ██    █ █   ",
            "████ ████ ██ ████ ████",
            "█         ██         █",
            "████ ████ ██ ████ ████",
            "   █ █    ██    █ █   ",
            "████ █ ████████ █ ████",
            "█    █          █     █",
            "█ ██ ███ ██ ███ ██ ██ █",
            "█                     █",
            "█ ████   ██  ██   ████ █",
            "█████████████████████████"
        ];
        
        for (let y = 0; y < Math.min(this.height, mazePattern.length); y++) {
            for (let x = 0; x < Math.min(this.width, mazePattern[y].length); x++) {
                this.walls[y][x] = mazePattern[y][x] === '█';
            }
        }
    }
    
    placeDots() {
        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                if (!this.walls[y][x] && !this.isGhostArea(x, y)) {
                    this.dots[y][x] = true;
                }
            }
        }
    }
    
    placePowerPellets() {
        const corners = [
            {x: 2, y: 2},
            {x: this.width - 3, y: 2},
            {x: 2, y: this.height - 3},
            {x: this.width - 3, y: this.height - 3}
        ];
        
        corners.forEach(corner => {
            if (!this.walls[corner.y][corner.x]) {
                this.powerPellets[corner.y][corner.x] = true;
                this.dots[corner.y][corner.x] = false;
            }
        });
    }
    
    isGhostArea(x, y) {
        return x >= 10 && x <= 14 && y >= 8 && y <= 10;
    }
    
    isWall(x, y) {
        const gridX = Math.floor(x / this.cellSize);
        const gridY = Math.floor(y / this.cellSize);
        
        if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) {
            return true;
        }
        
        return this.walls[gridY][gridX];
    }
    
    collectDot(x, y) {
        const gridX = Math.floor(x / this.cellSize);
        const gridY = Math.floor(y / this.cellSize);
        
        if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) {
            return false;
        }
        
        if (this.dots[gridY][gridX]) {
            this.dots[gridY][gridX] = false;
            return true;
        }
        
        return false;
    }
    
    collectPowerPellet(x, y) {
        const gridX = Math.floor(x / this.cellSize);
        const gridY = Math.floor(y / this.cellSize);
        
        if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) {
            return false;
        }
        
        if (this.powerPellets[gridY][gridX]) {
            this.powerPellets[gridY][gridX] = false;
            return true;
        }
        
        return false;
    }
    
    isComplete() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.dots[y][x] || this.powerPellets[y][x]) {
                    return false;
                }
            }
        }
        return true;
    }
    
    reset() {
        this.initializeMaze();
    }
    
    getStartPosition() {
        return {
            x: Math.floor(this.width / 2) * this.cellSize,
            y: (this.height - 3) * this.cellSize
        };
    }
    
    getGhostStartPositions() {
        const centerX = Math.floor(this.width / 2) * this.cellSize;
        const centerY = Math.floor(this.height / 2) * this.cellSize;
        
        return [
            {x: centerX, y: centerY - this.cellSize},
            {x: centerX - this.cellSize, y: centerY},
            {x: centerX + this.cellSize, y: centerY},
            {x: centerX, y: centerY + this.cellSize}
        ];
    }
    
    render(ctx) {
        // Render walls
        ctx.fillStyle = '#0000FF';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.walls[y][x]) {
                    ctx.fillRect(
                        x * this.cellSize + 200,
                        y * this.cellSize + 100,
                        this.cellSize,
                        this.cellSize
                    );
                }
            }
        }
        
        // Render dots
        ctx.fillStyle = '#FFFF99';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.dots[y][x]) {
                    ctx.beginPath();
                    ctx.arc(
                        x * this.cellSize + 200 + this.cellSize / 2,
                        y * this.cellSize + 100 + this.cellSize / 2,
                        2,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        }
        
        // Render power pellets
        ctx.fillStyle = '#FFFF00';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.powerPellets[y][x]) {
                    ctx.beginPath();
                    ctx.arc(
                        x * this.cellSize + 200 + this.cellSize / 2,
                        y * this.cellSize + 100 + this.cellSize / 2,
                        6,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        }
    }
}

// PacMan Class
class PacMan {
    constructor(startPos) {
        this.x = startPos.x;
        this.y = startPos.y;
        this.startX = startPos.x;
        this.startY = startPos.y;
        this.direction = 'right';
        this.nextDirection = null;
        this.speed = 150; // pixels per second - optimized for 120fps
        this.mouthAngle = 0;
        this.animationTime = 0;
    }
    
    update(deltaTime, maze) {
        this.animationTime += deltaTime;
        
        // Try to change direction if requested
        if (this.nextDirection) {
            const nextX = this.x + this.getDirectionOffset(this.nextDirection).x * 5;
            const nextY = this.y + this.getDirectionOffset(this.nextDirection).y * 5;
            
            if (!maze.isWall(nextX, nextY)) {
                this.direction = this.nextDirection;
                this.nextDirection = null;
            }
        }
        
        // Move in current direction
        const offset = this.getDirectionOffset(this.direction);
        const newX = this.x + offset.x * this.speed * (deltaTime / 1000);
        const newY = this.y + offset.y * this.speed * (deltaTime / 1000);
        
        // Check wall collision
        if (!maze.isWall(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }
        
        // Handle screen wrapping
        if (this.x < 0) {
            this.x = 800;
        } else if (this.x > 800) {
            this.x = 0;
        }
        
        // Update mouth animation
        this.mouthAngle = Math.sin(this.animationTime * 0.01) * 0.8;
    }
    
    getDirectionOffset(direction) {
        switch (direction) {
            case 'up': return {x: 0, y: -1};
            case 'down': return {x: 0, y: 1};
            case 'left': return {x: -1, y: 0};
            case 'right': return {x: 1, y: 0};
        }
    }
    
    setDirection(direction) {
        this.nextDirection = direction;
    }
    
    getPosition() {
        return {x: this.x, y: this.y};
    }
    
    reset(startPos) {
        this.x = startPos.x;
        this.y = startPos.y;
        this.direction = 'right';
        this.nextDirection = null;
    }
    
    render(ctx) {
        const renderX = this.x + 200;
        const renderY = this.y + 100;
        
        ctx.save();
        ctx.translate(renderX, renderY);
        
        // Rotate based on direction
        switch (this.direction) {
            case 'up':
                ctx.rotate(-Math.PI / 2);
                break;
            case 'down':
                ctx.rotate(Math.PI / 2);
                break;
            case 'left':
                ctx.rotate(Math.PI);
                break;
            case 'right':
                // Default orientation
                break;
        }
        
        // Draw Pac-Man body
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        
        if (Math.abs(this.mouthAngle) > 0.1) {
            // Mouth open
            ctx.arc(0, 0, 8, this.mouthAngle, Math.PI * 2 - this.mouthAngle);
            ctx.lineTo(0, 0);
        } else {
            // Mouth closed
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
        }
        
        ctx.fill();
        
        // Draw eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-2, -4, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Ghost Class
class Ghost {
    constructor(startPos, color, type) {
        this.x = startPos.x;
        this.y = startPos.y;
        this.startX = startPos.x;
        this.startY = startPos.y;
        this.direction = 'up';
        this.speed = 120; // pixels per second - optimized for 120fps
        this.color = color;
        this.type = type;
        this.frightened = false;
        this.frightenedTime = 0;
        this.mode = 'scatter';
        this.modeTimer = 0;
    }
    
    update(deltaTime, maze, pacmanPos) {
        // Update mode timer
        this.modeTimer += deltaTime;
        
        // Switch between scatter and chase modes
        if (this.modeTimer > 7000) {
            this.mode = this.mode === 'scatter' ? 'chase' : 'scatter';
            this.modeTimer = 0;
        }
        
        // Update frightened state
        if (this.frightened) {
            this.frightenedTime += deltaTime;
            if (this.frightenedTime > 8000) {
                this.frightened = false;
                this.frightenedTime = 0;
            }
        }
        
        // Choose direction based on AI behavior
        this.chooseDirection(maze, pacmanPos);
        
        // Move in current direction
        const offset = this.getDirectionOffset(this.direction);
        const newX = this.x + offset.x * this.speed * (deltaTime / 1000);
        const newY = this.y + offset.y * this.speed * (deltaTime / 1000);
        
        // Check wall collision
        if (!maze.isWall(newX, newY)) {
            this.x = newX;
            this.y = newY;
        } else {
            this.chooseRandomDirection(maze);
        }
        
        // Handle screen wrapping
        if (this.x < 0) {
            this.x = 800;
        } else if (this.x > 800) {
            this.x = 0;
        }
    }
    
    chooseDirection(maze, pacmanPos) {
        if (this.frightened) {
            this.runAway(maze, pacmanPos);
        } else {
            switch (this.type) {
                case 'blinky':
                    this.blinkyBehavior(maze, pacmanPos);
                    break;
                case 'pinky':
                    this.pinkyBehavior(maze, pacmanPos);
                    break;
                case 'inky':
                    this.inkyBehavior(maze, pacmanPos);
                    break;
                case 'clyde':
                    this.clydeBehavior(maze, pacmanPos);
                    break;
            }
        }
    }
    
    blinkyBehavior(maze, pacmanPos) {
        if (this.mode === 'chase') {
            this.chaseTarget(maze, pacmanPos);
        } else {
            this.patrol(maze);
        }
    }
    
    pinkyBehavior(maze, pacmanPos) {
        if (this.mode === 'chase') {
            const targetPos = {
                x: pacmanPos.x + 80,
                y: pacmanPos.y
            };
            this.chaseTarget(maze, targetPos);
        } else {
            this.patrol(maze);
        }
    }
    
    inkyBehavior(maze, pacmanPos) {
        this.patrol(maze);
    }
    
    clydeBehavior(maze, pacmanPos) {
        const distance = Math.sqrt(
            Math.pow(this.x - pacmanPos.x, 2) + Math.pow(this.y - pacmanPos.y, 2)
        );
        
        if (distance > 100 && this.mode === 'chase') {
            this.chaseTarget(maze, pacmanPos);
        } else {
            this.patrol(maze);
        }
    }
    
    chaseTarget(maze, targetPos) {
        const directions = ['up', 'down', 'left', 'right'];
        let bestDirection = this.direction;
        let shortestDistance = Infinity;
        
        for (const dir of directions) {
            if (this.isOppositeDirection(dir)) continue;
            
            const offset = this.getDirectionOffset(dir);
            const testX = this.x + offset.x * 20;
            const testY = this.y + offset.y * 20;
            
            if (!maze.isWall(testX, testY)) {
                const distance = Math.sqrt(
                    Math.pow(testX - targetPos.x, 2) + Math.pow(testY - targetPos.y, 2)
                );
                
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    bestDirection = dir;
                }
            }
        }
        
        this.direction = bestDirection;
    }
    
    runAway(maze, pacmanPos) {
        const directions = ['up', 'down', 'left', 'right'];
        let bestDirection = this.direction;
        let longestDistance = 0;
        
        for (const dir of directions) {
            const offset = this.getDirectionOffset(dir);
            const testX = this.x + offset.x * 20;
            const testY = this.y + offset.y * 20;
            
            if (!maze.isWall(testX, testY)) {
                const distance = Math.sqrt(
                    Math.pow(testX - pacmanPos.x, 2) + Math.pow(testY - pacmanPos.y, 2)
                );
                
                if (distance > longestDistance) {
                    longestDistance = distance;
                    bestDirection = dir;
                }
            }
        }
        
        this.direction = bestDirection;
    }
    
    patrol(maze) {
        if (Math.random() < 0.02) {
            this.chooseRandomDirection(maze);
        }
    }
    
    chooseRandomDirection(maze) {
        const directions = ['up', 'down', 'left', 'right'];
        const validDirections = directions.filter(dir => {
            if (this.isOppositeDirection(dir)) return false;
            
            const offset = this.getDirectionOffset(dir);
            const testX = this.x + offset.x * 20;
            const testY = this.y + offset.y * 20;
            
            return !maze.isWall(testX, testY);
        });
        
        if (validDirections.length > 0) {
            this.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
        }
    }
    
    isOppositeDirection(direction) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        return opposites[this.direction] === direction;
    }
    
    getDirectionOffset(direction) {
        switch (direction) {
            case 'up': return {x: 0, y: -1};
            case 'down': return {x: 0, y: 1};
            case 'left': return {x: -1, y: 0};
            case 'right': return {x: 1, y: 0};
        }
    }
    
    setFrightened(frightened) {
        this.frightened = frightened;
        if (frightened) {
            this.frightenedTime = 0;
        }
    }
    
    isFrightened() {
        return this.frightened;
    }
    
    getPosition() {
        return {x: this.x, y: this.y};
    }
    
    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = 'up';
        this.frightened = false;
        this.frightenedTime = 0;
        this.mode = 'scatter';
        this.modeTimer = 0;
    }
    
    render(ctx) {
        const renderX = this.x + 200;
        const renderY = this.y + 100;
        
        // Ghost body
        ctx.fillStyle = this.frightened ? '#0000FF' : this.color;
        
        // Draw ghost shape
        ctx.beginPath();
        ctx.arc(renderX, renderY - 2, 8, Math.PI, 0);
        ctx.rect(renderX - 8, renderY - 2, 16, 12);
        
        // Ghost bottom wavy part
        ctx.moveTo(renderX - 8, renderY + 10);
        ctx.lineTo(renderX - 4, renderY + 6);
        ctx.lineTo(renderX, renderY + 10);
        ctx.lineTo(renderX + 4, renderY + 6);
        ctx.lineTo(renderX + 8, renderY + 10);
        ctx.lineTo(renderX + 8, renderY - 2);
        
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(renderX - 3, renderY - 2, 2, 0, Math.PI * 2);
        ctx.arc(renderX + 3, renderY - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        
        let pupilOffsetX = 0;
        let pupilOffsetY = 0;
        
        switch (this.direction) {
            case 'up': pupilOffsetY = -0.5; break;
            case 'down': pupilOffsetY = 0.5; break;
            case 'left': pupilOffsetX = -0.5; break;
            case 'right': pupilOffsetX = 0.5; break;
        }
        
        ctx.arc(renderX - 3 + pupilOffsetX, renderY - 2 + pupilOffsetY, 1, 0, Math.PI * 2);
        ctx.arc(renderX + 3 + pupilOffsetX, renderY - 2 + pupilOffsetY, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Frightened indicator
        if (this.frightened) {
            ctx.fillStyle = '#FFF';
            ctx.font = '8px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('!', renderX, renderY + 15);
        }
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.start();
});