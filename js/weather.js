import { dayOfYear, doyToMonthDay, pad2, MONTH_NAMES } from "./dateUtils.js";

// ---------- Weather / historical frost (Open-Meteo, no API key needed) ----------
export async function fetchForecastAndRender(els, gardenLoc) {
  els.weatherBanner.className = "weather-banner";
  els.weatherBanner.textContent = `⛅ Checking the forecast for ${gardenLoc.label}…`;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${gardenLoc.lat}&longitude=${gardenLoc.lon}&daily=temperature_2m_min,temperature_2m_max&temperature_unit=fahrenheit&timezone=auto&forecast_days=14`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("forecast http " + res.status);
    const data = await res.json();
    const times = data.daily.time, mins = data.daily.temperature_2m_min, maxs = data.daily.temperature_2m_max;
    const frostDays = [];
    for (let i = 0; i < times.length; i++) {
      if (mins[i] <= 36) frostDays.push({ date: times[i], min: Math.round(mins[i]) });
    }
    if (frostDays.length) {
      els.weatherBanner.className = "weather-banner warn";
      const items = frostDays.slice(0, 5).map(f => {
        const d = new Date(f.date + "T00:00:00");
        return `<li>${d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} &mdash; low ${f.min}°F</li>`;
      }).join("");
      els.weatherBanner.innerHTML = `<b>❄️ Frost watch for ${gardenLoc.label}:</b> hold off on tender transplants or cover them.<ul>${items}</ul>`;
    } else {
      els.weatherBanner.className = "weather-banner ok";
      els.weatherBanner.innerHTML = `<b>✅ No frost in the 14-day forecast</b> for ${gardenLoc.label}. Today: high ${Math.round(maxs[0])}°F / low ${Math.round(mins[0])}°F.`;
    }
  } catch (e) {
    els.weatherBanner.className = "weather-banner";
    els.weatherBanner.textContent = "⚠️ Couldn't reach the weather service (offline?) — using your saved frost dates below instead.";
  }
}

// onSuccess is called only when a clear frost pattern was found and the frost
// date fields were updated, matching the original inline saveState()+render() call.
export async function recalcHistoricalFrost(els, gardenLoc, today, onSuccess) {
  els.frostStatus.textContent = `📊 Crunching ${today.getFullYear() - 8}–${today.getFullYear() - 1} historical weather for ${gardenLoc.label}…`;
  els.recalcBtn.disabled = true;
  try {
    const endYear = today.getFullYear() - 1;
    const startYear = endYear - 7;
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${gardenLoc.lat}&longitude=${gardenLoc.lon}&start_date=${startYear}-01-01&end_date=${endYear}-12-31&daily=temperature_2m_min&temperature_unit=fahrenheit&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("archive http " + res.status);
    const data = await res.json();
    const times = data.daily.time, mins = data.daily.temperature_2m_min;
    const byYear = {};
    for (let i = 0; i < times.length; i++) {
      const [y, m, d] = times[i].split("-").map(Number);
      byYear[y] = byYear[y] || [];
      byYear[y].push({ doy: dayOfYear(m, d), min: mins[i] });
    }
    const springDOYs = [], fallDOYs = [];
    let noFrostYears = 0;
    Object.values(byYear).forEach(days => {
      const firstHalf = days.filter(d => d.doy <= 181 && d.min <= 32);
      const secondHalf = days.filter(d => d.doy > 181 && d.min <= 32);
      const spring = firstHalf.length ? Math.max(...firstHalf.map(d => d.doy)) : null;
      const fall = secondHalf.length ? Math.min(...secondHalf.map(d => d.doy)) : null;
      if (spring) springDOYs.push(spring);
      if (fall) fallDOYs.push(fall);
      if (!spring && !fall) noFrostYears++;
    });
    const yearCount = Object.keys(byYear).length;

    if (yearCount && noFrostYears >= yearCount / 2) {
      els.noFrost.checked = true;
      els.frostStatus.textContent = `🌡️ Historical data (${yearCount} yrs) shows ${gardenLoc.label} rarely freezes — switched to frost-free mode. Uncheck above to set manual dates anyway.`;
    } else if (springDOYs.length && fallDOYs.length) {
      els.noFrost.checked = false;
      const avgSpring = springDOYs.reduce((a, b) => a + b, 0) / springDOYs.length;
      const avgFall = fallDOYs.reduce((a, b) => a + b, 0) / fallDOYs.length;
      const sMD = doyToMonthDay(avgSpring), fMD = doyToMonthDay(avgFall);
      els.springFrost.value = `2001-${pad2(sMD.month)}-${pad2(sMD.day)}`;
      els.fallFrost.value = `2001-${pad2(fMD.month)}-${pad2(fMD.day)}`;
      els.frostStatus.textContent = `📊 Based on ${yearCount} years of historical weather for ${gardenLoc.label}: avg last frost ~${MONTH_NAMES[sMD.month-1]} ${sMD.day}, avg first frost ~${MONTH_NAMES[fMD.month-1]} ${fMD.day}. Adjust anytime.`;
    } else {
      els.frostStatus.textContent = `Couldn't determine a clear frost pattern from ${yearCount} years of data for ${gardenLoc.label} — dates left as-is, adjust manually if needed.`;
    }
    onSuccess();
  } catch (e) {
    els.frostStatus.textContent = "⚠️ Couldn't fetch historical weather (offline?) — dates left as-is; adjust manually if needed.";
  } finally {
    els.recalcBtn.disabled = false;
  }
}

// onSelect(loc) is called when the user picks a search result, with
// { label, lat, lon, tz } for the chosen location.
export async function geocodeSearch(els, query, onSelect) {
  els.locResults.hidden = false;
  els.locResults.innerHTML = `<div style="padding:8px 12px;font-size:0.85rem;color:var(--muted)">Searching…</div>`;
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    const results = data.results || [];
    if (!results.length) {
      els.locResults.innerHTML = `<div style="padding:8px 12px;font-size:0.85rem;color:var(--muted)">No matches — try a different spelling or a nearby bigger city.</div>`;
      return;
    }
    els.locResults.innerHTML = "";
    results.forEach(r => {
      const parts = [r.name, r.admin1, r.country].filter(Boolean);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = parts.join(", ");
      btn.addEventListener("click", () => {
        onSelect({ label: parts.join(", "), lat: r.latitude, lon: r.longitude, tz: r.timezone || "auto" });
        els.locResults.hidden = true;
        els.locInput.value = "";
      });
      els.locResults.appendChild(btn);
    });
  } catch (e) {
    els.locResults.innerHTML = `<div style="padding:8px 12px;font-size:0.85rem;color:var(--muted)">⚠️ Search failed (offline?) — try again later.</div>`;
  }
}
