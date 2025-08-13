import { DOMelements, storage } from "./config.js";
import { updateZoom, loadZoomLevel } from "./localStorage.js";

document.addEventListener("DOMContentLoaded", () => {
  const MIN_ZOOM = 0.85;
  const ZOOM_STEP = 0.1;

  storage.zoomLevel = loadZoomLevel() || 1;

  if (storage.zoomLevel >= MIN_ZOOM) {
    setZoom(storage.zoomLevel);
  }

  DOMelements.zoomButton.addEventListener("click", () => changeZoom(ZOOM_STEP));
  DOMelements.zoomOutButton.addEventListener("click", () =>
    changeZoom(-ZOOM_STEP)
  );

  function changeZoom(delta) {
    const newZoom = storage.zoomLevel + delta;
    if (newZoom < MIN_ZOOM) return;

    storage.zoomLevel = newZoom;
    console.log(`Zoom set to ${storage.zoomLevel}`);

    setZoom(storage.zoomLevel);
    updateZoom(storage.zoomLevel);
  }

  function setZoom(zoomValue) {
    document.documentElement.style.setProperty("--board-zoom", zoomValue);
  }

  changeZoom(0);
});
