export const CUM_DAYS = [0,31,59,90,120,151,181,212,243,273,304,334];

export function dayOfYear(month, day) { return CUM_DAYS[month - 1] + day; }

export function doyToMonthDay(doy) {
  doy = Math.max(1, Math.min(365, Math.round(doy)));
  let m = 12;
  for (let i = 0; i < 12; i++) { if (doy <= (CUM_DAYS[i] + (i < 11 ? (CUM_DAYS[i+1]-CUM_DAYS[i]) : 31))) { m = i + 1; break; } }
  const day = doy - CUM_DAYS[m - 1];
  return { month: m, day: Math.max(1, day) };
}

export function mdFromDateInput(value) {
  const [y, m, d] = value.split("-").map(Number);
  return { month: m, day: d };
}

export function pad2(n) { return String(n).padStart(2, "0"); }

export function signedDiff(anchorDOY, todayDOY) {
  let diff = (todayDOY - anchorDOY + 365) % 365;
  if (diff > 182) diff -= 365;
  return diff;
}

export function fmtOffset(days) {
  const wk = Math.round(Math.abs(days) / 7);
  if (days === 0) return "on the frost date";
  const when = days < 0 ? "before" : "after";
  if (wk === 0) return `~${Math.abs(days)}d ${when}`;
  return `${wk} wk ${when}`;
}

export function windowText(min, max) {
  return `${fmtOffset(min)} → ${fmtOffset(max)}`;
}

export function spacingText(plant) {
  if (!plant.perSqFt) return "—";
  return plant.perSqFt >= 1 ? `${plant.perSqFt} per sq ft` : `1 per ${Math.round(1 / plant.perSqFt)} sq ft`;
}

export const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
