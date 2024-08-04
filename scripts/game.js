import { DOMelements, gameOptions } from "./config.js";
import { updateHeaders } from "./dom.js";

let isMouseDown = false;

export function updateBoardSize() {
  document.documentElement.style.setProperty(
    "--board-width",
    gameOptions.width
  );
  document.documentElement.style.setProperty(
    "--board-height",
    gameOptions.height
  );
}

export function generateGame(board) {
  board.innerHTML = "";
  const gameBoard = generateBoard();

  updateHeaders();
  placeMines(gameBoard);
  calculateNeighbors(gameBoard);
  renderBoard(board, gameBoard);
}

function generateBoard() {
  const board = [];
  for (let i = 0; i < gameOptions.height; i++) {
    const row = [];
    for (let j = 0; j < gameOptions.width; j++) {
      row.push({
        mine: false,
        neighborMines: 0,
        revealed: false,
        flagged: false,
      });
    }
    board.push(row);
  }
  return board;
}

function placeMines(board) {
  let minesPlaced = 0;
  while (minesPlaced < gameOptions.mineCount) {
    const row = Math.floor(Math.random() * gameOptions.height);
    const col = Math.floor(Math.random() * gameOptions.width);
    if (!board[row][col].mine) {
      board[row][col].mine = true;
      minesPlaced++;
    }
  }
}

function calculateNeighbors(board) {
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

  for (let row = 0; row < gameOptions.height; row++) {
    for (let col = 0; col < gameOptions.width; col++) {
      if (board[row][col].mine) continue;

      let mineCount = 0;
      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (
          newRow >= 0 &&
          newRow < gameOptions.height &&
          newCol >= 0 &&
          newCol < gameOptions.width
        ) {
          if (board[newRow][newCol].mine) {
            mineCount++;
          }
        }
      }
      board[row][col].neighborMines = mineCount;
    }
  }
}

function renderBoard(boardElement, board) {
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

      div.addEventListener("mouseup", () => {
        revealCell(board, row, col, div);
        checkWin(board);
        isMouseDown = false;
      });

      /* this one is so it recognizes if you stop clicking
       outside from the board */
      document.addEventListener("mouseup", () => {
        isMouseDown = false;
      });

      div.addEventListener("mousedown", () => {
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

      div.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        flagCell(board, row, col, div);

        gameOptions.flags++;
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

function revealCell(board, row, col, cellElement) {
  if (board[row][col].revealed || board[row][col].flagged) return;
  board[row][col].revealed = true;

  if (board[row][col].mine) {
    cellElement.classList.add("mine");
    revealAllMines(board);
  } else {
    cellElement.classList.add("revealed");
    const neighborMines = board[row][col].neighborMines;
    cellElement.classList.add(`n${neighborMines}`);

    cellElement.innerText = neighborMines > 0 ? neighborMines : "";
    if (neighborMines === 0) {
      revealNeighbors(board, row, col);
    }
  }
}

function revealNeighbors(board, row, col) {
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
      revealCell(board, newRow, newCol, cellElement);
    }
  }
}

function flagCell(board, row, col, cellElement) {
  if (board[row][col].revealed) return;

  if (board[row][col].flagged) {
    board[row][col].flagged = false;
    cellElement.classList.remove("flagged");
  } else {
    board[row][col].flagged = true;
    cellElement.classList.add("flagged");
  }
}

function checkWin(board) {
  for (let row = 0; row < gameOptions.height; row++) {
    for (let col = 0; col < gameOptions.width; col++) {
      if (!board[row][col].mine && !board[row][col].revealed) {
        return false;
      }
    }
  }
  alert("You WON!");
  return true;
}

function revealAllMines(board) {
  for (let row = 0; row < gameOptions.height; row++) {
    for (let col = 0; col < gameOptions.width; col++) {
      if (board[row][col].mine) {
        const cellElement = document.querySelector(
          `.cell[data-row='${row}'][data-col='${col}']`
        );
        cellElement.classList.add("mine2");
      }
    }
  }
}
