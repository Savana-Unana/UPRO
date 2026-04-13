(function () {
  const ACCESS_KEY = "upro_guesswho_unlocked";
  const PLAYER_NAME_KEY = "upro_guesswho_player_name";
  const NOTES_KEY = "upro_guesswho_notes";
  const BOARD_SIZE = 50;
  const DEFAULT_NAME = "Placeholder";
  const GUESSES_TOTAL = 3;
  const KEY_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
  const DATA_FILES = [
    { mode: "base", path: "data/mates/base.json" },
    { mode: "sacred", path: "data/mates/sacred.json" },
    { mode: "ace", path: "data/mates/ace.json" },
    { mode: "goner", path: "data/mates/goner.json" },
    { mode: "ncanon", path: "data/mates/ncanon.json" },
    { mode: "costumes", path: "data/mates/costumes.json" },
    { mode: "npc", path: "data/mates/npc.json" }
  ];

  if (sessionStorage.getItem(ACCESS_KEY) !== "true") {
    window.location.replace("index.html");
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
      const datasets = await Promise.all(
        DATA_FILES.map(file =>
          fetch(file.path)
            .then(response => {
              if (!response.ok) throw new Error(`Failed to load ${file.path}`);
              return response.json();
            })
            .then(items => ({ mode: file.mode, items }))
        )
      );

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
    document.getElementById("quitBtn").addEventListener("click", () => window.location.href = "index.html");
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
      (items || []).forEach(entry => {
        const normalizedName = String(entry?.name || "").trim();
        const image = String(entry?.image || "").toLowerCase();
        if (!normalizedName || seen.has(normalizedName.toLowerCase())) return;

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
          name: normalizedName,
          image: String(entry.image || "")
        });
      });
    });

    return pool.sort((a, b) => a.name.localeCompare(b.name));
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

    state.board = shuffled.slice(0, BOARD_SIZE).map(mon => ({
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
    cardsLeftLabel.textContent = `${visible}/${BOARD_SIZE}`;
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
    return `G${board
      .map(card => {
        const index = state.poolIndexByName.get(card.name.toLowerCase());
        return KEY_ALPHABET[index] || "";
      })
      .join("")}`;
  }

  function parseBoardKey(key) {
    const raw = String(key || "").trim();
    const compact = raw.startsWith("G") ? raw.slice(1) : raw;
    if (compact.length !== BOARD_SIZE) {
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

    if (names.length !== BOARD_SIZE) {
      joinStatus.textContent = "That key does not contain 50 mons.";
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
})();
