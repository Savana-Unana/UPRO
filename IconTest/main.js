// ====== DOM Refs ======
const boxOptions = document.getElementById("boxOptions");
const boxTabContainer = document.getElementById("boxTabs");
const iconOptions = document.getElementById("iconOptions");
const iconTabContainer = document.getElementById("iconTabs");
const speakerInput = document.getElementById("speakerInput");
const dialogueInput = document.getElementById("dialogueInput");
const cardsContainer = document.getElementById("cardsContainer");
const cardTemplate = document.getElementById("cardTemplate");
const nextBtn = document.getElementById("nextBtn");
const exportAllBtn = document.getElementById("exportAllBtn");
const resetBtn = document.getElementById("resetBtn");

// ====== App State ======
let BOXES = null, ICONS = null;
let cards = [];         // [{id, speaker, text, boxSrc, iconSrc, boxTab, iconTab}]
let activeId = null;

const LS_KEYS = {
  CARDS: "dialogue_cards_v2",
  ACTIVE: "dialogue_active_v2",
  BOX_TAB: "dialogue_box_tab",
  ICON_TAB: "dialogue_icon_tab"
};

// ====== Utilities ======
const uid = () => Math.random().toString(36).slice(2, 10);
const saveState = () => {
  localStorage.setItem(LS_KEYS.CARDS, JSON.stringify(cards));
  localStorage.setItem(LS_KEYS.ACTIVE, activeId || "");
};
function loadState() {
  try {
    const c = JSON.parse(localStorage.getItem(LS_KEYS.CARDS) || "[]");
    const a = localStorage.getItem(LS_KEYS.ACTIVE) || "";
    if (Array.isArray(c) && c.length) { cards = c; activeId = a || c[0].id; }
  } catch {}
}
const getActiveCard = () => cards.find(c => c.id === activeId);

function setActive(id) {
  activeId = id;
  [...cardsContainer.querySelectorAll(".dialogue-card")].forEach(el =>
    el.classList.toggle("active", el.dataset.id === activeId)
  );
  const c = getActiveCard(); if (!c) return;
  speakerInput.value = c.speaker || "";
  dialogueInput.value = c.text || "";
  saveState(); syncThumbnailsToActive();
}

function selectThumb(container, src) {
  if (!src) return;
  container.querySelectorAll(".thumb").forEach(t => {
    t.classList.toggle("selected", t.src === src || (t.src && src && src.endsWith(t.getAttribute("data-file") || "")));
  });
}
function syncThumbnailsToActive() {
  const c = getActiveCard(); if (!c) return;
  if (c.boxTab && boxTabContainer.querySelector(`[data-type="${c.boxTab}"]`)) {
    boxTabContainer.querySelector(`[data-type="${c.boxTab}"]`).click();
  }
  if (c.iconTab && iconTabContainer.querySelector(`[data-type="${c.iconTab}"]`)) {
    iconTabContainer.querySelector(`[data-type="${c.iconTab}"]`).click();
  }
  selectThumb(boxOptions, c.boxSrc);
  selectThumb(iconOptions, c.iconSrc);
}

// ====== Render ======
function renderAllCards() {
  cardsContainer.innerHTML = "";
  cards.forEach(renderCard);
  setActive(activeId);
}
function renderCard(card) {
  const node = cardTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.id = card.id;
  node.querySelector(".boxImage").src = card.boxSrc || "";
  node.querySelector(".iconImage").src = card.iconSrc || "";
  node.querySelector(".speaker").textContent = card.speaker || "";
  node.querySelector(".dialogue").textContent = card.text || "";
  node.addEventListener("click", () => setActive(card.id));
  node.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(card.id); }
  });
  cardsContainer.appendChild(node);
}
function patchActiveCardDOM() {
  const c = getActiveCard(); if (!c) return;
  const node = cardsContainer.querySelector(`.dialogue-card[data-id="${c.id}"]`);
  if (!node) return;
  node.querySelector(".boxImage").src = c.boxSrc || "";
  node.querySelector(".iconImage").src = c.iconSrc || "";
  node.querySelector(".speaker").textContent = c.speaker || "";
  node.querySelector(".dialogue").textContent = c.text || "";
}

// ====== Create ======
function createCardFromCurrent() {
  const base = getActiveCard() || {};
  const card = {
    id: uid(),
    speaker: speakerInput.value || base.speaker || "",
    text: dialogueInput.value || base.text || "",
    boxSrc: base.boxSrc || getFirstBoxSrc(),
    iconSrc: base.iconSrc || getFirstIconSrc(),
    boxTab: base.boxTab || getFirstBoxTabKey(),
    iconTab: base.iconTab || getFirstIconTabKey()
  };
  cards.push(card); saveState(); renderCard(card); setActive(card.id);
}

// Defaults
function getFirstBoxTabKey() {
  const a = boxTabContainer.querySelector(".tabBtn.active");
  return a ? a.dataset.type : (Object.keys(BOXES || { DialogueBox: [] })[0] || "DialogueBox");
}
function getFirstIconTabKey() {
  const a = iconTabContainer.querySelector(".tabBtn.active");
  return a ? a.dataset.type : (Object.keys(ICONS || {})[0] || "");
}
function getFirstBoxSrc() {
  const tab = getFirstBoxTabKey(); const list = (BOXES && BOXES[tab]) || [];
  return list.length ? `boxes/${list[0]}` : "";
}
function getFirstIconSrc() {
  const tab = getFirstIconTabKey(); const list = (ICONS && ICONS[tab]) || [];
  return list.length ? `icons/${list[0].file}` : "";
}

// Tabs: Boxes
function setupBoxTabs(boxes) {
  boxTabContainer.querySelectorAll(".tabBtn").forEach(tab => {
    tab.addEventListener("click", () => {
      boxTabContainer.querySelectorAll(".tabBtn").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      displayBoxCategory(tab.dataset.type, boxes[tab.dataset.type]);
      localStorage.setItem(LS_KEYS.BOX_TAB, tab.dataset.type);
      syncThumbnailsToActive();
    });
  });
  const saved = localStorage.getItem(LS_KEYS.BOX_TAB);
  (saved ? boxTabContainer.querySelector(`.tabBtn[data-type="${saved}"]`) : boxTabContainer.querySelector(".tabBtn"))?.click();
}
function displayBoxCategory(cat, files) {
  boxOptions.innerHTML = "";
  files.forEach(file => {
    const img = document.createElement("img");
    img.src = `boxes/${file}`; img.className = "thumb"; img.dataset.file = file;
    img.addEventListener("click", () => {
      boxOptions.querySelectorAll(".thumb").forEach(t => t.classList.remove("selected"));
      img.classList.add("selected");
      const c = getActiveCard(); if (!c) return;
      c.boxSrc = img.src; c.boxTab = cat; saveState(); patchActiveCardDOM();
    });
    boxOptions.appendChild(img);
  });
}

// Tabs: Icons
function setupIconTabs(icons) {
  iconTabContainer.innerHTML = ""; iconOptions.innerHTML = "";
  for (const cat in icons) {
    const btn = document.createElement("button");
    btn.textContent = cat; btn.className = "tabBtn"; btn.dataset.type = cat;
    btn.addEventListener("click", () => {
      iconTabContainer.querySelectorAll(".tabBtn").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      displayIconCategory(cat, icons[cat]);
      localStorage.setItem(LS_KEYS.ICON_TAB, cat);
      syncThumbnailsToActive();
    });
    iconTabContainer.appendChild(btn);
  }
  const saved = localStorage.getItem(LS_KEYS.ICON_TAB);
  (saved ? iconTabContainer.querySelector(`.tabBtn[data-type="${saved}"]`) : iconTabContainer.querySelector(".tabBtn"))?.click();
}
function displayIconCategory(cat, files) {
  iconOptions.innerHTML = "";
  files.forEach(obj => {
    const img = document.createElement("img");
    img.src = `icons/${obj.file}`; img.className = "thumb"; img.dataset.file = obj.file;
    img.addEventListener("click", () => {
      iconOptions.querySelectorAll(".thumb").forEach(t => t.classList.remove("selected"));
      img.classList.add("selected");
      const c = getActiveCard(); if (!c) return;
      c.iconSrc = img.src; c.iconTab = cat; saveState(); patchActiveCardDOM();
    });
    iconOptions.appendChild(img);
  });
}

// Inputs
speakerInput.addEventListener("input", () => { const c = getActiveCard(); if (!c) return; c.speaker = speakerInput.value; saveState(); patchActiveCardDOM(); });
dialogueInput.addEventListener("input", () => { const c = getActiveCard(); if (!c) return; c.text = dialogueInput.value; saveState(); patchActiveCardDOM(); });

// Buttons
nextBtn.addEventListener("click", createCardFromCurrent);
exportAllBtn.addEventListener("click", async () => {
  // Hide selection outline so it won't appear
  const actives = [...cardsContainer.querySelectorAll(".dialogue-card.active")];
  actives.forEach(el => el.classList.remove("active"));

  const canvas = await html2canvas(cardsContainer, { scale: 3, backgroundColor: null, useCORS: true });

  // Restore outlines
  setActive(activeId);

  const link = document.createElement("a");
  link.download = "dialogues.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
resetBtn.addEventListener("click", () => {
  Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k));
  cards = []; activeId = null; cardsContainer.innerHTML = "";
  const first = { id: uid(), speaker: "", text: "", boxSrc: getFirstBoxSrc(), iconSrc: getFirstIconSrc(), boxTab: getFirstBoxTabKey(), iconTab: getFirstIconTabKey() };
  cards.push(first); renderAllCards(); setActive(first.id);
});

// Boot
Promise.all([ fetch("boxes.json").then(r=>r.json()), fetch("icons.json").then(r=>r.json()) ])
.then(([boxes, icons]) => {
  BOXES = boxes; ICONS = icons;
  setupBoxTabs(BOXES); setupIconTabs(ICONS);
  loadState();
  if (cards.length === 0) {
    const first = { id: uid(), speaker: localStorage.getItem("dialogue_speaker") || "", text: localStorage.getItem("dialogue_text") || "", boxSrc: getFirstBoxSrc(), iconSrc: getFirstIconSrc(), boxTab: getFirstBoxTabKey(), iconTab: getFirstIconTabKey() };
    cards.push(first); activeId = first.id;
  }
  renderAllCards(); setActive(activeId); syncThumbnailsToActive();
});
