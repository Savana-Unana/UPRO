let abilitiesData = [];
let movesData = [];
let allMons = []; // merged mon list
let statusEffectsData = [];

let allTypes = [];

// keep original state variables
let activeTab = "abilities";
let filteredList = [];
let currentIndex = 0;

// DOM refs (matching your HTML)
const pokedex = document.getElementById("pokedex");
const searchInput = document.getElementById("search");

const typeToggle = document.getElementById("typeToggle");
const typePanel = document.getElementById("typePanel");
const typeOptionsEl = document.getElementById("typeOptions");
const clearTypes = document.getElementById("clearTypes");

const moveTypeWrapper = document.getElementById("moveTypeWrapper");
const moveTypeSelect = document.getElementById("moveTypeSelect");

const tabButtons = Array.from(document.querySelectorAll(".dex-tab"));
const statusEffectsIcon = document.getElementById("statusEffectsIcon");
const statusEffectsPopover = document.getElementById("statusEffectsPopover");
const statusEffectsList = document.getElementById("statusEffectsList");
const statusEffectsCount = document.getElementById("statusEffectsCount");

// modal refs
const modal = document.getElementById("detailsModal");
const closeModal = document.getElementById("closeModal");
const nextItem = document.getElementById("nextItem");
const prevItem = document.getElementById("prevItem");
const itemName = document.getElementById("itemName");
const itemTypes = document.getElementById("itemTypes");
const itemText = document.getElementById("itemText");
const extraStats = document.getElementById("extraStats");
const monUsersContainer = document.getElementById("monUsers");

// fallback default types (ensures Lucid is present)
const defaultTypes = [
  "Normal","Fire","Water","Plant","Electric","Ice","Savage","Gross",
  "Earth","Air","Mystic","Light","Dark","Spectral","Metal","Artillery",
  "Lucid"
];

const typeColors = {
  Normal: "#d8dde8",
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

// fallback status effects list (kept at 18 entries)
const fallbackStatusEffects = [
  { name: "Bored", typing: "Normal", desc: "10% chance each turn to do nothing." },
  { name: "Wet", typing: "Water", desc: "More vulnerable to electric effects while wet." },
  { name: "Burn", typing: "Fire", desc: "Takes 5% damage per turn and loses 15% MATK." },
  { name: "Poison", typing: "Plant", desc: "Takes gradual damage each turn." },
  { name: "Bloated", typing: "Air", desc: "Heals 2% each turn but loses 20% SP and 5% RATK." },
  { name: "Magnetized", typing: "Metal", desc: "Can be manipulated by magnetic effects." },
  { name: "Conductive", typing: "Electric", desc: "Opposing damaging attacks are 25% faster." },
  { name: "Confused", typing: "Mystic", desc: "10% chance each turn to hit itself." },
  { name: "Possessed", typing: "Spectral", desc: "30% chance once to attack itself with its own move." },
  { name: "Feral", typing: "Savage", desc: "Control is unstable and actions can become erratic." },
  { name: "Nauseous", typing: "Gross", desc: "10% chance to use the wrong move and loses 10% RATK." },
  { name: "Frozen", typing: "Ice", desc: "May be unable to act until thawed." },
  { name: "Rooted", typing: "Earth", desc: "Movement or swap options can be restricted." },
  { name: "Wounded", typing: "Artillery", desc: "Cannot swap out and takes +14% RATK damage." },
  { name: "Exposed", typing: "Light", desc: "Opposing attacks cannot miss." },
  { name: "Blind", typing: "Dark", desc: "Attacks are 40% more likely to miss." },
  { name: "Dreamlocked", typing: "Lucid", desc: "Mind state is altered by dream pressure." },
  { name: "Glitched", typing: "Switcheroo", desc: "Unstable switch state may force random interactions." }
];

// small HTML escape
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str).replace(/[&<>"']/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));
}

// load abilities, moves, and all mon files
Promise.all([
  fetch("data/abilities.json").then(r => r.json()).catch(() => []),
  fetch("data/moves.json").then(r => r.json()).catch(() => []),
  fetch("data/mates/base.json").then(r => r.json()).catch(() => []),
  fetch("data/mates/sacred.json").then(r => r.json()).catch(() => []),
  fetch("data/mates/ace.json").then(r => r.json()).catch(() => []),
  fetch("data/mates/costumes.json").then(r => r.json()).catch(() => []),
  fetch("data/mates/ncanon.json").then(r => r.json()).catch(() => []),
  fetch("data/unusused%20stuff/status.json").then(r => r.json()).catch(() => [])
]).then(([abilities, moves, base, sacred, ace, event, ncanon, statuses]) => {
  abilitiesData = Array.isArray(abilities) ? abilities : [];
  movesData = Array.isArray(moves) ? moves : [];

  // merge mons into allMons
  const merged = [];
  [base, sacred, ace, event, ncanon].forEach(arr => {
    if (Array.isArray(arr)) merged.push(...arr);
  });
  allMons = merged;
  statusEffectsData = buildStatusEffects(statuses);

  // gather types from moves + abilities + mons (so the type filter dropdown is useful)
  collectAllTypes();

  // populate type checkboxes
  populateTypeOptions();

  // initial render
  renderCurrentTab();
  renderStatusEffects();
}).catch(err => {
  console.error("Failed to load JSONs:", err);
  // if fetch fails, keep abilities/moves empty and continue with UI (no user list)
  allTypes = defaultTypes.slice();
  statusEffectsData = fallbackStatusEffects.slice();
  populateTypeOptions();
  renderCurrentTab();
  renderStatusEffects();
});

/* ----------------- Helpers for types/filter UI ----------------- */

function collectAllTypes() {
  const set = new Set();

  movesData.forEach(m => { if (m && typeof m.type === "string" && m.type.trim()) set.add(m.type.trim()); });
  abilitiesData.forEach(a => {
    if (Array.isArray(a.types)) a.types.forEach(t => { if (t && t.trim()) set.add(t.trim()); });
    if (a && typeof a.type === "string" && a.type.trim()) set.add(a.type.trim());
  });

  // also include types used in mons
  allMons.forEach(mon => {
    if (Array.isArray(mon.types)) mon.types.forEach(t => { if (t && t.trim()) set.add(t.trim()); });
  });

  // ensure defaults (Lucid etc) present
  defaultTypes.forEach(dt => set.add(dt));

  if (set.size === 0) allTypes = defaultTypes.slice();
  else allTypes = Array.from(set).sort((a,b) => a.localeCompare(b));
}

function populateTypeOptions() {
  typeOptionsEl.innerHTML = "";
  allTypes.forEach(t => {
    const label = document.createElement("label");
    label.className = "opt";
    label.innerHTML = `<input type="checkbox" value="${escapeHtml(t)}"> <span>${escapeHtml(t)}</span>`;
    typeOptionsEl.appendChild(label);
  });
}

/* ----------------- Toggle behavior (unchanged) ----------------- */

function setupToggle(toggle, panel) {
  if (!toggle || !panel) return;
  toggle.addEventListener("click", e => {
    e.stopPropagation();
    const open = panel.classList.toggle("open");
    panel.setAttribute("aria-hidden", !open);
  });
  document.addEventListener("click", ev => {
    if (!panel.contains(ev.target) && ev.target !== toggle) {
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden", "true");
    }
  });
  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape") {
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden", "true");
    }
  });
}
setupToggle(typeToggle, typePanel);

if (statusEffectsIcon && statusEffectsPopover) {
  statusEffectsIcon.addEventListener("click", ev => {
    ev.stopPropagation();
    toggleStatusPopover();
  });

  document.addEventListener("click", ev => {
    if (!statusEffectsPopover.contains(ev.target) && ev.target !== statusEffectsIcon) {
      closeStatusPopover();
    }
  });

  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape") closeStatusPopover();
  });
}

/* ----------------- Events (unchanged) ----------------- */

clearTypes.addEventListener("click", () => {
  typeOptionsEl.querySelectorAll("input").forEach(i => (i.checked = false));
  renderCurrentTab();
});
typeOptionsEl.addEventListener("change", renderCurrentTab);
searchInput.addEventListener("input", renderCurrentTab);
moveTypeSelect.addEventListener("change", renderCurrentTab);

// tab switching
tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab;
    renderCurrentTab();
  });
});

/* ----------------- Filtering helpers ----------------- */

function getCheckedTypes() {
  return Array.from(typeOptionsEl.querySelectorAll("input:checked")).map(i => i.value);
}

function matchesSearch(entity, term) {
  if (!term) return true;
  term = term.toLowerCase();
  if ((entity.name || "").toLowerCase().includes(term)) return true;
  if ((entity.text || "").toLowerCase().includes(term)) return true;
  if ((entity.description || "").toLowerCase().includes(term)) return true;
  if ((entity.type || "").toLowerCase().includes(term)) return true;
  if (Array.isArray(entity.types) && entity.types.some(t => (t||"").toLowerCase().includes(term))) return true;
  return false;
}

function typeTag(t) {
  return `<span class="hurty-type-tag">${escapeHtml(t)}</span>`;
}

function getTypeColor(typeName) {
  if (!typeName || typeof typeName !== "string") return "#8fa7ce";
  return typeColors[typeName.trim()] || "#8fa7ce";
}

function buildStatusEffects(rawStatuses) {
  const raw = Array.isArray(rawStatuses) ? rawStatuses : [];
  return fallbackStatusEffects.map((fallback, index) => {
    const exact = raw.find(s => (s?.typing || "").trim().toLowerCase() === fallback.typing.toLowerCase());
    if (!exact) return { ...fallback, order: index + 1 };

    return {
      name: (exact.name || "").trim() || fallback.name,
      typing: (exact.typing || "").trim() || fallback.typing,
      desc: (exact.desc || "").trim() || fallback.desc,
      order: index + 1
    };
  });
}

function renderStatusEffects() {
  if (!statusEffectsList) return;

  const effects = statusEffectsData.length ? statusEffectsData : fallbackStatusEffects;
  statusEffectsList.innerHTML = effects.map(effect => {
    return `
      <li>
        <span class="hurty-type-tag">${escapeHtml(effect.typing)}</span>
        <strong>${escapeHtml(effect.name)}</strong>
        <p>${escapeHtml(effect.desc)}</p>
      </li>
    `;
  }).join("");

  if (statusEffectsCount) statusEffectsCount.textContent = `${effects.length} total`;
}

function closeStatusPopover() {
  if (!statusEffectsPopover || !statusEffectsIcon) return;
  statusEffectsPopover.classList.add("hidden");
  statusEffectsPopover.setAttribute("aria-hidden", "true");
  statusEffectsIcon.setAttribute("aria-expanded", "false");
}

function toggleStatusPopover() {
  if (!statusEffectsPopover || !statusEffectsIcon) return;

  const isOpen = !statusEffectsPopover.classList.contains("hidden");
  statusEffectsPopover.classList.toggle("hidden", isOpen);
  statusEffectsPopover.setAttribute("aria-hidden", isOpen ? "true" : "false");
  statusEffectsIcon.setAttribute("aria-expanded", isOpen ? "false" : "true");
}

/* ----------------- Renderers (mostly unchanged) ----------------- */

function renderCurrentTab() {
  if (activeTab === "moves") moveTypeWrapper.style.display = "inline-block";
  else moveTypeWrapper.style.display = "none";

  if (activeTab === "abilities") renderAbilities();
  else renderMoves();
}

function renderAbilities() {
  pokedex.innerHTML = "";
  const types = getCheckedTypes();
  const term = (searchInput.value || "").trim();

  filteredList = abilitiesData.filter(a => {
    const abilityTypes = Array.isArray(a.types)
      ? a.types.filter(Boolean)
      : (a.type ? [a.type] : []);
    if (!matchesSearch(a, term)) return false;
    if (types.length > 0) {
      if (!abilityTypes.length) return false;
      if (!abilityTypes.some(t => types.includes(t))) return false;
    }
    return true;
  });

  if (!filteredList.length) {
    pokedex.innerHTML = `<div class="hurty-empty">No abilities found.</div>`;
    return;
  }

  filteredList.forEach((a, i) => {
    const card = document.createElement("div");
    card.className = "card";
    const abilityTypes = Array.isArray(a.types)
      ? a.types.filter(Boolean)
      : (a.type ? [a.type] : []);
    const primaryType = abilityTypes.length ? abilityTypes[0] : "";
    card.style.borderColor = getTypeColor(primaryType);
    card.innerHTML = `
      <h3 class="hurty-card-title">${escapeHtml(a.name)}</h3>
      <div class="types">${abilityTypes.map(typeTag).join("")}</div>
      <p class="hurty-card-copy">${escapeHtml(a.text || a.description || "")}</p>
    `;
    card.addEventListener("click", () => openModal(i));
    pokedex.appendChild(card);
  });
}

function renderMoves() {
  pokedex.innerHTML = "";
  const types = getCheckedTypes();
  const term = (searchInput.value || "").trim();
  const category = (moveTypeSelect.value || "").trim();

  filteredList = movesData.filter(m => {
    if (!matchesSearch(m, term)) return false;
    if (types.length > 0) {
      if (!m.type) return false;
      if (!types.includes(m.type)) return false;
    }
    if (category) {
      if (!m.category) return false;
      if (m.category.toLowerCase() !== category.toLowerCase()) return false;
    }
    return true;
  });

  if (!filteredList.length) {
    pokedex.innerHTML = `<div class="hurty-empty">No moves found.</div>`;
    return;
  }

  filteredList.forEach((m, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.borderColor = getTypeColor(m.type);
    card.innerHTML = `
      <h3 class="hurty-card-title">${escapeHtml(m.name)}</h3>
      <div class="types">${m.type ? typeTag(m.type) : ''}</div>
      <p class="hurty-card-copy">${escapeHtml(m.description || "")}</p>
      <div class="hurty-card-quickstats">
        <div>Power: ${escapeHtml(m.power ?? "")}</div>
        <div>Acc: ${escapeHtml(m.accuracy ?? "")}</div>
        <div>EP: ${escapeHtml(m.ep ?? "")}</div>
      </div>
    `;
    card.addEventListener("click", () => openModal(i));
    pokedex.appendChild(card);
  });
}

/* ----------------- New: lookup helpers for mons ----------------- */

// returns array of mon objects (not clickable) that have `abilityName` in their abilities[]
function getUsersOfAbility(abilityName) {
  if (!abilityName) return [];
  return allMons.filter(mon => {
    if (!mon) return false;
    if (Array.isArray(mon.abilities) && mon.abilities.includes(abilityName)) return true;
    // legacy single 'ability' support
    if (mon.ability && mon.ability === abilityName) return true;
    return false;
  });
}

// returns array of mon objects that have `moveName` in their moves[]
function getUsersOfMove(moveName) {
  if (!moveName) return [];
  return allMons.filter(mon => {
    if (!mon) return false;
    if (Array.isArray(mon.moves) && mon.moves.includes(moveName)) return true;
    return false;
  });
}

/* ----------------- Modal: open & render + mon users grid ----------------- */

function openModal(i) {
  currentIndex = i;
  const item = filteredList[i];
  if (!item) return;

  itemName.textContent = item.name || "";

  // clear previous monUsers content
  if (monUsersContainer) monUsersContainer.innerHTML = "";

  if (activeTab === "moves") {
    itemTypes.innerHTML = item.type ? typeTag(item.type) : "";
    itemText.textContent = item.description || "";
    extraStats.innerHTML = `
      <div class="hurty-move-stats">
        <b>Category:</b> ${escapeHtml(item.category || "")}<br>
        <b>Power:</b> ${escapeHtml(item.power ?? "")} &nbsp;
        <b>Accuracy:</b> ${escapeHtml(item.accuracy ?? "")} &nbsp;
        <b>EP:</b> ${escapeHtml(item.ep ?? "")}
      </div>
    `;

    // find and render mons that learn this move
    const users = getUsersOfMove(item.name);
    renderMonUsersGrid(users);
  } else {
    // ability
    const abilityTypes = Array.isArray(item.types)
      ? item.types.filter(Boolean)
      : (item.type ? [item.type] : []);
    itemTypes.innerHTML = abilityTypes.map(typeTag).join("");
    itemText.textContent = item.text || item.description || "";
    extraStats.innerHTML = "";

    // find and render mons that have this ability
    const users = getUsersOfAbility(item.name);
    renderMonUsersGrid(users);
  }

  modal.classList.remove("hidden");
}

// Renders a visual grid of mon cards under #monUsers (non-clickable)
function renderMonUsersGrid(monArray) {
  if (!monUsersContainer) return;
  monUsersContainer.innerHTML = ""; // clear

  const header = document.createElement("div");
  header.className = "mon-users-title";
  header.textContent = monArray.length ? "Usable by:" : "No mons found that use this.";
  monUsersContainer.appendChild(header);

  if (!monArray.length) return;

  const grid = document.createElement("div");
  grid.className = "mon-users-grid";

  monArray.forEach(mon => {
    const card = document.createElement("div");
    card.className = "mon-user-card";

    // image (use mon.image exactly)
    const img = document.createElement("img");
    img.src = mon.image || "";
    img.alt = mon.name || "";
    img.className = "mon-user-image";
    card.appendChild(img);

    // name
    const nm = document.createElement("div");
    nm.className = "mon-user-name";
    nm.textContent = mon.name || "";
    card.appendChild(nm);

    // types (small)
    if (Array.isArray(mon.types) && mon.types.length) {
      const typesWrap = document.createElement("div");
      typesWrap.className = "mon-user-types";
      typesWrap.innerHTML = (mon.types || []).map(typeTag).join("");
      card.appendChild(typesWrap);
    }

    grid.appendChild(card);
  });

  monUsersContainer.appendChild(grid);
}

/* ----------------- Navigation / modal helpers (unchanged) ----------------- */

closeModal.addEventListener("click", () => modal.classList.add("hidden"));
nextItem.addEventListener("click", () => {
  if (!filteredList || filteredList.length === 0) return;
  currentIndex = (currentIndex + 1) % filteredList.length;
  openModal(currentIndex);
});
prevItem.addEventListener("click", () => {
  if (!filteredList || filteredList.length === 0) return;
  currentIndex = (currentIndex - 1 + filteredList.length) % filteredList.length;
  openModal(currentIndex);
});
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});
