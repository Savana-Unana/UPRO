const GOOGLE_SCRIPT_URL = "";

const FALLBACK_TYPE = {
  name: "NPC",
  color: "#d7cfbf"
};

const state = {
  pool: [],
  pair: [],
  typeColors: new Map(),
  isVoting: false
};

const arena = document.getElementById("arena");
const leftPanel = document.getElementById("left-panel");
const rightPanel = document.getElementById("right-panel");
const poolStatus = document.getElementById("pool-status");
const saveStatus = document.getElementById("save-status");

init();

async function init() {
  try {
    const [types, base, ace, npc] = await Promise.all([
      fetchJson("data/types.json"),
      fetchJson("data/mates/base.json"),
      fetchJson("data/mates/ace.json"),
      fetchJson("data/mates/npc.json")
    ]);

    for (const type of types) {
      state.typeColors.set(type.name, type.color);
    }

    state.pool = buildPool(base, ace, npc);

    if (state.pool.length < 2) {
      renderEmptyState("Not enough vote options were found.");
      return;
    }

    updatePoolStatus();
    updateSaveStatus();
    nextPair();
  } catch (error) {
    console.error(error);
    renderEmptyState("The vote page could not load its data.");
    saveStatus.textContent = "Loading failed.";
    saveStatus.className = "status-error";
  }
}

function buildPool(baseEntries, aceEntries, npcEntries) {
  const pool = [];
  const seen = new Set();

  for (const entry of baseEntries) {
    if (entry.event) {
      if (isModeEntry(entry)) {
        continue;
      }
      pushPoolItem(pool, seen, normalizeMate(entry, "Event"));
      continue;
    }

    pushPoolItem(pool, seen, normalizeMate(entry, "Base"));
  }

  for (const entry of aceEntries) {
    if (entry.event) {
      if (isModeEntry(entry)) {
        continue;
      }
      pushPoolItem(pool, seen, normalizeMate(entry, "Event"));
      continue;
    }

    pushPoolItem(pool, seen, normalizeMate(entry, "Ace"));
  }

  for (const entry of npcEntries) {
    pushPoolItem(pool, seen, normalizeNpc(entry));
  }

  return pool;
}

function isModeEntry(entry) {
  return typeof entry.rarity === "string" && entry.rarity.includes("Mode");
}

function pushPoolItem(pool, seen, item) {
  if (!item || !item.name || seen.has(item.key)) {
    return;
  }

  seen.add(item.key);
  pool.push(item);
}

function normalizeMate(entry, source) {
  return {
    key: `${source}:${entry.name}`,
    source,
    name: entry.name,
    image: entry.image || "",
    primaryType: Array.isArray(entry.types) && entry.types[0] ? entry.types[0] : FALLBACK_TYPE.name,
    primaryColor: getTypeColor(Array.isArray(entry.types) ? entry.types[0] : ""),
    textColor: getReadableTextColor(getTypeColor(Array.isArray(entry.types) ? entry.types[0] : "")),
    types: Array.isArray(entry.types) ? entry.types : [],
    raw: entry
  };
}

function normalizeNpc(entry) {
  return {
    key: `NPC:${entry.name}`,
    source: "NPC",
    name: entry.name,
    image: entry.image || "",
    primaryType: FALLBACK_TYPE.name,
    primaryColor: FALLBACK_TYPE.color,
    textColor: getReadableTextColor(FALLBACK_TYPE.color),
    types: [],
    raw: entry
  };
}

function getTypeColor(typeName) {
  return state.typeColors.get(typeName) || FALLBACK_TYPE.color;
}

function nextPair() {
  state.pair = pickPair(state.pool);
  state.isVoting = false;
  renderPair();
}

function pickPair(pool) {
  const firstIndex = Math.floor(Math.random() * pool.length);
  let secondIndex = Math.floor(Math.random() * pool.length);

  while (secondIndex === firstIndex) {
    secondIndex = Math.floor(Math.random() * pool.length);
  }

  return [pool[firstIndex], pool[secondIndex]];
}

function renderPair() {
  const [left, right] = state.pair;
  renderPanel(leftPanel, left, 0);
  renderPanel(rightPanel, right, 1);
}

function renderPanel(panel, mon, sideIndex) {
  panel.classList.toggle("is-loading", state.isVoting);
  panel.style.background = mon.primaryColor;
  panel.style.color = mon.textColor;
  panel.disabled = state.isVoting;
  panel.onclick = () => handleVote(sideIndex);

  const typeMarkup = mon.types.length
    ? mon.types.map(type => `<span class="type-chip">${escapeHtml(type)}</span>`).join("")
    : `<span class="type-chip">${escapeHtml(mon.primaryType)}</span>`;

  panel.innerHTML = `
    <article class="vote-card">
      <span class="source-chip">${escapeHtml(mon.source)}</span>
      <img class="mon-image" src="${escapeAttribute(mon.image)}" alt="${escapeAttribute(mon.name)}">
      <h2 class="mon-name">${escapeHtml(mon.name)}</h2>
      <div class="meta">${typeMarkup}</div>
    </article>
  `;
}

async function handleVote(selectedIndex) {
  if (state.isVoting || state.pair.length !== 2) {
    return;
  }

  state.isVoting = true;
  renderPair();

  const winner = state.pair[selectedIndex];
  const loser = state.pair[selectedIndex === 0 ? 1 : 0];

  try {
    await submitVote(winner, loser);
    saveStatus.textContent = `Saved vote: ${winner.name}`;
    saveStatus.className = "status-ok";
  } catch (error) {
    console.error(error);
    saveStatus.textContent = "Vote advanced, but the Google Sheet save failed.";
    saveStatus.className = "status-error";
  }

  nextPair();
}

async function submitVote(winner, loser) {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error("Google Apps Script URL is not configured.");
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      action: "vote",
      winner: {
        name: winner.name,
        source: winner.source
      },
      loser: {
        name: loser.name,
        source: loser.source
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Vote request failed with ${response.status}.`);
  }
}

function updatePoolStatus() {
  const counts = state.pool.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + 1;
    return acc;
  }, {});

  poolStatus.innerHTML = [
    `Loaded <strong>${state.pool.length}</strong> options.`,
    `Base: <strong>${counts.Base || 0}</strong>`,
    `Ace: <strong>${counts.Ace || 0}</strong>`,
    `NPC: <strong>${counts.NPC || 0}</strong>`,
    `Event: <strong>${counts.Event || 0}</strong>`
  ].join(" ");
}

function updateSaveStatus() {
  if (GOOGLE_SCRIPT_URL) {
    saveStatus.textContent = "Google Sheet connection configured.";
    saveStatus.className = "status-ok";
    return;
  }

  saveStatus.textContent = "Google Sheet endpoint not configured yet.";
  saveStatus.className = "status-warn";
}

function renderEmptyState(message) {
  arena.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}.`);
  }
  return response.json();
}

function getReadableTextColor(hexColor) {
  const color = (hexColor || "").replace("#", "");
  if (color.length !== 6) {
    return "#111418";
  }

  const red = parseInt(color.slice(0, 2), 16);
  const green = parseInt(color.slice(2, 4), 16);
  const blue = parseInt(color.slice(4, 6), 16);
  const luminance = (0.299 * red) + (0.587 * green) + (0.114 * blue);
  return luminance > 150 ? "#111418" : "#f7f8fb";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
