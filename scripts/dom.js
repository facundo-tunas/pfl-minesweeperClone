import { gameOptions, DOMelements } from "./config.js";
import { generateGame, updateBoardSize } from "./game.js";

export function updateHeaders() {
  DOMelements.minesDisplay.textContent = (
    gameOptions.mineCount - gameOptions.flags
  )
    .toString()
    .padStart(3, "0");
}

export function initializeEventListeners() {
  generateGame(DOMelements.board);

  DOMelements.startButton.addEventListener("click", () => {
    gameOptions.flags = 0;
    generateGame(DOMelements.board);
  });

  DOMelements.setNewSettings.addEventListener("click", () => {
    const newMines = prompt("Enter new mine count:");
    const newWidth = prompt("Enter new width (min 9):");
    const newHeight = prompt("Enter new height (min 9):");

    if (
      newHeight &&
      !isNaN(newHeight) &&
      newHeight > 8 &&
      newWidth &&
      !isNaN(newWidth) &&
      newWidth > 8 &&
      newMines &&
      !isNaN(newMines) &&
      newMines > 0
    ) {
      gameOptions.mineCount = parseInt(newMines);
      gameOptions.width = parseInt(newWidth);
      gameOptions.height = parseInt(newHeight);

      updateBoardSize();
      validateMineCount();
      generateGame(DOMelements.board);
    } else {
      alert("Invalid Input");
    }
  });
}

function validateMineCount() {
  const maxMines = gameOptions.width * gameOptions.height - 2;

  if (gameOptions.mineCount > maxMines) {
    gameOptions.mineCount = maxMines;
    alert(
      `Mine count adjusted to ${maxMines} to ensure there are fewer mines than cells.`
    );
  }
}
