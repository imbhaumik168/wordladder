class WordGame {
    constructor() {
        this.wordLength = 3;
        this.maxAttempts = this.getMaxAttempts(this.wordLength);
        this.currentAttempt = 0;
        this.currentGuess = '';
        this.targetWord = '';
        this.gameOver = false;
        this.gameStarted = false;
        this.isAnimating = false;
        this.currentPosition = 0;

        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.gameBoard = document.querySelector('.game-board');
        this.keyboard = document.querySelector('.keyboard');
        this.messageElement = document.getElementById('gameMessage');
        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.wordLengthSelector = document.querySelector('.word-length-selector');
        this.wordLengthBtns = document.querySelectorAll('.word-length-btn');
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault(); // Prevent tab from changing focus
            }
            this.handleKeyPress(e);
        });

        this.keyboard.addEventListener('click', (e) => {
            if (e.target.classList.contains('key')) {
                e.target.classList.add('active');
                setTimeout(() => e.target.classList.remove('active'), 100);
                this.handleKeyClick(e.target.dataset.key);
            }
        });

        this.startBtn.addEventListener('click', () => {
            this.startBtn.classList.add('hidden');
            this.wordLengthSelector.classList.remove('hidden');
        });

        this.restartBtn.addEventListener('click', () => {
            this.restartBtn.classList.add('hidden');
            this.wordLengthSelector.classList.remove('hidden');
            this.resetGame();
        });

        this.wordLengthBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.wordLength = parseInt(btn.dataset.length);
                this.wordLengthBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.startGame();
            });
        });

        // Prevent focus on buttons (we'll handle everything with our own focus system)
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('focus', (e) => e.target.blur());
        });
    }

    getMaxAttempts(wordLength) {
        const attempts = {
            3: 5,
            5: 7,
            8: 9
        };
        return attempts[wordLength];
    }

    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
        this.currentAttempt = 0;
        this.currentGuess = '';
        this.currentPosition = 0;
        this.maxAttempts = this.getMaxAttempts(this.wordLength);
        this.targetWord = this.getRandomWord();
        this.wordLengthSelector.classList.add('hidden');
        this.gameBoard.classList.remove('hidden');
        this.keyboard.classList.remove('hidden');
        this.createGameBoard();
        this.resetKeyboard();
        this.messageElement.textContent = '';
        this.focusCurrentRow();
        this.updateCursor();
    }

    resetGame() {
        this.gameStarted = false;
        this.gameOver = false;
        this.currentAttempt = 0;
        this.currentGuess = '';
        this.currentPosition = 0;
        this.isAnimating = false;
        
        // Hide game elements
        this.gameBoard.classList.add('hidden');
        this.keyboard.classList.add('hidden');
        this.messageElement.textContent = '';
        
        // Reset the game board and keyboard
        this.gameBoard.innerHTML = '';
        this.resetKeyboard();
        
        // Reset word length buttons
        this.wordLengthBtns.forEach(btn => btn.classList.remove('active'));
    }

    getRandomWord() {
        const words = WORD_LISTS[this.wordLength];
        return words[Math.floor(Math.random() * words.length)];
    }

    createGameBoard() {
        this.gameBoard.innerHTML = '';
        for (let i = 0; i < this.maxAttempts; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            row.dataset.row = i;
            for (let j = 0; j < this.wordLength; j++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.dataset.index = j;
                row.appendChild(tile);
            }
            this.gameBoard.appendChild(row);
        }
    }

    focusCurrentRow() {
        const currentRow = this.gameBoard.children[this.currentAttempt];
        if (currentRow) {
            // Remove current-row class from all rows
            document.querySelectorAll('.row').forEach(row => {
                row.classList.remove('current-row');
            });
            currentRow.classList.add('current-row');
            this.currentPosition = 0;
            this.updateCursor();
        }
    }

    resetKeyboard() {
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.classList.remove('correct', 'wrong-position', 'wrong', 'active');
        });
    }

    updateGameBoard() {
        const currentRow = this.gameBoard.children[this.currentAttempt];
        const tiles = currentRow.children;

        for (let i = 0; i < this.wordLength; i++) {
            const tile = tiles[i];
            const letter = this.currentGuess[i] || '';
            
            if (letter && !tile.textContent) {
                // Add pop animation for new letters
                tile.classList.add('pop');
                setTimeout(() => tile.classList.remove('pop'), 100);
            }
            
            tile.textContent = letter;
            tile.classList.toggle('filled', !!letter);
        }
    }

    handleKeyPress(e) {
        if (!this.gameStarted || this.gameOver || this.isAnimating) return;

        if (e.key === 'Enter') {
            this.submitGuess();
        } else if (e.key === 'Backspace') {
            this.removeLastLetter();
        } else if (/^[A-Za-z]$/.test(e.key)) {
            this.addLetter(e.key.toUpperCase());
        }
    }

    handleKeyClick(key) {
        if (!this.gameStarted || this.gameOver || this.isAnimating) return;

        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.removeLastLetter();
        } else {
            this.addLetter(key);
        }
    }

    addLetter(letter) {
        if (this.currentGuess.length < this.wordLength) {
            this.currentGuess += letter;
            this.updateGameBoard();
            this.currentPosition = this.currentGuess.length;
            this.updateCursor();
        }
    }

    removeLastLetter() {
        if (this.currentGuess.length > 0) {
            this.currentGuess = this.currentGuess.slice(0, -1);
            this.updateGameBoard();
            this.currentPosition = this.currentGuess.length;
            this.updateCursor();
        }
    }

    async submitGuess() {
        if (this.currentGuess.length !== this.wordLength) {
            this.shakeCurrentRow();
            this.showMessage('Not enough letters!');
            return;
        }

        this.isAnimating = true;
        const result = this.checkGuess();
        await this.animateTileColors(result);
        this.updateKeyboardColors(result);

        if (this.currentGuess === this.targetWord) {
            this.gameOver = true;
            const currentRow = this.gameBoard.children[this.currentAttempt];
            const tiles = Array.from(currentRow.children);
            
            // Show and color the winning word
            for (let i = 0; i < this.wordLength; i++) {
                const tile = tiles[i];
                tile.textContent = this.targetWord[i];
                // Remove all existing color classes first
                tile.classList.remove('wrong', 'wrong-position', 'filled');
                tile.style.backgroundColor = ''; // Reset any inline background color
                tile.classList.add('correct');
            }
            
            this.showMessage(`Congratulations! You won! 🎉 The word was ${this.targetWord}`);
            this.showRestartButton();
        } else if (this.currentAttempt === this.maxAttempts - 1) {
            this.gameOver = true;
            this.showMessage(`Game Over! The word was ${this.targetWord}`);
            this.showRestartButton();
            this.markAllWrongTiles();
        } else {
            this.currentAttempt++;
            this.currentGuess = '';
            this.currentPosition = 0;
            this.focusCurrentRow();
        }

        this.isAnimating = false;
    }

    checkGuess() {
        const result = [];
        const targetLetters = [...this.targetWord];
        const guessLetters = [...this.currentGuess];

        // First pass: mark correct letters
        for (let i = 0; i < this.wordLength; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                result[i] = 'correct';
                targetLetters[i] = null;
                guessLetters[i] = null;
            }
        }

        // Second pass: mark wrong position letters
        for (let i = 0; i < this.wordLength; i++) {
            if (guessLetters[i] === null) continue;

            const targetIndex = targetLetters.indexOf(guessLetters[i]);
            if (targetIndex !== -1) {
                result[i] = 'wrong-position';
                targetLetters[targetIndex] = null;
            } else {
                result[i] = 'wrong';
            }
        }

        return result;
    }

    async animateTileColors(result) {
        const currentRow = this.gameBoard.children[this.currentAttempt];
        const tiles = Array.from(currentRow.children);
        
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            await new Promise(resolve => {
                setTimeout(() => {
                    tile.classList.add('flip');
                    setTimeout(() => {
                        tile.classList.add(result[i]);
                        tile.classList.remove('flip');
                        resolve();
                    }, 250);
                }, i * 250);
            });
        }
    }

    updateKeyboardColors(result) {
        const guessLetters = [...this.currentGuess];

        for (let i = 0; i < this.wordLength; i++) {
            const letter = guessLetters[i];
            const key = document.querySelector(`.key[data-key="${letter}"]`);
            
            if (key) {
                if (result[i] === 'correct') {
                    key.classList.remove('wrong-position', 'wrong');
                    key.classList.add('correct');
                } else if (result[i] === 'wrong-position' && !key.classList.contains('correct')) {
                    key.classList.remove('wrong');
                    key.classList.add('wrong-position');
                } else if (result[i] === 'wrong' && !key.classList.contains('correct') && !key.classList.contains('wrong-position')) {
                    key.classList.add('wrong');
                }
            }
        }
    }

    markAllWrongTiles() {
        const currentRow = this.gameBoard.children[this.currentAttempt];
        const tiles = currentRow.children;
        Array.from(tiles).forEach(tile => {
            tile.classList.add('all-wrong');
        });
    }

    shakeCurrentRow() {
        const currentRow = this.gameBoard.children[this.currentAttempt];
        currentRow.classList.add('wrongShake');
        setTimeout(() => {
            currentRow.classList.remove('wrongShake');
        }, 500);
    }

    showMessage(message) {
        this.messageElement.textContent = '';
        setTimeout(() => {
            this.messageElement.textContent = message;
        }, 100);
    }

    showRestartButton() {
        setTimeout(() => {
            this.restartBtn.classList.remove('hidden');
        }, 1000);
    }

    updateCursor() {
        const currentRow = this.gameBoard.children[this.currentAttempt];
        if (!currentRow) return;

        // Remove current cursor from all tiles
        document.querySelectorAll('.tile.current').forEach(tile => {
            tile.classList.remove('current');
        });

        // Add cursor to current position
        if (!this.gameOver) {
            const currentTile = currentRow.children[this.currentPosition];
            if (currentTile) {
                currentTile.classList.add('current');
            }
        }
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WordGame();
}); 