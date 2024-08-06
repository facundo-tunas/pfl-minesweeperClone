import { gameOptions, DOMelements } from "./config.js";
import {
  calculateNeighbors,
  checkWin,
  flagCell,
  generateGame,
  revealCell,
  revealNeighbors,
  setDifficulty,
  start,
} from "./game.js";
import { startTimer } from "./timer.js";

export function initializeEventListeners() {
  generateGame(DOMelements.board);

  function hoveredCell() {
    const hoveredCell = document.querySelector(".hovered");
    if (!hoveredCell) {
      return [null, null, null];
    }
    const hoveredCol = +hoveredCell.dataset.col;
    const hoveredRow = +hoveredCell.dataset.row;

    return [hoveredRow, hoveredCol, hoveredCell];
  }

  function keyStrokesListener(e) {
    if (gameOptions.gameState > 1) return;

    const [row, col, cell] = hoveredCell();
    if (row === null || col === null || cell === null) return;

    if ((e.key !== "g" && e.key !== " ") || !cell) return;
    e.preventDefault();

    // reveal only if number of mines is flagged
    calculateNeighbors(gameOptions.board);

    if (
      cell.classList.contains("revealed") &&
      gameOptions.board[row][col].neighborFlags ===
        gameOptions.board[row][col].neighborMines
    ) {
      revealNeighbors(gameOptions.board, row, col);
      checkWin(gameOptions.board);
    } else if (!cell.classList.contains("revealed")) {
      flagCell(gameOptions.board, row, col, cell);
      updateHeaders();
    }
  }

  DOMelements.settingsButton.addEventListener("click", () => {
    DOMelements.settingsModal.style.display = "block";
  });
  DOMelements.closeSettingsButton.addEventListener("click", () => {
    DOMelements.settingsModal.style.display = "none";
  });
  DOMelements.startButton.addEventListener("click", start);

  const difficultyOptions = document.querySelectorAll(".settings-modal li");
  difficultyOptions.forEach((option) => {
    option.addEventListener("click", () => {
      setDifficulty(option.dataset.difficulty);
      DOMelements.settingsModal.style.display = "none";
    });
  });

  document.addEventListener("keydown", keyStrokesListener);

  // right click
  document.addEventListener("mousedown", (e) => {
    if (e.button !== 2) return;
    if (gameOptions.gameState > 1) return;
    e.preventDefault();

    const [row, col, cell] = hoveredCell();
    if (row !== null && col !== null && cell !== null) {
      flagCell(gameOptions.board, row, col, cell);
      updateHeaders();
    }
  });

  // this is so you cant accidentally right click in the gaps
  DOMelements.board.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // left click
  document.addEventListener("mousedown", (e) => {
    const [row, col, cell] = hoveredCell();
    if (row === null || col === null || cell === null) return;

    if (e.button !== 0) return;
    if (gameOptions.gameState > 1) return;

    cell.classList.add("pressed");

    if (cell.classList.contains("revealed")) {
      pressNeighbours(row, col);
      gameOptions.pressedNeighbours = true;
    } else {
      gameOptions.pressedNeighbours = false;
    }

    gameOptions.mouseDown = true;
  });
  document.addEventListener("mouseup", (e) => {
    const [row, col, cell] = hoveredCell();
    if (row === null || col === null || cell === null) return;

    if (e.button !== 0) return;
    if (gameOptions.gameState > 1) return;

    // reveal only if number of mines is flagged
    calculateNeighbors(gameOptions.board);

    if (
      cell.classList.contains("revealed") &&
      gameOptions.board[row][col].neighborFlags ==
        gameOptions.board[row][col].neighborMines
    ) {
      revealNeighbors(gameOptions.board, row, col);
      gameOptions.mouseDown = false;

      return;
    }

    if (gameOptions.gameState !== 1) {
      gameOptions.gameState = 1;
      startTimer();
      updateHeaders();
    }
    revealCell(gameOptions.board, row, col, cell);
    checkWin(gameOptions.board);
    gameOptions.mouseDown = false;
  });
  /* this one is so it recognizes if you stop clicking outside from the board */
  document.addEventListener("mouseup", () => {
    gameOptions.mouseDown = false;
    if (gameOptions.pressedNeighbours) {
      unpressCells();
      gameOptions.pressedNeighbours = false;
    }
  });
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
    }
  }

  function pressCell(cellElement) {
    cellElement.classList.add("pressed");
  }
}

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
