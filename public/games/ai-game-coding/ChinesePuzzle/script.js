// Game State
let gameState = {
    session: null,
    currentPuzzle: null,
    playerId: null,
    hintsUsed: 0,
    isSubmitting: false,
    recentAttempts: []
};

// Chinese Idioms Database
const idiomsDatabase = [
    {
        id: 1,
        chinese: "塞翁失马",
        pinyin: "sài wēng shī mǎ",
        englishClue: "A blessing in disguise; misfortune may be an actual blessing",
        meaning: "What seems like misfortune may actually turn out to be a blessing",
        difficulty: 1
    },
    {
        id: 2,
        chinese: "画蛇添足",
        pinyin: "huà shé tiān zú",
        englishClue: "To do something unnecessary that spoils the effect",
        meaning: "To ruin something by doing more than necessary",
        difficulty: 1
    },
    {
        id: 3,
        chinese: "守株待兔",
        pinyin: "shǒu zhū dài tù",
        englishClue: "To wait for something good to happen without making any effort",
        meaning: "To wait passively for opportunities instead of seeking them",
        difficulty: 1
    },
    {
        id: 4,
        chinese: "亡羊补牢",
        pinyin: "wáng yáng bǔ láo",
        englishClue: "Better late than never; it's not too late to fix something",
        meaning: "It's never too late to take corrective action",
        difficulty: 1
    },
    {
        id: 5,
        chinese: "杞人忧天",
        pinyin: "qǐ rén yōu tiān",
        englishClue: "To worry about things that will probably never happen",
        meaning: "Unnecessary worry about unlikely events",
        difficulty: 2
    },
    {
        id: 6,
        chinese: "滥竽充数",
        pinyin: "làn yú chōng shù",
        englishClue: "To pretend to be something you're not; to make up numbers",
        meaning: "To fill a position without having the proper qualifications",
        difficulty: 2
    },
    {
        id: 7,
        chinese: "刻舟求剑",
        pinyin: "kè zhōu qiú jiàn",
        englishClue: "To stick to old ways without adapting to new circumstances",
        meaning: "Being inflexible and not adapting to changing situations",
        difficulty: 2
    },
    {
        id: 8,
        chinese: "叶公好龙",
        pinyin: "yè gōng hào lóng",
        englishClue: "To claim to like something but actually fear it when encountered",
        meaning: "Professing to like something while actually being afraid of it",
        difficulty: 2
    },
    {
        id: 9,
        chinese: "掩耳盗铃",
        pinyin: "yǎn ěr dào líng",
        englishClue: "To deceive oneself; to refuse to face reality",
        meaning: "Self-deception; refusing to acknowledge obvious facts",
        difficulty: 2
    },
    {
        id: 10,
        chinese: "破釜沉舟",
        pinyin: "pò fǔ chén zhōu",
        englishClue: "To burn one's boats; to commit completely to a course of action",
        meaning: "To cut off all means of retreat and fight with determination",
        difficulty: 3
    }
];

// Utility Functions
function generatePlayerId() {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getPlayerId() {
    if (!gameState.playerId) {
        gameState.playerId = localStorage.getItem('playerId') || generatePlayerId();
        localStorage.setItem('playerId', gameState.playerId);
    }
    return gameState.playerId;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Game Initialization
function initializeGame() {
    loadGameSession();
    setupEventListeners();
    updateUI();
}

function loadGameSession() {
    const savedSession = localStorage.getItem('chinesePuzzleSession');
    if (savedSession) {
        try {
            gameState.session = JSON.parse(savedSession);
        } catch (e) {
            console.error('Error loading session:', e);
            gameState.session = null;
        }
    }
    
    if (!gameState.session) {
        gameState.session = {
            playerId: getPlayerId(),
            currentPuzzleIndex: 0,
            completedPuzzles: [],
            totalAttempts: 0,
            totalHintsUsed: 0,
            startTime: Date.now()
        };
    }
    
    loadCurrentPuzzle();
    loadRecentAttempts();
}

function saveGameSession() {
    localStorage.setItem('chinesePuzzleSession', JSON.stringify(gameState.session));
}

function loadCurrentPuzzle() {
    if (gameState.session.currentPuzzleIndex < idiomsDatabase.length) {
        gameState.currentPuzzle = idiomsDatabase[gameState.session.currentPuzzleIndex];
    } else {
        gameState.currentPuzzle = null;
    }
}

function loadRecentAttempts() {
    const saved = localStorage.getItem('recentAttempts');
    if (saved) {
        try {
            gameState.recentAttempts = JSON.parse(saved);
        } catch (e) {
            gameState.recentAttempts = [];
        }
    }
}

function saveRecentAttempts() {
    localStorage.setItem('recentAttempts', JSON.stringify(gameState.recentAttempts));
}

// Game Logic
function submitGuess(guess) {
    if (gameState.isSubmitting || !gameState.currentPuzzle) return;
    
    gameState.isSubmitting = true;
    gameState.session.totalAttempts++;
    
    const attempt = {
        id: Date.now(),
        puzzleId: gameState.currentPuzzle.id,
        guess: guess.trim(),
        timestamp: new Date().toISOString(),
        isCorrect: guess.trim().toLowerCase() === gameState.currentPuzzle.chinese.toLowerCase()
    };
    
    gameState.recentAttempts.unshift(attempt);
    if (gameState.recentAttempts.length > 10) {
        gameState.recentAttempts = gameState.recentAttempts.slice(0, 10);
    }
    
    saveRecentAttempts();
    processGuess(attempt);
}

function processGuess(attempt) {
    if (attempt.isCorrect) {
        showToast('恭喜！答案正確！', 'success');
        
        // Mark puzzle as completed
        if (!gameState.session.completedPuzzles.includes(gameState.currentPuzzle.id)) {
            gameState.session.completedPuzzles.push(gameState.currentPuzzle.id);
        }
        
        // Move to next puzzle
        gameState.session.currentPuzzleIndex++;
        loadCurrentPuzzle();
        
        setTimeout(() => {
            if (gameState.currentPuzzle) {
                showResultModal(attempt);
            } else {
                showGameCompleteModal();
            }
        }, 1000);
    } else {
        showToast('答案不正確，請再試一次', 'error');
        
        setTimeout(() => {
            showResultModal(attempt);
        }, 500);
    }
    
    saveGameSession();
    updateUI();
    gameState.isSubmitting = false;
}

// UI Functions
function showHint() {
    if (!gameState.currentPuzzle || gameState.hintsUsed >= 2) return;
    
    gameState.hintsUsed++;
    gameState.session.totalHintsUsed++;
    
    const hintElement = document.getElementById('hint');
    hintElement.style.display = 'block';
    hintElement.innerHTML = `
        <div class="hint-content">
            <h4>提示 ${gameState.hintsUsed}/2</h4>
            <p><strong>拼音:</strong> ${gameState.currentPuzzle.pinyin}</p>
            <p><strong>英文提示:</strong> ${gameState.currentPuzzle.englishClue}</p>
        </div>
    `;
    
    updateUI();
    saveGameSession();
}

function hideHint() {
    const hintElement = document.getElementById('hint');
    hintElement.style.display = 'none';
}

function showResultModal(attempt) {
    const modal = document.getElementById('resultModal');
    const content = document.getElementById('resultContent');
    
    if (attempt.isCorrect) {
        content.innerHTML = `
            <h3>🎉 恭喜！</h3>
            <p>你成功猜出了成語：<strong>${gameState.currentPuzzle.chinese}</strong></p>
            <p><strong>拼音:</strong> ${gameState.currentPuzzle.pinyin}</p>
            <p><strong>含義:</strong> ${gameState.currentPuzzle.meaning}</p>
            <button onclick="closeResultModal()" class="btn btn-primary">繼續下一題</button>
        `;
    } else {
        content.innerHTML = `
            <h3>❌ 答案不正確</h3>
            <p>你的答案：<strong>${attempt.guess}</strong></p>
            <p>正確答案：<strong>${gameState.currentPuzzle.chinese}</strong></p>
            <p><strong>拼音:</strong> ${gameState.currentPuzzle.pinyin}</p>
            <p><strong>含義:</strong> ${gameState.currentPuzzle.meaning}</p>
            <button onclick="closeResultModal()" class="btn btn-primary">繼續嘗試</button>
        `;
    }
    
    modal.style.display = 'flex';
}

function showGameCompleteModal() {
    const modal = document.getElementById('resultModal');
    const content = document.getElementById('resultContent');
    
    content.innerHTML = `
        <h3>🎊 遊戲完成！</h3>
        <p>恭喜你完成了所有成語挑戰！</p>
        <p>總嘗試次數：${gameState.session.totalAttempts}</p>
        <p>使用提示次數：${gameState.session.totalHintsUsed}</p>
        <button onclick="resetGame()" class="btn btn-primary">重新開始</button>
    `;
    
    modal.style.display = 'flex';
}

function resetGame() {
    gameState.session = {
        playerId: getPlayerId(),
        currentPuzzleIndex: 0,
        completedPuzzles: [],
        totalAttempts: 0,
        totalHintsUsed: 0,
        startTime: Date.now()
    };
    
    gameState.hintsUsed = 0;
    gameState.recentAttempts = [];
    
    loadCurrentPuzzle();
    saveGameSession();
    saveRecentAttempts();
    updateUI();
    closeResultModal();
}

function updateUI() {
    updateProgressBar();
    updateHeader();
    updatePuzzleDisplay();
    updateRecentAttempts();
    updateCharCounter();
    updateSubmitButtonState();
}

function updateProgressBar() {
    const progress = (gameState.session.completedPuzzles.length / idiomsDatabase.length) * 100;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${progress}%`;
    
    const progressText = document.getElementById('progressText');
    progressText.textContent = `${gameState.session.completedPuzzles.length}/${idiomsDatabase.length}`;
}

function updateHeader() {
    const title = document.getElementById('gameTitle');
    if (gameState.currentPuzzle) {
        title.textContent = `成語挑戰 ${gameState.session.currentPuzzleIndex + 1}/${idiomsDatabase.length}`;
    } else {
        title.textContent = '遊戲完成！';
    }
}

function updatePuzzleDisplay() {
    const puzzleDisplay = document.getElementById('puzzleDisplay');
    if (gameState.currentPuzzle) {
        puzzleDisplay.innerHTML = `
            <div class="puzzle-card">
                <h3>猜猜這個成語</h3>
                <div class="puzzle-hint">
                    <p><strong>英文提示:</strong> ${gameState.currentPuzzle.englishClue}</p>
                </div>
                <div class="input-group">
                    <input type="text" id="guessInput" placeholder="輸入成語..." maxlength="10">
                    <button id="submitBtn" class="btn btn-primary">提交</button>
                </div>
                <div class="char-counter">
                    字符數: <span id="charCount">0</span>/10
                </div>
            </div>
        `;
    } else {
        puzzleDisplay.innerHTML = `
            <div class="puzzle-card">
                <h3>🎉 恭喜完成所有挑戰！</h3>
                <p>你已經成功猜出了所有成語。</p>
            </div>
        `;
    }
}

function updateRecentAttempts() {
    const container = document.getElementById('recentAttempts');
    if (gameState.recentAttempts.length === 0) {
        container.innerHTML = '<p class="no-attempts">還沒有嘗試記錄</p>';
        return;
    }
    
    container.innerHTML = gameState.recentAttempts.map(attempt => {
        const puzzle = idiomsDatabase.find(p => p.id === attempt.puzzleId);
        return `
            <div class="attempt-item ${attempt.isCorrect ? 'correct' : 'incorrect'}">
                <div class="attempt-info">
                    <span class="attempt-puzzle">${puzzle ? puzzle.chinese : 'Unknown'}</span>
                    <span class="attempt-guess">${attempt.guess}</span>
                </div>
                <span class="attempt-status">${attempt.isCorrect ? '✓' : '✗'}</span>
            </div>
        `;
    }).join('');
}

function updateCharCounter() {
    const input = document.getElementById('guessInput');
    const counter = document.getElementById('charCount');
    if (input && counter) {
        input.addEventListener('input', () => {
            counter.textContent = input.value.length;
        });
    }
}

function updateSubmitButtonState() {
    const submitBtn = document.getElementById('submitBtn');
    const input = document.getElementById('guessInput');
    if (submitBtn && input) {
        submitBtn.disabled = !input.value.trim();
    }
}

// Event Listeners
function setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
        // Submit button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'submitBtn') {
                handleSubmitGuess();
            }
        });
        
        // Enter key in input
        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'guessInput' && e.key === 'Enter') {
                handleSubmitGuess();
            }
        });
        
        // Hint button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'hintBtn') {
                showHint();
            }
        });
        
        // Reset button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'resetBtn') {
                resetGame();
            }
        });
    });
}

function handleSubmitGuess() {
    const input = document.getElementById('guessInput');
    if (input && input.value.trim()) {
        submitGuess(input.value.trim());
        input.value = '';
        updateCharCounter();
        updateSubmitButtonState();
    }
}

function closeResultModal() {
    const modal = document.getElementById('resultModal');
    modal.style.display = 'none';
}

// Initialize the game
initializeGame(); 