import { PLANTS, MATURITY_BUFFER } from "./data.js";
import { dayOfYear, mdFromDateInput, signedDiff, windowText, spacingText } from "./dateUtils.js";
import { saveState } from "./state.js";

export function render(els, today, todayDOY) {
  saveState(els);
  const noFrost = els.noFrost.checked;
  const sf = mdFromDateInput(els.springFrost.value);
  const ff = mdFromDateInput(els.fallFrost.value);
  const springDOY = dayOfYear(sf.month, sf.day);
  const fallDOY = dayOfYear(ff.month, ff.day);
  const relSpring = signedDiff(springDOY, todayDOY);
  const relFall = signedDiff(fallDOY, todayDOY);

  const opts = today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  els.todayPill.textContent = noFrost ? `Today: ${opts} · frost-free mode` : `Today: ${opts}`;

  const nowList = [];
  const soonList = [];
  const refRows = [];

  PLANTS.forEach(plant => {
    let bestNow = null;
    let bestSoon = null;
    const refParts = { spring: [], fall: [] };

    plant.acts.forEach(act => {
      const rel = act.anchor === "spring" ? relSpring : relFall;
      refParts[act.anchor].push(`${act.label}: ${windowText(act.min, act.max)}`);

      let active = rel >= act.min && rel <= act.max;
      if (active && act.checkFall && plant.maturity) {
        const neededBy = -(plant.maturity + MATURITY_BUFFER);
        if (relFall > neededBy) active = false;
      }
      if (noFrost && (plant.tender || plant.warmSeasonOnly)) active = true;

      if (active) {
        bestNow = act.label;
      } else if (!bestSoon && rel < act.min) {
        const daysUntil = act.min - rel;
        if (daysUntil <= 21) bestSoon = { label: act.label, days: daysUntil };
      }
    });

    if (noFrost && !plant.tender && !plant.warmSeasonOnly) {
      bestNow = bestNow || "Direct sow (mild climate)";
    }

    if (bestNow) nowList.push({ plant, action: bestNow });
    else if (bestSoon) soonList.push({ plant, action: bestSoon.label, days: bestSoon.days });

    refRows.push({
      name: plant.name,
      cat: plant.cat,
      spring: refParts.spring.join(" · ") || "—",
      fall: refParts.fall.join(" · ") || "—",
      spacing: spacingText(plant),
      tip: plant.plotTip,
    });
  });

  renderCards(els.nowCards, nowList, "now");
  renderCards(els.soonCards, soonList, "soon");
  renderRef(els.refBody, refRows);
}

function renderCards(container, list, mode) {
  container.innerHTML = "";
  if (list.length === 0) {
    const p = document.createElement("p");
    p.className = "empty-note";
    p.textContent = mode === "now"
      ? "Nothing matches your window right now — check back soon, or open the reference calendar below."
      : "Nothing coming up in the next few weeks.";
    container.appendChild(p);
    return;
  }
  list.sort((a, b) => a.plant.name.localeCompare(b.plant.name));
  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "plant-card" + (mode === "soon" ? " soon" : "");
    const tipHtml = item.plant.plotTip ? `<div class="tip">⚠ ${item.plant.plotTip}</div>` : "";
    card.innerHTML = `
      <div class="name"><span>${item.plant.name}</span><span class="cat">${item.plant.cat}</span></div>
      <div class="action">${item.action}${mode === "soon" ? ` in ~${item.days}d` : ""}</div>
      <div class="spacing">🔲 ${spacingText(item.plant)}</div>
      ${tipHtml}
    `;
    container.appendChild(card);
  });
}

function renderRef(refBody, rows) {
  refBody.innerHTML = "";
  rows.sort((a, b) => a.name.localeCompare(b.name));
  rows.forEach(r => {
    const tr = document.createElement("tr");
    const tipHtml = r.tip ? `<span class="tip">⚠ ${r.tip}</span>` : "";
    tr.innerHTML = `<td>${r.name}</td><td>${r.cat}</td><td>${r.spring}</td><td>${r.fall}</td><td>${r.spacing}${tipHtml}</td>`;
    refBody.appendChild(tr);
  });
}
