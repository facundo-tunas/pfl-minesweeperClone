import { gameOptions, DOMelements } from "./config.js";

export function startTimer() {
  const startTime = Date.now();
  gameOptions.timerDisplay = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
    DOMelements.timerDisplay.innerText = `${minutes}${seconds
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

export function endTimer() {
  clearInterval(gameOptions.timerDisplay);
  gameOptions.timerDisplay = null;
}
