import { initializeEventListeners, updateHeaders } from "./dom.js";

document.addEventListener("DOMContentLoaded", () => {
  updateHeaders();
  initializeEventListeners();

  document.body.style.opacity = "1";
});
