let abilitiesData = [];
let movesData = [];
let allMons = []; // merged mon list

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

const gridView = document.getElementById("gridView");
const listView = document.getElementById("listView");

const tabButtons = Array.from(document.querySelectorAll(".dex-tab"));

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

// small HTML escape
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str).replace(/[&<>"']/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));
}

// load abilities, moves, and all mon files
Promise.all([
  fetch("data/abilities.json").then(r => r.json()).catch(() => []),
  fetch("data/moves.json").then(r => r.json()).catch(() => []),
  fetch("data/base.json").then(r => r.json()).catch(() => []),
  fetch("data/sacred.json").then(r => r.json()).catch(() => []),
  fetch("data/ace.json").then(r => r.json()).catch(() => []),
  fetch("data/event.json").then(r => r.json()).catch(() => []),
  fetch("data/ncanon.json").then(r => r.json()).catch(() => [])
]).then(([abilities, moves, base, sacred, ace, event, ncanon]) => {
  abilitiesData = Array.isArray(abilities) ? abilities : [];
  movesData = Array.isArray(moves) ? moves : [];

  // merge mons into allMons
  const merged = [];
  [base, sacred, ace, event, ncanon].forEach(arr => {
    if (Array.isArray(arr)) merged.push(...arr);
  });
  allMons = merged;

  // gather types from moves + abilities + mons (so the type filter dropdown is useful)
  collectAllTypes();

  // populate type checkboxes
  populateTypeOptions();

  // initial render
  renderCurrentTab();
}).catch(err => {
  console.error("Failed to load JSONs:", err);
  // if fetch fails, keep abilities/moves empty and continue with UI (no user list)
  allTypes = defaultTypes.slice();
  populateTypeOptions();
  renderCurrentTab();
});

/* ----------------- Helpers for types/filter UI ----------------- */

function collectAllTypes() {
  const set = new Set();

  movesData.forEach(m => { if (m && typeof m.type === "string" && m.type.trim()) set.add(m.type.trim()); });
  abilitiesData.forEach(a => { if (Array.isArray(a.types)) a.types.forEach(t => { if (t && t.trim()) set.add(t.trim()); }); });

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

/* ----------------- Events (unchanged) ----------------- */

clearTypes.addEventListener("click", () => {
  typeOptionsEl.querySelectorAll("input").forEach(i => (i.checked = false));
  renderCurrentTab();
});
typeOptionsEl.addEventListener("change", renderCurrentTab);
searchInput.addEventListener("input", renderCurrentTab);
moveTypeSelect.addEventListener("change", renderCurrentTab);

gridView.addEventListener("click", () => {
  gridView.classList.add("active");
  listView.classList.remove("active");
  pokedex.className = "grid";
});
listView.addEventListener("click", () => {
  listView.classList.add("active");
  gridView.classList.remove("active");
  pokedex.className = "list";
});

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
  return `<span style="background:#0ff; padding:3px 6px; border-radius:6px; color:#000; margin:2px; display:inline-block;">${escapeHtml(t)}</span>`;
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
    if (!matchesSearch(a, term)) return false;
    if (types.length > 0) {
      if (!Array.isArray(a.types)) return false;
      if (!a.types.some(t => types.includes(t))) return false;
    }
    return true;
  });

  if (!filteredList.length) {
    pokedex.innerHTML = `<div style="padding:20px; color:#0ff;">No abilities found.</div>`;
    return;
  }

  filteredList.forEach((a, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3 style="font-size:2.4rem; margin:6px 0;">${escapeHtml(a.name)}</h3>
      <div class="types">${(a.types || []).map(typeTag).join("")}</div>
      <p style="font-size:1.8rem; padding:6px 8px;">${escapeHtml(a.text || a.description || "")}</p>
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
    pokedex.innerHTML = `<div style="padding:20px; color:#0ff;">No moves found.</div>`;
    return;
  }

  filteredList.forEach((m, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3 style="font-size:2.4rem; margin:6px 0;">${escapeHtml(m.name)}</h3>
      <div class="types">${m.type ? typeTag(m.type) : ''}</div>
      <p style="font-size:1.6rem; padding:6px 8px;">${escapeHtml(m.description || "")}</p>
      <div style="display:flex; gap:10px; justify-content:center; font-size:1.6rem; margin-top:8px;">
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
      <div style="margin-top:8px; font-size:1.6rem;">
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
    itemTypes.innerHTML = (item.types || []).map(typeTag).join("");
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
  header.style.marginBottom = "8px";
  header.style.fontSize = "1.4rem";
  header.style.color = "#cfe";
  header.textContent = monArray.length ? "Usable by:" : "No mons found that use this.";
  monUsersContainer.appendChild(header);

  if (!monArray.length) return;

  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(140px, 1fr))";
  grid.style.gap = "10px";
  grid.style.alignItems = "start";

  monArray.forEach(mon => {
    const card = document.createElement("div");
    card.style.background = "#1b1b1f";
    card.style.border = "1px solid #0ff";
    card.style.borderRadius = "10px";
    card.style.padding = "8px";
    card.style.textAlign = "center";
    card.style.color = "#e0f0ff";
    card.style.pointerEvents = "none"; // ensure non-clickable

    // image (use mon.image exactly)
    const img = document.createElement("img");
    img.src = mon.image || "";
    img.alt = mon.name || "";
    img.style.width = "100%";
    img.style.height = "120px";
    img.style.objectFit = "contain";
    img.style.display = "block";
    img.style.margin = "0 auto 8px auto";
    card.appendChild(img);

    // name
    const nm = document.createElement("div");
    nm.style.fontSize = "1.1rem";
    nm.style.fontWeight = "600";
    nm.textContent = mon.name || "";
    card.appendChild(nm);

    // types (small)
    if (Array.isArray(mon.types) && mon.types.length) {
      const typesWrap = document.createElement("div");
      typesWrap.style.marginTop = "6px";
      typesWrap.innerHTML = (mon.types || []).map(t => `<span style="background:#0ff; color:#000; padding:3px 6px; border-radius:6px; margin:2px; display:inline-block; font-weight:bold;">${escapeHtml(t)}</span>`).join("");
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
