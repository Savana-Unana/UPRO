const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxE1DoOARQLGl9mKJmdFSsIltgq9wWN3E-ilF-Tf5yESS6A62CI3IKyv33myyQv1iMUBg/exec";

const FALLBACK_TYPE = {
  name: "NPC",
  color: "#d7cfbf"
};

const VOTE_MODES = {
  finalized: { label: "Finalized", sheetName: "Finalized" },
  conceptualized: { label: "Conceptualized", sheetName: "Conceptualized" },
  all: { label: "All Mons", sheetName: "All Mons" }
};

const DEFAULT_MODE = "finalized";
const RESET_VOTES_HASH = "#appleciderbananajuice";
const PENDING_VOTES_KEY = "upro_vote_queue";
const LAST_MODE_KEY = "upro_vote_mode";

const state = {
  pools: {
    finalized: [],
    conceptualized: [],
    all: []
  },
  pair: [],
  currentMode: loadVoteMode(),
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
const modeButtons = Array.from(document.querySelectorAll("[data-vote-mode]"));
let emptyStateEl = null;

bootstrap();

async function bootstrap() {
  if (window.location.hash === RESET_VOTES_HASH) {
    await handleVoteResetHash();
    return;
  }

  initModeSwitcher();
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

    state.pools = buildPools(base, ace, npc);
    refreshForCurrentMode();
    flushPendingVotes();
  } catch (error) {
    console.error(error);
    renderEmptyState("The vote page could not load its data.");
    saveStatus.textContent = "Loading failed.";
    saveStatus.className = "status-error";
  }
}

function initModeSwitcher() {
  modeButtons.forEach(button => {
    button.addEventListener("click", () => setVoteMode(button.dataset.voteMode));
  });
  syncModeButtons();
}

function setVoteMode(mode) {
  if (!VOTE_MODES[mode] || mode === state.currentMode) {
    return;
  }

  state.currentMode = mode;
  persistVoteMode();
  refreshForCurrentMode();
  flushPendingVotes();
}

function refreshForCurrentMode() {
  syncModeButtons();
  updatePoolStatus();
  updateSaveStatus();

  if (getCurrentPool().length < 2) {
    state.pair = [];
    renderEmptyState(`Not enough ${VOTE_MODES[state.currentMode].label.toLowerCase()} vote options were found.`);
    return;
  }

  nextPair();
}

function syncModeButtons() {
  modeButtons.forEach(button => {
    const isActive = button.dataset.voteMode === state.currentMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function getCurrentPool() {
  return state.pools[state.currentMode] || [];
}

function buildPools(baseEntries, aceEntries, npcEntries) {
  const pools = {
    finalized: [],
    conceptualized: [],
    all: []
  };
  const seen = {
    finalized: new Set(),
    conceptualized: new Set(),
    all: new Set()
  };

  const mateEntries = [
    ...baseEntries.map(entry => ({ entry, source: entry.event ? "Event" : "Base" })),
    ...aceEntries.map(entry => ({ entry, source: entry.event ? "Event" : "Ace" }))
  ];

  for (const { entry, source } of mateEntries) {
    if (!isDesignedEntry(entry) || isModeEntry(entry)) {
      continue;
    }

    const item = normalizeMate(entry, source);
    if (!item) {
      continue;
    }

    if (isFinalizedEntry(entry)) {
      pushPoolItem(pools.finalized, seen.finalized, item);
    }
    if (isConceptualizedEntry(entry)) {
      pushPoolItem(pools.conceptualized, seen.conceptualized, item);
    }
    pushPoolItem(pools.all, seen.all, item);
  }

  for (const entry of npcEntries) {
    if (!isDesignedNpcEntry(entry)) {
      continue;
    }

    const item = normalizeNpc(entry);
    pushPoolItem(pools.finalized, seen.finalized, item);
    pushPoolItem(pools.all, seen.all, item);
  }

  return pools;
}

function isModeEntry(entry) {
  return typeof entry?.rarity === "string" && entry.rarity.includes("Mode");
}

function isDesignedEntry(entry) {
  return entry?.mode !== "npc" && !isMissingNo(entry) && !isOnes(entry);
}

function isDesignedNpcEntry(entry) {
  const image = String(entry?.image || "").toLowerCase();
  return /(^|\/)nimages\//i.test(image) && !image.includes("youknowwhoiam");
}

function isFinalizedEntry(entry) {
  const image = String(entry?.image || "").toLowerCase();
  return /(^|\/)images\//i.test(image);
}

function isConceptualizedEntry(entry) {
  const image = String(entry?.image || "").toLowerCase();
  return /(^|\/)lostimages\//i.test(image);
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
  const pool = getCurrentPool();
  state.pair = pickPair(pool);
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
  ensureArenaReady();
  const [left, right] = state.pair;
  renderPanel(leftPanel, left, 0);
  renderPanel(rightPanel, right, 1);
}

function renderPanel(panel, mon, sideIndex) {
  if (!mon) {
    panel.innerHTML = "";
    panel.disabled = true;
    panel.classList.add("is-loading");
    return;
  }

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
  enqueueVote(winner, loser, state.currentMode);
  nextPair();
  flushPendingVotes();
}

async function submitVote(vote) {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error("Google Apps Script URL is not configured.");
  }

  await postVoteRequest({
    action: "vote",
    mode: vote.mode,
    winnerName: vote.winner.name,
    winnerSource: vote.winner.source,
    loserName: vote.loser.name,
    loserSource: vote.loser.source
  });
}

function enqueueVote(winner, loser, mode) {
  state.pendingVotes.push({
    mode,
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
  saveStatus.textContent = `Queued ${VOTE_MODES[mode].label} vote: ${winner.name}`;
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
      const vote = normalizePendingVote(state.pendingVotes[0]);
      await submitVote(vote);
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

function normalizePendingVote(vote) {
  return {
    mode: VOTE_MODES[vote?.mode] ? vote.mode : "all",
    winner: {
      name: vote?.winner?.name || "",
      source: vote?.winner?.source || ""
    },
    loser: {
      name: vote?.loser?.name || "",
      source: vote?.loser?.source || ""
    },
    queuedAt: vote?.queuedAt || Date.now()
  };
}

function updatePoolStatus() {
  const pool = getCurrentPool();
  const counts = pool.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + 1;
    return acc;
  }, {});

  poolStatus.innerHTML = [
    `${VOTE_MODES[state.currentMode].label}: <strong>${pool.length}</strong> options.`,
    `Base: <strong>${counts.Base || 0}</strong>`,
    `Ace: <strong>${counts.Ace || 0}</strong>`,
    `NPC: <strong>${counts.NPC || 0}</strong>`,
    `Event: <strong>${counts.Event || 0}</strong>`
  ].join(" ");
}

function updateSaveStatus() {
  const queuedInCurrentMode = state.pendingVotes
    .map(normalizePendingVote)
    .filter(vote => vote.mode === state.currentMode)
    .length;

  if (GOOGLE_SCRIPT_URL) {
    if (state.isFlushingVotes) {
      saveStatus.textContent = `Saving ${state.pendingVotes.length} queued vote(s)...`;
      saveStatus.className = "status-warn";
      return;
    }

    if (state.pendingVotes.length) {
      if (queuedInCurrentMode) {
        saveStatus.textContent = `${queuedInCurrentMode} ${VOTE_MODES[state.currentMode].label.toLowerCase()} vote(s) queued for sync.`;
      } else {
        saveStatus.textContent = `${state.pendingVotes.length} vote(s) queued in other mode(s).`;
      }
      saveStatus.className = "status-warn";
      return;
    }

    saveStatus.textContent = `Google Sheet connection configured for ${VOTE_MODES[state.currentMode].sheetName}.`;
    saveStatus.className = "status-ok";
    return;
  }

  saveStatus.textContent = "Google Sheet endpoint not configured yet.";
  saveStatus.className = "status-warn";
}

function renderEmptyState(message) {
  if (!emptyStateEl) {
    emptyStateEl = document.createElement("div");
    emptyStateEl.className = "empty-state";
  }

  leftPanel.hidden = true;
  rightPanel.hidden = true;
  emptyStateEl.innerHTML = escapeHtml(message);
  if (!arena.contains(emptyStateEl)) {
    arena.appendChild(emptyStateEl);
  }
}

function ensureArenaReady() {
  leftPanel.hidden = false;
  rightPanel.hidden = false;
  if (emptyStateEl && arena.contains(emptyStateEl)) {
    emptyStateEl.remove();
  }
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
    const raw = window.localStorage.getItem(PENDING_VOTES_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizePendingVote) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function persistPendingVotes() {
  try {
    window.localStorage.setItem(PENDING_VOTES_KEY, JSON.stringify(state.pendingVotes));
  } catch (error) {
    console.error(error);
  }
}

function loadVoteMode() {
  try {
    const savedMode = window.localStorage.getItem(LAST_MODE_KEY);
    return VOTE_MODES[savedMode] ? savedMode : DEFAULT_MODE;
  } catch (error) {
    console.error(error);
    return DEFAULT_MODE;
  }
}

function persistVoteMode() {
  try {
    window.localStorage.setItem(LAST_MODE_KEY, state.currentMode);
  } catch (error) {
    console.error(error);
  }
}

async function handleVoteResetHash() {
  try {
    window.localStorage.removeItem(PENDING_VOTES_KEY);
  } catch (error) {
    console.error(error);
  }

  if (GOOGLE_SCRIPT_URL) {
    try {
      await postVoteRequest({ action: "reset" });
    } catch (error) {
      console.error(error);
    }
  }

  const cleanUrl = `${window.location.pathname}${window.location.search}`;
  window.location.replace(cleanUrl);
}

async function postVoteRequest(fields) {
  if (typeof window.fetch === "function") {
    const body = new URLSearchParams();
    Object.entries(fields).forEach(([key, value]) => {
      body.append(key, value == null ? "" : String(value));
    });

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: body.toString(),
        keepalive: true
      });
      return;
    } catch (error) {
      console.warn("Fetch vote submit failed; falling back to iframe submit.", error);
    }
  }

  return postVoteThroughIframe(fields);
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
