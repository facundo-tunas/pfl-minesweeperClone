export const gameOptions = {
  width: 16,
  height: 16,
  mineCount: 40,
  flags: 0,
  gameState: 0 /* 0: off, 1: started, 2: lost, 3: won */,
  timer: null,
  board: null,
  mouseDown: false,
  pressedNeighbours: false,
  difficulty: "intermediate",
};

export const DOMelements = {
  timerHeader: document.querySelector(".timer-header"),
  timerDisplay: document.querySelector(".timer"),
  minesDisplay: document.querySelector(".minecount"),
  startButton: document.querySelector(".start-game"),
  board: document.querySelector(".board"),

  settingsModal: document.querySelector(".settings-modal"),
  settingsButton: document.querySelector(".open-settings"),
  statisticsModal: document.querySelector(".statistics-modal"),
  statisticsButton: document.querySelector(".open-statistics"),
  helpModal: document.querySelector(".help-modal"),
  helpButton: document.querySelector(".open-help"),

  closeButton: document.querySelectorAll(".close-modal"),

  zoomButton: document.getElementById("zoom-in"),
  zoomOutButton: document.getElementById("zoom-out"),
};

export const storage = {
  beginnerGames: 0,
  beginnerWins: 0,
  beginnerBest: Infinity,

  intermediateGames: 0,
  intermediateWins: 0,
  intermediateBest: Infinity,

  advancedGames: 0,
  advancedWins: 0,
  advancedBest: Infinity,

  zoomLevel: 1,
  theme: "dark",
};
