import { gameOptions, DOMelements } from "./config.js";
import {
  calculateNeighbors,
  revealNeighbors,
  revealCell,
  checkWin,
  flagCell,
} from "./game.js";
import { startTimer, endTimer } from "./timer.js";
import { pressNeighbours, unpressCells, updateHeaders } from "./dom.js";

let counter = 0;

export function renderBoard(boardElement, board) {
  let start = true;
  let isMouseDown = false;
  let pressedNeighbours = false;

  for (let row = 0; row < gameOptions.height; row++) {
    for (let col = 0; col < gameOptions.width; col++) {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.dataset.row = row;
      div.dataset.col = col;

      // mark safe spot to start game
      const cell = board[row][col];
      if (start && !cell.neighborMines && !cell.mine) {
        div.innerText = "❎";
        start = false;
      }

      div.addEventListener("mouseup", (e) => {
        if (e.button !== 0) return;
        if (gameOptions.gameState > 1) return;

        // reveal only if number of mines is flagged
        calculateNeighbors(board);

        if (
          div.classList.contains("revealed") &&
          board[row][col].neightborFlags == board[row][col].neighborMines
        ) {
          revealNeighbors(board, row, col);
          isMouseDown = false;

          return;
        }

        if (gameOptions.gameState !== 1) {
          gameOptions.gameState = 1;
          startTimer();
          updateHeaders();
        }
        revealCell(board, row, col, div);
        checkWin(board);
        isMouseDown = false;
      });

      div.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        if (gameOptions.gameState > 1) return;

        div.classList.add("pressed");

        if (div.classList.contains("revealed")) {
          pressNeighbours(row, col);
          pressedNeighbours = true;
        } else {
          pressedNeighbours = false;
        }

        isMouseDown = true;
      });

      div.addEventListener("mouseleave", () => {
        div.classList.remove("pressed");
        div.classList.remove("hovered");

        if (pressedNeighbours) {
          unpressCells();
          pressedNeighbours = false;
        }
      });

      div.addEventListener("mouseenter", () => {
        if (isMouseDown) {
          div.classList.add("pressed");

          if (div.classList.contains("revealed")) {
            pressNeighbours(row, col);
            pressedNeighbours = true;
          } else {
            pressedNeighbours = false;
          }
        }
        div.classList.add("hovered");
      });

      div.addEventListener("mousedown", (e) => {
        if (e.button !== 2) return;
        if (gameOptions.gameState > 1) return;

        e.preventDefault();
        flagCell(board, row, col, div);
        updateHeaders();
      });

      // this is so you cant accidentally right click in the gaps
      DOMelements.board.addEventListener("contextmenu", (e) => {
        e.preventDefault();
      });

      boardElement.appendChild(div);
    }
  }
  /* this one is so it recognizes if you stop clicking outside from the board */
  document.addEventListener("mouseup", () => {
    isMouseDown = false;
    if (pressedNeighbours) {
      unpressCells();
      pressedNeighbours = false;
    }
  });

  document.addEventListener("keydown", keyStrokesListener);
}

function keyStrokesListener(e) {
  e.preventDefault();
  if (gameOptions.gameState > 1) return;

  const hoveredCell = document.querySelector(".hovered");
  if ((e.key !== "g" && e.key !== " ") || !hoveredCell) return;

  const hoveredCol = +hoveredCell.dataset.col;
  const hoveredRow = +hoveredCell.dataset.row;
  calculateNeighbors(gameOptions.board);
  if (
    hoveredCell.classList.contains("revealed") &&
    gameOptions.board[hoveredRow][hoveredCol].neightborFlags ===
      gameOptions.board[hoveredRow][hoveredCol].neighborMines
  ) {
    console.log("XD");

    revealNeighbors(gameOptions.board, hoveredRow, hoveredCol);
    checkWin(gameOptions.board);
  } else if (!hoveredCell.classList.contains("revealed")) {
    flagCell(gameOptions.board, hoveredRow, hoveredCol, hoveredCell);
    updateHeaders();
  }
}
