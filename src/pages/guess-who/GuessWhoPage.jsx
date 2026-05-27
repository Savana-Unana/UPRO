import { useEffect } from 'react'
import { fetchMateBuckets, mateModes } from '../../utils/mateData'

/* eslint-disable no-unused-vars */
const pageStyles = ""
function runPageScript() {
  const ACCESS_KEY = "upro_guesswho_unlocked";
  const PLAYER_NAME_KEY = "upro_guesswho_player_name";
  const NOTES_KEY = "upro_guesswho_notes";
  const BOARD_SIZE = 50;
  const DEFAULT_NAME = "Placeholder";
  const GUESSES_TOTAL = 3;
  const KEY_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

  if (sessionStorage.getItem(ACCESS_KEY) !== "true") {
    window.location.replace("/");
    return;
  }

  const state = {
    pool: [],
    poolByName: new Map(),
    poolIndexByName: new Map(),
    board: [],
    boardKey: "",
    secret: null,
    playerName: localStorage.getItem(PLAYER_NAME_KEY) || DEFAULT_NAME,
    remainingGuesses: GUESSES_TOTAL
  };

  const screens = {
    name: document.getElementById("nameScreen"),
    menu: document.getElementById("menuScreen"),
    instructions: document.getElementById("instructionsScreen"),
    game: document.getElementById("gameScreen"),
    notes: document.getElementById("notesScreen")
  };

  const playerNameInput = document.getElementById("playerNameInput");
  const chosenNameLabel = document.getElementById("chosenNameLabel");
  const povTitle = document.getElementById("povTitle");
  const secretNameLabel = document.getElementById("secretNameLabel");
  const secretPortrait = document.getElementById("secretPortrait");
  const cardsLeftLabel = document.getElementById("cardsLeftLabel");
  const boardEl = document.getElementById("guesswhoBoard");
  const hoverTag = document.getElementById("guesswhoHoverTag");
  const heartsEl = document.getElementById("guessHearts");
  const notesArea = document.getElementById("notesArea");
  const notesStatus = document.getElementById("notesStatus");
  const secretCharacterButton = document.getElementById("secretCharacterButton");
  const joinPanel = document.getElementById("joinPanel");
  const joinGameKeyInput = document.getElementById("joinGameKeyInput");
  const joinStatus = document.getElementById("joinStatus");
  const gameKeyOutput = document.getElementById("gameKeyOutput");

  init();

  async function init() {
    wireEvents();
    notesArea.value = localStorage.getItem(NOTES_KEY) || "";
    syncPlayerName();
    renderHearts();

    try {
      const mateBuckets = await fetchMateBuckets();
      const datasets = mateModes.map(mode => ({ mode, items: mateBuckets[mode] || [] }));

      state.pool = buildFinalizedPool(datasets);
      state.poolByName = new Map(state.pool.map(mon => [mon.name.toLowerCase(), mon]));
      state.poolIndexByName = new Map(state.pool.map((mon, index) => [mon.name.toLowerCase(), index]));
    } catch (error) {
      console.error(error);
      notesStatus.textContent = "Loading finalized mons failed.";
    }
  }

  function wireEvents() {
    document.getElementById("continueFromNameBtn").addEventListener("click", continueFromName);
    document.getElementById("startGameBtn").addEventListener("click", startGame);
    document.getElementById("joinGameBtn").addEventListener("click", () => {
      joinPanel.hidden = !joinPanel.hidden;
      if (!joinPanel.hidden) joinGameKeyInput.focus();
    });
    document.getElementById("loadKeyBtn").addEventListener("click", () => loadBoardFromKey(joinGameKeyInput.value));
    document.getElementById("editNameBtn").addEventListener("click", () => showScreen("name"));
    document.getElementById("instructionsBtn").addEventListener("click", () => showScreen("instructions"));
    document.getElementById("quitBtn").addEventListener("click", quitToNormalPage);
    document.getElementById("instructionsBackBtn").addEventListener("click", () => showScreen("menu"));
    document.getElementById("quitToMenuBtn").addEventListener("click", () => showScreen("menu"));
    document.getElementById("notesBtn").addEventListener("click", () => showScreen("notes"));
    document.getElementById("notesBackBtn").addEventListener("click", () => showScreen("game"));
    document.getElementById("notesRandomBtn").addEventListener("click", () => {
      buildRandomBoard();
      notesStatus.textContent = "Randomized finalized board loaded.";
    });
    document.getElementById("notesNewSecretBtn").addEventListener("click", rerollSecret);
    document.getElementById("copyGameKeyBtn").addEventListener("click", copyGameKey);
    secretCharacterButton.addEventListener("click", rerollSecret);

    playerNameInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        continueFromName();
      }
    });

    joinGameKeyInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        loadBoardFromKey(joinGameKeyInput.value);
      }
    });

    notesArea.addEventListener("input", () => {
      localStorage.setItem(NOTES_KEY, notesArea.value);
    });

    document.addEventListener("keydown", event => {
      if (screens.game.hidden) return;

      if (event.key.toLowerCase() === "r") {
        resetBoard();
      }

      if (event.key === "Tab") {
        event.preventDefault();
        toggleAllCards();
      }
    });
  }

  function quitToNormalPage() {
    if (typeof window.uproNavigate === "function" && window.uproNavigate("/normal")) {
      return;
    }

    window.location.assign("/normal");
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, screen]) => {
      screen.hidden = key !== name;
    });

    if (name === "menu") {
      syncPlayerName();
    }

    if (name === "game") {
      if (!state.board.length && state.pool.length) {
        buildRandomBoard();
      }
      renderBoard();
      renderSecret();
      renderHearts();
      updateBoardCounter();
    }
  }

  function continueFromName() {
    const nextName = String(playerNameInput.value || "").trim() || DEFAULT_NAME;
    state.playerName = nextName;
    localStorage.setItem(PLAYER_NAME_KEY, nextName);
    syncPlayerName();
    showScreen("menu");
  }

  function syncPlayerName() {
    chosenNameLabel.textContent = state.playerName;
    povTitle.textContent = `${state.playerName}'s POV`;
    playerNameInput.value = "";
    playerNameInput.placeholder = state.playerName || DEFAULT_NAME;
  }

  function buildFinalizedPool(datasets) {
    const seen = new Set();
    const pool = [];

    datasets.forEach(({ mode, items }) => {
      (items || []).forEach((entry, index) => {
        const normalizedName = String(entry?.name || "").trim();
        const image = String(entry?.image || "").toLowerCase();
        if (!normalizedName || seen.has(normalizedName.toLowerCase())) return;
        if (mode === "costumes" || entry?.cosmark === "Y") return;

        if (mode !== "npc" && (
          normalizedName === "MissingNo" ||
          normalizedName === "L.MissingNo" ||
          normalizedName === "Ones" ||
          image.includes("missingno")
        )) {
          return;
        }

        const valid = mode === "npc"
          ? /(^|\/)assets\/images\/mates\/npc\//i.test(image) && !image.includes("youknowwhoiam")
          : /(^|\/)assets\/images\/mates\/base\//i.test(image);

        if (!valid) return;

        seen.add(normalizedName.toLowerCase());
        pool.push({
          mode,
          order: index,
          name: normalizedName,
          image: String(entry.image || "")
        });
      });
    });

    return pool.sort((a, b) => {
      if (a.mode === "npc" && b.mode !== "npc") return 1;
      if (a.mode !== "npc" && b.mode === "npc") return -1;
      if (a.mode === "npc" && b.mode === "npc") return a.order - b.order;
      return a.name.localeCompare(b.name);
    });
  }

  function startGame() {
    if (!state.pool.length) {
      notesStatus.textContent = "The finalized pool has not loaded yet.";
      return;
    }

    buildRandomBoard();
    showScreen("game");
  }

  function buildRandomBoard() {
    const shuffled = [...state.pool];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    const targetSize = shuffled.length < BOARD_SIZE ? 25 : BOARD_SIZE;
    state.board = shuffled.slice(0, Math.min(targetSize, shuffled.length)).map(mon => ({
      ...mon,
      hidden: false,
      questioned: false
    }));
    state.boardKey = buildBoardKey(state.board);
    state.remainingGuesses = GUESSES_TOTAL;
    rerollSecret();
    renderBoard();
    renderHearts();
    updateBoardCounter();
    updateGameKeyOutput();
  }

  function rerollSecret() {
    if (!state.board.length) {
      state.secret = null;
      renderSecret();
      return;
    }

    state.secret = state.board[Math.floor(Math.random() * state.board.length)];
    renderSecret();
  }

  function renderSecret() {
    if (!state.secret) {
      secretNameLabel.textContent = "None";
      secretPortrait.innerHTML = `<div class="guesswho-secret-placeholder">?</div>`;
      return;
    }

    secretNameLabel.textContent = state.secret.name;
    secretPortrait.innerHTML = `<img src="${escapeAttribute(state.secret.image)}" alt="${escapeAttribute(state.secret.name)}" class="guesswho-secret-image">`;
  }

  function renderBoard() {
    boardEl.innerHTML = "";

    state.board.forEach((card, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `guesswho-board-card${card.hidden ? " is-hidden" : ""}${card.questioned ? " is-questioned" : ""}`;
      button.setAttribute("aria-label", `${card.name}${card.hidden ? ", hidden" : ", visible"}`);
      button.innerHTML = `
        <span class="guesswho-board-frame">
          <img src="${escapeAttribute(card.image)}" alt="${escapeAttribute(card.name)}" class="guesswho-board-image">
          <span class="guesswho-board-silhouette"></span>
          <span class="guesswho-board-highlight">?</span>
        </span>
      `;

      button.addEventListener("click", () => toggleCard(index));
      button.addEventListener("contextmenu", event => {
        event.preventDefault();
        toggleQuestioned(index);
      });
      button.addEventListener("mouseenter", event => showHoverTag(card.name, event.currentTarget));
      button.addEventListener("mouseleave", hideHoverTag);
      button.addEventListener("mousemove", event => moveHoverTag(event.currentTarget));
      button.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleCard(index);
        }
      });

      boardEl.appendChild(button);
    });
  }

  function toggleCard(index) {
    const card = state.board[index];
    if (!card) return;
    card.hidden = !card.hidden;
    renderBoard();
    updateBoardCounter();
  }

  function toggleQuestioned(index) {
    const card = state.board[index];
    if (!card) return;
    card.questioned = !card.questioned;
    renderBoard();
  }

  function toggleAllCards() {
    const shouldHide = state.board.some(card => !card.hidden);
    state.board.forEach(card => {
      card.hidden = shouldHide;
    });
    renderBoard();
    updateBoardCounter();
  }

  function resetBoard() {
    state.board.forEach(card => {
      card.hidden = false;
      card.questioned = false;
    });
    renderBoard();
    updateBoardCounter();
  }

  function updateBoardCounter() {
    const visible = state.board.filter(card => !card.hidden).length;
    cardsLeftLabel.textContent = `${visible}/${state.board.length || BOARD_SIZE}`;
  }

  function renderHearts() {
    heartsEl.innerHTML = "";
    for (let index = 0; index < GUESSES_TOTAL; index += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `guesswho-heart${index < state.remainingGuesses ? " is-full" : ""}`;
      button.innerHTML = `<img src="assets/images/ui/Lucid.png" alt="" class="guesswho-heart-image">`;
      button.addEventListener("click", () => {
        state.remainingGuesses = index + 1 === state.remainingGuesses ? index : index + 1;
        renderHearts();
      });
      heartsEl.appendChild(button);
    }
  }

  function buildBoardKey(board) {
    return `G2${board
      .map(card => encodePoolIndex(state.poolIndexByName.get(card.name.toLowerCase())))
      .join("")}`;
  }

  function encodePoolIndex(index) {
    const base = KEY_ALPHABET.length;
    if (!Number.isInteger(index) || index < 0 || index >= base * base) {
      throw new Error("Bad index");
    }

    return `${KEY_ALPHABET[Math.floor(index / base)]}${KEY_ALPHABET[index % base]}`;
  }

  function parseBoardKey(key) {
    const raw = String(key || "").trim();
    const compact = raw.startsWith("G") ? raw.slice(1) : raw;

    if (compact.startsWith("2") && (compact.length === (BOARD_SIZE * 2) + 1 || compact.length === (25 * 2) + 1)) {
      const encoded = compact.slice(1);
      return encoded.match(/.{2}/g).map(pair => {
        const high = KEY_ALPHABET.indexOf(pair[0]);
        const low = KEY_ALPHABET.indexOf(pair[1]);
        const index = (high * KEY_ALPHABET.length) + low;
        if (high < 0 || low < 0 || index >= state.pool.length) {
          throw new Error("Bad char");
        }
        return state.pool[index].name;
      });
    }

    if (compact.length !== BOARD_SIZE && compact.length !== 25) {
      throw new Error("Bad length");
    }

    return compact.split("").map(char => {
      const index = KEY_ALPHABET.indexOf(char);
      if (index < 0 || index >= state.pool.length) {
        throw new Error("Bad char");
      }
      return state.pool[index].name;
    });
  }

  function loadBoardFromKey(key) {
    let names;
    try {
      names = parseBoardKey(key);
    } catch (error) {
      joinStatus.textContent = "That key could not be read.";
      return;
    }

    if (names.length !== BOARD_SIZE && names.length !== 25) {
      joinStatus.textContent = "That key does not contain a valid board size.";
      return;
    }

    const seen = new Set();
    const board = [];
    for (const name of names) {
      const normalized = name.toLowerCase();
      if (seen.has(normalized)) {
        joinStatus.textContent = "That key has duplicate mons.";
        return;
      }
      seen.add(normalized);

      const mon = state.poolByName.get(normalized);
      if (!mon) {
        joinStatus.textContent = `Unknown or non-finalized mon in key: ${name}.`;
        return;
      }

      board.push({
        ...mon,
        hidden: false,
        questioned: false
      });
    }

    state.board = board;
    state.boardKey = buildBoardKey(board);
    state.remainingGuesses = GUESSES_TOTAL;
    rerollSecret();
    renderBoard();
    renderHearts();
    updateBoardCounter();
    updateGameKeyOutput();
    joinStatus.textContent = "Board loaded from key.";
    showScreen("game");
  }

  function updateGameKeyOutput() {
    gameKeyOutput.value = state.boardKey || "";
  }

  async function copyGameKey() {
    if (!state.boardKey) return;
    try {
      await navigator.clipboard.writeText(state.boardKey);
      notesStatus.textContent = "Game key copied.";
    } catch (error) {
      notesStatus.textContent = "Could not copy the game key.";
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  function showHoverTag(name, target) {
    if (!hoverTag || !target) return;
    hoverTag.textContent = name;
    hoverTag.hidden = false;
    moveHoverTag(target);
  }

  function moveHoverTag(target) {
    if (!hoverTag || hoverTag.hidden || !target) return;
    const cardRect = target.getBoundingClientRect();
    const panelRect = boardEl.parentElement.getBoundingClientRect();
    const left = cardRect.left - panelRect.left + (cardRect.width / 2);
    const top = cardRect.top - panelRect.top - 10;

    hoverTag.style.left = `${left}px`;
    hoverTag.style.top = `${top}px`;
  }

  function hideHoverTag() {
    if (!hoverTag) return;
    hoverTag.hidden = true;
  }
}
const remoteScripts = []


function loadRemoteScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-upro-src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.dataset.uproSrc = src
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

export default function GuessWhoPage() {
  useEffect(() => {
    document.title = "Animatrix Guess Who?"
    document.body.className = "guesswho-page"
    document.body.setAttribute('style', "")

    let cancelled = false

    async function startPage() {
      for (const src of remoteScripts) {
        await loadRemoteScript(src)
      }
      if (cancelled) return

      window.onload = null
      runPageScript()
      document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }))
      window.dispatchEvent(new Event('load'))
      if (typeof window.onload === 'function') {
        window.onload()
      }
    }

    startPage().catch(error => console.error(error))

    return () => {
      cancelled = true
      window.onload = null
    }
  }, [])

  return (
    <>
      {pageStyles && <style>{pageStyles}</style>}
      <div className="upro-page-root"><main className="guesswho-shell">
    <section id="nameScreen" className="guesswho-screen guesswho-screen-active guesswho-center-screen" aria-labelledby="nameScreenTitle">
      <div className="guesswho-name-layout">
        <h1 id="nameScreenTitle" className="guesswho-large-title">Please enter your name!</h1>
        <p className="guesswho-sub-copy">It will be displayed in-game</p>
        <div className="guesswho-name-field-wrap">
          <input id="playerNameInput" className="guesswho-text-input guesswho-name-input" type="text" maxLength={24} placeholder="Placeholder" />
        </div>
      </div>
      <div className="guesswho-bottom-action">
        <button type="button" className="guesswho-box-btn" id="continueFromNameBtn">Continue</button>
      </div>
    </section>
    <section id="menuScreen" className="guesswho-screen" aria-labelledby="guesswhoMenuTitle" hidden>
      <div className="guesswho-menu-stage">
        <div className="guesswho-menu-header">
          <div className="guesswho-logo-wrap">
            <img id="guesswhoMenuTitle" className="guesswho-logo-image" src="assets/images/ui/Logo.png" alt="UPRO logo" />
            <div className="guesswho-logo-sub">Guess Who</div>
          </div>
          <p className="guesswho-chosen-name">Chosen name: <span id="chosenNameLabel">Placeholder</span></p>
        </div>
        <nav className="guesswho-menu" aria-label="Guess Who menu">
          <button type="button" className="guesswho-menu-btn" id="startGameBtn">START GAME</button>
          <button type="button" className="guesswho-menu-btn" id="joinGameBtn">JOIN GAME</button>
          <button type="button" className="guesswho-menu-btn" id="editNameBtn">EDIT NAME</button>
          <button type="button" className="guesswho-menu-btn" id="instructionsBtn">INSTRUCTIONS</button>
          <button type="button" className="guesswho-menu-btn" id="quitBtn">QUIT</button>
        </nav>
        <section id="joinPanel" className="guesswho-join-panel" hidden>
          <label className="guesswho-field-label" htmlFor="joinGameKeyInput">Paste a game key to load the same 50-mon order</label>
          <div className="guesswho-join-row">
            <input id="joinGameKeyInput" className="guesswho-text-input" type="text" />
            <button type="button" className="guesswho-box-btn" id="loadKeyBtn">Load Key</button>
          </div>
          <p id="joinStatus" className="guesswho-validation" />
        </section>
      </div>
    </section>
    <section id="instructionsScreen" className="guesswho-screen" hidden aria-labelledby="instructionsTitle">
      <div className="guesswho-instructions-layout">
        <div className="guesswho-instructions-main">
          <h2 id="instructionsTitle" className="guesswho-screen-heading">INSTRUCTIONS:</h2>
          <div className="guesswho-instructions-copy">
            <p>If you don't know how Guess Who works, you will need 2 people in order to play. Ask a friend to get the game on their device, and play through a call or just side by side. Each player needs their own game and their own screen.</p>
            <p>Once you're set, take turns asking "yes" or "no" questions to try and figure out who your opponent's character is. Whoever guesses correct first wins.</p>
            <p className="guesswho-rules-intro">Here are some <span>RULES</span> to spice up the game. You can adjust them to your liking.</p>
            <ol className="guesswho-rules-list">
              <li>No repeated questions. Once a question is asked, it can't be asked again.</li>
              <li>No questions about the card's placement on the board.</li>
              <li>Each player gets 3 guesses. Guessing also takes a turn.</li>
              <li>Optional rule: allow one final guess after losing so the round can end on a tie.</li>
            </ol>
            <p className="guesswho-hard-mode">As a fun <span>HARD MODE</span> alternative, try a turn where you're only allowed to ask subjective questions instead of pure yes/no ones.</p>
          </div>
        </div>
        <aside className="guesswho-extra-controls">
          <h3>EXTRA CONTROLS:</h3>
          <ul>
            <li><span>[+]</span> Increase Volume</li>
            <li><span>[-]</span> Decrease Volume</li>
            <li><span>[Esc]</span> Close the game</li>
            <li><span>[F5]</span> Restart the game</li>
            <li><span>[F4]</span> Toggle Fullscreen</li>
          </ul>
          <p className="guesswho-try-it">[Alt + F4] Try it!</p>
        </aside>
      </div>
      <div className="guesswho-bottom-action">
        <button type="button" className="guesswho-box-btn guesswho-box-btn-large" id="instructionsBackBtn">◀ Quit to Menu</button>
      </div>
    </section>
    <section id="gameScreen" className="guesswho-screen" aria-labelledby="povTitle" hidden>
      <div className="guesswho-toolbar guesswho-toolbar-left">
        <button type="button" className="guesswho-box-btn" id="quitToMenuBtn">◀ Quit to Menu</button>
      </div>
      <div className="guesswho-toolbar guesswho-toolbar-right">
        <button type="button" className="guesswho-box-btn" id="notesBtn">Notes ▣</button>
      </div>
      <div className="guesswho-game-layout">
        <aside className="guesswho-sidebar-panel" aria-labelledby="yourCharacterTitle">
          <h2 id="yourCharacterTitle" className="guesswho-panel-title">YOUR CHARACTER:</h2>
          <button type="button" id="secretCharacterButton" className="guesswho-secret-button">
            <p id="secretNameLabel" className="guesswho-panel-name">None</p>
            <div id="secretPortrait" className="guesswho-secret-portrait">
              <div className="guesswho-secret-placeholder">?</div>
            </div>
          </button>
          <div className="guesswho-guesses">
            <p className="guesswho-guesses-label">Guesses:</p>
            <div id="guessHearts" className="guesswho-hearts" aria-label="Remaining guesses" />
          </div>
        </aside>
        <section className="guesswho-board-panel" aria-labelledby="povTitle">
          <header className="guesswho-board-head">
            <h2 id="povTitle" className="guesswho-pov-title">Placeholder's POV</h2>
            <p className="guesswho-cards-left">Cards left: <span id="cardsLeftLabel">0/50</span></p>
          </header>
          <div id="guesswhoBoard" className="guesswho-board" aria-live="polite" />
          <div id="guesswhoHoverTag" className="guesswho-hover-tag" hidden />
        </section>
      </div>
      <div className="guesswho-controls-dock">
        <div id="controlsPanel" className="guesswho-controls-panel">
          <div className="guesswho-controls-grid">
            <span>🖱 Flip card.</span>
            <span>🖱 Highlight card.</span>
            <span>⌨ Toggle flipped cards.</span>
            <span>R Reset cards.</span>
            <span>Click your character to re-roll.</span>
            <span>Click the hearts to count your guesses.</span>
          </div>
        </div>
      </div>
    </section>
    <section id="notesScreen" className="guesswho-screen" hidden aria-labelledby="notesScreenTitle">
      <div className="guesswho-toolbar guesswho-toolbar-left">
        <button type="button" className="guesswho-box-btn guesswho-box-btn-accent" id="notesBackBtn">Go Back</button>
      </div>
      <div className="guesswho-notes-layout">
        <header className="guesswho-notes-header">
          <h2 id="notesScreenTitle" className="guesswho-notes-title">Notes about your opponent's character.</h2>
          <p className="guesswho-sub-copy">Make notes after each question to avoid losing track of information.</p>
        </header>
        <textarea id="notesArea" className="guesswho-notes-area" spellCheck="false" defaultValue={""} />
        <section className="guesswho-notes-tools">
          <p id="notesStatus">Share a key to mirror the same 50-mon board, or reroll a fresh randomized one.</p>
          <label className="guesswho-field-label" htmlFor="gameKeyOutput">Current game key</label>
          <div className="guesswho-join-row">
            <input id="gameKeyOutput" className="guesswho-text-input" type="text" readOnly />
            <button type="button" className="guesswho-box-btn" id="copyGameKeyBtn">Copy Key</button>
          </div>
          <div className="guesswho-modal-actions">
            <button type="button" className="guesswho-box-btn" id="notesRandomBtn">Randomized Board</button>
            <button type="button" className="guesswho-box-btn" id="notesNewSecretBtn">New Secret Mon</button>
          </div>
        </section>
      </div>
    </section>
  </main></div>
    </>
  )
}
