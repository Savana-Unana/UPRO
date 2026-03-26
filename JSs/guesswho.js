(function () {
  const ACCESS_KEY = "upro_guesswho_unlocked";
  const SAVED_CUSTOM_KEY = "upro_guesswho_custom_board";
  const PLAYER_NAME_KEY = "upro_guesswho_player_name";
  const NOTES_KEY = "upro_guesswho_notes";
  const BOARD_SIZE = 50;
  const DEFAULT_NAME = "Placeholder";
  const GUESSES_TOTAL = 3;
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
    board: [],
    secret: null,
    playerName: localStorage.getItem(PLAYER_NAME_KEY) || DEFAULT_NAME,
    remainingGuesses: GUESSES_TOTAL,
    controlsVisible: false
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
  const heartsEl = document.getElementById("guessHearts");
  const controlsPanel = document.getElementById("controlsPanel");
  const controlsButton = document.getElementById("showControlsBtn");
  const notesArea = document.getElementById("notesArea");
  const customBoardInput = document.getElementById("customBoardInput");
  const customValidation = document.getElementById("customValidation");
  const finalizedNames = document.getElementById("finalizedNames");
  const notesStatus = document.getElementById("notesStatus");
  const secretCharacterButton = document.getElementById("secretCharacterButton");

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
      finalizedNames.innerHTML = state.pool.map(mon => `<span class="guesswho-name-chip">${escapeHtml(mon.name)}</span>`).join("");
      loadSavedCustomList(false);
    } catch (error) {
      console.error(error);
      notesStatus.textContent = "Loading finalized mons failed.";
    }
  }

  function wireEvents() {
    document.getElementById("continueFromNameBtn").addEventListener("click", continueFromName);
    document.getElementById("startGameBtn").addEventListener("click", startGame);
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
    document.getElementById("notesUseCustomBtn").addEventListener("click", buildCustomBoard);
    document.getElementById("notesUseCurrentBtn").addEventListener("click", copyCurrentBoardToEditor);
    document.getElementById("notesSaveCustomBtn").addEventListener("click", saveCustomList);
    document.getElementById("notesLoadSavedBtn").addEventListener("click", () => loadSavedCustomList(true));
    document.getElementById("notesNewSecretBtn").addEventListener("click", rerollSecret);
    document.getElementById("showControlsBtn").addEventListener("click", toggleControlsPanel);
    secretCharacterButton.addEventListener("click", rerollSecret);

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
    playerNameInput.value = state.playerName;
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
          ? /(^|\/)nimages\//i.test(image) && !image.includes("youknowwhoiam")
          : /(^|\/)images\//i.test(image);

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
      highlighted: false
    }));
    state.remainingGuesses = GUESSES_TOTAL;
    state.controlsVisible = false;
    controlsPanel.hidden = true;
    controlsButton.textContent = "Show Controls";
    rerollSecret();
    renderBoard();
    renderHearts();
    updateBoardCounter();
  }

  function buildCustomBoard() {
    const names = String(customBoardInput.value || "")
      .split(/[\n,]+/g)
      .map(name => name.trim())
      .filter(Boolean);

    if (names.length !== BOARD_SIZE) {
      customValidation.textContent = `Custom board needs exactly ${BOARD_SIZE} names.`;
      return;
    }

    const seen = new Set();
    const board = [];
    const invalid = [];

    names.forEach(name => {
      const key = name.toLowerCase();
      if (seen.has(key)) {
        invalid.push(name);
        return;
      }
      seen.add(key);

      const mon = state.poolByName.get(key);
      if (!mon) {
        invalid.push(name);
        return;
      }

      board.push({
        ...mon,
        hidden: false,
        highlighted: false
      });
    });

    if (invalid.length) {
      customValidation.textContent = `Only finalized mons can be used once each. Problem entries: ${invalid.join(", ")}.`;
      return;
    }

    state.board = board;
    state.remainingGuesses = GUESSES_TOTAL;
    rerollSecret();
    renderBoard();
    renderHearts();
    updateBoardCounter();
    customValidation.textContent = "Custom board loaded.";
    notesStatus.textContent = "Custom finalized board loaded.";
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
      button.className = `guesswho-board-card${card.hidden ? " is-hidden" : ""}${card.highlighted ? " is-highlighted" : ""}`;
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
        toggleHighlight(index);
      });
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

  function toggleHighlight(index) {
    const card = state.board[index];
    if (!card) return;
    card.highlighted = !card.highlighted;
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
      card.highlighted = false;
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
      button.innerHTML = `<img src="webimages/Lucid.png" alt="" class="guesswho-heart-image">`;
      button.addEventListener("click", () => {
        state.remainingGuesses = index + 1 === state.remainingGuesses ? index : index + 1;
        renderHearts();
      });
      heartsEl.appendChild(button);
    }
  }

  function toggleControlsPanel() {
    state.controlsVisible = !state.controlsVisible;
    controlsPanel.hidden = !state.controlsVisible;
    controlsButton.textContent = state.controlsVisible ? "Hide Controls" : "Show Controls";
  }

  function saveCustomList() {
    localStorage.setItem(SAVED_CUSTOM_KEY, customBoardInput.value);
    customValidation.textContent = "Custom list saved.";
  }

  function loadSavedCustomList(showMessage) {
    const saved = localStorage.getItem(SAVED_CUSTOM_KEY);
    if (!saved) {
      if (showMessage) customValidation.textContent = "No saved custom list found.";
      return;
    }

    customBoardInput.value = saved;
    if (showMessage) customValidation.textContent = "Saved custom list loaded.";
  }

  function copyCurrentBoardToEditor() {
    if (!state.board.length) {
      customValidation.textContent = "Start or load a board first.";
      return;
    }

    customBoardInput.value = state.board.map(card => card.name).join("\n");
    customValidation.textContent = "Current board copied into the custom list.";
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
})();
