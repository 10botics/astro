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
        this.finalLevelElement = document.getElementById('finalLevel');
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
        
        // Menu button
        document.getElementById('menuBtn').addEventListener('click', () => {
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
        
        // Update FPS counter
        this.frameCount++;
        this.fpsTimer += deltaTime;
        if (this.fpsTimer >= 1000) {
            this.fpsDisplay = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
        }
        
        if (this.gameState.isPlaying()) {
            this.processInputBuffer();
            this.update(deltaTime);
        this.render();
        this.updateUI();
        }
        
        this.animationId = requestAnimationFrame(this.gameLoop);
    }
    
    processInputBuffer() {
        if (this.inputBuffer.length === 0) return;
            
        const input = this.inputBuffer.shift();
        let direction = null;
            
        switch (input) {
                case 'ArrowUp':
            case 'KeyW':
                direction = 'up';
                    break;
                case 'ArrowDown':
            case 'KeyS':
                direction = 'down';
                    break;
                case 'ArrowLeft':
            case 'KeyA':
                direction = 'left';
                    break;
                case 'ArrowRight':
            case 'KeyD':
                direction = 'right';
                    break;
            }
        
        if (direction) {
            this.handleDirection(direction);
        }
    }
    
    handleDirection(direction) {
        this.pacman.setDirection(direction);
    }
    
    update(deltaTime) {
        // Update Pac-Man
        this.pacman.update(deltaTime, this.maze);
        
        // Update ghosts
        this.ghosts.forEach(ghost => {
            ghost.update(deltaTime, this.maze, this.pacman.getPosition());
        });
        
        // Check collisions
        this.checkCollisions();
        
        // Check if level is complete
        if (this.maze.isComplete()) {
            this.gameState.nextLevel();
            this.resetLevel();
        }
    }
    
    checkCollisions() {
        const pacmanPos = this.pacman.getPosition();
        
        this.ghosts.forEach(ghost => {
            if (this.checkCollision(pacmanPos, ghost.getPosition())) {
                if (ghost.isFrightened()) {
                    // Pac-Man eats ghost
                    ghost.reset();
                    this.gameState.addScore(200);
                    this.audioManager.playEatGhost();
                } else {
                    // Ghost eats Pac-Man
                    this.gameState.loseLife();
                    this.audioManager.playDeath();
                    
                    if (this.gameState.getLives() <= 0) {
                        this.gameOver();
                    } else {
                        this.resetLevel();
                    }
                }
            }
        });
    }
    
    checkCollision(pos1, pos2) {
        const distance = Math.sqrt(
            Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
        );
        return distance < 20; // Collision threshold
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render maze
        this.maze.render(this.ctx);
        
        // Render Pac-Man
        this.pacman.render(this.ctx);
        
        // Render ghosts
        this.ghosts.forEach(ghost => {
            ghost.render(this.ctx);
        });
    }
    
    updateUI() {
        this.scoreElement.textContent = this.gameState.getScore();
        this.levelElement.textContent = this.gameState.getLevel();
        this.livesElement.textContent = '●'.repeat(this.gameState.getLives());
    }
    
    gameOver() {
        this.gameState.end();
        this.finalScoreElement.textContent = this.gameState.getScore();
        this.finalLevelElement.textContent = this.gameState.getLevel();
        this.gameOverScreen.classList.remove('hidden');
        this.stop();
    }
    
    resetLevel() {
        this.pacman.reset(this.maze.getStartPosition());
        this.ghosts.forEach(ghost => ghost.reset());
        this.maze.reset();
    }
}

class GameState {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.playing = false;
    }
    
    start() {
        this.playing = true;
    }
    
    restart() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.playing = true;
    }
    
    end() {
        this.playing = false;
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
    
    getScore() {
        return this.score;
    }
    
    getLevel() {
        return this.level;
    }
    
    getLives() {
        return this.lives;
    }
    
    isPlaying() {
        return this.playing;
    }
}

class AudioManager {
    constructor() {
        this.muted = false;
        this.audioContext = null;
        this.initializeSounds();
    }
    
    initializeSounds() {
        try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    toggleMute() {
        this.muted = !this.muted;
    }
    
    playTone(frequency, duration, volume = 0.1) {
        if (this.muted || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playEat() {
        this.playTone(800, 0.1);
    }
    
    playPowerUp() {
        this.playTone(400, 0.3);
        setTimeout(() => this.playTone(600, 0.3), 100);
    }
    
    playEatGhost() {
        this.playTone(200, 0.2);
        setTimeout(() => this.playTone(400, 0.2), 100);
        setTimeout(() => this.playTone(600, 0.2), 200);
    }
    
    playDeath() {
        this.playTone(200, 0.5);
        setTimeout(() => this.playTone(150, 0.5), 100);
        setTimeout(() => this.playTone(100, 0.5), 200);
    }
    
    playLevelComplete() {
        this.playTone(400, 0.2);
        setTimeout(() => this.playTone(500, 0.2), 100);
        setTimeout(() => this.playTone(600, 0.2), 200);
        setTimeout(() => this.playTone(700, 0.2), 300);
        setTimeout(() => this.playTone(800, 0.4), 400);
    }
    
    isMuted() {
        return this.muted;
    }
}

class Maze {
    constructor() {
        this.grid = [];
        this.dotCount = 0;
        this.powerPelletCount = 0;
        this.initializeMaze();
    }
    
    initializeMaze() {
        this.createMazeLayout();
        this.placeDots();
        this.placePowerPellets();
    }
    
    createMazeLayout() {
        // Create a simplified maze layout with proper spacing
        const layout = [
            "WWWWWWWWWWWWWWWWWWWW",
            "W....WW....WW....WW",
            "W.WW.WW.WW.WW.WW.WW",
            "W.WW.WW.WW.WW.WW.WW",
            "W....WW....WW....WW",
            "WWWW.WWWW.WWWW.WWWW",
            "    W    W    W    ",
            "WWWW.WWWW.WWWW.WWWW",
            "W....WW....WW....WW",
            "W.WW.WW.WW.WW.WW.WW",
            "W.WW.WW.WW.WW.WW.WW",
            "W....WW....WW....WW",
            "WWWWWWWWWWWWWWWWWWWW"
        ];
        
        this.grid = layout.map(row => row.split(''));
        this.width = this.grid[0].length;
        this.height = this.grid.length;
    }
    
    placeDots() {
        this.dotCount = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] === '.') {
                    this.dotCount++;
                }
            }
        }
    }
    
    placePowerPellets() {
        this.powerPelletCount = 4;
        // Place power pellets at corners
        const positions = [
            {x: 1, y: 1},
            {x: this.width - 2, y: 1},
            {x: 1, y: this.height - 2},
            {x: this.width - 2, y: this.height - 2}
        ];
        
        positions.forEach(pos => {
            if (this.grid[pos.y] && this.grid[pos.y][pos.x] === '.') {
                this.grid[pos.y][pos.x] = 'P';
            }
        });
    }
    
    isGhostArea(x, y) {
        return y >= 5 && y <= 7 && x >= 8 && x <= 11;
    }
    
    isWall(x, y) {
        const gridX = Math.floor(x / 40);
        const gridY = Math.floor(y / 40);
        
        if (gridY < 0 || gridY >= this.height || gridX < 0 || gridX >= this.width) {
            return true;
        }
        return this.grid[gridY][gridX] === 'W';
    }
    
    collectDot(x, y) {
        const gridX = Math.floor(x / 40);
        const gridY = Math.floor(y / 40);
        
        if (gridY >= 0 && gridY < this.height && gridX >= 0 && gridX < this.width) {
            if (this.grid[gridY][gridX] === '.') {
                this.grid[gridY][gridX] = ' ';
                this.dotCount--;
                return 10;
            } else if (this.grid[gridY][gridX] === 'P') {
                this.grid[gridY][gridX] = ' ';
                this.powerPelletCount--;
                return 50;
            }
        }
        return 0;
    }
    
    collectPowerPellet(x, y) {
        const gridX = Math.floor(x / 40);
        const gridY = Math.floor(y / 40);
        
        if (gridY >= 0 && gridY < this.height && gridX >= 0 && gridX < this.width) {
            if (this.grid[gridY][gridX] === 'P') {
                this.grid[gridY][gridX] = ' ';
                this.powerPelletCount--;
            return true;
        }
        }
        return false;
    }
    
    isComplete() {
        return this.dotCount === 0 && this.powerPelletCount === 0;
    }
    
    reset() {
        this.initializeMaze();
    }
    
    getStartPosition() {
        return { x: 60, y: 60 };
    }
    
    getGhostStartPositions() {
        return [
            { x: 300, y: 200 },
            { x: 500, y: 200 },
            { x: 300, y: 400 },
            { x: 500, y: 400 }
        ];
    }
    
    render(ctx) {
        const cellSize = 40;
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cellX = x * cellSize;
                const cellY = y * cellSize;
                
                if (this.grid[y][x] === 'W') {
                    // Wall
                    ctx.fillStyle = '#0000FF';
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                } else if (this.grid[y][x] === '.') {
                    // Dot
                    ctx.fillStyle = '#FFFF00';
                    ctx.beginPath();
                    ctx.arc(cellX + cellSize/2, cellY + cellSize/2, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (this.grid[y][x] === 'P') {
                    // Power pellet
        ctx.fillStyle = '#FFFF00';
                    ctx.beginPath();
                    ctx.arc(cellX + cellSize/2, cellY + cellSize/2, 8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }
}

class PacMan {
    constructor(startPos) {
        this.x = startPos.x;
        this.y = startPos.y;
        this.direction = 'right';
        this.speed = 150;
        this.mouthAngle = 0;
        this.mouthDirection = 1;
        this.radius = 15;
    }
    
    update(deltaTime, maze) {
        const moveDistance = (this.speed * deltaTime) / 1000;
        
        // Update mouth animation
        this.mouthAngle += this.mouthDirection * 0.3;
        if (this.mouthAngle >= 0.5 || this.mouthAngle <= 0) {
            this.mouthDirection *= -1;
        }
        
        // Calculate new position
        const newX = this.x + Math.cos(this.getDirectionAngle()) * moveDistance;
        const newY = this.y + Math.sin(this.getDirectionAngle()) * moveDistance;
        
        // Check collision with walls
        if (!maze.isWall(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }
        
        // Collect dots
        const points = maze.collectDot(this.x, this.y);
        if (points > 0) {
            // Trigger score update through game engine
            if (window.gameEngine) {
                window.gameEngine.gameState.addScore(points);
            }
        }
    }
    
    getDirectionOffset(direction) {
        switch (direction) {
            case 'up': return { x: 0, y: -1 };
            case 'down': return { x: 0, y: 1 };
            case 'left': return { x: -1, y: 0 };
            case 'right': return { x: 1, y: 0 };
            default: return { x: 0, y: 0 };
        }
    }
    
    getDirectionAngle() {
        switch (this.direction) {
            case 'up': return -Math.PI / 2;
            case 'down': return Math.PI / 2;
            case 'left': return Math.PI;
            case 'right': return 0;
            default: return 0;
        }
    }
    
    setDirection(direction) {
        this.direction = direction;
    }
    
    getPosition() {
        return { x: this.x, y: this.y };
    }
    
    reset(startPos) {
        this.x = startPos.x;
        this.y = startPos.y;
        this.direction = 'right';
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.getDirectionAngle());
        
        // Draw Pac-Man
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, this.mouthAngle, Math.PI * 2 - this.mouthAngle);
            ctx.lineTo(0, 0);
        ctx.fill();
        
        ctx.restore();
    }
}

class Ghost {
    constructor(startPos, color, type) {
        this.x = startPos.x;
        this.y = startPos.y;
        this.color = color;
        this.type = type;
        this.direction = 'left';
        this.speed = 80;
        this.frightened = false;
        this.frightenedTimer = 0;
        this.radius = 15;
        this.targetX = startPos.x;
        this.targetY = startPos.y;
    }
    
    update(deltaTime, maze, pacmanPos) {
        const moveDistance = (this.speed * deltaTime) / 1000;
        
        // Update frightened state
        if (this.frightened) {
            this.frightenedTimer -= deltaTime;
            if (this.frightenedTimer <= 0) {
                this.frightened = false;
            }
        }
        
        // Choose direction based on behavior
        this.chooseDirection(maze, pacmanPos);
        
        // Calculate new position
        const newX = this.x + Math.cos(this.getDirectionAngle()) * moveDistance;
        const newY = this.y + Math.sin(this.getDirectionAngle()) * moveDistance;
        
        // Check collision with walls
        if (!maze.isWall(newX, newY)) {
            this.x = newX;
            this.y = newY;
        } else {
            // Hit wall, choose new direction
            this.chooseRandomDirection(maze);
        }
    }
    
    chooseDirection(maze, pacmanPos) {
        if (this.frightened) {
            this.runAway(maze, pacmanPos);
        } else {
            // Add some randomness to make ghosts less predictable
            if (Math.random() < 0.1) {
                this.chooseRandomDirection(maze);
                return;
            }
            
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
            this.chaseTarget(maze, pacmanPos);
    }
    
    pinkyBehavior(maze, pacmanPos) {
        // Target 4 tiles ahead of Pac-Man
        const offset = this.getDirectionOffset(this.direction);
        const targetX = pacmanPos.x + offset.x * 160;
        const targetY = pacmanPos.y + offset.y * 160;
        this.chaseTarget(maze, { x: targetX, y: targetY });
    }
    
    inkyBehavior(maze, pacmanPos) {
        // Complex behavior - simplified for demo
        this.chaseTarget(maze, pacmanPos);
    }
    
    clydeBehavior(maze, pacmanPos) {
        const distance = Math.sqrt(
            Math.pow(this.x - pacmanPos.x, 2) + Math.pow(this.y - pacmanPos.y, 2)
        );
        
        if (distance > 200) {
            this.chaseTarget(maze, pacmanPos);
        } else {
            this.runAway(maze, pacmanPos);
        }
    }
    
    chaseTarget(maze, targetPos) {
        const directions = ['up', 'down', 'left', 'right'];
        let bestDirection = this.direction;
        let bestDistance = Infinity;
        
        directions.forEach(dir => {
            if (!this.isOppositeDirection(dir)) {
            const offset = this.getDirectionOffset(dir);
                const newX = this.x + offset.x * 40;
                const newY = this.y + offset.y * 40;
            
                if (!maze.isWall(newX, newY)) {
                const distance = Math.sqrt(
                        Math.pow(newX - targetPos.x, 2) + Math.pow(newY - targetPos.y, 2)
                );
                
                    if (distance < bestDistance) {
                        bestDistance = distance;
                    bestDirection = dir;
                }
            }
        }
        });
        
        this.direction = bestDirection;
    }
    
    runAway(maze, pacmanPos) {
        const directions = ['up', 'down', 'left', 'right'];
        let bestDirection = this.direction;
        let bestDistance = 0;
        
        directions.forEach(dir => {
            if (!this.isOppositeDirection(dir)) {
            const offset = this.getDirectionOffset(dir);
                const newX = this.x + offset.x * 40;
                const newY = this.y + offset.y * 40;
            
                if (!maze.isWall(newX, newY)) {
                const distance = Math.sqrt(
                        Math.pow(newX - pacmanPos.x, 2) + Math.pow(newY - pacmanPos.y, 2)
                );
                
                    if (distance > bestDistance) {
                        bestDistance = distance;
                    bestDirection = dir;
                }
            }
        }
        });
        
        this.direction = bestDirection;
    }
    
    patrol(maze) {
        // Simple patrol behavior
        if (Math.random() < 0.02) {
            this.chooseRandomDirection(maze);
        }
    }
    
    chooseRandomDirection(maze) {
        const directions = ['up', 'down', 'left', 'right'];
        const validDirections = directions.filter(dir => {
            if (this.isOppositeDirection(dir)) return false;
            
            const offset = this.getDirectionOffset(dir);
            const newX = this.x + offset.x * 40;
            const newY = this.y + offset.y * 40;
            
            return !maze.isWall(newX, newY);
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
        return opposites[direction] === this.direction;
    }
    
    getDirectionOffset(direction) {
        switch (direction) {
            case 'up': return { x: 0, y: -1 };
            case 'down': return { x: 0, y: 1 };
            case 'left': return { x: -1, y: 0 };
            case 'right': return { x: 1, y: 0 };
            default: return { x: 0, y: 0 };
        }
    }
    
    getDirectionAngle() {
        switch (this.direction) {
            case 'up': return -Math.PI / 2;
            case 'down': return Math.PI / 2;
            case 'left': return Math.PI;
            case 'right': return 0;
            default: return 0;
        }
    }
    
    setFrightened(frightened) {
        this.frightened = frightened;
        if (frightened) {
            this.frightenedTimer = 10000; // 10 seconds
        }
    }
    
    isFrightened() {
        return this.frightened;
    }
    
    getPosition() {
        return { x: this.x, y: this.y };
    }
    
    reset() {
        const startPositions = [
            { x: 300, y: 200 },
            { x: 500, y: 200 },
            { x: 300, y: 400 },
            { x: 500, y: 400 }
        ];
        
        const index = ['blinky', 'pinky', 'inky', 'clyde'].indexOf(this.type);
        if (index >= 0) {
            this.x = startPositions[index].x;
            this.y = startPositions[index].y;
        }
        
        this.direction = 'left';
        this.frightened = false;
        this.frightenedTimer = 0;
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Draw ghost body
        ctx.fillStyle = this.frightened ? '#0000FF' : this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI, true);
        ctx.rect(-this.radius, 0, this.radius * 2, this.radius);
        ctx.fill();
        
        // Draw ghost eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-5, -5, 3, 0, Math.PI * 2);
        ctx.arc(5, -5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw ghost pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-5, -5, 1, 0, Math.PI * 2);
        ctx.arc(5, -5, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new GameEngine();
    window.gameEngine.start();
});