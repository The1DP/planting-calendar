import { PRESETS } from "./data.js";
import { dayOfYear } from "./dateUtils.js";
import { loadState, saveState, updateLocCurrent, getGardenLoc, setGardenLoc } from "./state.js";
import { fetchForecastAndRender, recalcHistoricalFrost, geocodeSearch } from "./weather.js";
import { render } from "./render.js";

const els = {
  springFrost: document.getElementById("springFrost"),
  fallFrost: document.getElementById("fallFrost"),
  noFrost: document.getElementById("noFrost"),
  presetRow: document.getElementById("presetRow"),
  todayPill: document.getElementById("todayPill"),
  nowCards: document.getElementById("nowCards"),
  soonCards: document.getElementById("soonCards"),
  refBody: document.querySelector("#refTable tbody"),
  settingsBox: document.getElementById("settingsBox"),
  locInput: document.getElementById("locInput"),
  locSearchBtn: document.getElementById("locSearchBtn"),
  locGeoBtn: document.getElementById("locGeoBtn"),
  locResults: document.getElementById("locResults"),
  locCurrent: document.getElementById("locCurrent"),
  frostStatus: document.getElementById("frostStatus"),
  recalcBtn: document.getElementById("recalcBtn"),
  weatherBanner: document.getElementById("weatherBanner"),
};

const today = new Date();
const todayDOY = dayOfYear(today.getMonth() + 1, today.getDate());

function doRender() {
  render(els, today, todayDOY);
}

function runRecalc() {
  return recalcHistoricalFrost(els, getGardenLoc(), today, () => {
    saveState(els);
    doRender();
  });
}

function onLocationChosen(loc) {
  setGardenLoc(loc);
  updateLocCurrent(els);
  saveState(els);
  fetchForecastAndRender(els, getGardenLoc());
  runRecalc();
}

function buildPresets() {
  els.presetRow.innerHTML = "";
  PRESETS.forEach(p => {
    const btn = document.createElement("button");
    btn.className = "preset-btn";
    btn.type = "button";
    btn.textContent = p.name;
    btn.addEventListener("click", () => {
      els.springFrost.value = `2001-${p.spring}`;
      els.fallFrost.value = `2001-${p.fall}`;
      saveState(els);
      doRender();
    });
    els.presetRow.appendChild(btn);
  });
}

els.locSearchBtn.addEventListener("click", () => {
  const q = els.locInput.value.trim();
  if (q) geocodeSearch(els, q, onLocationChosen);
});
els.locInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); const q = els.locInput.value.trim(); if (q) geocodeSearch(els, q, onLocationChosen); }
});
els.locGeoBtn.addEventListener("click", () => {
  if (!navigator.geolocation) { els.locCurrent.textContent = "Geolocation isn't available in this browser."; return; }
  els.locGeoBtn.disabled = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      onLocationChosen({
        label: `My location (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`,
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        tz: "auto",
      });
      els.locGeoBtn.disabled = false;
    },
    () => { els.locCurrent.textContent = "Couldn't get your location — search for it above instead."; els.locGeoBtn.disabled = false; },
    { timeout: 10000 }
  );
});
els.recalcBtn.addEventListener("click", runRecalc);

[els.springFrost, els.fallFrost, els.noFrost].forEach(el => el.addEventListener("change", doRender));

buildPresets();
const isFirstRun = loadState(els, PRESETS);
doRender();
fetchForecastAndRender(els, getGardenLoc());
if (isFirstRun) runRecalc();
