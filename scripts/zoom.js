import { DOMelements, gameOptions } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  DOMelements.zoomButton.addEventListener("click", () => {
    zoom(0.1);
  });
  DOMelements.zoomOutButton.addEventListener("click", () => {
    zoom(-0.1);
  });

  function zoom(value) {
    gameOptions.zoom += value;
    console.log("zoomed in to" + " " + gameOptions.zoom);

    document.documentElement.style.setProperty(
      "--board-zoom",
      gameOptions.zoom
    );
  }
});
