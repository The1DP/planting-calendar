import { DEFAULT_LOCATION } from "./data.js";

const STORAGE_KEY = "plantcal.v2";

let gardenLoc = DEFAULT_LOCATION;

export function getGardenLoc() { return gardenLoc; }
export function setGardenLoc(loc) { gardenLoc = loc; }

export function loadState(els, presets) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const defaultPreset = presets[1];
  gardenLoc = saved.location || DEFAULT_LOCATION;
  els.springFrost.value = saved.springFrost || `2001-${defaultPreset.spring}`;
  els.fallFrost.value = saved.fallFrost || `2001-${defaultPreset.fall}`;
  els.noFrost.checked = !!saved.noFrost;
  if (saved.hasChosen) els.settingsBox.open = false;
  updateLocCurrent(els);
  return !saved.hasChosen; // true = first run ever
}

export function saveState(els) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    location: gardenLoc,
    springFrost: els.springFrost.value,
    fallFrost: els.fallFrost.value,
    noFrost: els.noFrost.checked,
    hasChosen: true,
  }));
}

export function updateLocCurrent(els) {
  els.locCurrent.innerHTML = `📍 Using <b>${gardenLoc.label}</b> (${gardenLoc.lat.toFixed(2)}, ${gardenLoc.lon.toFixed(2)})`;
}
