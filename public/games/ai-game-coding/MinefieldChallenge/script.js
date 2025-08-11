class Minesweeper {
    constructor() {
        this.difficulties = {
            beginner: { gridSize: 9, mineCount: 10 },
            intermediate: { gridSize: 16, mineCount: 40 },
            expert: { gridSize: 16, mineCount: 99 }
        };
        this.currentDifficulty = 'beginner';
        this.gridSize = this.difficulties[this.currentDifficulty].gridSize;
        this.mineCount = this.difficulties[this.currentDifficulty].mineCount;
        this.grid = [];
        this.gameState = 'playing'; // 'playing', 'won', 'lost'
        this.firstClick = true;
        this.flaggedCount = 0;
        this.revealedCount = 0;
        this.timer = 0;
        this.timerInterval = null;
        
        this.initializeDOM();
        this.createGrid();
        this.setupEventListeners();
    }
    
    initializeDOM() {
        this.gridElement = document.getElementById('game-grid');
        this.mineCountElement = document.getElementById('mine-count');
        this.flagCountElement = document.getElementById('flag-count');
        this.timerElement = document.getElementById('timer');
        this.messageElement = document.getElementById('game-message');
        this.resetButton = document.getElementById('reset-btn');
        this.hintButton = document.getElementById('hint-btn');
        this.autoSolveButton = document.getElementById('auto-solve-btn');
        
        this.updateMineCount();
        this.updateFlagCount();
        this.updateTimer();
    }
    
    createGrid() {
        this.grid = [];
        this.gridElement.innerHTML = '';
        this.gridElement.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        this.gridElement.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;
        
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                const cell = {
                    row: row,
                    col: col,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0,
                    element: null
                };
                
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                cellElement.dataset.row = row;
                cellElement.dataset.col = col;
                
                cell.element = cellElement;
                this.grid[row][col] = cell;
                this.gridElement.appendChild(cellElement);
            }
        }
    }
    
    setupEventListeners() {
        this.gridElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.handleCellClick(row, col);
            }
        });
        
        this.gridElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('cell')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.handleCellRightClick(row, col);
            }
        });
        
        this.resetButton.addEventListener('click', () => {
            this.resetGame();
        });
        
        this.hintButton.addEventListener('click', () => {
            this.provideHint();
        });
        
        this.autoSolveButton.addEventListener('click', () => {
            this.autoSolve();
        });
        
        // Difficulty selector
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.target.closest('.difficulty-btn').dataset.difficulty;
                this.changeDifficulty(difficulty);
            });
        });
    }
    
    changeDifficulty(difficulty) {
        if (this.difficulties[difficulty]) {
            // Update active button
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');
            
            this.currentDifficulty = difficulty;
            this.gridSize = this.difficulties[difficulty].gridSize;
            this.mineCount = this.difficulties[difficulty].mineCount;
            this.resetGame();
        }
    }
    
    placeMines(excludeRow, excludeCol) {
        const positions = [];
        
        // Generate all possible positions except the first clicked cell
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (row !== excludeRow || col !== excludeCol) {
                    positions.push({ row, col });
                }
            }
        }
        
        // Randomly select mine positions
        for (let i = 0; i < this.mineCount; i++) {
            const randomIndex = Math.floor(Math.random() * positions.length);
            const { row, col } = positions.splice(randomIndex, 1)[0];
            this.grid[row][col].isMine = true;
        }
        
        // Calculate neighbor mine counts
        this.calculateNeighborMines();
    }
    
    calculateNeighborMines() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (!this.grid[row][col].isMine) {
                    this.grid[row][col].neighborMines = this.countNeighborMines(row, col);
                }
            }
        }
    }
    
    countNeighborMines(row, col) {
        let count = 0;
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (this.isValidPosition(r, c) && this.grid[r][c].isMine) {
                    count++;
                }
            }
        }
        return count;
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize;
    }
    
    handleCellClick(row, col) {
        if (this.gameState !== 'playing' || this.grid[row][col].isFlagged) {
            return;
        }
        
        if (this.firstClick) {
            this.placeMines(row, col);
            this.firstClick = false;
            this.startTimer();
        }
        
        if (this.grid[row][col].isMine) {
            this.gameOver(false);
        } else {
            this.revealCell(row, col);
            this.checkWinCondition();
        }
    }
    
    handleCellRightClick(row, col) {
        if (this.gameState !== 'playing' || this.grid[row][col].isRevealed) {
            return;
        }
        
        const cell = this.grid[row][col];
        cell.isFlagged = !cell.isFlagged;
        
        if (cell.isFlagged) {
            cell.element.classList.add('flagged');
            this.flaggedCount++;
        } else {
            cell.element.classList.remove('flagged');
            this.flaggedCount--;
        }
        
        this.updateFlagCount();
    }
    
    revealCell(row, col) {
        const cell = this.grid[row][col];
        
        if (cell.isRevealed || cell.isFlagged) {
            return;
        }
        
        cell.isRevealed = true;
        this.revealedCount++;
        cell.element.classList.add('revealed');
        
        if (cell.neighborMines > 0) {
            cell.element.textContent = cell.neighborMines;
            cell.element.classList.add(`number-${cell.neighborMines}`);
        } else {
            // Reveal neighboring cells for empty cells
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (this.isValidPosition(r, c)) {
                        this.revealCell(r, c);
                    }
                }
            }
        }
    }
    
    checkWinCondition() {
        const totalCells = this.gridSize * this.gridSize;
        if (this.revealedCount === totalCells - this.mineCount) {
            this.gameOver(true);
        }
    }
    
    gameOver(won) {
        this.gameState = won ? 'won' : 'lost';
        this.stopTimer();
        
        if (won) {
            this.showMessage('🎉 Congratulations! You won! 🎉', 'win');
            this.flagAllMines();
        } else {
            this.showMessage('💥 Game Over! You hit a mine! 💥', 'lose');
            this.revealAllMines();
        }
    }
    
    revealAllMines() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.grid[row][col];
                if (cell.isMine) {
                    cell.element.classList.add('mine');
                    cell.element.innerHTML = '💣';
                }
            }
        }
    }
    
    flagAllMines() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.grid[row][col];
                if (cell.isMine && !cell.isFlagged) {
                    cell.isFlagged = true;
                    cell.element.classList.add('flagged');
                    this.flaggedCount++;
                }
            }
        }
        this.updateFlagCount();
    }
    
    provideHint() {
        if (this.gameState !== 'playing' || this.firstClick) {
            return;
        }
        
        // Find a safe cell to reveal
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.grid[row][col];
                if (!cell.isRevealed && !cell.isFlagged && !cell.isMine) {
                    // Highlight the cell briefly
                    cell.element.style.backgroundColor = '#ffeb3b';
                    cell.element.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        cell.element.style.backgroundColor = '';
                        cell.element.style.transform = '';
                    }, 1000);
                    
                    return;
                }
            }
        }
    }
    
    autoSolve() {
        if (this.gameState !== 'playing' || this.firstClick) {
            return;
        }
        
        // Simple auto-solve: reveal all non-mine cells
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.grid[row][col];
                if (!cell.isMine && !cell.isRevealed) {
                    this.revealCell(row, col);
                }
            }
        }
        
        this.checkWinCondition();
    }
    
    showMessage(text, type) {
        this.messageElement.textContent = text;
        this.messageElement.className = `message ${type}`;
    }
    
    hideMessage() {
        this.messageElement.className = 'message hidden';
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimer() {
        this.timerElement.textContent = this.timer;
    }
    
    updateMineCount() {
        this.mineCountElement.textContent = this.mineCount;
    }
    
    updateFlagCount() {
        this.flagCountElement.textContent = this.flaggedCount;
    }
    
    resetGame() {
        this.gameState = 'playing';
        this.firstClick = true;
        this.flaggedCount = 0;
        this.revealedCount = 0;
        this.timer = 0;
        this.stopTimer();
        
        this.hideMessage();
        this.createGrid();
        this.updateMineCount();
        this.updateFlagCount();
        this.updateTimer();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
});