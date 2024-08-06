import { gameOptions } from "./config.js";
import { pressNeighbours, unpressCells } from "./dom.js";

let counter = 0;

export function renderBoard(boardElement, board) {
  let start = true;

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

      div.addEventListener("mouseleave", () => {
        div.classList.remove("pressed");
        div.classList.remove("hovered");

        if (gameOptions.pressedNeighbours) {
          unpressCells();
          gameOptions.pressedNeighbours = false;
        }
      });

      div.addEventListener("mouseenter", () => {
        if (gameOptions.mouseDown) {
          div.classList.add("pressed");

          if (div.classList.contains("revealed")) {
            pressNeighbours(row, col);
            gameOptions.pressedNeighbours = true;
          } else {
            gameOptions.pressedNeighbours = false;
          }
        }
        div.classList.add("hovered");
      });

      boardElement.appendChild(div);
    }
  }
}