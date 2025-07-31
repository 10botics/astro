// Game State
let board = new Array(16).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let winner = null;
let stats = { xWins: 0, oWins: 0, draws: 0 };

// Win conditions for 4x4 grid
const winConditions = [
  // 4-in-a-row patterns
  [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], // Rows
  [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], // Columns
  [0, 5, 10, 15], [3, 6, 9, 12], // Diagonals
  
  // 3-in-a-row patterns
  [0, 1, 2], [1, 2, 3], [4, 5, 6], [5, 6, 7], [8, 9, 10], [9, 10, 11], [12, 13, 14], [13, 14, 15], // 3-in-row horizontal
  [0, 4, 8], [4, 8, 12], [1, 5, 9], [5, 9, 13], [2, 6, 10], [6, 10, 14], [3, 7, 11], [7, 11, 15], // 3-in-row vertical
  [0, 5, 10], [5, 10, 15], [1, 6, 11], [2, 7, 12], [3, 6, 9], [6, 9, 12] // 3-in-row diagonal
];

// DOM Elements
const gameBoard = document.getElementById('game-board');
const gameStatus = document.getElementById('game-status');
const currentPlayerSpan = document.getElementById('current-player');
const resetBtn = document.getElementById('reset-btn');
const xWinsSpan = document.getElementById('x-wins');
const oWinsSpan = document.getElementById('o-wins');
const drawsSpan = document.getElementById('draws');

// Initialize game
function initGame() {
  createBoard();
  loadStats();
  updateDisplay();
  
  resetBtn.addEventListener('click', resetGame);
}

// Create game board
function createBoard() {
  gameBoard.innerHTML = '';
  
  for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    gameBoard.appendChild(cell);
  }
}

// Handle cell click
function handleCellClick(event) {
  const index = parseInt(event.target.dataset.index);
  
  if (!gameActive || board[index]) return;
  
  // Place symbol
  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add(currentPlayer === 'X' ? 'symbol-x' : 'symbol-o');
  
  // Check for win
  const winningLine = checkWin();
  if (winningLine) {
    winner = currentPlayer;
    gameActive = false;
    highlightWinningCells(winningLine);
    updateStats();
    updateDisplay();
    return;
  }
  
  // Check for draw
  if (board.every(cell => cell !== null)) {
    winner = 'draw';
    gameActive = false;
    updateStats();
    updateDisplay();
    return;
  }
  
  // Switch players
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateDisplay();
}

// Check for win
function checkWin() {
  for (const condition of winConditions) {
    const [a, b, c, d] = condition;
    
    // Check 4-in-a-row conditions
    if (condition.length === 4) {
      if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d]) {
        return condition;
      }
    }
    
    // Check 3-in-a-row conditions
    if (condition.length === 3) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return condition;
      }
    }
  }
  
  return null;
}

// Highlight winning cells
function highlightWinningCells(winningLine) {
  winningLine.forEach(index => {
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.classList.add('winner-cell');
  });
}

// Update display
function updateDisplay() {
  if (winner === 'draw') {
    gameStatus.innerHTML = '<span class="winner-message">🤝 It\'s a Draw!</span>';
  } else if (winner) {
    gameStatus.innerHTML = `<span class="winner-message">🎉 Player <span class="${winner === 'X' ? 'symbol-x' : 'symbol-o'}">${winner}</span> Wins!</span>`;
  } else {
    gameStatus.innerHTML = `Current Player: <span id="current-player" class="${currentPlayer === 'X' ? 'symbol-x' : 'symbol-o'}">${currentPlayer}</span>`;
  }
  
  // Update stats display
  xWinsSpan.textContent = stats.xWins;
  oWinsSpan.textContent = stats.oWins;
  drawsSpan.textContent = stats.draws;
}

// Reset game
function resetGame() {
  board = new Array(16).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  winner = null;
  
  // Clear board display
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('symbol-x', 'symbol-o', 'winner-cell');
  });
  
  updateDisplay();
}

// Update stats
function updateStats() {
  if (winner === 'X') {
    stats.xWins++;
  } else if (winner === 'O') {
    stats.oWins++;
  } else if (winner === 'draw') {
    stats.draws++;
  }
  
  saveStats();
}

// Save stats to localStorage
function saveStats() {
  localStorage.setItem('tic-tac-toe-stats', JSON.stringify(stats));
}

// Load stats from localStorage
function loadStats() {
  const savedStats = localStorage.getItem('tic-tac-toe-stats');
  if (savedStats) {
    stats = JSON.parse(savedStats);
  }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);