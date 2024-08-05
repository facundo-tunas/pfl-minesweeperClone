import { gameOptions, DOMelements } from "./config.js";

export function startTimer() {
  const startTime = Date.now();
  gameOptions.timerDisplay = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString();

    DOMelements.timerDisplay.innerText = `${formattedSeconds.padStart(3, "0")}`;
    DOMelements.timerHeader.innerText = `${formattedMinutes}:${formattedSeconds.padStart(
      2,
      "0"
    )}`;
  }, 1000);
}

export function endTimer() {
  clearInterval(gameOptions.timerDisplay);
  gameOptions.timerDisplay = null;
}

export function getCellUnderMouse(x, y) {
  const element = document.elementFromPoint(x, y);
  
  if (element && element.classList.contains("cell")) {
    return element;
  }
  return null;
}