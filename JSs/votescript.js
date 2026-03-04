const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz1wM0PuhsT8TUoorvnXx9OZx5lXcd0I-7o4LpW7Yea3ham4saWMn2WOnNvGvUyKpqbow/exec";

const FALLBACK_TYPE = {
  name: "NPC",
  color: "#d7cfbf"
};

const state = {
  pool: [],
  pair: [],
  typeColors: new Map(),
  isVoting: false,
  pendingVotes: loadPendingVotes(),
  isFlushingVotes: false
};

const arena = document.getElementById("arena");
const leftPanel = document.getElementById("left-panel");
const rightPanel = document.getElementById("right-panel");
const poolStatus = document.getElementById("pool-status");
const saveStatus = document.getElementById("save-status");
const RESET_VOTES_HASH = "#appleciderbananajuice";

bootstrap();

async function bootstrap() {
  if (window.location.hash === RESET_VOTES_HASH) {
    await handleVoteResetHash();
    return;
  }

  init();
}

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
    flushPendingVotes();
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
    if (!isDesignedEntry(entry)) {
      continue;
    }

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
    if (!isDesignedEntry(entry)) {
      continue;
    }

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
    if (!isDesignedEntry({ ...entry, mode: "npc" })) {
      continue;
    }
    pushPoolItem(pool, seen, normalizeNpc(entry));
  }

  return pool;
}

function isModeEntry(entry) {
  return typeof entry.rarity === "string" && entry.rarity.includes("Mode");
}

function isDesignedEntry(entry) {
  return entry?.mode !== "npc" && !isMissingNo(entry) && !isOnes(entry);
}

function isMissingNo(entry) {
  return entry?.mode !== "npc" && (
    entry?.name === "MissingNo" ||
    entry?.name === "L.MissingNo" ||
    String(entry?.image || "").includes("MissingNo")
  );
}

function isOnes(entry) {
  return entry?.name === "Ones";
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

  panel.innerHTML = `
    <article class="vote-card">
      <img class="mon-image" src="${escapeAttribute(mon.image)}" alt="${escapeAttribute(mon.name)}">
      <h2 class="mon-name">${escapeHtml(mon.name)}</h2>
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
  enqueueVote(winner, loser);
  nextPair();
  flushPendingVotes();
}

async function submitVote(winner, loser) {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error("Google Apps Script URL is not configured.");
  }

  await postVoteThroughIframe({
    action: "vote",
    winnerName: winner.name,
    winnerSource: winner.source,
    loserName: loser.name,
    loserSource: loser.source
  });
}

function enqueueVote(winner, loser) {
  state.pendingVotes.push({
    winner: {
      name: winner.name,
      source: winner.source
    },
    loser: {
      name: loser.name,
      source: loser.source
    },
    queuedAt: Date.now()
  });

  persistPendingVotes();
  saveStatus.textContent = `Queued vote: ${winner.name}`;
  saveStatus.className = "status-warn";
}

async function flushPendingVotes() {
  if (state.isFlushingVotes || !state.pendingVotes.length) {
    updateSaveStatus();
    return;
  }

  if (!GOOGLE_SCRIPT_URL) {
    updateSaveStatus();
    return;
  }

  state.isFlushingVotes = true;
  updateSaveStatus();

  try {
    while (state.pendingVotes.length) {
      const vote = state.pendingVotes[0];
      await submitVote(vote.winner, vote.loser);
      state.pendingVotes.shift();
      persistPendingVotes();
    }

    saveStatus.textContent = "All queued votes saved.";
    saveStatus.className = "status-ok";
  } catch (error) {
    console.error(error);
    saveStatus.textContent = `Saved later: ${state.pendingVotes.length} queued vote(s).`;
    saveStatus.className = "status-error";
  } finally {
    state.isFlushingVotes = false;
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
    if (state.isFlushingVotes) {
      saveStatus.textContent = `Saving ${state.pendingVotes.length} queued vote(s)...`;
      saveStatus.className = "status-warn";
      return;
    }

    if (state.pendingVotes.length) {
      saveStatus.textContent = `${state.pendingVotes.length} vote(s) queued for sync.`;
      saveStatus.className = "status-warn";
      return;
    }

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

function loadPendingVotes() {
  try {
    const raw = window.localStorage.getItem("upro_vote_queue");
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function persistPendingVotes() {
  try {
    window.localStorage.setItem("upro_vote_queue", JSON.stringify(state.pendingVotes));
  } catch (error) {
    console.error(error);
  }
}

async function handleVoteResetHash() {
  try {
    window.localStorage.removeItem("upro_vote_queue");
  } catch (error) {
    console.error(error);
  }

  if (GOOGLE_SCRIPT_URL) {
    try {
      await postVoteThroughIframe({ action: "reset" });
    } catch (error) {
      console.error(error);
    }
  }

  const cleanUrl = `${window.location.pathname}${window.location.search}`;
  window.location.replace(cleanUrl);
}

function postVoteThroughIframe(fields) {
  return new Promise((resolve, reject) => {
    const iframeName = `vote-submit-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const iframe = document.createElement("iframe");
    const form = document.createElement("form");
    let settled = false;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      iframe.remove();
      form.remove();
    };

    const settle = callback => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      callback();
    };

    iframe.name = iframeName;
    iframe.hidden = true;
    iframe.tabIndex = -1;

    form.method = "POST";
    form.action = GOOGLE_SCRIPT_URL;
    form.target = iframeName;
    form.hidden = true;

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    iframe.addEventListener("load", () => {
      settle(resolve);
    }, { once: true });

    const timeoutId = window.setTimeout(() => {
      settle(() => reject(new Error("Vote request timed out.")));
    }, 15000);

    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.submit();
  });
}
