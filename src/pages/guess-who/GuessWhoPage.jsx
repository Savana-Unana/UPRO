import { useEffect } from 'react'

const pageStyles = ""
const pageScript = "(function () {\r\n  const ACCESS_KEY = \"upro_guesswho_unlocked\";\r\n  const PLAYER_NAME_KEY = \"upro_guesswho_player_name\";\r\n  const NOTES_KEY = \"upro_guesswho_notes\";\r\n  const BOARD_SIZE = 50;\r\n  const DEFAULT_NAME = \"Placeholder\";\r\n  const GUESSES_TOTAL = 3;\r\n  const KEY_ALPHABET = \"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_\";\r\n  const DATA_FILES = [\r\n    { mode: \"base\", path: \"data/mates/base.json\" },\r\n    { mode: \"sacred\", path: \"data/mates/sacred.json\" },\r\n    { mode: \"ace\", path: \"data/mates/ace.json\" },\r\n    { mode: \"goner\", path: \"data/mates/goner.json\" },\r\n    { mode: \"ncanon\", path: \"data/mates/ncanon.json\" },\r\n    { mode: \"costumes\", path: \"data/mates/costumes.json\" },\r\n    { mode: \"npc\", path: \"data/mates/npc.json\" }\r\n  ];\r\n\r\n  if (sessionStorage.getItem(ACCESS_KEY) !== \"true\") {\r\n    window.location.replace(\"/\");\r\n    return;\r\n  }\r\n\r\n  const state = {\r\n    pool: [],\r\n    poolByName: new Map(),\r\n    poolIndexByName: new Map(),\r\n    board: [],\r\n    boardKey: \"\",\r\n    secret: null,\r\n    playerName: localStorage.getItem(PLAYER_NAME_KEY) || DEFAULT_NAME,\r\n    remainingGuesses: GUESSES_TOTAL\r\n  };\r\n\r\n  const screens = {\r\n    name: document.getElementById(\"nameScreen\"),\r\n    menu: document.getElementById(\"menuScreen\"),\r\n    instructions: document.getElementById(\"instructionsScreen\"),\r\n    game: document.getElementById(\"gameScreen\"),\r\n    notes: document.getElementById(\"notesScreen\")\r\n  };\r\n\r\n  const playerNameInput = document.getElementById(\"playerNameInput\");\r\n  const chosenNameLabel = document.getElementById(\"chosenNameLabel\");\r\n  const povTitle = document.getElementById(\"povTitle\");\r\n  const secretNameLabel = document.getElementById(\"secretNameLabel\");\r\n  const secretPortrait = document.getElementById(\"secretPortrait\");\r\n  const cardsLeftLabel = document.getElementById(\"cardsLeftLabel\");\r\n  const boardEl = document.getElementById(\"guesswhoBoard\");\r\n  const hoverTag = document.getElementById(\"guesswhoHoverTag\");\r\n  const heartsEl = document.getElementById(\"guessHearts\");\r\n  const notesArea = document.getElementById(\"notesArea\");\r\n  const notesStatus = document.getElementById(\"notesStatus\");\r\n  const secretCharacterButton = document.getElementById(\"secretCharacterButton\");\r\n  const joinPanel = document.getElementById(\"joinPanel\");\r\n  const joinGameKeyInput = document.getElementById(\"joinGameKeyInput\");\r\n  const joinStatus = document.getElementById(\"joinStatus\");\r\n  const gameKeyOutput = document.getElementById(\"gameKeyOutput\");\r\n\r\n  init();\r\n\r\n  async function init() {\r\n    wireEvents();\r\n    notesArea.value = localStorage.getItem(NOTES_KEY) || \"\";\r\n    syncPlayerName();\r\n    renderHearts();\r\n\r\n    try {\r\n      const datasets = await Promise.all(\r\n        DATA_FILES.map(file =>\r\n          fetch(file.path)\r\n            .then(response => {\r\n              if (!response.ok) throw new Error(`Failed to load ${file.path}`);\r\n              return response.json();\r\n            })\r\n            .then(items => ({ mode: file.mode, items }))\r\n        )\r\n      );\r\n\r\n      state.pool = buildFinalizedPool(datasets);\r\n      state.poolByName = new Map(state.pool.map(mon => [mon.name.toLowerCase(), mon]));\r\n      state.poolIndexByName = new Map(state.pool.map((mon, index) => [mon.name.toLowerCase(), index]));\r\n    } catch (error) {\r\n      console.error(error);\r\n      notesStatus.textContent = \"Loading finalized mons failed.\";\r\n    }\r\n  }\r\n\r\n  function wireEvents() {\r\n    document.getElementById(\"continueFromNameBtn\").addEventListener(\"click\", continueFromName);\r\n    document.getElementById(\"startGameBtn\").addEventListener(\"click\", startGame);\r\n    document.getElementById(\"joinGameBtn\").addEventListener(\"click\", () => {\r\n      joinPanel.hidden = !joinPanel.hidden;\r\n      if (!joinPanel.hidden) joinGameKeyInput.focus();\r\n    });\r\n    document.getElementById(\"loadKeyBtn\").addEventListener(\"click\", () => loadBoardFromKey(joinGameKeyInput.value));\r\n    document.getElementById(\"editNameBtn\").addEventListener(\"click\", () => showScreen(\"name\"));\r\n    document.getElementById(\"instructionsBtn\").addEventListener(\"click\", () => showScreen(\"instructions\"));\r\n    document.getElementById(\"quitBtn\").addEventListener(\"click\", () => window.location.href = \"/\");\r\n    document.getElementById(\"instructionsBackBtn\").addEventListener(\"click\", () => showScreen(\"menu\"));\r\n    document.getElementById(\"quitToMenuBtn\").addEventListener(\"click\", () => showScreen(\"menu\"));\r\n    document.getElementById(\"notesBtn\").addEventListener(\"click\", () => showScreen(\"notes\"));\r\n    document.getElementById(\"notesBackBtn\").addEventListener(\"click\", () => showScreen(\"game\"));\r\n    document.getElementById(\"notesRandomBtn\").addEventListener(\"click\", () => {\r\n      buildRandomBoard();\r\n      notesStatus.textContent = \"Randomized finalized board loaded.\";\r\n    });\r\n    document.getElementById(\"notesNewSecretBtn\").addEventListener(\"click\", rerollSecret);\r\n    document.getElementById(\"copyGameKeyBtn\").addEventListener(\"click\", copyGameKey);\r\n    secretCharacterButton.addEventListener(\"click\", rerollSecret);\r\n\r\n    playerNameInput.addEventListener(\"keydown\", event => {\r\n      if (event.key === \"Enter\") {\r\n        event.preventDefault();\r\n        continueFromName();\r\n      }\r\n    });\r\n\r\n    joinGameKeyInput.addEventListener(\"keydown\", event => {\r\n      if (event.key === \"Enter\") {\r\n        event.preventDefault();\r\n        loadBoardFromKey(joinGameKeyInput.value);\r\n      }\r\n    });\r\n\r\n    notesArea.addEventListener(\"input\", () => {\r\n      localStorage.setItem(NOTES_KEY, notesArea.value);\r\n    });\r\n\r\n    document.addEventListener(\"keydown\", event => {\r\n      if (screens.game.hidden) return;\r\n\r\n      if (event.key.toLowerCase() === \"r\") {\r\n        resetBoard();\r\n      }\r\n\r\n      if (event.key === \"Tab\") {\r\n        event.preventDefault();\r\n        toggleAllCards();\r\n      }\r\n    });\r\n  }\r\n\r\n  function showScreen(name) {\r\n    Object.entries(screens).forEach(([key, screen]) => {\r\n      screen.hidden = key !== name;\r\n    });\r\n\r\n    if (name === \"menu\") {\r\n      syncPlayerName();\r\n    }\r\n\r\n    if (name === \"game\") {\r\n      if (!state.board.length && state.pool.length) {\r\n        buildRandomBoard();\r\n      }\r\n      renderBoard();\r\n      renderSecret();\r\n      renderHearts();\r\n      updateBoardCounter();\r\n    }\r\n  }\r\n\r\n  function continueFromName() {\r\n    const nextName = String(playerNameInput.value || \"\").trim() || DEFAULT_NAME;\r\n    state.playerName = nextName;\r\n    localStorage.setItem(PLAYER_NAME_KEY, nextName);\r\n    syncPlayerName();\r\n    showScreen(\"menu\");\r\n  }\r\n\r\n  function syncPlayerName() {\r\n    chosenNameLabel.textContent = state.playerName;\r\n    povTitle.textContent = `${state.playerName}'s POV`;\r\n    playerNameInput.value = \"\";\r\n    playerNameInput.placeholder = state.playerName || DEFAULT_NAME;\r\n  }\r\n\r\n  function buildFinalizedPool(datasets) {\r\n    const seen = new Set();\r\n    const pool = [];\r\n\r\n    datasets.forEach(({ mode, items }) => {\r\n      (items || []).forEach((entry, index) => {\r\n        const normalizedName = String(entry?.name || \"\").trim();\r\n        const image = String(entry?.image || \"\").toLowerCase();\r\n        if (!normalizedName || seen.has(normalizedName.toLowerCase())) return;\r\n\r\n        if (mode !== \"npc\" && (\r\n          normalizedName === \"MissingNo\" ||\r\n          normalizedName === \"L.MissingNo\" ||\r\n          normalizedName === \"Ones\" ||\r\n          image.includes(\"missingno\")\r\n        )) {\r\n          return;\r\n        }\r\n\r\n        const valid = mode === \"npc\"\r\n          ? /(^|\\/)assets\\/images\\/mates\\/npc\\//i.test(image) && !image.includes(\"youknowwhoiam\")\r\n          : /(^|\\/)assets\\/images\\/mates\\/base\\//i.test(image);\r\n\r\n        if (!valid) return;\r\n\r\n        seen.add(normalizedName.toLowerCase());\r\n        pool.push({\r\n          mode,\r\n          order: index,\r\n          name: normalizedName,\r\n          image: String(entry.image || \"\")\r\n        });\r\n      });\r\n    });\r\n\r\n    return pool.sort((a, b) => {\r\n      if (a.mode === \"npc\" && b.mode !== \"npc\") return 1;\r\n      if (a.mode !== \"npc\" && b.mode === \"npc\") return -1;\r\n      if (a.mode === \"npc\" && b.mode === \"npc\") return a.order - b.order;\r\n      return a.name.localeCompare(b.name);\r\n    });\r\n  }\r\n\r\n  function startGame() {\r\n    if (!state.pool.length) {\r\n      notesStatus.textContent = \"The finalized pool has not loaded yet.\";\r\n      return;\r\n    }\r\n\r\n    buildRandomBoard();\r\n    showScreen(\"game\");\r\n  }\r\n\r\n  function buildRandomBoard() {\r\n    const shuffled = [...state.pool];\r\n    for (let index = shuffled.length - 1; index > 0; index -= 1) {\r\n      const swapIndex = Math.floor(Math.random() * (index + 1));\r\n      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];\r\n    }\r\n\r\n    state.board = shuffled.slice(0, BOARD_SIZE).map(mon => ({\r\n      ...mon,\r\n      hidden: false,\r\n      questioned: false\r\n    }));\r\n    state.boardKey = buildBoardKey(state.board);\r\n    state.remainingGuesses = GUESSES_TOTAL;\r\n    rerollSecret();\r\n    renderBoard();\r\n    renderHearts();\r\n    updateBoardCounter();\r\n    updateGameKeyOutput();\r\n  }\r\n\r\n  function rerollSecret() {\r\n    if (!state.board.length) {\r\n      state.secret = null;\r\n      renderSecret();\r\n      return;\r\n    }\r\n\r\n    state.secret = state.board[Math.floor(Math.random() * state.board.length)];\r\n    renderSecret();\r\n  }\r\n\r\n  function renderSecret() {\r\n    if (!state.secret) {\r\n      secretNameLabel.textContent = \"None\";\r\n      secretPortrait.innerHTML = `<div class=\"guesswho-secret-placeholder\">?</div>`;\r\n      return;\r\n    }\r\n\r\n    secretNameLabel.textContent = state.secret.name;\r\n    secretPortrait.innerHTML = `<img src=\"${escapeAttribute(state.secret.image)}\" alt=\"${escapeAttribute(state.secret.name)}\" class=\"guesswho-secret-image\">`;\r\n  }\r\n\r\n  function renderBoard() {\r\n    boardEl.innerHTML = \"\";\r\n\r\n    state.board.forEach((card, index) => {\r\n      const button = document.createElement(\"button\");\r\n      button.type = \"button\";\r\n      button.className = `guesswho-board-card${card.hidden ? \" is-hidden\" : \"\"}${card.questioned ? \" is-questioned\" : \"\"}`;\r\n      button.setAttribute(\"aria-label\", `${card.name}${card.hidden ? \", hidden\" : \", visible\"}`);\r\n      button.innerHTML = `\r\n        <span class=\"guesswho-board-frame\">\r\n          <img src=\"${escapeAttribute(card.image)}\" alt=\"${escapeAttribute(card.name)}\" class=\"guesswho-board-image\">\r\n          <span class=\"guesswho-board-silhouette\"></span>\r\n          <span class=\"guesswho-board-highlight\">?</span>\r\n        </span>\r\n      `;\r\n\r\n      button.addEventListener(\"click\", () => toggleCard(index));\r\n      button.addEventListener(\"contextmenu\", event => {\r\n        event.preventDefault();\r\n        toggleQuestioned(index);\r\n      });\r\n      button.addEventListener(\"mouseenter\", event => showHoverTag(card.name, event.currentTarget));\r\n      button.addEventListener(\"mouseleave\", hideHoverTag);\r\n      button.addEventListener(\"mousemove\", event => moveHoverTag(event.currentTarget));\r\n      button.addEventListener(\"keydown\", event => {\r\n        if (event.key === \"Enter\" || event.key === \" \") {\r\n          event.preventDefault();\r\n          toggleCard(index);\r\n        }\r\n      });\r\n\r\n      boardEl.appendChild(button);\r\n    });\r\n  }\r\n\r\n  function toggleCard(index) {\r\n    const card = state.board[index];\r\n    if (!card) return;\r\n    card.hidden = !card.hidden;\r\n    renderBoard();\r\n    updateBoardCounter();\r\n  }\r\n\r\n  function toggleQuestioned(index) {\r\n    const card = state.board[index];\r\n    if (!card) return;\r\n    card.questioned = !card.questioned;\r\n    renderBoard();\r\n  }\r\n\r\n  function toggleAllCards() {\r\n    const shouldHide = state.board.some(card => !card.hidden);\r\n    state.board.forEach(card => {\r\n      card.hidden = shouldHide;\r\n    });\r\n    renderBoard();\r\n    updateBoardCounter();\r\n  }\r\n\r\n  function resetBoard() {\r\n    state.board.forEach(card => {\r\n      card.hidden = false;\r\n      card.questioned = false;\r\n    });\r\n    renderBoard();\r\n    updateBoardCounter();\r\n  }\r\n\r\n  function updateBoardCounter() {\r\n    const visible = state.board.filter(card => !card.hidden).length;\r\n    cardsLeftLabel.textContent = `${visible}/${BOARD_SIZE}`;\r\n  }\r\n\r\n  function renderHearts() {\r\n    heartsEl.innerHTML = \"\";\r\n    for (let index = 0; index < GUESSES_TOTAL; index += 1) {\r\n      const button = document.createElement(\"button\");\r\n      button.type = \"button\";\r\n      button.className = `guesswho-heart${index < state.remainingGuesses ? \" is-full\" : \"\"}`;\r\n      button.innerHTML = `<img src=\"assets/images/ui/Lucid.png\" alt=\"\" class=\"guesswho-heart-image\">`;\r\n      button.addEventListener(\"click\", () => {\r\n        state.remainingGuesses = index + 1 === state.remainingGuesses ? index : index + 1;\r\n        renderHearts();\r\n      });\r\n      heartsEl.appendChild(button);\r\n    }\r\n  }\r\n\r\n  function buildBoardKey(board) {\r\n    return `G${board\r\n      .map(card => {\r\n        const index = state.poolIndexByName.get(card.name.toLowerCase());\r\n        return KEY_ALPHABET[index] || \"\";\r\n      })\r\n      .join(\"\")}`;\r\n  }\r\n\r\n  function parseBoardKey(key) {\r\n    const raw = String(key || \"\").trim();\r\n    const compact = raw.startsWith(\"G\") ? raw.slice(1) : raw;\r\n    if (compact.length !== BOARD_SIZE) {\r\n      throw new Error(\"Bad length\");\r\n    }\r\n\r\n    return compact.split(\"\").map(char => {\r\n      const index = KEY_ALPHABET.indexOf(char);\r\n      if (index < 0 || index >= state.pool.length) {\r\n        throw new Error(\"Bad char\");\r\n      }\r\n      return state.pool[index].name;\r\n    });\r\n  }\r\n\r\n  function loadBoardFromKey(key) {\r\n    let names;\r\n    try {\r\n      names = parseBoardKey(key);\r\n    } catch (error) {\r\n      joinStatus.textContent = \"That key could not be read.\";\r\n      return;\r\n    }\r\n\r\n    if (names.length !== BOARD_SIZE) {\r\n      joinStatus.textContent = \"That key does not contain 50 mons.\";\r\n      return;\r\n    }\r\n\r\n    const seen = new Set();\r\n    const board = [];\r\n    for (const name of names) {\r\n      const normalized = name.toLowerCase();\r\n      if (seen.has(normalized)) {\r\n        joinStatus.textContent = \"That key has duplicate mons.\";\r\n        return;\r\n      }\r\n      seen.add(normalized);\r\n\r\n      const mon = state.poolByName.get(normalized);\r\n      if (!mon) {\r\n        joinStatus.textContent = `Unknown or non-finalized mon in key: ${name}.`;\r\n        return;\r\n      }\r\n\r\n      board.push({\r\n        ...mon,\r\n        hidden: false,\r\n        questioned: false\r\n      });\r\n    }\r\n\r\n    state.board = board;\r\n    state.boardKey = buildBoardKey(board);\r\n    state.remainingGuesses = GUESSES_TOTAL;\r\n    rerollSecret();\r\n    renderBoard();\r\n    renderHearts();\r\n    updateBoardCounter();\r\n    updateGameKeyOutput();\r\n    joinStatus.textContent = \"Board loaded from key.\";\r\n    showScreen(\"game\");\r\n  }\r\n\r\n  function updateGameKeyOutput() {\r\n    gameKeyOutput.value = state.boardKey || \"\";\r\n  }\r\n\r\n  async function copyGameKey() {\r\n    if (!state.boardKey) return;\r\n    try {\r\n      await navigator.clipboard.writeText(state.boardKey);\r\n      notesStatus.textContent = \"Game key copied.\";\r\n    } catch (error) {\r\n      notesStatus.textContent = \"Could not copy the game key.\";\r\n    }\r\n  }\r\n\r\n  function escapeHtml(value) {\r\n    return String(value)\r\n      .replace(/&/g, \"&amp;\")\r\n      .replace(/</g, \"&lt;\")\r\n      .replace(/>/g, \"&gt;\")\r\n      .replace(/\"/g, \"&quot;\")\r\n      .replace(/'/g, \"&#39;\");\r\n  }\r\n\r\n  function escapeAttribute(value) {\r\n    return escapeHtml(value);\r\n  }\r\n\r\n  function showHoverTag(name, target) {\r\n    if (!hoverTag || !target) return;\r\n    hoverTag.textContent = name;\r\n    hoverTag.hidden = false;\r\n    moveHoverTag(target);\r\n  }\r\n\r\n  function moveHoverTag(target) {\r\n    if (!hoverTag || hoverTag.hidden || !target) return;\r\n    const cardRect = target.getBoundingClientRect();\r\n    const panelRect = boardEl.parentElement.getBoundingClientRect();\r\n    const left = cardRect.left - panelRect.left + (cardRect.width / 2);\r\n    const top = cardRect.top - panelRect.top - 10;\r\n\r\n    hoverTag.style.left = `${left}px`;\r\n    hoverTag.style.top = `${top}px`;\r\n  }\r\n\r\n  function hideHoverTag() {\r\n    if (!hoverTag) return;\r\n    hoverTag.hidden = true;\r\n  }\r\n})();\r\n"
const remoteScripts = []

const legacyBoardKeyScript = `  function buildBoardKey(board) {
    return \`G\${board
      .map(card => {
        const index = state.poolIndexByName.get(card.name.toLowerCase());
        return KEY_ALPHABET[index] || "";
      })
      .join("")}\`;
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

`

const updatedBoardKeyScript = `  function buildBoardKey(board) {
    return \`G2\${board
      .map(card => encodePoolIndex(state.poolIndexByName.get(card.name.toLowerCase())))
      .join("")}\`;
  }

  function encodePoolIndex(index) {
    const base = KEY_ALPHABET.length;
    if (!Number.isInteger(index) || index < 0 || index >= base * base) {
      throw new Error("Bad index");
    }

    return \`\${KEY_ALPHABET[Math.floor(index / base)]}\${KEY_ALPHABET[index % base]}\`;
  }

  function parseBoardKey(key) {
    const raw = String(key || "").trim();
    const compact = raw.startsWith("G") ? raw.slice(1) : raw;

    if (compact.startsWith("2") && compact.length === (BOARD_SIZE * 2) + 1) {
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

`

const guessWhoPageScript = pageScript.replace(
  legacyBoardKeyScript.replace(/\n/g, "\r\n"),
  updatedBoardKeyScript.replace(/\n/g, "\r\n")
)

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

      if (cancelled || !pageScript) return

      window.onload = null
      new Function(`${guessWhoPageScript}\n//# sourceURL=GuessWhoPage.legacy.js`)()
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
