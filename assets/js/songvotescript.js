const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxW2-Ir2-V-gYtjh_8loErFZNmNbBPEYq7tgFbpZNtUQNeKt1Pnz5-v87aTu8jHb43gRg/exec";

const FALLBACK_COLOR = "#d7cfbf";
const SONG_VOTE_MODES = {
  ost: { label: "Canon", sheetName: "Song Canon" },
  bonus: { label: "Non-Canon", sheetName: "Song Non-Canon" }
};

const TYPE_COLORS = {
  Normal: "#d7cfbf",
  Plant: "#6BBF59",
  Water: "#3BA5FF",
  Ice: "#C9F0FF",
  Fire: "#FF7A4D",
  Earth: "#C99C6B",
  Mystic: "#BFA6FF",
  Air: "#9ED8FF",
  Savage: "#D6C79B",
  Metal: "#B0B8C1",
  Electric: "#F6C94C",
  Artillery: "#D88F8F",
  Light: "#FFF3B0",
  Dark: "#3B3B3F",
  Gross: "#A8A77A",
  Spectral: "#8F7AE6",
  Lucid: "#9FE5D1"
};

const DEFAULT_MODE = "ost";
const RESET_VOTES_HASH = "#appleciderbananajuice";
const PENDING_VOTES_KEY = "upro_song_vote_queue";
const LAST_MODE_KEY = "upro_song_vote_mode";

const state = {
  pools: {
    ost: [],
    bonus: []
  },
  pair: [],
  currentMode: loadVoteMode(),
  isVoting: false,
  currentAudio: null,
  currentListenButton: null,
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
    const songs = await fetchJson("data/songs.json");
    state.pools = buildPools(songs);
    refreshForCurrentMode();
    flushPendingVotes();
  } catch (error) {
    console.error(error);
    renderEmptyState("The song vote page could not load its data.");
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
  if (!SONG_VOTE_MODES[mode] || mode === state.currentMode) {
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
    renderEmptyState(`Not enough ${SONG_VOTE_MODES[state.currentMode].label.toLowerCase()} songs were found.`);
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

function buildPools(songEntries) {
  const pools = {
    ost: [],
    bonus: []
  };
  const seen = {
    ost: new Set(),
    bonus: new Set()
  };

  songEntries
    .map(normalizeSong)
    .filter(song => song && song.playable)
    .forEach(song => {
      if (song.isCanonTrack) {
        pushPoolItem(pools.ost, seen.ost, song);
      } else {
        pushPoolItem(pools.bonus, seen.bonus, song);
      }
    });

  return pools;
}

function normalizeSong(entry) {
  if (!entry || !entry.name) {
    return null;
  }

  const typing = Array.isArray(entry.typing) ? entry.typing : [entry.typing || "Normal"];
  const primaryType = typing[0] || "Normal";
  const primaryColor = TYPE_COLORS[primaryType] || FALLBACK_COLOR;
  const ostNumber = Number(entry.ost);
  const file = typeof entry.file === "string" ? entry.file.trim() : "";
  const playable = Boolean(file);
  const isNonCanonTrack = Number.isFinite(ostNumber) && ostNumber === 1000;
  const isCanonTrack = playable && !isNonCanonTrack;

  return {
    key: `Song:${entry.name}`,
    name: entry.name,
    composer: entry.composer || "Unknown",
    area: entry.area || "Unknown",
    theme: entry.theme || "Theme",
    typing,
    primaryType,
    primaryColor,
    textColor: getReadableTextColor(primaryColor),
    ost: Number.isFinite(ostNumber) ? ostNumber : null,
    order: Number(entry.order) || 0,
    source: isCanonTrack ? "Canon" : "Non-Canon",
    isCanonTrack,
    isNonCanonTrack,
    file,
    playable,
    raw: entry
  };
}

function pushPoolItem(pool, seen, item) {
  if (!item || !item.name || seen.has(item.key)) {
    return;
  }

  seen.add(item.key);
  pool.push(item);
}

function nextPair() {
  resetCurrentPreview();
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

function renderPanel(panel, song, sideIndex) {
  if (!song) {
    panel.innerHTML = "";
    panel.removeAttribute("aria-disabled");
    panel.removeAttribute("data-vote-index");
    panel.classList.add("is-loading");
    panel.onclick = null;
    panel.onkeydown = null;
    return;
  }

  panel.classList.toggle("is-loading", state.isVoting);
  panel.style.setProperty("--song-rgb", hexToRgbString(song.primaryColor));
  panel.style.setProperty("--song-color", song.primaryColor);
  panel.style.color = "#f7f8fb";
  panel.setAttribute("aria-disabled", state.isVoting ? "true" : "false");
  panel.dataset.voteIndex = String(sideIndex);
  panel.onclick = () => handleVote(sideIndex);
  panel.onkeydown = event => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleVote(sideIndex);
  };

  const numberLabel = song.isCanonTrack ? `OST ${song.ost}` : "NON-CANON";
  const typingChips = song.typing
    .filter(Boolean)
    .map(type => `<span class="song-chip">${escapeHtml(type)}</span>`)
    .join("");
  const listenLabel = song.playable ? "Listen" : "Unavailable";
  const listenStatus = song.playable ? "Preview this song" : "No file available";

  panel.innerHTML = `
    <article class="vote-card">
      <div class="song-number">${escapeHtml(numberLabel)}</div>
      <h2 class="song-name">${escapeHtml(song.name)}</h2>
      <div class="song-meta">
        <p>Composer: ${escapeHtml(song.composer)}</p>
        <p>${escapeHtml(song.area)} | ${escapeHtml(song.theme)}</p>
      </div>
      <div class="song-chip-row">${typingChips}</div>
      <div class="song-actions">
        <button class="listen-button" type="button" ${song.playable ? "" : "disabled"}>${listenLabel}</button>
      </div>
      <div class="listen-status">${escapeHtml(listenStatus)}</div>
      ${song.playable ? `<audio preload="metadata" src="${escapeAttribute(song.file)}"></audio>` : ""}
    </article>
  `;

  const listenButton = panel.querySelector(".listen-button");
  const listenStatusEl = panel.querySelector(".listen-status");
  const audio = panel.querySelector("audio");

  if (listenButton) {
    listenButton.addEventListener("click", event => {
      event.stopPropagation();
      toggleSongPreview(song, audio, listenButton, listenStatusEl);
    });
  }
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
    entityType: "song",
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
  saveStatus.textContent = `Queued ${SONG_VOTE_MODES[mode].label} song vote: ${winner.name}`;
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

    saveStatus.textContent = "All queued song votes saved.";
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
    mode: SONG_VOTE_MODES[vote?.mode] ? vote.mode : DEFAULT_MODE,
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
    `${SONG_VOTE_MODES[state.currentMode].label}: <strong>${pool.length}</strong> songs.`,
    `Canon: <strong>${counts.Canon || 0}</strong>`,
    `Non-Canon: <strong>${counts["Non-Canon"] || 0}</strong>`
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
        saveStatus.textContent = `${queuedInCurrentMode} ${SONG_VOTE_MODES[state.currentMode].label.toLowerCase()} song vote(s) queued for sync.`;
      } else {
        saveStatus.textContent = `${state.pendingVotes.length} vote(s) queued in other song mode(s).`;
      }
      saveStatus.className = "status-warn";
      return;
    }

    saveStatus.textContent = `Google Sheet connection configured for ${SONG_VOTE_MODES[state.currentMode].sheetName}.`;
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

function toggleSongPreview(song, audio, button, statusEl) {
  if (!audio || !button || !statusEl) {
    return;
  }

  if (state.currentAudio && state.currentAudio !== audio) {
    resetCurrentPreview();
  }

  if (audio.paused) {
    audio.currentTime = 0;
    audio.play().catch(error => {
      console.error(error);
      statusEl.textContent = "Could not play preview";
    });
    button.textContent = "Pause";
    statusEl.textContent = `Playing ${song.name}`;
    state.currentAudio = audio;
    state.currentListenButton = button;

    audio.onended = () => {
      if (state.currentAudio === audio) {
        button.textContent = "Listen";
        statusEl.textContent = "Preview this song";
        state.currentAudio = null;
        state.currentListenButton = null;
      }
    };
    return;
  }

  audio.pause();
  button.textContent = "Listen";
  statusEl.textContent = "Preview this song";
  if (state.currentAudio === audio) {
    state.currentAudio = null;
    state.currentListenButton = null;
  }
}

function resetCurrentPreview() {
  if (!state.currentAudio || !state.currentListenButton) {
    return;
  }

  const previousAudio = state.currentAudio;
  const previousButton = state.currentListenButton;
  const previousStatus = previousButton.closest(".vote-card")?.querySelector(".listen-status");

  previousAudio.pause();
  previousAudio.currentTime = 0;
  previousButton.textContent = "Listen";
  if (previousStatus) {
    previousStatus.textContent = "Preview this song";
  }

  state.currentAudio = null;
  state.currentListenButton = null;
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

function hexToRgbString(hexColor) {
  const color = (hexColor || "").replace("#", "");
  if (color.length !== 6) {
    return "215, 207, 191";
  }

  const red = parseInt(color.slice(0, 2), 16);
  const green = parseInt(color.slice(2, 4), 16);
  const blue = parseInt(color.slice(4, 6), 16);
  return `${red}, ${green}, ${blue}`;
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
    return SONG_VOTE_MODES[savedMode] ? savedMode : DEFAULT_MODE;
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
      await postVoteRequest({ action: "reset", entityType: "song" });
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
