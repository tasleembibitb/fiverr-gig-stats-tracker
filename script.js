// Fiverr Gig Stats Tracker — daily log, gig comparison, best day, saved in localStorage.
const STORAGE_KEY = "tb-fiverr-stats-v1";

const GIGS = [
  { id: "website", name: "Responsive Website", packages: "$80 / $120 / $180" },
  { id: "landing", name: "Landing Page", packages: "$80 / $110 / $150" },
  { id: "bugfix", name: "Bug Fix & Maintenance", packages: "$15 / $20 / $35" }
];

const GIG_LABEL = { all: "All gigs", website: "Responsive Website", landing: "Landing Page", bugfix: "Bug Fix & Maintenance" };

// Real account totals for 6–8 Nov 2026 (Fiverr analytics). Clicks for those
// exact days are not recorded, so they are logged as 0 here; the 1 click in
// the 30-day total is shown in the header above.
const DEMO_LOG = [
  { id: "d1", date: "2026-11-06", gig: "all", impressions: 6, clicks: 0 },
  { id: "d2", date: "2026-11-07", gig: "all", impressions: 9, clicks: 0 },
  { id: "d3", date: "2026-11-08", gig: "all", impressions: 5, clicks: 0 }
];

let log = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* fall through to demo */ }
  return structuredClone(DEMO_LOG);
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(log)); } catch (e) { /* private mode */ }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function totalsByDate() {
  const byDate = {};
  log.forEach(e => {
    byDate[e.date] = byDate[e.date] || { impressions: 0, clicks: 0 };
    byDate[e.date].impressions += e.impressions;
    byDate[e.date].clicks += e.clicks;
  });
  return Object.keys(byDate).sort().map(d => ({ date: d, impressions: byDate[d].impressions, clicks: byDate[d].clicks }));
}

function render() {
  // Gig cards: totals from entries tagged to that gig
  const gigList = document.getElementById("gig-list");
  gigList.innerHTML = "";
  const perGig = {};
  GIGS.forEach(g => { perGig[g.id] = { impressions: 0, clicks: 0 }; });
  log.forEach(e => { if (perGig[e.gig]) { perGig[e.gig].impressions += e.impressions; perGig[e.gig].clicks += e.clicks; } });
  let bestGig = null;
  let bestImp = -1;
  GIGS.forEach(g => { if (perGig[g.id].impressions > bestImp) { bestImp = perGig[g.id].impressions; bestGig = g.id; } });
  GIGS.forEach(g => {
    const card = document.createElement("div");
    card.className = "result-card" + (g.id === bestGig && bestImp > 0 ? " best" : "");
    card.innerHTML =
      '<span class="result-label">' + escapeHtml(g.name) + '</span>' +
      '<span class="result-value">' + perGig[g.id].impressions + ' impressions</span>' +
      '<span class="result-sub">Packages: ' + escapeHtml(g.packages) + '</span>' +
      '<span class="result-sub">' + perGig[g.id].clicks + ' clicks logged · 0 orders</span>' +
      (g.id === bestGig && bestImp > 0 ? '<span><span class="badge">Best so far</span></span>' : "");
    gigList.appendChild(card);
  });

  // Best day + chart (last 7 logged days)
  const days = totalsByDate();
  if (days.length === 0) {
    document.getElementById("best-day").textContent = "No days logged yet — add today above.";
  } else {
    const best = days.reduce((a, b) => (b.impressions > a.impressions ? b : a), days[0]);
    document.getElementById("best-day").textContent =
      "Best day: " + best.date + " — " + best.impressions + " impressions, " + best.clicks + " clicks.";
  }
  const chart = document.getElementById("chart");
  chart.innerHTML = "";
  const last7 = days.slice(-7);
  const maxImp = Math.max(1, ...last7.map(d => d.impressions));
  last7.forEach(d => {
    const col = document.createElement("div");
    col.className = "bar-col";
    const h = Math.max(4, Math.round((d.impressions / maxImp) * 90));
    col.innerHTML =
      '<span class="bar-value">' + d.impressions + '</span>' +
      '<div class="bar" style="height:' + h + 'px"></div>' +
      '<span class="bar-date">' + escapeHtml(d.date.slice(5)) + '</span>';
    chart.appendChild(col);
  });

  // Daily log, newest first
  const sorted = [...log].sort((a, b) => b.date.localeCompare(a.date) || (b.id || "").localeCompare(a.id || ""));
  const totalImp = log.reduce((s, e) => s + e.impressions, 0);
  const totalClicks = log.reduce((s, e) => s + e.clicks, 0);
  document.getElementById("summary").textContent =
    log.length + " entries logged · " + totalImp + " impressions · " + totalClicks + " clicks in the log.";
  const list = document.getElementById("log-list");
  list.innerHTML = "";
  sorted.forEach(e => {
    const row = document.createElement("div");
    row.className = "log-row";
    row.innerHTML =
      '<span class="log-date">' + escapeHtml(e.date) + '</span>' +
      '<span class="log-gig">' + escapeHtml(GIG_LABEL[e.gig] || e.gig) + '</span>' +
      '<span class="log-nums">' + e.impressions + ' impressions · ' + e.clicks + ' clicks</span>';
    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn btn-secondary btn-small";
    del.textContent = "Remove";
    del.addEventListener("click", () => { log = log.filter(x => x.id !== e.id); save(); render(); });
    row.appendChild(del);
    list.appendChild(row);
  });
}

document.getElementById("add-form").addEventListener("submit", e => {
  e.preventDefault();
  const date = document.getElementById("new-date").value;
  const gig = document.getElementById("new-gig").value;
  const impressions = parseInt(document.getElementById("new-impressions").value, 10) || 0;
  const clicks = parseInt(document.getElementById("new-clicks").value, 10) || 0;
  if (!date) return;
  log.push({ id: "e" + Date.now(), date, gig, impressions, clicks });
  save();
  e.target.reset();
  document.getElementById("new-impressions").value = 0;
  document.getElementById("new-clicks").value = 0;
  render();
});

document.getElementById("reset-demo").addEventListener("click", () => {
  log = structuredClone(DEMO_LOG);
  save();
  render();
});

render();
