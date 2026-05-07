import { useEffect } from 'react'

const pageStyles = ""
const pageScript = "let abilitiesData = [];\r\nlet movesData = [];\r\nlet allMons = []; // merged mon list\r\nlet statusEffectsData = [];\r\n\r\nlet allTypes = [];\r\n\r\n// keep original state variables\r\nlet activeTab = \"abilities\";\r\nlet filteredList = [];\r\nlet currentIndex = 0;\r\n\r\n// DOM refs (matching your HTML)\r\nconst pokedex = document.getElementById(\"pokedex\");\r\nconst searchInput = document.getElementById(\"search\");\r\n\r\nconst typeToggle = document.getElementById(\"typeToggle\");\r\nconst typePanel = document.getElementById(\"typePanel\");\r\nconst typeOptionsEl = document.getElementById(\"typeOptions\");\r\nconst clearTypes = document.getElementById(\"clearTypes\");\r\n\r\nconst moveTypeWrapper = document.getElementById(\"moveTypeWrapper\");\r\nconst moveTypeSelect = document.getElementById(\"moveTypeSelect\");\r\n\r\nconst tabButtons = Array.from(document.querySelectorAll(\".dex-tab\"));\r\nconst statusEffectsIcon = document.getElementById(\"statusEffectsIcon\");\r\nconst statusEffectsPopover = document.getElementById(\"statusEffectsPopover\");\r\nconst statusEffectsList = document.getElementById(\"statusEffectsList\");\r\nconst statusEffectsCount = document.getElementById(\"statusEffectsCount\");\r\n\r\n// modal refs\r\nconst modal = document.getElementById(\"detailsModal\");\r\nconst closeModal = document.getElementById(\"closeModal\");\r\nconst nextItem = document.getElementById(\"nextItem\");\r\nconst prevItem = document.getElementById(\"prevItem\");\r\nconst itemName = document.getElementById(\"itemName\");\r\nconst itemTypes = document.getElementById(\"itemTypes\");\r\nconst itemText = document.getElementById(\"itemText\");\r\nconst extraStats = document.getElementById(\"extraStats\");\r\nconst monUsersContainer = document.getElementById(\"monUsers\");\r\n\r\n// fallback default types (ensures Lucid is present)\r\nconst defaultTypes = [\r\n  \"Normal\",\"Fire\",\"Water\",\"Plant\",\"Electric\",\"Ice\",\"Savage\",\"Gross\",\r\n  \"Earth\",\"Air\",\"Mystic\",\"Light\",\"Dark\",\"Spectral\",\"Metal\",\"Artillery\",\r\n  \"Lucid\"\r\n];\r\n\r\nconst typeColors = {\r\n  Normal: \"#d8dde8\",\r\n  Plant: \"#6BBF59\",\r\n  Water: \"#3BA5FF\",\r\n  Ice: \"#C9F0FF\",\r\n  Fire: \"#FF7A4D\",\r\n  Earth: \"#C99C6B\",\r\n  Mystic: \"#BFA6FF\",\r\n  Air: \"#9ED8FF\",\r\n  Savage: \"#D6C79B\",\r\n  Metal: \"#B0B8C1\",\r\n  Electric: \"#F6C94C\",\r\n  Artillery: \"#D88F8F\",\r\n  Light: \"#FFF3B0\",\r\n  Dark: \"#3B3B3F\",\r\n  Gross: \"#A8A77A\",\r\n  Spectral: \"#8F7AE6\",\r\n  Lucid: \"#9FE5D1\"\r\n};\r\n\r\n// fallback status effects list (kept at 18 entries)\r\nconst fallbackStatusEffects = [\r\n  { name: \"Defenseless\", typing: \"Normal\", desc: \"This Animates takes 150% dmg from attacks.\" },\r\n  { name: \"Burn\", typing: \"Fire\", desc: \"Takes 1+(number of turns with effect)% of max HP as damage each turn.\" },\r\n  { name: \"Wet\", typing: \"Water\", desc: \"125% damage from Electric attacks, and only deals 80% fire damage. Accuracy is reduced to maximum of 95%.\" },\r\n  { name: \"Frozen\", typing: \"Ice\", desc: \"Can't move. Any fire attacks disable the status.\" },\r\n  { name: \"Filthy\", typing: \"Gross\", desc: \"All healing items, moves, and abilities are halved in effect.\" },\r\n  { name: \"Blinded\", typing: \"Light\", desc: \"Accuracy is reduced to maximum of 90%. Any damage from Dark-type moves ends the status.\" },\r\n  { name: \"Obscured\", typing: \"Dark\", desc: \"Accuracy is reduced to maximum of 90%. Any damage from Light-type moves ends the status.\" },\r\n  { name: \"Placeholder\", typing: \"Placeholder\", desc: \"Placeholder\" }\r\n];\r\n\r\n// small HTML escape\r\nfunction escapeHtml(str) {\r\n  if (!str && str !== 0) return \"\";\r\n  return String(str).replace(/[&<>\"']/g, s => ({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",\"\\\"\":\"&quot;\",\"'\":\"&#39;\"}[s]));\r\n}\r\n\r\n// load abilities, moves, and all mon files\r\nPromise.all([\r\n  fetch(\"data/abilities.json\").then(r => r.json()).catch(() => []),\r\n  fetch(\"data/moves.json\").then(r => r.json()).catch(() => []),\r\n  fetch(\"data/mates/base.json\").then(r => r.json()).catch(() => []),\r\n  fetch(\"data/mates/sacred.json\").then(r => r.json()).catch(() => []),\r\n  fetch(\"data/mates/ace.json\").then(r => r.json()).catch(() => []),\r\n  fetch(\"data/mates/costumes.json\").then(r => r.json()).catch(() => []),\r\n  fetch(\"data/mates/ncanon.json\").then(r => r.json()).catch(() => []),\r\n  fetch(\"data/unused/status.json\").then(r => r.json()).catch(() => [])\r\n]).then(([abilities, moves, base, sacred, ace, event, ncanon, statuses]) => {\r\n  abilitiesData = Array.isArray(abilities) ? abilities : [];\r\n  movesData = Array.isArray(moves) ? moves : [];\r\n\r\n  // merge mons into allMons\r\n  const merged = [];\r\n  [base, sacred, ace, event, ncanon].forEach(arr => {\r\n    if (Array.isArray(arr)) merged.push(...arr);\r\n  });\r\n  allMons = merged;\r\n  statusEffectsData = buildStatusEffects(statuses);\r\n\r\n  // gather types from moves + abilities + mons (so the type filter dropdown is useful)\r\n  collectAllTypes();\r\n\r\n  // populate type checkboxes\r\n  populateTypeOptions();\r\n\r\n  // initial render\r\n  renderCurrentTab();\r\n  renderStatusEffects();\r\n}).catch(err => {\r\n  console.error(\"Failed to load JSONs:\", err);\r\n  // if fetch fails, keep abilities/moves empty and continue with UI (no user list)\r\n  allTypes = defaultTypes.slice();\r\n  statusEffectsData = fallbackStatusEffects.slice();\r\n  populateTypeOptions();\r\n  renderCurrentTab();\r\n  renderStatusEffects();\r\n});\r\n\r\n/* ----------------- Helpers for types/filter UI ----------------- */\r\n\r\nfunction collectAllTypes() {\r\n  const set = new Set();\r\n\r\n  movesData.forEach(m => { if (m && typeof m.type === \"string\" && m.type.trim()) set.add(m.type.trim()); });\r\n  abilitiesData.forEach(a => {\r\n    if (Array.isArray(a.types)) a.types.forEach(t => { if (t && t.trim()) set.add(t.trim()); });\r\n    if (a && typeof a.type === \"string\" && a.type.trim()) set.add(a.type.trim());\r\n  });\r\n\r\n  // also include types used in mons\r\n  allMons.forEach(mon => {\r\n    if (Array.isArray(mon.types)) mon.types.forEach(t => { if (t && t.trim()) set.add(t.trim()); });\r\n  });\r\n\r\n  // ensure defaults (Lucid etc) present\r\n  defaultTypes.forEach(dt => set.add(dt));\r\n\r\n  if (set.size === 0) allTypes = defaultTypes.slice();\r\n  else allTypes = Array.from(set).sort((a,b) => a.localeCompare(b));\r\n}\r\n\r\nfunction populateTypeOptions() {\r\n  typeOptionsEl.innerHTML = \"\";\r\n  allTypes.forEach(t => {\r\n    const label = document.createElement(\"label\");\r\n    label.className = \"opt\";\r\n    label.innerHTML = `<input type=\"checkbox\" value=\"${escapeHtml(t)}\"> <span>${escapeHtml(t)}</span>`;\r\n    typeOptionsEl.appendChild(label);\r\n  });\r\n}\r\n\r\n/* ----------------- Toggle behavior (unchanged) ----------------- */\r\n\r\nfunction setupToggle(toggle, panel) {\r\n  if (!toggle || !panel) return;\r\n  toggle.addEventListener(\"click\", e => {\r\n    e.stopPropagation();\r\n    const open = panel.classList.toggle(\"open\");\r\n    panel.setAttribute(\"aria-hidden\", !open);\r\n  });\r\n  document.addEventListener(\"click\", ev => {\r\n    if (!panel.contains(ev.target) && ev.target !== toggle) {\r\n      panel.classList.remove(\"open\");\r\n      panel.setAttribute(\"aria-hidden\", \"true\");\r\n    }\r\n  });\r\n  document.addEventListener(\"keydown\", ev => {\r\n    if (ev.key === \"Escape\") {\r\n      panel.classList.remove(\"open\");\r\n      panel.setAttribute(\"aria-hidden\", \"true\");\r\n    }\r\n  });\r\n}\r\nsetupToggle(typeToggle, typePanel);\r\n\r\nif (statusEffectsIcon && statusEffectsPopover) {\r\n  statusEffectsIcon.addEventListener(\"click\", ev => {\r\n    ev.stopPropagation();\r\n    toggleStatusPopover();\r\n  });\r\n\r\n  document.addEventListener(\"click\", ev => {\r\n    if (!statusEffectsPopover.contains(ev.target) && ev.target !== statusEffectsIcon) {\r\n      closeStatusPopover();\r\n    }\r\n  });\r\n\r\n  document.addEventListener(\"keydown\", ev => {\r\n    if (ev.key === \"Escape\") closeStatusPopover();\r\n  });\r\n}\r\n\r\n/* ----------------- Events (unchanged) ----------------- */\r\n\r\nclearTypes.addEventListener(\"click\", () => {\r\n  typeOptionsEl.querySelectorAll(\"input\").forEach(i => (i.checked = false));\r\n  renderCurrentTab();\r\n});\r\ntypeOptionsEl.addEventListener(\"change\", renderCurrentTab);\r\nsearchInput.addEventListener(\"input\", renderCurrentTab);\r\nmoveTypeSelect.addEventListener(\"change\", renderCurrentTab);\r\n\r\n// tab switching\r\ntabButtons.forEach(btn => {\r\n  btn.addEventListener(\"click\", () => {\r\n    tabButtons.forEach(t => t.classList.remove(\"active\"));\r\n    btn.classList.add(\"active\");\r\n    activeTab = btn.dataset.tab;\r\n    renderCurrentTab();\r\n  });\r\n});\r\n\r\n/* ----------------- Filtering helpers ----------------- */\r\n\r\nfunction getCheckedTypes() {\r\n  return Array.from(typeOptionsEl.querySelectorAll(\"input:checked\")).map(i => i.value);\r\n}\r\n\r\nfunction matchesSearch(entity, term) {\r\n  if (!term) return true;\r\n  term = term.toLowerCase();\r\n  if ((entity.name || \"\").toLowerCase().includes(term)) return true;\r\n  if ((entity.text || \"\").toLowerCase().includes(term)) return true;\r\n  if ((entity.description || \"\").toLowerCase().includes(term)) return true;\r\n  if ((entity.type || \"\").toLowerCase().includes(term)) return true;\r\n  if (Array.isArray(entity.types) && entity.types.some(t => (t||\"\").toLowerCase().includes(term))) return true;\r\n  return false;\r\n}\r\n\r\nfunction typeTag(t) {\r\n  return `<span class=\"hurty-type-tag\">${escapeHtml(t)}</span>`;\r\n}\r\n\r\nfunction getTypeColor(typeName) {\r\n  if (!typeName || typeof typeName !== \"string\") return \"#8fa7ce\";\r\n  return typeColors[typeName.trim()] || \"#8fa7ce\";\r\n}\r\n\r\nfunction buildStatusEffects(rawStatuses) {\r\n  const raw = Array.isArray(rawStatuses) ? rawStatuses : [];\r\n  return fallbackStatusEffects.map((fallback, index) => {\r\n    const exact = raw.find(s => (s?.typing || \"\").trim().toLowerCase() === fallback.typing.toLowerCase());\r\n    if (!exact) return { ...fallback, order: index + 1 };\r\n\r\n    return {\r\n      name: (exact.name || \"\").trim() || fallback.name,\r\n      typing: (exact.typing || \"\").trim() || fallback.typing,\r\n      desc: (exact.desc || \"\").trim() || fallback.desc,\r\n      order: index + 1\r\n    };\r\n  });\r\n}\r\n\r\nfunction renderStatusEffects() {\r\n  if (!statusEffectsList) return;\r\n\r\n  const effects = statusEffectsData.length ? statusEffectsData : fallbackStatusEffects;\r\n  statusEffectsList.innerHTML = effects.map(effect => {\r\n    return `\r\n      <li>\r\n        <span class=\"hurty-type-tag\">${escapeHtml(effect.typing)}</span>\r\n        <strong>${escapeHtml(effect.name)}</strong>\r\n        <p>${escapeHtml(effect.desc)}</p>\r\n      </li>\r\n    `;\r\n  }).join(\"\");\r\n\r\n  if (statusEffectsCount) statusEffectsCount.textContent = `${effects.length} total`;\r\n}\r\n\r\nfunction closeStatusPopover() {\r\n  if (!statusEffectsPopover || !statusEffectsIcon) return;\r\n  statusEffectsPopover.classList.add(\"hidden\");\r\n  statusEffectsPopover.setAttribute(\"aria-hidden\", \"true\");\r\n  statusEffectsIcon.setAttribute(\"aria-expanded\", \"false\");\r\n}\r\n\r\nfunction toggleStatusPopover() {\r\n  if (!statusEffectsPopover || !statusEffectsIcon) return;\r\n\r\n  const isOpen = !statusEffectsPopover.classList.contains(\"hidden\");\r\n  statusEffectsPopover.classList.toggle(\"hidden\", isOpen);\r\n  statusEffectsPopover.setAttribute(\"aria-hidden\", isOpen ? \"true\" : \"false\");\r\n  statusEffectsIcon.setAttribute(\"aria-expanded\", isOpen ? \"false\" : \"true\");\r\n}\r\n\r\n/* ----------------- Renderers (mostly unchanged) ----------------- */\r\n\r\nfunction renderCurrentTab() {\r\n  if (activeTab === \"moves\") moveTypeWrapper.style.display = \"inline-block\";\r\n  else moveTypeWrapper.style.display = \"none\";\r\n\r\n  if (activeTab === \"abilities\") renderAbilities();\r\n  else renderMoves();\r\n}\r\n\r\nfunction renderAbilities() {\r\n  pokedex.innerHTML = \"\";\r\n  const types = getCheckedTypes();\r\n  const term = (searchInput.value || \"\").trim();\r\n\r\n  filteredList = abilitiesData.filter(a => {\r\n    const abilityTypes = Array.isArray(a.types)\r\n      ? a.types.filter(Boolean)\r\n      : (a.type ? [a.type] : []);\r\n    if (!matchesSearch(a, term)) return false;\r\n    if (types.length > 0) {\r\n      if (!abilityTypes.length) return false;\r\n      if (!abilityTypes.some(t => types.includes(t))) return false;\r\n    }\r\n    return true;\r\n  });\r\n\r\n  if (!filteredList.length) {\r\n    pokedex.innerHTML = `<div class=\"hurty-empty\">No abilities found.</div>`;\r\n    return;\r\n  }\r\n\r\n  filteredList.forEach((a, i) => {\r\n    const card = document.createElement(\"div\");\r\n    card.className = \"card\";\r\n    const abilityTypes = Array.isArray(a.types)\r\n      ? a.types.filter(Boolean)\r\n      : (a.type ? [a.type] : []);\r\n    const primaryType = abilityTypes.length ? abilityTypes[0] : \"\";\r\n    card.style.borderColor = getTypeColor(primaryType);\r\n    card.innerHTML = `\r\n      <h3 class=\"hurty-card-title\">${escapeHtml(a.name)}</h3>\r\n      <div class=\"types\">${abilityTypes.map(typeTag).join(\"\")}</div>\r\n      <p class=\"hurty-card-copy\">${escapeHtml(a.text || a.description || \"\")}</p>\r\n    `;\r\n    card.addEventListener(\"click\", () => openModal(i));\r\n    pokedex.appendChild(card);\r\n  });\r\n}\r\n\r\nfunction renderMoves() {\r\n  pokedex.innerHTML = \"\";\r\n  const types = getCheckedTypes();\r\n  const term = (searchInput.value || \"\").trim();\r\n  const category = (moveTypeSelect.value || \"\").trim();\r\n\r\n  filteredList = movesData.filter(m => {\r\n    if (!matchesSearch(m, term)) return false;\r\n    if (types.length > 0) {\r\n      if (!m.type) return false;\r\n      if (!types.includes(m.type)) return false;\r\n    }\r\n    if (category) {\r\n      if (!m.category) return false;\r\n      if (m.category.toLowerCase() !== category.toLowerCase()) return false;\r\n    }\r\n    return true;\r\n  });\r\n\r\n  if (!filteredList.length) {\r\n    pokedex.innerHTML = `<div class=\"hurty-empty\">No moves found.</div>`;\r\n    return;\r\n  }\r\n\r\n  filteredList.forEach((m, i) => {\r\n    const card = document.createElement(\"div\");\r\n    card.className = \"card\";\r\n    card.style.borderColor = getTypeColor(m.type);\r\n    card.innerHTML = `\r\n      <h3 class=\"hurty-card-title\">${escapeHtml(m.name)}</h3>\r\n      <div class=\"types\">${m.type ? typeTag(m.type) : ''}</div>\r\n      <p class=\"hurty-card-copy\">${escapeHtml(m.description || \"\")}</p>\r\n      <div class=\"hurty-card-quickstats\">\r\n        <div>Power: ${escapeHtml(m.power ?? \"\")}</div>\r\n        <div>Acc: ${escapeHtml(m.accuracy ?? \"\")}</div>\r\n        <div>EP: ${escapeHtml(m.ep ?? \"\")}</div>\r\n      </div>\r\n    `;\r\n    card.addEventListener(\"click\", () => openModal(i));\r\n    pokedex.appendChild(card);\r\n  });\r\n}\r\n\r\n/* ----------------- New: lookup helpers for mons ----------------- */\r\n\r\n// returns array of mon objects (not clickable) that have `abilityName` in their abilities[]\r\nfunction getUsersOfAbility(abilityName) {\r\n  if (!abilityName) return [];\r\n  return allMons.filter(mon => {\r\n    if (!mon) return false;\r\n    if (Array.isArray(mon.abilities) && mon.abilities.includes(abilityName)) return true;\r\n    // legacy single 'ability' support\r\n    if (mon.ability && mon.ability === abilityName) return true;\r\n    return false;\r\n  });\r\n}\r\n\r\n// returns array of mon objects that have `moveName` in their moves[]\r\nfunction getUsersOfMove(moveName) {\r\n  if (!moveName) return [];\r\n  return allMons.filter(mon => {\r\n    if (!mon) return false;\r\n    if (Array.isArray(mon.moves) && mon.moves.includes(moveName)) return true;\r\n    return false;\r\n  });\r\n}\r\n\r\n/* ----------------- Modal: open & render + mon users grid ----------------- */\r\n\r\nfunction openModal(i) {\r\n  currentIndex = i;\r\n  const item = filteredList[i];\r\n  if (!item) return;\r\n\r\n  itemName.textContent = item.name || \"\";\r\n\r\n  // clear previous monUsers content\r\n  if (monUsersContainer) monUsersContainer.innerHTML = \"\";\r\n\r\n  if (activeTab === \"moves\") {\r\n    itemTypes.innerHTML = item.type ? typeTag(item.type) : \"\";\r\n    itemText.textContent = item.description || \"\";\r\n    extraStats.innerHTML = `\r\n      <div class=\"hurty-move-stats\">\r\n        <b>Category:</b> ${escapeHtml(item.category || \"\")}<br>\r\n        <b>Power:</b> ${escapeHtml(item.power ?? \"\")} &nbsp;\r\n        <b>Accuracy:</b> ${escapeHtml(item.accuracy ?? \"\")} &nbsp;\r\n        <b>EP:</b> ${escapeHtml(item.ep ?? \"\")}\r\n      </div>\r\n    `;\r\n\r\n    // find and render mons that learn this move\r\n    const users = getUsersOfMove(item.name);\r\n    renderMonUsersGrid(users);\r\n  } else {\r\n    // ability\r\n    const abilityTypes = Array.isArray(item.types)\r\n      ? item.types.filter(Boolean)\r\n      : (item.type ? [item.type] : []);\r\n    itemTypes.innerHTML = abilityTypes.map(typeTag).join(\"\");\r\n    itemText.textContent = item.text || item.description || \"\";\r\n    extraStats.innerHTML = \"\";\r\n\r\n    // find and render mons that have this ability\r\n    const users = getUsersOfAbility(item.name);\r\n    renderMonUsersGrid(users);\r\n  }\r\n\r\n  modal.classList.remove(\"hidden\");\r\n}\r\n\r\n// Renders a visual grid of mon cards under #monUsers (non-clickable)\r\nfunction renderMonUsersGrid(monArray) {\r\n  if (!monUsersContainer) return;\r\n  monUsersContainer.innerHTML = \"\"; // clear\r\n\r\n  const header = document.createElement(\"div\");\r\n  header.className = \"mon-users-title\";\r\n  header.textContent = monArray.length ? \"Usable by:\" : \"No mons found that use this.\";\r\n  monUsersContainer.appendChild(header);\r\n\r\n  if (!monArray.length) return;\r\n\r\n  const grid = document.createElement(\"div\");\r\n  grid.className = \"mon-users-grid\";\r\n\r\n  monArray.forEach(mon => {\r\n    const card = document.createElement(\"div\");\r\n    card.className = \"mon-user-card\";\r\n\r\n    // image (use mon.image exactly)\r\n    const img = document.createElement(\"img\");\r\n    img.src = mon.image || \"\";\r\n    img.alt = mon.name || \"\";\r\n    img.className = \"mon-user-image\";\r\n    card.appendChild(img);\r\n\r\n    // name\r\n    const nm = document.createElement(\"div\");\r\n    nm.className = \"mon-user-name\";\r\n    nm.textContent = mon.name || \"\";\r\n    card.appendChild(nm);\r\n\r\n    // types (small)\r\n    if (Array.isArray(mon.types) && mon.types.length) {\r\n      const typesWrap = document.createElement(\"div\");\r\n      typesWrap.className = \"mon-user-types\";\r\n      typesWrap.innerHTML = (mon.types || []).map(typeTag).join(\"\");\r\n      card.appendChild(typesWrap);\r\n    }\r\n\r\n    grid.appendChild(card);\r\n  });\r\n\r\n  monUsersContainer.appendChild(grid);\r\n}\r\n\r\n/* ----------------- Navigation / modal helpers (unchanged) ----------------- */\r\n\r\ncloseModal.addEventListener(\"click\", () => modal.classList.add(\"hidden\"));\r\nnextItem.addEventListener(\"click\", () => {\r\n  if (!filteredList || filteredList.length === 0) return;\r\n  currentIndex = (currentIndex + 1) % filteredList.length;\r\n  openModal(currentIndex);\r\n});\r\nprevItem.addEventListener(\"click\", () => {\r\n  if (!filteredList || filteredList.length === 0) return;\r\n  currentIndex = (currentIndex - 1 + filteredList.length) % filteredList.length;\r\n  openModal(currentIndex);\r\n});\r\nmodal.addEventListener(\"click\", e => {\r\n  if (e.target === modal) modal.classList.add(\"hidden\");\r\n});\r\n"
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

export default function HurtyPage() {
  useEffect(() => {
    document.title = "Moves & Abilities"
    document.body.className = "hurty-page"
    document.body.setAttribute('style', "")

    let cancelled = false

    async function startPage() {
      for (const src of remoteScripts) {
        await loadRemoteScript(src)
      }

      if (cancelled || !pageScript) return

      window.onload = null
      new Function(`${pageScript}\n//# sourceURL=HurtyPage.legacy.js`)()
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
      <div className="upro-page-root"><div className="status-effects-wrap">
    <button id="statusEffectsIcon" className="status-effects-icon" type="button" title="Show status effects" aria-label="Show status effects" aria-expanded="false" aria-controls="statusEffectsPopover">i</button>
    <div id="statusEffectsPopover" className="status-effects-popover hidden" aria-hidden="true">
      <div className="status-effects-head">
        <h3>Status Effects</h3>
        <span id="statusEffectsCount" />
      </div>
      <ul id="statusEffectsList" />
    </div>
  </div>
  <header>
    <div style={{display: 'flex'}}>
      <div id="nav-btn">
        <a href="/"><button>Main Menu</button></a>
      </div>
    </div>
    <h1>Moves &amp; Abilities</h1>
    <div className="controls">
      <input type="text" id="search" placeholder="Search..." />
      {/* Type filter */}
      <div className="multi-filter" id="typeFilterWrapper">
        <button className="filter-toggle" id="typeToggle">Types ▾</button>
        <div className="filter-panel" id="typePanel" aria-hidden="true">
          <div className="panel-actions">
            <button id="clearTypes" className="clear-btn">Clear</button>
          </div>
          <div className="options" id="typeOptions" />
        </div>
      </div>
      {/* Move category filter */}
      <div id="moveTypeWrapper" style={{display: 'none'}}>
        <select id="moveTypeSelect">
          <option value>All Categories</option>
          <option value="Melee">Melee</option>
          <option value="Ranged">Ranged</option>
          <option value="Status">Status</option>
        </select>
      </div>
      {/* Tabs */}
      <div className="mode-switch">
        <button className="dex-tab active" data-tab="abilities">Abilities</button>
        <button className="dex-tab" data-tab="moves">Moves</button>
      </div>
    </div>
  </header>
  <main id="pokedex" className="grid" />
  {/* Modal */}
  <div id="detailsModal" className="modal hidden">
    <div className="modal-content">
      <button id="closeModal" className="close-btn">✕</button>
      <div className="modal-header">
        <h2 id="itemName" />
        <div id="itemTypes" />
      </div>
      <div className="modal-body">
        <p id="itemText" />
        <div id="extraStats" />
        {/* NEW: Visual list of mons that learn/use this item (non-clickable cards) */}
        <div id="monUsers" style={{marginTop: 12}}>
        </div>
      </div>
      <div className="modal-footer">
        <button id="prevItem" className="nav-btn">← Previous</button>
        <button id="nextItem" className="nav-btn">Next →</button>
      </div>
    </div>
  </div></div>
    </>
  )
}
