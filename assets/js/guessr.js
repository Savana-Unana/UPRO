(function () {
  const BASE_DATA_PATH = "data/mates/base.json";
  const MAX_GUESSES = 6;
  const STORAGE_PREFIX = "upro-guessr-daily-";
  const CLUE_CONFIGS = [
    {
      id: "blackout",
      title: "Black-out",
      description: "A fully blacked-out sprite silhouette.",
      modeLabel: "Blacked-out animate",
      shareSymbol: "⬛",
      emptyState: "No finalized animates match that search."
    },
    {
      id: "palette",
      title: "Semi-Color",
      description: "The sprite's colors, shown side by side.",
      modeLabel: "Palette animate",
      shareSymbol: "🟦",
      emptyState: "No finalized animates match that search."
    }
  ];

  const gameGrid = document.getElementById("guessrGameGrid");
  const tabsEl = document.getElementById("guessrTabs");
  const modeLabel = document.getElementById("guessrModeLabel");
  const randomBtn = document.getElementById("guessrRandomBtn");

  const state = {
    pool: [],
    rounds: {},
    randomRound: false,
    dailyKey: "",
    activeTab: CLUE_CONFIGS[0].id
  };

  init();

  async function init() {
    buildGameCards();
    setActiveTab(state.activeTab);
    wireGlobalEvents();

    try {
      const baseItems = await fetch(BASE_DATA_PATH)
        .then(response => {
          if (!response.ok) throw new Error(`Failed to load ${BASE_DATA_PATH}`);
          return response.json();
        });

      state.pool = buildPool(baseItems);
      state.pool.sort((a, b) => a.name.localeCompare(b.name));
      if (state.pool.length < 2) {
        throw new Error("Guessr needs at least two finalized animates.");
      }

      startDailyRound();
    } catch (error) {
      console.error(error);
      modeLabel.textContent = "Guessr failed to load finalized animates.";
      Object.values(state.rounds).forEach(round => {
        round.status.textContent = "Guessr could not load the finalized animate pool.";
        round.pickerBtn.disabled = true;
      });
      randomBtn.hidden = true;
    }
  }

  function buildGameCards() {
    CLUE_CONFIGS.forEach(config => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "guessr-tab";
      tab.id = `guessrTab-${config.id}`;
      tab.textContent = config.title;
      tab.setAttribute("aria-selected", config.id === state.activeTab ? "true" : "false");
      tab.addEventListener("click", () => setActiveTab(config.id));
      tabsEl.appendChild(tab);

      const article = document.createElement("article");
      article.className = "guessr-panel";
      article.id = `guessrPanel-${config.id}`;
      article.hidden = config.id !== state.activeTab;
      article.innerHTML = `
        <div class="guessr-panel-head">
          <div>
            <p class="guessr-kicker">${escapeHtml(config.title)}</p>
            <h2 class="guessr-panel-title">${escapeHtml(config.modeLabel)}</h2>
            <p class="guessr-panel-copy">${escapeHtml(config.description)}</p>
          </div>
          <div class="guessr-clue-shell">
            <div class="guessr-clue-card guessr-clue-card-${config.id}" id="guessrClueCard-${config.id}">
              ${config.id === "blackout" ? `
              <div class="guessr-clue-image-wrap" id="guessrClueWrap-${config.id}">
                <img alt="" class="guessr-clue-image" id="guessrClueImage-${config.id}" hidden>
                <div class="guessr-clue-fallback" id="guessrClueFallback-${config.id}">Loading clue...</div>
              </div>
              ` : `
              <div class="guessr-palette-grid" id="guessrPalette-${config.id}" hidden></div>
              `}
            </div>
          </div>
        </div>

        <div class="guessr-controls">
          <div class="guessr-combobox" id="guessrCombobox-${config.id}">
            <button class="guessr-combobox-btn" type="button" id="guessrPickerBtn-${config.id}" aria-expanded="false" aria-controls="guessrPickerPanel-${config.id}">
              <span id="guessrPickerLabel-${config.id}">Guess the animate</span>
            </button>
            <div class="guessr-combobox-panel" id="guessrPickerPanel-${config.id}" hidden>
              <input class="guessr-search" id="guessrSearchInput-${config.id}" type="text" placeholder="Search animates..." autocomplete="off">
              <div class="guessr-option-list" id="guessrOptionList-${config.id}" role="listbox" aria-label="${escapeAttribute(config.title)} animate options"></div>
            </div>
          </div>

          <p class="guessr-status" id="guessrStatus-${config.id}">You have ${MAX_GUESSES} guesses for ${config.title}.</p>
        </div>

        <div class="guessr-board" id="guessrBoard-${config.id}" aria-live="polite"></div>
      `;

      gameGrid.appendChild(article);

      state.rounds[config.id] = {
        config,
        target: null,
        guesses: [],
        finished: false,
        pickerBtn: article.querySelector(`#guessrPickerBtn-${config.id}`),
        pickerLabel: article.querySelector(`#guessrPickerLabel-${config.id}`),
        pickerPanel: article.querySelector(`#guessrPickerPanel-${config.id}`),
        searchInput: article.querySelector(`#guessrSearchInput-${config.id}`),
        optionList: article.querySelector(`#guessrOptionList-${config.id}`),
        status: article.querySelector(`#guessrStatus-${config.id}`),
        board: article.querySelector(`#guessrBoard-${config.id}`),
        panel: article,
        tab,
        clueCard: article.querySelector(`#guessrClueCard-${config.id}`),
        clueWrap: article.querySelector(`#guessrClueWrap-${config.id}`),
        clueImage: article.querySelector(`#guessrClueImage-${config.id}`),
        clueFallback: article.querySelector(`#guessrClueFallback-${config.id}`),
        paletteGrid: article.querySelector(`#guessrPalette-${config.id}`)
      };
    });

    Object.values(state.rounds).forEach(wireRoundEvents);
  }

  function setActiveTab(tabId) {
    state.activeTab = tabId;
    Object.values(state.rounds).forEach(round => {
      const isActive = round.config.id === tabId;
      round.panel.hidden = !isActive;
      round.tab.setAttribute("aria-selected", isActive ? "true" : "false");
      round.tab.classList.toggle("is-active", isActive);
      if (!isActive) {
        closePicker(round);
      }
    });
  }

  function wireGlobalEvents() {
    document.addEventListener("click", event => {
      Object.values(state.rounds).forEach(round => {
        const combobox = document.getElementById(`guessrCombobox-${round.config.id}`);
        if (combobox && !combobox.contains(event.target)) {
          closePicker(round);
        }
      });
    });

    randomBtn.addEventListener("click", () => {
      startRandomRound();
    });
  }

  function wireRoundEvents(round) {
    round.pickerBtn.addEventListener("click", () => {
      const isOpen = !round.pickerPanel.hidden;
      closeAllPickers();
      if (isOpen) return;
      round.pickerPanel.hidden = false;
      round.pickerBtn.setAttribute("aria-expanded", "true");
      round.searchInput.value = "";
      renderOptions(round, "");
      round.searchInput.focus();
    });

    round.searchInput.addEventListener("input", event => {
      renderOptions(round, event.target.value || "");
    });
  }

  function closeAllPickers() {
    Object.values(state.rounds).forEach(closePicker);
  }

  function closePicker(round) {
    round.pickerPanel.hidden = true;
    round.pickerBtn.setAttribute("aria-expanded", "false");
  }

  function buildPool(baseItems) {
    return baseItems
      .map((item, index) => normalizeAnimate(item, index))
      .filter(Boolean);
  }

  function normalizeAnimate(item, index) {
    const imagePath = String(item.image || "");
    const path = imagePath.toLowerCase();
    const hasFinalArt = (
      path.startsWith("assets/images/mates/base/") ||
      path.includes("/assets/images/mates/base/") ||
      path.startsWith("assets/images/mates/costumes/") ||
      path.includes("/assets/images/mates/costumes/")
    ) && !path.includes("missingno") && !path.includes("youknowwhoiam");

    if (!hasFinalArt) return null;
    if (item.name === "MissingNo" || item.name === "L.MissingNo" || item.name === "Ones") return null;

    return {
      id: index,
      name: String(item.name || "Unknown"),
      image: imagePath
    };
  }

  function startDailyRound() {
    state.randomRound = false;
    state.dailyKey = getDailyStorageKey();
    modeLabel.textContent = "Two daily clue hunts, two different animates";
    assignTargets(pickDistinctTargets(getDailySeed()));
    resetRounds();
    restoreDailyProgress();
    renderAll();
  }

  function startRandomRound() {
    state.randomRound = true;
    state.dailyKey = "";
    modeLabel.textContent = "Random round with two different animates";
    assignTargets(pickDistinctTargets(`${Date.now()}-${Math.random()}`));
    resetRounds();
    renderAll();
  }

  function assignTargets(targets) {
    CLUE_CONFIGS.forEach((config, index) => {
      state.rounds[config.id].target = targets[index];
    });
  }

  function resetRounds() {
    Object.values(state.rounds).forEach(round => {
      round.guesses = [];
      round.finished = false;
      round.pickerBtn.disabled = false;
      round.pickerLabel.textContent = "Guess the animate";
      round.status.textContent = `You have ${MAX_GUESSES} guesses for ${round.config.title}.`;
      renderOptions(round, "");
      renderBoard(round);
      renderClue(round);
    });

    randomBtn.hidden = true;
  }

  function restoreDailyProgress() {
    const saved = loadDailyProgress();
    if (!saved || !saved.targets) return;

    const matchesTargets = CLUE_CONFIGS.every(config => {
      const round = state.rounds[config.id];
      return saved.targets[config.id] === round.target?.name;
    });

    if (!matchesTargets) return;

    CLUE_CONFIGS.forEach(config => {
      const round = state.rounds[config.id];
      const guesses = Array.isArray(saved.guesses?.[config.id]) ? saved.guesses[config.id] : [];
      guesses.slice(0, MAX_GUESSES).forEach(guessName => {
        const animate = state.pool.find(entry => entry.name === guessName);
        if (!animate) return;
        round.guesses.push({
          animate,
          correct: animate.name === round.target.name
        });
      });

      if (round.guesses.length) {
        round.pickerLabel.textContent = round.guesses[round.guesses.length - 1].animate.name;
      }

      round.finished = round.guesses.some(guess => guess.correct) || round.guesses.length >= MAX_GUESSES;
      updateRoundStatus(round);
      if (round.finished) {
        round.pickerBtn.disabled = true;
      }
    });

    updateGlobalActions();
  }

  function renderAll() {
    Object.values(state.rounds).forEach(round => {
      renderOptions(round, "");
      renderBoard(round);
      renderClue(round);
      updateRoundStatus(round);
    });
    updateGlobalActions();
  }

  function renderOptions(round, term) {
    round.optionList.innerHTML = "";

    const needle = String(term || "").trim().toLowerCase();
    const visible = state.pool.filter(animate => animate.name.toLowerCase().includes(needle));

    visible.forEach(animate => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "guessr-option";
      button.innerHTML = `<span class="guessr-option-name">${escapeHtml(animate.name)}</span>`;
      button.addEventListener("click", () => submitGuess(round, animate));
      round.optionList.appendChild(button);
    });

    if (!visible.length) {
      const empty = document.createElement("div");
      empty.className = "guessr-empty";
      empty.textContent = round.config.emptyState;
      round.optionList.appendChild(empty);
    }
  }

  function submitGuess(round, animate) {
    if (round.finished) return;

    if (round.guesses.some(guess => guess.animate.name === animate.name)) {
      round.status.textContent = "You already guessed that animate.";
      closePicker(round);
      return;
    }

    round.guesses.push({
      animate,
      correct: animate.name === round.target.name
    });

    round.pickerLabel.textContent = animate.name;
    closePicker(round);

    if (animate.name === round.target.name) {
      round.finished = true;
      round.pickerBtn.disabled = true;
    } else if (round.guesses.length >= MAX_GUESSES) {
      round.finished = true;
      round.pickerBtn.disabled = true;
    }

    updateRoundStatus(round);
    renderBoard(round);
    saveDailyProgress();
    updateGlobalActions();
  }

  function renderBoard(round) {
    round.board.innerHTML = "";

    if (!round.guesses.length) {
      const empty = document.createElement("div");
      empty.className = "guessr-board-empty";
      empty.textContent = "No guesses yet.";
      round.board.appendChild(empty);
      return;
    }

    round.guesses.forEach((guessEntry, guessIndex) => {
      const row = document.createElement("div");
      row.className = `guessr-row ${guessEntry.correct ? "is-correct" : "is-wrong"}`;
      row.style.animationDelay = `${guessIndex * 90}ms`;
      row.innerHTML = `
        <div class="guessr-row-main">
          <div>
            <div class="guessr-row-name">${escapeHtml(guessEntry.animate.name)}</div>
            <div class="guessr-row-result">${guessEntry.correct ? "Correct" : "Not this animate"}</div>
          </div>
        </div>
      `;
      round.board.appendChild(row);
    });
  }

  function renderClue(round) {
    if (round.clueWrap) {
      round.clueImage.hidden = true;
    }
    if (round.paletteGrid) {
      round.paletteGrid.hidden = true;
      round.paletteGrid.innerHTML = "";
    }
    if (round.clueFallback) {
      round.clueFallback.hidden = false;
      round.clueFallback.textContent = "Loading clue...";
    }

    const target = round.target;
    if (!target) {
      if (round.config.id === "blackout") {
        round.clueFallback.textContent = "Clue unavailable.";
      }
      return;
    }

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      try {
        const clueData = buildClueData(image, round.config.id);

        if (round.config.id === "blackout") {
          round.clueImage.src = clueData;
          round.clueImage.hidden = false;
          round.clueFallback.hidden = true;
        } else {
          clueData.forEach(color => {
            const swatch = document.createElement("div");
            swatch.className = "guessr-palette-swatch";
            swatch.style.background = color;
            round.paletteGrid.appendChild(swatch);
          });
          if (round.paletteGrid) {
            round.paletteGrid.hidden = clueData.length === 0;
          }
        }
      } catch (error) {
        console.error(error);
        if (round.config.id === "blackout") {
          round.clueFallback.textContent = "Clue unavailable.";
        }
      }
    };
    image.onerror = () => {
      if (round.config.id === "blackout") {
        round.clueFallback.textContent = "Clue unavailable.";
      }
    };
    image.src = target.image;
  }

  function buildClueData(image, clueId) {
    const canvas = document.createElement("canvas");
    const width = Math.max(1, image.naturalWidth || image.width || 1);
    const height = Math.max(1, image.naturalHeight || image.height || 1);
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    if (clueId === "blackout") {
      const imageData = context.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] === 0) continue;
        pixels[index] = 0;
        pixels[index + 1] = 0;
        pixels[index + 2] = 0;
      }
      context.putImageData(imageData, 0, 0);
      return canvas.toDataURL("image/png");
    }

    const rawPalette = extractPalette(context.getImageData(0, 0, width, height).data);
    return sortPalette(rawPalette).slice(0, 24);
  }

  function extractPalette(pixels) {
    const counts = new Map();

    for (let index = 0; index < pixels.length; index += 4) {
      const alpha = pixels[index + 3];
      if (alpha < 24) continue;

      const red = quantizeChannel(pixels[index]);
      const green = quantizeChannel(pixels[index + 1]);
      const blue = quantizeChannel(pixels[index + 2]);
      const key = `${red},${green},${blue}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1])
      .map(([key]) => {
        const [red, green, blue] = key.split(",").map(Number);
        return rgbToHex(red, green, blue);
      });
  }

  function sortPalette(colors) {
    return colors.slice().sort((left, right) => {
      const leftHsl = hexToHsl(left);
      const rightHsl = hexToHsl(right);

      const leftNeutral = leftHsl.s < 0.12;
      const rightNeutral = rightHsl.s < 0.12;
      if (leftNeutral && rightNeutral) return rightHsl.l - leftHsl.l;
      if (leftNeutral) return 1;
      if (rightNeutral) return -1;

      const leftHue = normalizeHueOrder(leftHsl.h);
      const rightHue = normalizeHueOrder(rightHsl.h);
      if (leftHue !== rightHue) return leftHue - rightHue;
      if (leftHsl.l !== rightHsl.l) return rightHsl.l - leftHsl.l;
      return rightHsl.s - leftHsl.s;
    });
  }

  function normalizeHueOrder(hue) {
    return hue < 0 ? 999 : ((hue - 360) % 360 + 360) % 360;
  }

  function hexToHsl(hex) {
    const red = parseInt(hex.slice(1, 3), 16) / 255;
    const green = parseInt(hex.slice(3, 5), 16) / 255;
    const blue = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;
    const delta = max - min;

    if (delta === 0) {
      return { h: -1, s: 0, l: lightness };
    }

    const saturation = delta / (1 - Math.abs(2 * lightness - 1));
    let hue;

    switch (max) {
      case red:
        hue = 60 * (((green - blue) / delta) % 6);
        break;
      case green:
        hue = 60 * (((blue - red) / delta) + 2);
        break;
      default:
        hue = 60 * (((red - green) / delta) + 4);
        break;
    }

    if (hue < 0) hue += 360;
    return { h: hue, s: saturation, l: lightness };
  }

  function quantizeChannel(value) {
    return Math.max(0, Math.min(255, Math.round(value / 16) * 16));
  }

  function rgbToHex(red, green, blue) {
    return `#${[red, green, blue].map(value => value.toString(16).padStart(2, "0")).join("")}`;
  }

  function updateRoundStatus(round) {
    const correctGuess = round.guesses.find(guess => guess.correct);
    if (correctGuess) {
      round.status.textContent = `Solved in ${round.guesses.length}/${MAX_GUESSES}. ${correctGuess.animate.name} was the answer.`;
      return;
    }

    if (round.guesses.length >= MAX_GUESSES) {
      round.status.textContent = `Out of guesses. The answer was ${round.target.name}.`;
      return;
    }

    round.status.textContent = `${MAX_GUESSES - round.guesses.length} guesses remaining for ${round.config.title}.`;
  }

  function updateGlobalActions() {
    const allFinished = Object.values(state.rounds).every(round => round.finished);
    randomBtn.hidden = !allFinished;
  }

  function saveDailyProgress() {
    if (state.randomRound || !state.dailyKey) return;
    const payload = {
      targets: Object.fromEntries(CLUE_CONFIGS.map(config => [config.id, state.rounds[config.id].target?.name || ""])),
      guesses: Object.fromEntries(CLUE_CONFIGS.map(config => [config.id, state.rounds[config.id].guesses.map(entry => entry.animate.name)]))
    };
    try {
      localStorage.setItem(state.dailyKey, JSON.stringify(payload));
    } catch (error) {
      console.error(error);
    }
  }

  function loadDailyProgress() {
    if (!state.dailyKey) return null;
    try {
      const raw = localStorage.getItem(state.dailyKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function pickDistinctTargets(seedText) {
    const firstIndex = seededIndex(seedText, "blackout", state.pool.length);
    let secondIndex = seededIndex(seedText, "palette", state.pool.length);

    if (secondIndex === firstIndex) {
      secondIndex = (secondIndex + 1) % state.pool.length;
    }

    return [state.pool[firstIndex], state.pool[secondIndex]];
  }

  function seededIndex(seedText, salt, size) {
    const fullSeed = `${seedText}:${salt}`;
    let hash = 0;
    for (let index = 0; index < fullSeed.length; index += 1) {
      hash = ((hash * 31) + fullSeed.charCodeAt(index)) >>> 0;
    }
    return hash % size;
  }

  function getDailySeed() {
    const now = new Date();
    return [
      now.getUTCFullYear(),
      String(now.getUTCMonth() + 1).padStart(2, "0"),
      String(now.getUTCDate()).padStart(2, "0")
    ].join("-");
  }

  function getDailyStorageKey() {
    return `${STORAGE_PREFIX}${getDailySeed()}`;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, match => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    }[match]));
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }
})();
