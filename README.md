# Word Ladder Game

## Overview

The Word Ladder Game is an interactive word-guessing game built with HTML, CSS, and JavaScript. Players must guess a hidden word of a selected length within a limited number of attempts. The game provides feedback on each letter guessed, helping players deduce the correct word.

## Features

- Choose word length: 3, 5, or 8 letters
- Limited attempts:
  - 3-letter words: 5 attempts
  - 5-letter words: 7 attempts
  - 8-letter words: 9 attempts
- Color-coded feedback system:
  - **Green**: Correct letter in the correct position
  - **Red**: Incorrect letter
  - **Blackish**: Correct letter in the wrong position
- Interactive keyboard input
- Restart and word-length selection options

## How to Play

1. Click "Start" and choose a word length.
2. Type your guess or use the on-screen keyboard.
3. Submit your guess by pressing **Enter**.
4. Observe color feedback for each letter:
   - **Green**: Letter is correct and in the right position.
   - **Red**: Letter is incorrect.
   - **Blackish**: Letter is correct but in the wrong position.
5. Continue guessing within the allowed attempts.
6. Win by correctly guessing the word or lose when attempts run out.

## Technologies Used

- **HTML**: Structure of the game board and UI elements
- **CSS**: Styling and animations
- **JavaScript**: Game logic, event handling, and interactions

## Setup & Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/word-ladder-game.git
   ```
2. Navigate to the project directory:
   ```sh
   cd word-ladder-game
   ```
3. Open `index.html` in a browser to play the game.

## Future Improvements

- Add a dictionary validation for guessed words.
- Implement a scoring system.
- Enhance animations and sound effects.

## License

This project is licensed under the MIT License. Feel free to modify and enhance it!

## Author

Developed by imbhaumik168 . Contributions are welcome!
