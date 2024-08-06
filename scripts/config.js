export const gameOptions = {
  width: 16,
  height: 16,
  mineCount: 40,
  flags: 0,
  gameState: 0 /* 0: off, 1: started, 2: lost, 3: won */,
  timer: null,
  board: null,
};

export const DOMelements = {
  timerHeader: document.querySelector(".timer-header"),
  timerDisplay: document.querySelector(".timer"),
  minesDisplay: document.querySelector(".minecount"),
  startButton: document.querySelector(".start-game"),
  board: document.querySelector(".board"),
  settingsModal: document.querySelector(".settings-modal"),
  closeSettingsButton: document.querySelector(".close-settings"),
  settingsButton: document.querySelector(".open-settings"),
};
