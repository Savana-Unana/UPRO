(function () {
  const BASE_DATA_PATH = "data/mates/base.json";
  const MAX_GUESSES = 6;

  const pickerBtn = document.getElementById("aniordlePickerBtn");
  const pickerLabel = document.getElementById("aniordlePickerLabel");
  const pickerPanel = document.getElementById("aniordlePickerPanel");
  const searchInput = document.getElementById("aniordleSearchInput");
  const optionList = document.getElementById("aniordleOptionList");
  const board = document.getElementById("aniordleBoard");
  const statusEl = document.getElementById("aniordleStatus");
  const modeLabel = document.getElementById("aniordleModeLabel");
  const shareBtn = document.getElementById("aniordleShareBtn");
  const randomBtn = document.getElementById("aniordleRandomBtn");
  const STORAGE_PREFIX = "upro-aniordle-daily-";

  const state = {
    pool: [],
    target: null,
    guesses: [],
    finished: false,
    randomRound: false,
    dailyKey: ""
  };

  init();

  async function init() {
    wireEvents();

    try {
      const baseItems = await fetch(BASE_DATA_PATH)
        .then(response => {
          if (!response.ok) throw new Error(`Failed to load ${BASE_DATA_PATH}`);
          return response.json();
        });

      state.pool = buildPool(baseItems);
      state.pool.sort((a, b) => a.name.localeCompare(b.name));
      startDailyRound();
      renderOptions("");
      renderBoard();
    } catch (error) {
      console.error(error);
      statusEl.textContent = "UPROrdle failed to load finalized animates.";
      pickerBtn.disabled = true;
    }
  }

  function wireEvents() {
    pickerBtn.addEventListener("click", () => {
      const isOpen = !pickerPanel.hidden;
      pickerPanel.hidden = isOpen;
      pickerBtn.setAttribute("aria-expanded", String(!isOpen));
      if (!isOpen) {
        searchInput.value = "";
        renderOptions("");
        searchInput.focus();
      }
    });

    searchInput.addEventListener("input", event => {
      renderOptions(event.target.value || "");
    });

    document.addEventListener("click", event => {
      const combobox = document.getElementById("aniordleCombobox");
      if (combobox && !combobox.contains(event.target)) {
        closePicker();
      }
    });

    shareBtn.addEventListener("click", async () => {
      if (!state.finished) return;
      const text = buildShareText();
      try {
        await navigator.clipboard.writeText(text);
        statusEl.textContent = "Result copied to clipboard.";
      } catch (error) {
        console.error(error);
        statusEl.textContent = "Copy failed. You can still copy the result manually.";
      }
    });

    randomBtn.addEventListener("click", () => {
      startRandomRound();
      renderBoard();
      renderOptions(searchInput.value || "");
    });
  }

  function closePicker() {
    pickerPanel.hidden = true;
    pickerBtn.setAttribute("aria-expanded", "false");
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

    const types = normalizeStrings(item.types);
    const paraTypes = normalizeStrings(item.paraTypes);
    const biomes = getBiomes(item);
    const versions = getVersions(item);
    const demoNumber = getDemoNumber(versions);
    const displayMode = item.event ? item.event : "base";

    return {
      id: index,
      name: String(item.name || "Unknown"),
      mode: "base",
      displayMode,
      types,
      paraTypes,
      biomes,
      versions,
      demoNumber,
      image: imagePath
    };
  }

  function normalizeStrings(value) {
    if (!Array.isArray(value)) {
      if (typeof value === "string" && value.trim()) return [value.trim()];
      return [];
    }
    return value.map(entry => String(entry || "").trim()).filter(Boolean);
  }

  function getBiomes(item) {
    const direct = normalizeStrings(item.biomes).concat(normalizeStrings(item.biome));
    if (direct.length) return unique(direct);
    if (typeof item.Biome === "string" && item.Biome.trim()) return [item.Biome.trim()];
    return [];
  }

  function getVersions(item) {
    if (Array.isArray(item.versions)) return item.versions.map(entry => String(entry || "").trim()).filter(Boolean);
    if (typeof item.versions === "string" && item.versions.trim()) return [item.versions.trim()];
    if (item.event === "halloween") return ["Halloween"];
    if (item.event === "winter") return ["Winter"];
    if (item.event === "fools") return ["April Fools"];
    return [];
  }

  function getDemoNumber(versions) {
    for (const version of versions) {
      const match = String(version || "").match(/demo\s*(\d+)/i);
      if (match) return Number(match[1]);
    }
    return null;
  }

  function unique(list) {
    return [...new Set(list)];
  }

  function startDailyRound() {
    state.randomRound = false;
    state.guesses = [];
    state.finished = false;
    state.dailyKey = getDailyStorageKey();
    state.target = state.pool[getDailyIndex()];
    modeLabel.textContent = "For That Daily UPRO Thought";
    statusEl.textContent = `You have ${MAX_GUESSES} guesses to find today's animate.`;
    shareBtn.disabled = true;
    randomBtn.hidden = true;
    pickerBtn.disabled = false;
    pickerLabel.textContent = "Choose a finalized animate";
    restoreDailyProgress();
  }

  function startRandomRound() {
    state.randomRound = true;
    state.guesses = [];
    state.finished = false;
    state.dailyKey = "";
    state.target = state.pool[Math.floor(Math.random() * state.pool.length)];
    modeLabel.textContent = "Random finalized animate";
    statusEl.textContent = `Random round started. You have ${MAX_GUESSES} guesses.`;
    shareBtn.disabled = true;
    randomBtn.hidden = true;
    pickerBtn.disabled = false;
    pickerLabel.textContent = "Choose a finalized animate";
  }

  function getDailyIndex() {
    const dateKey = getDailyDateKey();

    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
      hash = ((hash * 31) + dateKey.charCodeAt(i)) >>> 0;
    }
    return hash % state.pool.length;
  }

  function getDailyDateKey() {
    const now = new Date();
    return [
      now.getUTCFullYear(),
      String(now.getUTCMonth() + 1).padStart(2, "0"),
      String(now.getUTCDate()).padStart(2, "0")
    ].join("-");
  }

  function getDailyStorageKey() {
    return `${STORAGE_PREFIX}${getDailyDateKey()}`;
  }

  function restoreDailyProgress() {
    const saved = loadDailyProgress();
    if (!saved || saved.targetName !== state.target.name) return;

    const restoredGuesses = [];
    for (const guessName of saved.guesses || []) {
      const animate = state.pool.find(entry => entry.name === guessName);
      if (!animate) continue;
      restoredGuesses.push({
        animate,
        result: evaluateGuess(animate, state.target)
      });
    }

    state.guesses = restoredGuesses.slice(0, MAX_GUESSES);
    const lastGuess = state.guesses[state.guesses.length - 1];
    if (lastGuess) {
      pickerLabel.textContent = lastGuess.animate.name;
    }

    const solved = state.guesses.some(guess => guess.result.every(cell => cell.state === "green"));
    const failed = !solved && state.guesses.length >= MAX_GUESSES;
    state.finished = solved || failed;

    if (solved) {
      statusEl.textContent = `Solved in ${state.guesses.length}/${MAX_GUESSES}.`;
      shareBtn.disabled = false;
      randomBtn.hidden = false;
      pickerBtn.disabled = true;
    } else if (failed) {
      statusEl.textContent = `Out of guesses. The answer was ${state.target.name}.`;
      shareBtn.disabled = false;
      randomBtn.hidden = false;
      pickerBtn.disabled = true;
    } else if (state.guesses.length) {
      statusEl.textContent = `${MAX_GUESSES - state.guesses.length} guesses remaining.`;
    }
  }

  function saveDailyProgress() {
    if (state.randomRound || !state.dailyKey || !state.target) return;
    const payload = {
      targetName: state.target.name,
      guesses: state.guesses.map(entry => entry.animate.name),
      finished: state.finished
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

  function renderOptions(term) {
    optionList.innerHTML = "";

    const needle = String(term || "").trim().toLowerCase();
    const visible = state.pool.filter(animate => animate.name.toLowerCase().includes(needle));

    visible.forEach(animate => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "aniordle-option";
      button.innerHTML = `
        <img src="${escapeAttribute(animate.image)}" alt="" class="aniordle-option-image">
        <span class="aniordle-option-name">${escapeHtml(animate.name)}</span>
      `;
      button.addEventListener("click", () => submitGuess(animate));
      optionList.appendChild(button);
    });

    if (!visible.length) {
      const empty = document.createElement("div");
      empty.className = "aniordle-empty";
      empty.textContent = "No finalized animates match that search.";
      optionList.appendChild(empty);
    }
  }

  function submitGuess(animate) {
    if (state.finished) return;
    if (state.guesses.some(guess => guess.animate.name === animate.name)) {
      statusEl.textContent = "You already guessed that animate.";
      closePicker();
      return;
    }

    const result = evaluateGuess(animate, state.target);
    state.guesses.push({ animate, result });
    pickerLabel.textContent = animate.name;
    closePicker();

    if (result.every(cell => cell.state === "green")) {
      state.finished = true;
      statusEl.textContent = `Solved in ${state.guesses.length}/${MAX_GUESSES}.`;
    } else if (state.guesses.length >= MAX_GUESSES) {
      state.finished = true;
      statusEl.textContent = `Out of guesses. The answer was ${state.target.name}.`;
    } else {
      statusEl.textContent = `${MAX_GUESSES - state.guesses.length} guesses remaining.`;
    }

    if (state.finished) {
      shareBtn.disabled = false;
      randomBtn.hidden = false;
      pickerBtn.disabled = true;
    }

    saveDailyProgress();
    renderBoard();
  }

  function evaluateGuess(guess, target) {
    const guessType1 = guess.types[0] || "";
    const guessType2 = guess.types[1] || "";
    const targetType1 = target.types[0] || "";
    const targetType2 = target.types[1] || "";
    const biomeOverlap = intersects(guess.biomes, target.biomes);
    const guessDemoLabel = guess.demoNumber === null ? "None" : `Demo ${guess.demoNumber}`;

    return [
      {
        label: `${guess.id}${guess.id === target.id ? "" : guess.id < target.id ? " ↑" : " ↓"}`,
        state: guess.id === target.id ? "green" : "red"
      },
      {
        label: guessType1 || "None",
        state: !guessType1 && !targetType1 ? "green" : guessType1 === targetType1 ? "green" : guessType1 && guess.types.includes(targetType1) ? "yellow" : "red"
      },
      {
        label: guessType2 || "None",
        state: !guessType2 && !targetType2 ? "green" : guessType2 === targetType2 ? "green" : guessType2 && target.types.includes(guessType2) ? "yellow" : "red"
      },
      {
        label: formatList(guess.biomes),
        state: sameList(guess.biomes, target.biomes) ? "green" : biomeOverlap ? "yellow" : "red"
      },
      {
        label: guessDemoLabel + (guess.demoNumber === null || target.demoNumber === null || guess.demoNumber === target.demoNumber ? "" : guess.demoNumber < target.demoNumber ? " ↑" : " ↓"),
        state: guess.demoNumber === target.demoNumber
          ? "green"
          : "red"
      }
    ];
  }

  function renderBoard() {
    board.innerHTML = "";

    state.guesses.forEach((guessEntry, guessIndex) => {
      const row = document.createElement("div");
      row.className = "aniordle-row";

      const name = document.createElement("div");
      name.className = "aniordle-guess-name";
      name.innerHTML = `<img src="${escapeAttribute(guessEntry.animate.image)}" alt="" class="aniordle-guess-image"><span>${escapeHtml(guessEntry.animate.name)}</span>`;
      row.appendChild(name);

      const cells = document.createElement("div");
      cells.className = "aniordle-cells";

      guessEntry.result.forEach((cellResult, cellIndex) => {
        const cell = document.createElement("div");
        cell.className = `aniordle-cell aniordle-cell-${cellResult.state}`;
        cell.textContent = cellResult.label;
        cell.style.animationDelay = `${(guessIndex * 5 + cellIndex) * 90}ms`;
        cells.appendChild(cell);
      });

      row.appendChild(cells);
      board.appendChild(row);
    });
  }

  function buildShareText() {
    const modeLabelText = state.randomRound ? "UPROrdle Random" : "UPROrdle";
    const score = state.guesses.some(guess => guess.result.every(cell => cell.state === "green"))
      ? `${state.guesses.length}/${MAX_GUESSES}`
      : `X/${MAX_GUESSES}`;
    const dateText = state.randomRound ? "" : ` ${formatShareDate()}`;

    const lines = [`${modeLabelText} ${score}${dateText}`];
    state.guesses.forEach(guess => {
      const line = guess.result.map(cell => {
        if (cell.state === "green") return "🟩";
        if (cell.state === "yellow") return "🟨";
        return "⬛";
      }).join("");
      lines.push(line);
    });
    return lines.join("\n");
  }

  function sameList(left, right) {
    if (left.length !== right.length) return false;
    return left.every((value, index) => value === right[index]);
  }

  function intersects(left, right) {
    return left.some(value => right.includes(value));
  }

  function formatList(list) {
    return list.length ? list.join(" / ") : "None";
  }

  function formatShareDate() {
    const now = new Date();
    return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
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
