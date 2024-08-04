const gameOptions = {
  width: 16,
  height: 16,
  mineCount: 40,
};

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".start-game");
  const board = document.querySelector(".board");

  button.addEventListener("click", () => {
    generateGame(board);
  });
});

function generateGame(board) {
  board.innerHTML = "";
  const gameBoard = generateBoard();
  console.log(gameBoard);
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
  for (let row = 0; row < gameOptions.height; row++) {
    for (let col = 0; col < gameOptions.width; col++) {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.dataset.row = row;
      div.dataset.col = col;

      div.addEventListener("click", () => {
        revealCell(board, row, col, div);
        checkWin(board);
      });

      div.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        flagCell(board, row, col, div);
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
    cellElement.innerText = "💣";

    alert("You LOST!");
  } else {
    cellElement.classList.add("revealed");
    const neighborMines = board[row][col].neighborMines;
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
    cellElement.innerText = "";
  } else {
    board[row][col].flagged = true;
    cellElement.classList.add("flagged");
    cellElement.innerText = "🚩";
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
