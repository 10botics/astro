// Game state
let gameState = {
    grid: [],
    solution: [],
    selectedRow: null,
    selectedCol: null,
    mistakes: 0,
    maxMistakes: 3,
    timeElapsed: 0,
    isCompleted: false,
    difficulty: 'medium',
    isNotesMode: false,
    timerInterval: null
};

// Statistics
let stats = {
    gamesPlayed: 0,
    gamesWon: 0,
    bestTime: null,
    currentStreak: 0
};

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
    loadStats();
    startNewGame();
});

function initializeGame() {
    createGrid();
    updateDisplay();
}

function setupEventListeners() {
    // Number pad
    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const number = parseInt(btn.dataset.number);
            handleNumberInput(number);
        });
    });

    // Action buttons
    document.getElementById('erase-btn').addEventListener('click', handleErase);
    document.getElementById('notes-btn').addEventListener('click', toggleNotesMode);

    // Game actions
    document.getElementById('check-btn').addEventListener('click', checkSolution);
    document.getElementById('hint-btn').addEventListener('click', getHint);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('new-game-btn').addEventListener('click', () => startNewGame());

    // Difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const difficulty = btn.dataset.difficulty;
            changeDifficulty(difficulty);
        });
    });

    // Modal buttons
    document.getElementById('modal-new-game').addEventListener('click', () => {
        hideSuccessModal();
        startNewGame();
    });
    document.getElementById('modal-close').addEventListener('click', hideSuccessModal);

    // Keyboard input
    document.addEventListener('keydown', handleKeyPress);
}

function createGrid() {
    const gridContainer = document.getElementById('sudoku-grid');
    gridContainer.innerHTML = '';

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => selectCell(row, col));
            gridContainer.appendChild(cell);
        }
    }
}

function generateSudokuPuzzle(difficulty) {
    // Complete valid Sudoku solution
    const solution = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
    
    const removalCounts = {
        easy: 40,
        medium: 50,
        hard: 60,
        expert: 70
    };
    
    const removeCount = removalCounts[difficulty] || 50;
    const solutionArray = solution.split('');
    
    // Randomly remove numbers
    const positions = Array.from({ length: 81 }, (_, i) => i);
    shuffleArray(positions);
    
    for (let i = 0; i < removeCount; i++) {
        solutionArray[positions[i]] = '0';
    }
    
    return {
        puzzle: solutionArray.join(''),
        solution: solution
    };
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function stringToGrid(puzzleString) {
    const grid = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            const char = puzzleString[i * 9 + j];
            row.push({
                value: char === '0' ? 0 : parseInt(char),
                isGiven: char !== '0',
                isSelected: false,
                notes: new Set()
            });
        }
        grid.push(row);
    }
    return grid;
}

function startNewGame(difficulty = gameState.difficulty) {
    // Stop current timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    // Generate new puzzle
    const { puzzle, solution } = generateSudokuPuzzle(difficulty);
    
    // Initialize game state
    gameState = {
        grid: stringToGrid(puzzle),
        solution: stringToGrid(solution),
        selectedRow: null,
        selectedCol: null,
        mistakes: 0,
        maxMistakes: 3,
        timeElapsed: 0,
        isCompleted: false,
        difficulty: difficulty,
        isNotesMode: false,
        timerInterval: null
    };

    // Update stats
    stats.gamesPlayed++;
    saveStats();

    // Start timer
    startTimer();
    
    // Update display
    updateDisplay();
    updateGrid();
}

function changeDifficulty(difficulty) {
    // Update difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');
    
    // Start new game with new difficulty
    startNewGame(difficulty);
}

function selectCell(row, col) {
    if (gameState.grid[row][col].isGiven) return;

    // Clear previous selection
    gameState.grid.forEach(row => {
        row.forEach(cell => {
            cell.isSelected = false;
        });
    });

    // Select new cell
    gameState.grid[row][col].isSelected = true;
    gameState.selectedRow = row;
    gameState.selectedCol = col;

    updateGrid();
}

function handleNumberInput(number) {
    if (gameState.selectedRow === null || gameState.selectedCol === null) {
        showMessage('Please select a cell first', 'error');
        return;
    }

    const cell = gameState.grid[gameState.selectedRow][gameState.selectedCol];
    if (cell.isGiven) {
        showMessage('Cannot modify given numbers', 'error');
        return;
    }

    if (gameState.isNotesMode) {
        // Toggle note
        if (cell.notes.has(number)) {
            cell.notes.delete(number);
        } else {
            cell.notes.add(number);
        }
    } else {
        // Place number
        const isValid = isValidMove(gameState.selectedRow, gameState.selectedCol, number);
        
        if (!isValid) {
            gameState.mistakes++;
            showMessage('Invalid move - violates Sudoku rules', 'error');
            
            if (gameState.mistakes >= gameState.maxMistakes) {
                showMessage('Game Over - Too many mistakes!', 'error');
                return;
            }
        }

        cell.value = number;
        cell.notes.clear();
        
        // Check if puzzle is complete
        if (isPuzzleComplete()) {
            completeGame();
        }
    }

    updateDisplay();
    updateGrid();
}

function handleErase() {
    if (gameState.selectedRow === null || gameState.selectedCol === null) {
        showMessage('Please select a cell first', 'error');
        return;
    }

    const cell = gameState.grid[gameState.selectedRow][gameState.selectedCol];
    if (cell.isGiven) {
        showMessage('Cannot modify given numbers', 'error');
        return;
    }

    cell.value = 0;
    cell.notes.clear();
    
    updateDisplay();
    updateGrid();
}

function toggleNotesMode() {
    gameState.isNotesMode = !gameState.isNotesMode;
    const notesBtn = document.getElementById('notes-btn');
    if (gameState.isNotesMode) {
        notesBtn.classList.add('active');
    } else {
        notesBtn.classList.remove('active');
    }
}

function isValidMove(row, col, num) {
    // Check row
    for (let c = 0; c < 9; c++) {
        if (c !== col && gameState.grid[row][c].value === num) {
            return false;
        }
    }

    // Check column
    for (let r = 0; r < 9; r++) {
        if (r !== row && gameState.grid[r][col].value === num) {
            return false;
        }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if ((r !== row || c !== col) && gameState.grid[r][c].value === num) {
                return false;
            }
        }
    }

    return true;
}

function isPuzzleComplete() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (gameState.grid[row][col].value === 0) {
                return false;
            }
        }
    }
    return true;
}

function checkSolution() {
    if (isPuzzleComplete()) {
        showMessage('Puzzle Complete! Congratulations!', 'success');
        completeGame();
    } else {
        showMessage('Puzzle incomplete - fill in all empty cells', 'error');
    }
}

function getHint() {
    const emptyCells = [];
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (gameState.grid[row][col].value === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    
    if (emptyCells.length === 0) {
        showMessage('No hints available - puzzle is complete!', 'info');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    const correctValue = gameState.solution[row][col].value;
    
    gameState.grid[row][col].value = correctValue;
    gameState.grid[row][col].notes.clear();
    
    showMessage(`Hint applied: ${correctValue} at row ${row + 1}, column ${col + 1}`, 'success');
    
    updateGrid();
    
    if (isPuzzleComplete()) {
        completeGame();
    }
}

function restartGame() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Reset grid to initial state
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = gameState.grid[row][col];
            if (!cell.isGiven) {
                cell.value = 0;
                cell.notes.clear();
            }
            cell.isSelected = false;
        }
    }
    
    gameState.selectedRow = null;
    gameState.selectedCol = null;
    gameState.mistakes = 0;
    gameState.timeElapsed = 0;
    gameState.isCompleted = false;
    gameState.isNotesMode = false;
    
    const notesBtn = document.getElementById('notes-btn');
    notesBtn.classList.remove('active');
    
    startTimer();
    updateDisplay();
    updateGrid();
}

function completeGame() {
    gameState.isCompleted = true;
    
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Update stats
    stats.gamesWon++;
    stats.currentStreak++;
    
    if (!stats.bestTime || gameState.timeElapsed < stats.bestTime) {
        stats.bestTime = gameState.timeElapsed;
    }
    
    saveStats();
    updateDisplay();
    showSuccessModal();
}

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        if (!gameState.isCompleted) {
            gameState.timeElapsed++;
            updateTimer();
        }
    }, 1000);
}

function updateTimer() {
    const timer = document.getElementById('timer');
    timer.textContent = formatTime(gameState.timeElapsed);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    // Update timer
    updateTimer();
    
    // Update difficulty
    document.getElementById('current-difficulty').textContent = 
        gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
    
    // Update mistakes
    document.getElementById('mistakes').textContent = 
        `${gameState.mistakes}/${gameState.maxMistakes}`;
    
    // Update stats
    document.getElementById('games-played').textContent = stats.gamesPlayed;
    document.getElementById('games-won').textContent = stats.gamesWon;
    document.getElementById('best-time').textContent = 
        stats.bestTime ? formatTime(stats.bestTime) : '--:--';
    document.getElementById('current-streak').textContent = stats.currentStreak;
}

function updateGrid() {
    const cells = document.querySelectorAll('.sudoku-cell');
    
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const cellData = gameState.grid[row][col];
        
        // Clear cell content
        cell.innerHTML = '';
        cell.className = 'sudoku-cell';
        
        // Add state classes
        if (cellData.isSelected) {
            cell.classList.add('selected');
        }
        
        if (cellData.isGiven) {
            cell.classList.add('given');
        } else if (cellData.value !== 0) {
            cell.classList.add('user');
        }
        
        // Add content
        if (cellData.value !== 0) {
            cell.textContent = cellData.value;
        } else if (cellData.notes.size > 0) {
            const notesContainer = document.createElement('div');
            notesContainer.className = 'notes';
            
            for (let i = 1; i <= 9; i++) {
                const noteCell = document.createElement('div');
                noteCell.className = 'note-cell';
                if (cellData.notes.has(i)) {
                    noteCell.textContent = i;
                }
                notesContainer.appendChild(noteCell);
            }
            
            cell.appendChild(notesContainer);
        }
    });
}

function showSuccessModal() {
    document.getElementById('completion-time').textContent = formatTime(gameState.timeElapsed);
    document.getElementById('completion-difficulty').textContent = 
        gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
    document.getElementById('completion-mistakes').textContent = gameState.mistakes;
    
    document.getElementById('success-modal').classList.remove('hidden');
}

function hideSuccessModal() {
    document.getElementById('success-modal').classList.add('hidden');
}

function showMessage(message, type) {
    // Simple message display - could be enhanced with a toast system
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // For now, just use alert for important messages
    if (type === 'error' && (message.includes('Game Over') || message.includes('Invalid move'))) {
        alert(message);
    }
}

function handleKeyPress(e) {
    if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
    }
}

function saveStats() {
    localStorage.setItem('sudokuStats', JSON.stringify(stats));
}

function loadStats() {
    const savedStats = localStorage.getItem('sudokuStats');
    if (savedStats) {
        stats = { ...stats, ...JSON.parse(savedStats) };
    }
}