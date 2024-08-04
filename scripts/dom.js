import { gameOptions, DOMelements } from "./config.js";
import { generateGame, updateBoardSize } from "./game.js";

export function updateHeaders() {
  DOMelements.minesDisplay.textContent =
    gameOptions.mineCount - gameOptions.flags;
  DOMelements.widthDisplay.textContent = "Width: " + gameOptions.width;
  DOMelements.heightDisplay.textContent = "Height: " + gameOptions.height;
}

export function initializeEventListeners() {
  generateGame(DOMelements.board);

  DOMelements.startButton.addEventListener("click", () => {
    gameOptions.flags = 0;
    generateGame(DOMelements.board);
  });

  DOMelements.setMinesButton.addEventListener("click", () => {
    const newMines = prompt("Enter new mine count:");
    if (newMines && !isNaN(newMines) && newMines > 0) {
      gameOptions.mineCount = parseInt(newMines);
      validateMineCount();
      generateGame(DOMelements.board);
    } else {
      alert("Invalid value");
    }
  });

  DOMelements.setWidthButton.addEventListener("click", () => {
    const newWidth = prompt("Enter new width:");
    if (newWidth && !isNaN(newWidth) && newWidth > 0) {
      gameOptions.width = parseInt(newWidth);
      validateMineCount();
      updateBoardSize();
      generateGame(DOMelements.board);
    } else {
      alert("Invalid width value");
    }
  });

  DOMelements.setHeightButton.addEventListener("click", () => {
    const newHeight = prompt("Enter new height:");
    if (newHeight && !isNaN(newHeight) && newHeight > 0) {
      gameOptions.height = parseInt(newHeight);
      validateMineCount();
      updateBoardSize();
      generateGame(DOMelements.board);
    } else {
      alert("Invalid height value");
    }
  });
}

function validateMineCount() {
  const maxMines = gameOptions.width * gameOptions.height - 1;
  if (gameOptions.mineCount >= maxMines) {
    gameOptions.mineCount = maxMines;
    alert(
      `Mine count adjusted to ${maxMines} to ensure there are fewer mines than cells.`
    );
  }
}
