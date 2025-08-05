class Minesweeper {
    constructor() {
        this.gridSize = 9;
        this.mineCount = 10;
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
        this.timerElement = document.getElementById('timer');
        this.messageElement = document.getElementById('game-message');
        this.resetButton = document.getElementById('reset-btn');
        
        this.updateMineCount();
        this.updateTimer();
    }
    
    createGrid() {
        this.grid = [];
        this.gridElement.innerHTML = '';
        
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
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (this.isValidPosition(newRow, newCol) && this.grid[newRow][newCol].isMine) {
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
        if (this.gameState !== 'playing') return;
        
        const cell = this.grid[row][col];
        if (cell.isRevealed || cell.isFlagged) return;
        
        // Place mines after first click to ensure first click is safe
        if (this.firstClick) {
            this.placeMines(row, col);
            this.firstClick = false;
            this.startTimer();
        }
        
        if (cell.isMine) {
            this.gameOver(false);
            return;
        }
        
        this.revealCell(row, col);
        this.checkWinCondition();
    }
    
    handleCellRightClick(row, col) {
        if (this.gameState !== 'playing') return;
        
        const cell = this.grid[row][col];
        if (cell.isRevealed) return;
        
        if (cell.isFlagged) {
            cell.isFlagged = false;
            cell.element.classList.remove('flagged');
            this.flaggedCount--;
        } else {
            cell.isFlagged = true;
            cell.element.classList.add('flagged');
            this.flaggedCount++;
        }
        
        this.updateMineCount();
    }
    
    revealCell(row, col) {
        const cell = this.grid[row][col];
        if (cell.isRevealed || cell.isFlagged) return;
        
        cell.isRevealed = true;
        cell.element.classList.add('revealed');
        this.revealedCount++;
        
        if (cell.neighborMines > 0) {
            cell.element.textContent = cell.neighborMines;
            cell.element.classList.add(`number-${cell.neighborMines}`);
        } else {
            // Reveal all adjacent cells if this cell has no neighboring mines
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (this.isValidPosition(newRow, newCol)) {
                        this.revealCell(newRow, newCol);
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
            this.showMessage('Congratulations! You won!', 'win');
        } else {
            this.showMessage('Game Over! You hit a mine!', 'lose');
            this.revealAllMines();
        }
    }
    
    revealAllMines() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.grid[row][col];
                if (cell.isMine) {
                    cell.element.classList.add('mine');
                    cell.element.textContent = '💣';
                }
            }
        }
    }
    
    showMessage(text, type) {
        this.messageElement.textContent = text;
        this.messageElement.className = `message ${type}`;
        this.messageElement.classList.remove('hidden');
    }
    
    hideMessage() {
        this.messageElement.classList.add('hidden');
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
        const remainingMines = this.mineCount - this.flaggedCount;
        this.mineCountElement.textContent = remainingMines;
    }
    
    resetGame() {
        this.stopTimer();
        this.gameState = 'playing';
        this.firstClick = true;
        this.flaggedCount = 0;
        this.revealedCount = 0;
        this.timer = 0;
        this.timerInterval = null;
        
        this.hideMessage();
        this.updateMineCount();
        this.updateTimer();
        this.createGrid();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
});