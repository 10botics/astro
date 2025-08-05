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
    let playerId = localStorage.getItem('chengyu_player_id');
    if (!playerId) {
        playerId = generatePlayerId();
        localStorage.setItem('chengyu_player_id', playerId);
    }
    return playerId;
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'error' ? '#f56565' : type === 'success' ? '#48bb78' : '#5a67d8'};
        color: white;
        border-radius: 8px;
        font-weight: 500;
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Game Logic Functions
function initializeGame() {
    gameState.playerId = getPlayerId();
    loadGameSession();
}

function loadGameSession() {
    // In a real app, this would be an API call
    // For now, we'll use localStorage to simulate persistence
    const savedSession = localStorage.getItem('chengyu_game_session');
    
    if (savedSession) {
        gameState.session = JSON.parse(savedSession);
    } else {
        gameState.session = {
            id: 1,
            playerId: gameState.playerId,
            currentRound: 1,
            totalRounds: 10,
            score: 0,
            level: 1,
            isCompleted: false,
            completedIdioms: []
        };
        saveGameSession();
    }
    
    loadCurrentPuzzle();
    loadRecentAttempts();
    updateUI();
}

function saveGameSession() {
    localStorage.setItem('chengyu_game_session', JSON.stringify(gameState.session));
}

function loadCurrentPuzzle() {
    const availableIdioms = idiomsDatabase.filter(
        idiom => !gameState.session.completedIdioms.includes(idiom.id)
    );
    
    if (availableIdioms.length === 0) {
        gameState.currentPuzzle = null;
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableIdioms.length);
    gameState.currentPuzzle = availableIdioms[randomIndex];
}

function loadRecentAttempts() {
    const savedAttempts = localStorage.getItem('chengyu_recent_attempts');
    if (savedAttempts) {
        gameState.recentAttempts = JSON.parse(savedAttempts);
    } else {
        gameState.recentAttempts = [];
    }
}

function saveRecentAttempts() {
    localStorage.setItem('chengyu_recent_attempts', JSON.stringify(gameState.recentAttempts));
}

function submitGuess(guess) {
    if (!gameState.currentPuzzle || gameState.isSubmitting) {
        return;
    }
    
    gameState.isSubmitting = true;
    updateSubmitButtonState();
    
    // Simulate API delay
    setTimeout(() => {
        processGuess(guess);
        gameState.isSubmitting = false;
        updateSubmitButtonState();
    }, 500);
}

function processGuess(guess) {
    const isCorrect = guess.trim() === gameState.currentPuzzle.chinese;
    let points = 0;
    
    if (isCorrect) {
        points = Math.max(10 - gameState.hintsUsed * 2, 1);
    }
    
    // Create attempt record
    const attempt = {
        id: Date.now(),
        sessionId: gameState.session.id,
        idiomId: gameState.currentPuzzle.id,
        userGuess: guess,
        isCorrect: isCorrect,
        hintsUsed: gameState.hintsUsed,
        points: points,
        timestamp: new Date().toISOString(),
        idiom: {
            chinese: gameState.currentPuzzle.chinese,
            pinyin: gameState.currentPuzzle.pinyin,
            meaning: gameState.currentPuzzle.meaning
        }
    };
    
    // Add to recent attempts
    gameState.recentAttempts.unshift(attempt);
    if (gameState.recentAttempts.length > 5) {
        gameState.recentAttempts.pop();
    }
    saveRecentAttempts();
    
    // Update session
    gameState.session.completedIdioms.push(gameState.currentPuzzle.id);
    gameState.session.score += points;
    gameState.session.currentRound = Math.min(gameState.session.currentRound + 1, gameState.session.totalRounds);
    gameState.session.isCompleted = gameState.session.currentRound > gameState.session.totalRounds;
    
    saveGameSession();
    
    // Show result modal
    showResultModal(attempt);
    
    // Reset for next round
    gameState.hintsUsed = 0;
    document.getElementById('user-guess').value = '';
    hideHint();
    
    // Load next puzzle
    loadCurrentPuzzle();
}

function showHint() {
    if (!gameState.currentPuzzle) return;
    
    const hintSection = document.getElementById('hint-section');
    const hintText = document.getElementById('hint-text');
    const hintBtn = document.getElementById('hint-btn');
    
    if (hintSection.classList.contains('hidden')) {
        gameState.hintsUsed++;
        hintText.textContent = `Pinyin: ${gameState.currentPuzzle.pinyin}`;
        hintSection.classList.remove('hidden');
        hintBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
            </svg>
            Hide Hint
        `;
    } else {
        hideHint();
    }
}

function hideHint() {
    const hintSection = document.getElementById('hint-section');
    const hintBtn = document.getElementById('hint-btn');
    
    hintSection.classList.add('hidden');
    hintBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
        </svg>
        Need a Hint?
    `;
}

function showResultModal(attempt) {
    const modal = document.getElementById('result-modal');
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const correctAnswer = document.getElementById('correct-answer');
    const answerPinyin = document.getElementById('answer-pinyin');
    const answerMeaning = document.getElementById('answer-meaning');
    
    // Update modal content
    if (attempt.isCorrect) {
        resultIcon.className = 'result-icon correct';
        resultIcon.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
        `;
        resultTitle.textContent = 'Correct!';
        resultMessage.textContent = `Great job! You earned ${attempt.points} points.`;
    } else {
        resultIcon.className = 'result-icon incorrect';
        resultIcon.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18"/>
                <path d="M6 6l12 12"/>
            </svg>
        `;
        resultTitle.textContent = 'Incorrect';
        resultMessage.textContent = "Don't worry, keep trying!";
    }
    
    correctAnswer.textContent = attempt.idiom.chinese;
    answerPinyin.textContent = attempt.idiom.pinyin;
    answerMeaning.textContent = attempt.idiom.meaning;
    
    modal.classList.remove('hidden');
    
    // Check if game is completed
    if (gameState.session.isCompleted) {
        setTimeout(() => {
            modal.classList.add('hidden');
            showGameCompleteModal();
        }, 2000);
    }
}

function showGameCompleteModal() {
    const modal = document.getElementById('complete-modal');
    const finalScore = document.querySelector('#final-score .score-value');
    
    finalScore.textContent = gameState.session.score;
    modal.classList.remove('hidden');
}

function resetGame() {
    // Clear saved data
    localStorage.removeItem('chengyu_game_session');
    localStorage.removeItem('chengyu_recent_attempts');
    
    // Reset game state
    gameState.session = {
        id: 1,
        playerId: gameState.playerId,
        currentRound: 1,
        totalRounds: 10,
        score: 0,
        level: 1,
        isCompleted: false,
        completedIdioms: []
    };
    gameState.hintsUsed = 0;
    gameState.recentAttempts = [];
    
    // Close modals
    document.getElementById('result-modal').classList.add('hidden');
    document.getElementById('complete-modal').classList.add('hidden');
    
    // Reset UI
    document.getElementById('user-guess').value = '';
    hideHint();
    
    // Load new game
    loadCurrentPuzzle();
    updateUI();
    
    showToast('Game reset! Starting a new game.', 'success');
}

// UI Update Functions
function updateUI() {
    updateProgressBar();
    updateHeader();
    updatePuzzleDisplay();
    updateRecentAttempts();
    updateCharCounter();
}

function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    const roundInfo = document.getElementById('round-info');
    
    if (gameState.session) {
        const percentage = (gameState.session.currentRound / gameState.session.totalRounds) * 100;
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
        roundInfo.textContent = `Round ${gameState.session.currentRound} of ${gameState.session.totalRounds}`;
    }
}

function updateHeader() {
    const levelSpan = document.getElementById('level');
    const scoreSpan = document.getElementById('score');
    
    if (gameState.session) {
        levelSpan.textContent = gameState.session.level;
        scoreSpan.textContent = gameState.session.score;
    }
}

function updatePuzzleDisplay() {
    const englishClue = document.getElementById('english-clue');
    
    if (gameState.currentPuzzle) {
        englishClue.textContent = gameState.currentPuzzle.englishClue;
    } else {
        englishClue.textContent = 'No more puzzles available!';
    }
}

function updateRecentAttempts() {
    const recentAttemptsSection = document.getElementById('recent-attempts');
    const attemptsList = document.getElementById('attempts-list');
    
    if (gameState.recentAttempts.length === 0) {
        recentAttemptsSection.classList.add('hidden');
        return;
    }
    
    recentAttemptsSection.classList.remove('hidden');
    attemptsList.innerHTML = '';
    
    gameState.recentAttempts.forEach(attempt => {
        const attemptItem = document.createElement('div');
        attemptItem.className = 'attempt-item';
        
        attemptItem.innerHTML = `
            <div class="attempt-left">
                <div class="attempt-icon ${attempt.isCorrect ? 'correct' : 'incorrect'}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${attempt.isCorrect ? 
                            '<path d="M20 6L9 17l-5-5"/>' : 
                            '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>'
                        }
                    </svg>
                </div>
                <div class="attempt-text">
                    <div class="attempt-answer chinese-text">${attempt.idiom.chinese}</div>
                    <div class="attempt-pinyin">${attempt.idiom.pinyin}</div>
                </div>
            </div>
            <div class="attempt-right">
                <div class="attempt-status ${attempt.isCorrect ? 'correct' : 'incorrect'}">
                    ${attempt.isCorrect ? 'Correct!' : 'Incorrect'}
                </div>
                <div class="attempt-points">
                    ${attempt.isCorrect ? `+${attempt.points} points` : 'Try again!'}
                </div>
            </div>
        `;
        
        attemptsList.appendChild(attemptItem);
    });
}

function updateCharCounter() {
    const input = document.getElementById('user-guess');
    const counter = document.getElementById('char-count');
    
    counter.textContent = input.value.length;
}

function updateSubmitButtonState() {
    const submitBtn = document.getElementById('submit-btn');
    const input = document.getElementById('user-guess');
    
    if (gameState.isSubmitting) {
        submitBtn.classList.add('loading-btn');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading-btn');
        submitBtn.disabled = !input.value.trim() || input.value.length !== 4;
    }
}

// Event Listeners
function setupEventListeners() {
    // Input events
    const userGuessInput = document.getElementById('user-guess');
    userGuessInput.addEventListener('input', () => {
        updateCharCounter();
        updateSubmitButtonState();
    });
    
    userGuessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !gameState.isSubmitting) {
            handleSubmitGuess();
        }
    });
    
    // Button events
    document.getElementById('submit-btn').addEventListener('click', handleSubmitGuess);
    document.getElementById('hint-btn').addEventListener('click', showHint);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    
    // Modal events
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('result-modal').classList.add('hidden');
    });
    
    document.getElementById('next-round-btn').addEventListener('click', () => {
        document.getElementById('result-modal').classList.add('hidden');
        updateUI();
    });
    
    document.getElementById('play-again-btn').addEventListener('click', resetGame);
    
    // Close modal on overlay click
    document.getElementById('result-modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            document.getElementById('result-modal').classList.add('hidden');
        }
    });
    
    document.getElementById('complete-modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            document.getElementById('complete-modal').classList.add('hidden');
        }
    });
}

// Main event handlers
function handleSubmitGuess() {
    const input = document.getElementById('user-guess');
    const guess = input.value.trim();
    
    if (!guess || guess.length !== 4) {
        showToast('Please enter exactly 4 Chinese characters.', 'error');
        input.classList.add('animate-shake');
        setTimeout(() => {
            input.classList.remove('animate-shake');
        }, 500);
        return;
    }
    
    if (!gameState.currentPuzzle) {
        showToast('No puzzle available.', 'error');
        return;
    }
    
    submitGuess(guess);
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen and show game
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        
        // Initialize game
        initializeGame();
        setupEventListeners();
    }, 1000);
});

// Handle page visibility changes to save game state
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        saveGameSession();
        saveRecentAttempts();
    }
});

// Save game state before page unload
window.addEventListener('beforeunload', () => {
    saveGameSession();
    saveRecentAttempts();
});