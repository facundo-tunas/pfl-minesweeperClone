import { gameOptions, DOMelements } from "./config.js";
import {calculateNeighbors, revealCell, checkWin, flagCell} from './game.js'
import { startTimer, endTimer } from "./timer.js";
import { updateHeaders } from "./dom.js";

export function renderBoard(boardElement, board) {
  let start = true;
  let isMouseDown = false;

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

      /* this one is so it recognizes if you stop clicking
       outside from the board */
      document.addEventListener("mouseup", () => {
        isMouseDown = false;
      });

      div.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        if (gameOptions.gameState > 1) return;

        div.classList.add("pressed");
        isMouseDown = true;
      });

      div.addEventListener("mouseleave", () => {
        div.classList.remove("pressed");
      });

      div.addEventListener("mouseenter", () => {
        if (isMouseDown) {
          div.classList.add("pressed");
        }
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
}
