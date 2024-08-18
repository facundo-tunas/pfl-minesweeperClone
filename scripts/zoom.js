import { DOMelements, storage } from "./config.js";
import { updateZoom, loadZoomLevel } from "./localStorage.js";

document.addEventListener("DOMContentLoaded", () => {
  storage.zoomLevel = loadZoomLevel();

  document.documentElement.style.setProperty(
    "--board-zoomLevel",
    storage.zoomLevel
  );

  DOMelements.zoomButton.addEventListener("click", () => {
    zoom(0.1);
  });
  DOMelements.zoomOutButton.addEventListener("click", () => {
    zoom(-0.1);
  });

  function zoom(value) {
    storage.zoomLevel += value;
    console.log("zoomed in to " + storage.zoomLevel);

    if (storage.zoomLevel > 0) {
      document.documentElement.style.setProperty(
        "--board-zoomLevel",
        storage.zoomLevel
      );
    }

    updateZoom(storage.zoomLevel);
  }

  zoom(0);
});
