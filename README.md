# MineSweeper

Minesweeper is a logic puzzle game. The game consists of a grid of clickable tiles, with concealed "mines" dispersed across the board. The goal is to clear the board without detonating any mines, using hints regarding the amount of adjacent mines in each area.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contact](#contact)

## Features
- **Dark Mode**: Toggle between light and dark themes.
- **Three Difficulty Levels**: Choose from 3 levels of the game.
- **Three Lives**: Play with up to 3 lives.
- **First Safe Click**: The first cell clicked is guaranteed to be safe.
- **Auto-Expand on Empty Cell**: Clicking an empty cell automatically reveals all adjacent empty cells.
- **Three Safe Clicks**: Use up to 3 safe clicks to reveal a random non-mined cell momentarily.
- **Three Hints**: Use up to 3 hints to reveal safe cells momentarily.
- **Manual Mine Placement Mode**: Place mines manually before starting the game.
- **Interactive Smiley Face Reset Button**: Click the smiley to reset the game with a new board.

## Technologies used
- HTML5
- CSS3
- Vanilla JavaScript

This project was my first major solo vanilla JavaScript application. Through building it, I learned how to:
- Set up and run a website locally.
- Create a responsive layout using CSS Grid and Flex.
- Use GitHub for version control, including committing changes, branching, and pushing updates.

## Installation
You can view the project live [here](https://jennylottner.github.io/MineSweeper/)

Alternatively, if you'd like to run it locally:
1. Clone the repository: `git clone https://github.com/JennyLottner/MineSweeper.git`
2. Navigate to the project folder and open the `index.html` file in your browser.

## Usage
Minesweeper is a game where mines are hidden in a grid of squares. Safe squares have numbers telling you how many mines touch the square. You can use the number clues to solve the game by opening all of the safe squares. If you click on 3 mines you lose the game!
You open squares with the left mouse button and put flags on mines with the right mouse button.
A counter shows the number of mines without flags, and a clock shows your time in seconds.
The game ends when all safe squares have been opened.

- **Hints**: When a hint is activated, the cell clicked next and its neighbors are revealed for a second before disappearing.

- **Safe Clicks**: When clicking a Safe-Click button, a random hidden cell that is safe to click will glow momentarily.

- **Manual positioning**: The user positions the mines (by clicking cells) before playing.

## Contact
For questions or feedback, please reach out to:

**Jenny Lottner - Tover**
[GitHub](https://github.com/JennyLottner)
[LinkedIn](https://www.linkedin.com/in/jenny-lottner-tover-7b1357261)
