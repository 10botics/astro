class TicTacToe {
    constructor() {
        this.board = Array(16).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0,
            draws: 0
        };
        
        // Winning combinations (indices of the 4x4 grid)
        this.winningCombinations = [
            // Rows
            [0, 1, 2, 3],   // Top row
            [4, 5, 6, 7],   // Second row
            [8, 9, 10, 11], // Third row
            [12, 13, 14, 15], // Bottom row
            // Columns
            [0, 4, 8, 12],  // Left column
            [1, 5, 9, 13],  // Second column
            [2, 6, 10, 14], // Third column
            [3, 7, 11, 15], // Right column
            // Diagonals
            [0, 5, 10, 15], // Diagonal top-left to bottom-right
            [3, 6, 9, 12]   // Diagonal top-right to bottom-left
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.cells = document.querySelectorAll('.cell');
        this.statusElement = document.getElementById('status');
        this.resetButton = document.getElementById('resetBtn');
        this.xWinsElement = document.getElementById('xWins');
        this.oWinsElement = document.getElementById('oWins');
        this.drawsElement = document.getElementById('draws');
        
        this.bindEvents();
        this.updateStatus();
        this.updateScoreDisplay();
        this.updateHoverEffects();
    }
    
    bindEvents() {
        // Add click event listeners to all cells
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        // Add reset button event listener
        this.resetButton.addEventListener('click', () => this.resetGame());
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            // Handle numbers 1-9 for first 9 cells, then 0 for cell 10, q-f for cells 11-16
            let index = -1;
            if (e.key >= '1' && e.key <= '9') {
                index = parseInt(e.key) - 1;
            } else if (e.key === '0') {
                index = 9; // Cell 10
            } else if (e.key.toLowerCase() === 'q') {
                index = 10; // Cell 11
            } else if (e.key.toLowerCase() === 'w') {
                index = 11; // Cell 12
            } else if (e.key.toLowerCase() === 'e') {
                index = 12; // Cell 13
            } else if (e.key.toLowerCase() === 'r') {
                index = 13; // Cell 14
            } else if (e.key.toLowerCase() === 't') {
                index = 14; // Cell 15
            } else if (e.key.toLowerCase() === 'y') {
                index = 15; // Cell 16
            } else if (e.key.toLowerCase() === 'n') {
                this.resetGame();
                return;
            }
            
            if (index >= 0 && index < 16) {
                this.handleCellClick(index);
            }
        });
    }
    
    handleCellClick(index) {
        // Check if the cell is already occupied or game is not active
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        // Place the marker
        this.board[index] = this.currentPlayer;
        this.updateCellDisplay(index);
        
        // Check for win or draw
        if (this.checkWin()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            // Switch players
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatus();
            this.updateHoverEffects();
        }
    }
    
    updateCellDisplay(index) {
        const cell = this.cells[index];
        cell.textContent = this.currentPlayer;
        cell.classList.add('occupied');
        cell.classList.add(this.currentPlayer.toLowerCase());
        
        // Add animation class
        cell.style.animation = 'none';
        cell.offsetHeight; // Trigger reflow
        cell.style.animation = 'placeMarker 0.3s ease-out';
    }
    
    updateHoverEffects() {
        this.cells.forEach(cell => {
            cell.setAttribute('data-current', this.currentPlayer);
        });
    }
    
    checkWin() {
        return this.winningCombinations.some(combination => {
            const [a, b, c, d] = combination;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c] && this.board[a] === this.board[d]) {
                this.winningCombination = combination;
                return true;
            }
            return false;
        });
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.highlightWinningCells();
        this.updateStatus(`Player ${this.currentPlayer} Wins! 🎉`);
        this.statusElement.classList.add('winner');
        this.updateScoreDisplay();
        
        // Add celebration effect
        this.celebrateWin();
    }
    
    handleDraw() {
        this.gameActive = false;
        this.scores.draws++;
        this.updateStatus("It's a Draw! 🤝");
        this.statusElement.classList.add('draw');
        this.updateScoreDisplay();
    }
    
    highlightWinningCells() {
        if (this.winningCombination) {
            this.winningCombination.forEach(index => {
                this.cells[index].classList.add('winning');
            });
        }
    }
    
    celebrateWin() {
        // Add a simple celebration animation
        setTimeout(() => {
            this.cells.forEach(cell => {
                if (cell.classList.contains('winning')) {
                    cell.style.animation = 'winningCell 0.6s ease-in-out';
                }
            });
        }, 100);
    }
    
    updateStatus(message = null) {
        if (message) {
            this.statusElement.textContent = message;
        } else {
            this.statusElement.textContent = `Player ${this.currentPlayer}'s Turn`;
        }
    }
    
    updateScoreDisplay() {
        this.xWinsElement.textContent = this.scores.X;
        this.oWinsElement.textContent = this.scores.O;
        this.drawsElement.textContent = this.scores.draws;
    }
    
    resetGame() {
        // Reset game state
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningCombination = null;
        
        // Reset UI
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
            cell.style.animation = '';
        });
        
        // Reset status
        this.statusElement.classList.remove('winner', 'draw');
        this.updateStatus();
        this.updateHoverEffects();
        
        // Add reset animation
        this.cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.style.animation = 'placeMarker 0.2s ease-out reverse';
            }, index * 50);
        });
    }
    
    // Additional method to reset scores
    resetScores() {
        this.scores = { X: 0, O: 0, draws: 0 };
        this.updateScoreDisplay();
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new TicTacToe();
    
    // Optional: Add double-click on score board to reset scores
    document.querySelector('.score-board').addEventListener('dblclick', () => {
        if (confirm('Reset all scores?')) {
            game.resetScores();
        }
    });
    
    // Add keyboard instructions
    console.log('Keyboard controls for 4x4 grid:');
    console.log('- Press 1-9, 0, Q, W, E, R, T, Y for cells 1-16');
    console.log('- Press N to reset the game');
    console.log('- Double-click score board to reset scores');
});

// Add service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}