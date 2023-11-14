# L-Game

Welcome to the L-Game repository! This is a web-based implementation of the L-Game, a strategic board game for two players.

## Overview

This version of the L-Game adds an interactive element to drawing L pieces and moving black pieces. The undo, skip, and restart buttons enhance the gameplay experience.


## Demo

<img width="400" alt="Screenshot Game Start" src="https://github.com/anuj7862/L-game-using-Javascript/assets/66530079/8e55a5bf-29d7-43a6-b310-408b120c9f0e">
<img width="400" alt="Screenshot Game Middle" src="https://github.com/anuj7862/L-game-using-Javascript/assets/66530079/1322e02e-58c0-425a-9ea1-d5032de94a2c">
<img width="800" alt="Screenshot Game End" src="https://github.com/anuj7862/L-game-using-Javascript/assets/66530079/8b47e9bd-87dd-4ea8-a0be-706ed9a2b3b2">


## Gameplay Features

- **Draw L Piece:** Click and hold the mouse to draw your L piece on the board. Rotate or flip it as needed. Release the mouse to finalize the position.

- **Move Black Piece:** Select a black piece and choose any empty location to place it. Be strategic in your moves!

- **Buttons:**
  - **Undo:** Deselect the selected black piece.
  - **Skip:** Skip the part to move the black piece.
  - **Restart:** Restart the game.

- **Winning Condition:** After each player's turn, the game checks the total possible moves for the next player. If the count is zero, the current player wins.


## Getting Started

### Installation

1. Clone the repository: `git clone https://github.com/anuj7862/L-game-using-Javascript.git`
2. Open `index.html` in your web browser.

## How to Play

- Draw your L piece by clicking and holding the mouse. Release it to finalize the position.
- Select a black piece and choose an empty location to strategically place it on the board.
- Use the undo button to deselect the selected black piece.
- Skip the part to move the black piece if needed.
- Restart the game anytime to start afresh.

## Additional Gameplay Rules

- **Turn Structure:** On each turn, a player must first move their L piece. Optionally, the player may then move one of the black pieces.
  
- **Objective:** The game is won by leaving the opponent unable to move their L piece to a new position.

- **Piece Movement:** 
  - Moving the L piece involves picking it up and placing it in empty squares anywhere on the board.
  - The L piece can be rotated or flipped during the move.
  - The piece must end in a different position from where it started, covering at least one square it did not previously cover.
  
- **Black Piece Movement:**
  - To move a black piece, a player picks it up and places it in an empty square anywhere on the board.

- **Overlap and Cover Rules:**
  - Pieces may not overlap or cover other pieces.



## Additional Information

For detailed information on the game logic, validation, and specific rules, refer to the code documentation and comments within the JavaScript files.


## Technologies Used

- HTML
- CSS
- JavaScript

