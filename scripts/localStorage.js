import { gameOptions, storage } from "./config.js";

function saveToStorage() {
  const keys = Object.keys(storage);
  keys.forEach((key) => {
    const value = storage[key];
    localStorage.setItem(key, value);
  });
}

export function updateGameStats(result, time) {
  if (result) {
    storage[`${gameOptions.difficulty}Wins`]++;

    if (storage[`${gameOptions.difficulty}Best`] > time) {
      storage[`${gameOptions.difficulty}Best`] = time;
    }
  }

  storage[`${gameOptions.difficulty}Games`]++;

  saveToStorage();
  loadFromLocalStorage();
}

export function loadFromLocalStorage() {
  const keys = Object.keys(storage);
  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      // Check if the value should be a number
      if (key.includes("Games") || key.includes("Wins")) {
        storage[key] = parseInt(value, 10);
      } else {
        storage[key] = value;
      }
      setElement(key);
    }
  });
}

function setElement(key) {
  if (key.includes("Best")) {
    const seconds = Math.floor((storage[key] / 1000) % 60);
    const miliseconds = Math.floor(storage[key] % 1000);

    let result;
    if (storage[key] == Infinity) result = "NO TIME";
    else result = seconds + "." + miliseconds;
    
    document.getElementById(key).innerHTML = result;
  } else {
    document.getElementById(key).innerHTML = storage[key];
  }
}
