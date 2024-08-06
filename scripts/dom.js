import { gameOptions, DOMelements } from "./config.js";
import { generateGame, setDifficulty, start } from "./game.js";
import { endTimer } from "./timer.js";

export function updateHeaders() {
  DOMelements.minesDisplay.textContent = (
    gameOptions.mineCount - gameOptions.flags
  )
    .toString()
    .padStart(3, "0");

  // change divider color depending on game state
  document.documentElement.style.setProperty("--board-divider", returnColor());
  function returnColor() {
    switch (gameOptions.gameState) {
      case 1:
        return "yellow";
      case 2:
        return "red";
      case 3:
        return "#06e206";
      case 0:
        return "#acf9ff";
    }
  }
}

export function initializeEventListeners() {
  generateGame(DOMelements.board);

  DOMelements.settingsButton.addEventListener("click", () => {
    DOMelements.settingsModal.style.display = "block";
  });

  DOMelements.closeSettingsButton.addEventListener("click", () => {
    DOMelements.settingsModal.style.display = "none";
  });

  const difficultyOptions = document.querySelectorAll(".settings-modal li");
  difficultyOptions.forEach((option) => {
    option.addEventListener("click", () => {
      setDifficulty(option.dataset.difficulty);
      DOMelements.settingsModal.style.display = "none";
    });
  });

  DOMelements.startButton.addEventListener("click", start);
}

export function unpressCells() {
  const pressed = document.querySelectorAll(".pressed");

  pressed.forEach((element) => {
    element.classList.remove("pressed");
  });
}

export function pressNeighbours(row, col) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      newRow >= 0 &&
      newRow < gameOptions.height &&
      newCol >= 0 &&
      newCol < gameOptions.width
    ) {
      const cellElement = document.querySelector(
        `.cell[data-row='${newRow}'][data-col='${newCol}']`
      );
      pressCell(cellElement);
      console.log("Xd");
    }
  }
}
function pressCell(cellElement) {
  cellElement.classList.add("pressed");
}
