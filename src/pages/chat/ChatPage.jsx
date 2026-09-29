import { useEffect } from 'react'

/* eslint-disable no-empty, no-undef */
const pageStyles = ""
function runPageScript() {
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
  const spacingSlider = document.getElementById("spacingSlider");
  const spacingVal = document.getElementById("spacingVal");
  const scaleSlider = document.getElementById("scaleSlider");
  const scaleVal = document.getElementById("scaleVal");
  const choiceEditor = document.getElementById("choiceEditor");
  const choiceInputs = document.getElementById("choiceInputs");
  const addChoiceBtn = document.getElementById("addChoiceBtn");

  // ====== App State ======
  let BOXES = null, ICONS = null;
  let cards = [];         // [{id, speaker, text, boxSrc, iconSrc, iconFrame, iconCols, iconRows, boxTab, iconTab}]
  let activeId = null;

  const LS_KEYS = {
    CARDS: "dialogue_cards_v2",
    ACTIVE: "dialogue_active_v2",
    BOX_TAB: "dialogue_box_tab",
    ICON_TAB: "dialogue_icon_tab",
    SPACING: "dialogue_spacing_px_v1",
    SCALE: "dialogue_export_scale_v1"
  };

  // Defaults:
  const DEFAULTS = { spacing: -20, scale: 5 };

  // ====== Utilities ======
  const uid = () => Math.random().toString(36).slice(2, 10);
  function normalizeAssetSrc(src) {
    const value = String(src || "");
    if (!value) return "";

    const oldBoxMatch = value.match(/(?:^|\/)IconTest\/boxes\/([^/?#]+)/i) || value.match(/^boxes\/([^/?#]+)/i);
    if (oldBoxMatch) return `assets/images/dialogue/${oldBoxMatch[1]}`;

    const oldIconMatch = value.match(/(?:^|\/)IconTest\/icons\/([^/?#]+)/i) || value.match(/^icons\/([^/?#]+)/i);
    if (oldIconMatch) return `assets/images/dialogue/${oldIconMatch[1]}`;

    return value
      .replace("assets/images/dialogue/boxes/", "assets/images/dialogue/")
      .replace("assets/images/dialogue/icons/", "assets/images/dialogue/");
  }

  const saveState = () => {
    localStorage.setItem(LS_KEYS.CARDS, JSON.stringify(cards));
    localStorage.setItem(LS_KEYS.ACTIVE, activeId || "");
  };
  function boxSelection(entry, category) {
    return {
      boxSrc: `assets/images/dialogue/${entry.file}`,
      boxX: Number(entry.x) || 0,
      boxY: Number(entry.y) || 0,
      boxWidth: Number(entry.width) || 256,
      boxHeight: Number(entry.height) || 100,
      boxSheetWidth: Number(entry.sheetWidth) || 512,
      boxSheetHeight: Number(entry.sheetHeight) || 700,
      boxKind: entry.kind || "dialogue",
      isChoice: Boolean(entry.choice),
      boxTab: category
    };
  }
  function resolveBoxSelection(card) {
    const oldFile = normalizeAssetSrc(card.boxSrc).split("/").pop() || "";
    const legacy = oldFile.match(/^(DialogueBox|ChoiceBox|FacelessBox|FacelessChoice)_(\d+)\.png$/i);
    const legacyTabs = { ChoiceBox: "DialogueBox", FacelessBox: "IconlessBox", FacelessChoice: "CharacterlessBox" };
    const category = legacyTabs[legacy?.[1]] || legacy?.[1] || card.boxTab || "DialogueBox";
    const list = BOXES?.[category] || BOXES?.DialogueBox || [];
    const currentEntry = Object.entries(BOXES || {}).flatMap(([tab, entries]) =>
      entries.map(entry => ({ tab, entry }))
    ).find(({ entry }) => entry.file === oldFile && Number(entry.x) === Number(card.boxX) && Number(entry.y) === Number(card.boxY));
    const entry = currentEntry?.entry || list[Number(legacy?.[2]) || 0] || list[0];
    if (!entry) return {};
    return boxSelection(entry, currentEntry?.tab || category);
  }
  function resolveIconSelection(card) {
    const iconSrc = normalizeAssetSrc(card.iconSrc);
    const file = iconSrc.split("/").pop() || "";

    for (const [category, sheets] of Object.entries(ICONS || {})) {
      const sheet = sheets.find(item => item.file === file);
      if (sheet) {
        return {
          iconSrc,
          iconFrame: Number(card.iconFrame) || 0,
          iconCols: Number(sheet.columns) || 1,
          iconRows: Number(sheet.rows) || 1,
          iconTab: category
        };
      }
    }

    const legacy = file.match(/^(.+)_Icon_(\d+)\.png$/i);
    if (legacy) {
      const category = Object.keys(ICONS || {}).find(key => key.replaceAll(" ", "").toLowerCase() === legacy[1].toLowerCase());
      const flattened = (ICONS?.[category] || []).flatMap(sheet =>
        Array.from({ length: Number(sheet.frames) || 1 }, (_, frame) => ({ sheet, frame }))
      );
      const match = flattened[Number(legacy[2])];
      if (match) {
        return {
          iconSrc: `assets/images/dialogue/${match.sheet.file}`,
          iconFrame: match.frame,
          iconCols: Number(match.sheet.columns) || 1,
          iconRows: Number(match.sheet.rows) || 1,
          iconTab: category
        };
      }
    }

    return { iconSrc: "", iconFrame: 0, iconCols: 1, iconRows: 1, iconTab: "Nothing" };
  }
  function loadState() {
    try {
      const c = JSON.parse(localStorage.getItem(LS_KEYS.CARDS) || "[]");
      const a = localStorage.getItem(LS_KEYS.ACTIVE) || "";
      if (Array.isArray(c) && c.length) {
        cards = c.map(card => ({
          ...card,
          ...resolveBoxSelection(card),
          ...resolveIconSelection(card),
          choices: Array.isArray(card.choices) ? card.choices.slice(0, 4) : ["", ""],
          selectedChoice: Number.isInteger(card.selectedChoice) ? card.selectedChoice : null
        }));
        activeId = a || c[0].id;
      }
    } catch {}
  }
  const getActiveCard = () => cards.find(c => c.id === activeId);

  function setSpriteFrame(img, card) {
    const src = card.iconSrc || "";
    const cols = Math.max(1, Number(card.iconCols) || 1);
    const rows = Math.max(1, Number(card.iconRows) || 1);
    const frame = Math.max(0, Number(card.iconFrame) || 0);
    const col = frame % cols;
    const row = Math.floor(frame / cols);

    img.src = src;
    img.hidden = !src;
    img.style.width = `${cols * 100}%`;
    img.style.height = `${rows * 100}%`;
    img.style.left = `${col * -100}%`;
    img.style.top = `${row * -100}%`;
  }

  function setBoxFrame(img, card) {
    const cropWidth = Math.max(1, Number(card.boxWidth) || 256);
    const cropHeight = Math.max(1, Number(card.boxHeight) || 100);
    const sheetWidth = Math.max(cropWidth, Number(card.boxSheetWidth) || 512);
    const sheetHeight = Math.max(cropHeight, Number(card.boxSheetHeight) || 700);

    img.src = card.boxSrc || "";
    img.style.width = `${sheetWidth / cropWidth * 100}%`;
    img.style.height = `${sheetHeight / cropHeight * 100}%`;
    img.style.left = `${-(Number(card.boxX) || 0) / cropWidth * 100}%`;
    img.style.top = `${-(Number(card.boxY) || 0) / cropHeight * 100}%`;
  }

  function fitPreview() {
    requestAnimationFrame(() => {
      const stage = cardsContainer.parentElement;
      if (!stage || !cards.length) return;
      cardsContainer.style.transform = "none";
      const naturalWidth = cardsContainer.scrollWidth || 1;
      const naturalHeight = cardsContainer.scrollHeight || 1;
      const scale = Math.min(1.25, stage.clientWidth / naturalWidth, stage.clientHeight / naturalHeight);
      cardsContainer.style.transform = `scale(${Math.max(0.1, scale)})`;
    });
  }

  function renderChoicePreview(node, card) {
    const container = node.querySelector(".previewChoices");
    container.innerHTML = "";
    container.hidden = !card.isChoice;
    node.querySelector(".preview-box").classList.toggle("has-choices", card.isChoice);
    if (!card.isChoice) return;

    const choices = Array.isArray(card.choices) && card.choices.length ? card.choices : ["", ""];
    choices.forEach((choice, index) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "preview-choice";
      row.classList.toggle("selected", card.selectedChoice === index);
      row.title = card.selectedChoice === index ? "Clear selected choice" : `Select choice ${index + 1}`;

      const selected = card.selectedChoice === index;
      const art = document.createElement("span");
      art.className = "choice-art";
      const artImage = document.createElement("img");
      setBoxFrame(artImage, {
        boxSrc: "assets/images/dialogue/Dialogue_Panel.png",
        boxX: selected ? 109 : 111,
        boxY: selected ? 617 : 669,
        boxWidth: selected ? 38 : 34,
        boxHeight: selected ? 17 : 13,
        boxSheetWidth: 512,
        boxSheetHeight: 700
      });
      art.appendChild(artImage);

      const label = document.createElement("span");
      label.className = "choice-label";
      label.textContent = choice || `Choice ${index + 1}`;
      art.appendChild(label);
      row.appendChild(art);
      row.addEventListener("click", event => {
        event.stopPropagation();
        card.selectedChoice = card.selectedChoice === index ? null : index;
        saveState();
        renderChoicePreview(node, card);
      });
      container.appendChild(row);
    });
  }

  function patchCardNode(node, card) {
    setBoxFrame(node.querySelector(".boxImage"), card);
    setSpriteFrame(node.querySelector(".iconImage"), card);
    node.querySelector(".speaker").textContent = card.speaker || "";
    node.querySelector(".dialogue").textContent = card.text || "";
    node.querySelector(".nameBox").hidden = card.boxKind === "nameless" || card.boxKind === "characterless";
    node.querySelector(".iconViewport").hidden = card.boxKind === "iconless" || card.boxKind === "characterless";
    node.classList.toggle("wide-dialogue", card.boxKind === "iconless" || card.boxKind === "characterless");
    renderChoicePreview(node, card);
  }

  function syncChoiceEditor() {
    const card = getActiveCard();
    choiceEditor.hidden = !card?.isChoice;
    choiceInputs.innerHTML = "";
    if (!card?.isChoice) return;

    if (!Array.isArray(card.choices) || card.choices.length < 2) card.choices = ["", ""];
    card.choices = card.choices.slice(0, 4);
    card.choices.forEach((choice, index) => {
      const row = document.createElement("div");
      row.className = "choice-input-row";
      const label = document.createElement("label");
      label.htmlFor = `choiceInput${index}`;
      label.textContent = `Choice ${index + 1}:`;
      const input = document.createElement("input");
      input.id = `choiceInput${index}`;
      input.value = choice;
      input.maxLength = 48;
      input.addEventListener("input", () => {
        card.choices[index] = input.value;
        saveState();
        patchActiveCardDOM();
      });
      row.append(label, input);

      if (card.choices.length > 2) {
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-choice";
        remove.textContent = "×";
        remove.title = `Remove choice ${index + 1}`;
        remove.addEventListener("click", () => {
          card.choices.splice(index, 1);
          if (card.selectedChoice === index) card.selectedChoice = null;
          else if (card.selectedChoice > index) card.selectedChoice -= 1;
          saveState();
          syncChoiceEditor();
          patchActiveCardDOM();
        });
        row.appendChild(remove);
      }
      choiceInputs.appendChild(row);
    });
    addChoiceBtn.disabled = card.choices.length >= 4;
  }

  function setActive(id) {
    activeId = id;
    [...cardsContainer.querySelectorAll(".dialogue-card")].forEach(el =>
      el.classList.toggle("active", el.dataset.id === activeId)
    );
    const c = getActiveCard(); if (!c) return;
    speakerInput.value = c.speaker || "";
    dialogueInput.value = c.text || "";
    speakerInput.disabled = c.boxKind === "nameless" || c.boxKind === "characterless";
    syncChoiceEditor();
    saveState();
    // Sync thumbs/tabs ONLY when switching active card
    syncThumbnailsToActive();
  }

  function selectThumb(container, src, frame = null) {
    if (!src) return;
    container.querySelectorAll(".thumb").forEach(t => {
      const sameFile = src.endsWith(t.getAttribute("data-file") || "");
      const sameFrame = frame === null || Number(t.dataset.frame || 0) === Number(frame || 0);
      t.classList.toggle("selected", sameFile && sameFrame);
    });
  }
  function syncThumbnailsToActive() {
    const c = getActiveCard(); if (!c) return;

    // Switch tabs to the card's saved tabs
    if (c.boxTab && boxTabContainer.querySelector(`[data-type="${c.boxTab}"]`)) {
      boxTabContainer.querySelector(`[data-type="${c.boxTab}"]`).classList.add("active");
      displayBoxCategory(c.boxTab, BOXES[c.boxTab]);
    }
    if (c.iconTab && iconTabContainer.querySelector(`[data-type="${c.iconTab}"]`)) {
      iconTabContainer.querySelector(`[data-type="${c.iconTab}"]`).classList.add("active");
      displayIconCategory(c.iconTab, ICONS[c.iconTab]);
    }
    // Highlight current selections
    boxOptions.querySelectorAll(".thumb").forEach(thumb => {
      const sameCrop = Number(thumb.dataset.x) === Number(c.boxX) && Number(thumb.dataset.y) === Number(c.boxY);
      thumb.classList.toggle("selected", sameCrop);
    });
    if (!c.iconSrc) {
      iconOptions.querySelector('[data-empty="true"]')?.classList.add("selected");
    } else {
      selectThumb(iconOptions, c.iconSrc, c.iconFrame);
    }
  }

  // ====== Render ======
  function renderAllCards() {
    cardsContainer.innerHTML = "";
    cards.forEach(renderCard);
    setActive(activeId);
    fitPreview();
  }
  function renderCard(card) {
    const node = cardTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.id = card.id;
    patchCardNode(node, card);
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
    patchCardNode(node, c);
    fitPreview();
  }

  // ====== Create ======
  function createCardFromCurrent() {
    const base = getActiveCard() || {};
    const firstBox = getFirstBoxSelection();
    const card = {
      id: uid(),
      speaker: speakerInput.value || base.speaker || "",
      text: dialogueInput.value || base.text || "",
      boxSrc: base.boxSrc || firstBox.boxSrc,
      boxX: Number(base.boxX) || 0,
      boxY: Number(base.boxY) || 0,
      boxWidth: Number(base.boxWidth) || firstBox.boxWidth,
      boxHeight: Number(base.boxHeight) || firstBox.boxHeight,
      boxSheetWidth: Number(base.boxSheetWidth) || firstBox.boxSheetWidth,
      boxSheetHeight: Number(base.boxSheetHeight) || firstBox.boxSheetHeight,
      boxKind: base.boxKind || firstBox.boxKind,
      isChoice: Boolean(base.isChoice),
      choices: Array.isArray(base.choices) ? [...base.choices] : ["", ""],
      selectedChoice: Number.isInteger(base.selectedChoice) ? base.selectedChoice : null,
      iconSrc: base.iconSrc || getFirstIconSrc(),
      iconFrame: Number(base.iconFrame) || 0,
      iconCols: Number(base.iconCols) || 1,
      iconRows: Number(base.iconRows) || 1,
      boxTab: base.boxTab || getFirstBoxTabKey(),
      iconTab: base.iconTab || getFirstIconTabKey()
    };
    cards.push(card); saveState(); renderCard(card); setActive(card.id); fitPreview();
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
  function getFirstBoxSelection() {
    const tab = getFirstBoxTabKey(); const list = (BOXES && BOXES[tab]) || [];
    return list.length ? boxSelection(list[0], tab) : {};
  }
  function getFirstIconSrc() {
    const tab = getFirstIconTabKey(); const list = (ICONS && ICONS[tab]) || [];
    return list.length && list[0].file ? `assets/images/dialogue/${list[0].file}` : "";
  }

  // ====== Tabs: Boxes ======
  function setupBoxTabs(boxes) {
    // clear active class first
    boxTabContainer.querySelectorAll(".tabBtn").forEach(t => t.classList.remove("active"));

    boxTabContainer.querySelectorAll(".tabBtn").forEach(tab => {
      tab.addEventListener("click", () => {
        boxTabContainer.querySelectorAll(".tabBtn").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        // Show the category the user clicked
        displayBoxCategory(tab.dataset.type, boxes[tab.dataset.type]);
        localStorage.setItem(LS_KEYS.BOX_TAB, tab.dataset.type);
        // NOTE: DO NOT call syncThumbnailsToActive() here (prevents click being undone)
      });
    });

    // initial: use saved tab or first button
    const savedTab = localStorage.getItem(LS_KEYS.BOX_TAB);
    const firstTab = boxTabContainer.querySelector(`.tabBtn[data-type="${savedTab}"]`) || boxTabContainer.querySelector(".tabBtn");
    if (firstTab) {
      firstTab.classList.add("active");
      displayBoxCategory(firstTab.dataset.type, boxes[firstTab.dataset.type]);
    }
  }

  function displayBoxCategory(cat, files) {
    boxOptions.innerHTML = "";
    files.forEach((entry, index) => {
      const selection = boxSelection(entry, cat);
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "thumb box-thumb";
      thumb.dataset.file = entry.file;
      thumb.dataset.x = String(entry.x);
      thumb.dataset.y = String(entry.y);
      thumb.title = `${entry.kind || cat.replace(/([a-z])([A-Z])/g, "$1 $2")}${entry.choice ? " choice" : ""} - part ${index + 1}`;
      const viewport = document.createElement("span");
      viewport.className = "box-thumb-viewport";
      const img = document.createElement("img");
      setBoxFrame(img, selection);
      viewport.appendChild(img);
      thumb.appendChild(viewport);
      if (entry.choice) {
        const badge = document.createElement("span");
        badge.className = "choice-thumb-badge";
        badge.textContent = "Choice";
        thumb.appendChild(badge);
      }
      thumb.addEventListener("click", () => {
        boxOptions.querySelectorAll(".thumb").forEach(t => t.classList.remove("selected"));
        thumb.classList.add("selected");
        const c = getActiveCard(); if (!c) return;
        Object.assign(c, selection);
        if (c.isChoice && (!Array.isArray(c.choices) || c.choices.length < 2)) c.choices = ["", ""];
        if (!c.isChoice) c.selectedChoice = null;
        saveState();
        patchActiveCardDOM();
        syncChoiceEditor();
      });
      boxOptions.appendChild(thumb);
    });
  }

  // ====== Tabs: Icons ======
  function setupIconTabs(icons) {
    iconTabContainer.innerHTML = "";
    iconOptions.innerHTML = "";

    for (const cat in icons) {
      const btn = document.createElement("button");
      btn.textContent = cat;
      btn.className = "tabBtn";
      btn.dataset.type = cat;

      btn.addEventListener("click", () => {
        iconTabContainer.querySelectorAll(".tabBtn").forEach(t => t.classList.remove("active"));
        btn.classList.add("active");
        // Show the category the user clicked
        displayIconCategory(cat, icons[cat]);
        localStorage.setItem(LS_KEYS.ICON_TAB, cat);
        // NOTE: DO NOT call syncThumbnailsToActive() here (prevents click being undone)
      });

      iconTabContainer.appendChild(btn);
    }

    // initial: use saved tab or first
    const savedIconTab = localStorage.getItem(LS_KEYS.ICON_TAB);
    const first = iconTabContainer.querySelector(`.tabBtn[data-type="${savedIconTab}"]`) || iconTabContainer.querySelector(".tabBtn");
    if (first) {
      first.classList.add("active");
      displayIconCategory(first.dataset.type, icons[first.dataset.type]);
    }
  }

  function displayIconCategory(cat, files) {
    iconOptions.innerHTML = "";
    files.forEach(obj => {
      const cols = Math.max(1, Number(obj.columns) || 1);
      const rows = Math.max(1, Number(obj.rows) || 1);
      const frameCount = Math.max(1, Number(obj.frames) || cols * rows);

      for (let frame = 0; frame < frameCount; frame += 1) {
        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "thumb icon-thumb";
        thumb.dataset.file = obj.file || "";
        thumb.dataset.frame = String(frame);
        thumb.title = obj.file
          ? `${obj.file.replace(/\.png$/i, "").replaceAll("_", " ")} - part ${frame + 1}`
          : "No icon";

        if (obj.file) {
          const viewport = document.createElement("span");
          viewport.className = "icon-thumb-viewport";
          const img = document.createElement("img");
          setSpriteFrame(img, {
            iconSrc: `assets/images/dialogue/${obj.file}`,
            iconFrame: frame,
            iconCols: cols,
            iconRows: rows
          });
          viewport.appendChild(img);
          thumb.appendChild(viewport);
        } else {
          thumb.dataset.empty = "true";
          thumb.textContent = "None";
        }

        thumb.addEventListener("click", () => {
          iconOptions.querySelectorAll(".thumb").forEach(t => t.classList.remove("selected"));
          thumb.classList.add("selected");
          const c = getActiveCard(); if (!c) return;
          c.iconSrc = obj.file ? `assets/images/dialogue/${obj.file}` : "";
          c.iconFrame = frame;
          c.iconCols = cols;
          c.iconRows = rows;
          c.iconTab = cat;
          saveState();
          patchActiveCardDOM();
        });

        iconOptions.appendChild(thumb);
      }
    });
  }

  // ====== Inputs ======
  speakerInput.addEventListener("input", () => {
    const c = getActiveCard(); if (!c) return;
    c.speaker = speakerInput.value; saveState(); patchActiveCardDOM();
  });
  dialogueInput.addEventListener("input", () => {
    const c = getActiveCard(); if (!c) return;
    c.text = dialogueInput.value; saveState(); patchActiveCardDOM();
  });

  // ====== Spacing slider ======
  function applySpacing(px) {
    document.documentElement.style.setProperty("--card-gap", `${px}px`);
    spacingVal.textContent = `${px}px`;
    localStorage.setItem(LS_KEYS.SPACING, String(px));
    fitPreview();
  }
  spacingSlider.addEventListener("input", () => applySpacing(Number(spacingSlider.value)));

  // ====== Scale slider ======
  function applyScale(v) {
    scaleVal.textContent = `×${v}`;
    localStorage.setItem(LS_KEYS.SCALE, String(v));
  }
  scaleSlider.addEventListener("input", () => applyScale(Number(scaleSlider.value)));

  // ====== Buttons ======
  nextBtn.addEventListener("click", createCardFromCurrent);
  addChoiceBtn.addEventListener("click", () => {
    const card = getActiveCard();
    if (!card?.isChoice) return;
    if (!Array.isArray(card.choices)) card.choices = ["", ""];
    if (card.choices.length >= 4) return;
    card.choices.push("");
    saveState();
    syncChoiceEditor();
    patchActiveCardDOM();
  });

  exportAllBtn.addEventListener("click", async () => {
    const scale = Number(localStorage.getItem(LS_KEYS.SCALE)) || DEFAULTS.scale;
    const actives = [...cardsContainer.querySelectorAll(".dialogue-card.active")];
    actives.forEach(el => el.classList.remove("active"));

    const transform = getComputedStyle(cardsContainer).transform;
    const previewScale = transform === "none" ? 1 : Math.abs(new DOMMatrixReadOnly(transform).a) || 1;
    const previewTransform = cardsContainer.style.transform;
    cardsContainer.style.transform = "none";
    const exportScale = Math.max(1, scale * previewScale);
    const containerRect = cardsContainer.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(containerRect.width * exportScale));
    canvas.height = Math.max(1, Math.round(containerRect.height * exportScale));
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    const cardsToExport = [...cardsContainer.querySelectorAll(".dialogue-card")];
    for (const card of cardsToExport) {
      const cardRect = card.getBoundingClientRect();
      const renderedCard = await html2canvas(card, {
        scale: 16,
        backgroundColor: null,
        useCORS: true
      });
      const targetX = Math.round((cardRect.left - containerRect.left) * exportScale);
      const targetY = Math.round((cardRect.top - containerRect.top) * exportScale);
      const targetWidth = Math.round(cardRect.width * exportScale);
      const targetHeight = Math.round(cardRect.height * exportScale);
      context.drawImage(renderedCard, targetX, targetY, targetWidth, targetHeight);
      renderedCard.width = 0;
      renderedCard.height = 0;
    }
    cardsContainer.style.transform = previewTransform;

    setActive(activeId); // restore outline

    const link = document.createElement("a");
    link.download = "dialogues.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  resetBtn.addEventListener("click", () => {
    Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k));
    spacingSlider.value = DEFAULTS.spacing; applySpacing(DEFAULTS.spacing);
    scaleSlider.value = DEFAULTS.scale; applyScale(DEFAULTS.scale);

    cards = []; activeId = null; cardsContainer.innerHTML = "";
    const first = { id: uid(), speaker: "", text: "", ...getFirstBoxSelection(), iconSrc: getFirstIconSrc(), iconFrame: 0, iconCols: 1, iconRows: 1, iconTab: getFirstIconTabKey() };
    cards.push(first); renderAllCards(); setActive(first.id);
  });

  window.addEventListener("resize", fitPreview);

  // ====== Boot ======
  Promise.all([ fetch("data/dialogue/boxes.json").then(r=>r.json()), fetch("data/dialogue/icons.json").then(r=>r.json()) ])
  .then(([boxes, icons]) => {
    BOXES = boxes; ICONS = icons;
    setupBoxTabs(BOXES);
    setupIconTabs(ICONS);

    // init sliders
    const savedSpacing = Number(localStorage.getItem(LS_KEYS.SPACING));
    const spacing = Number.isFinite(savedSpacing) ? savedSpacing : DEFAULTS.spacing;
    spacingSlider.value = spacing; applySpacing(spacing);

    const savedScale = Number(localStorage.getItem(LS_KEYS.SCALE));
    const scale = Number.isFinite(savedScale) ? savedScale : DEFAULTS.scale;
    scaleSlider.value = scale; applyScale(scale);

    loadState();
    if (cards.length === 0) {
      const first = { id: uid(), speaker: localStorage.getItem("dialogue_speaker") || "", text: localStorage.getItem("dialogue_text") || "", ...getFirstBoxSelection(), iconSrc: getFirstIconSrc(), iconFrame: 0, iconCols: 1, iconRows: 1, iconTab: getFirstIconTabKey() };
      cards.push(first); activeId = first.id;
    }
    renderAllCards();
    setActive(activeId);
    // one-time sync at boot so tabs match the first card
    syncThumbnailsToActive();
  });
}
const remoteScripts = ["https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"]

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

export default function ChatPage() {
  useEffect(() => {
    document.title = "Dialogue Box Builder"
    document.body.className = "chat-page"
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
      <div className="upro-page-root"><div className="chat-nav">
    <div id="nav-btn">
      <a href="/">
        <button>Main Menu</button>
      </a>
    </div>
  </div>
  <div id="editor">
    <div className="panel editor-panel">
      <h1>Dialogue Builder</h1>
      <section className="asset-section box-section">
        <h2 className="asset-title">Dialogues</h2>
        <div id="boxTabs">
          <button className="tabBtn active" data-type="DialogueBox">Dialogue</button>
          <button className="tabBtn" data-type="NamelessBox">Nameless</button>
          <button className="tabBtn" data-type="IconlessBox">Iconless</button>
          <button className="tabBtn" data-type="CharacterlessBox">Characterless</button>
        </div>
        <div id="boxOptions" />
      </section>
      <section className="asset-section icon-section">
        <h2 className="asset-title">Icons</h2>
        <div id="iconTabs" />
        <div id="iconOptions" />
      </section>
      <div className="control-grid">
        <section className="text-controls">
          <h3>Speaker &amp; Text</h3>
          <input id="speakerInput" placeholder="Speaker Name" />
          <textarea id="dialogueInput" placeholder="Dialogue text..." rows={4} defaultValue={""} />
        </section>
        <section id="choiceEditor" className="choice-editor" hidden>
          <h3>Choices</h3>
          <div id="choiceInputs" />
          <button id="addChoiceBtn" type="button">Add Choice</button>
        </section>
        <section className="layout-controls">
          <h3>Layout &amp; Export</h3>
          <label>
            <span>Spacing</span>
            <input id="spacingSlider" type="range" min={-100} max={100} step={1} />
            <output id="spacingVal" />
          </label>
          <label>
            <span>Export scale</span>
            <input id="scaleSlider" type="range" min={1} max={8} step="0.5" />
            <output id="scaleVal" />
          </label>
        </section>
        <div className="buttons">
          <button id="nextBtn" type="button">Next (Add Dialogue)</button>
          <button id="exportAllBtn" type="button">Export All (PNG)</button>
          <button id="resetBtn" type="button">Reset Website</button>
        </div>
      </div>
    </div>
    <div className="panel preview-panel">
      <h1>Stacked Preview (Click any to edit)</h1>
      <div className="preview-stage"><div id="cardsContainer" /></div>
    </div>
  </div>
  <template id="cardTemplate" dangerouslySetInnerHTML={{ __html: "<div class=\"dialogue-card\" tabindex=\"0\">\r\n      <div class=\"preview-box\">\r\n        <div class=\"boxViewport\"><img class=\"boxImage\" alt=\"\"></div>\r\n        <div class=\"nameBox\">\r\n          <span class=\"speaker\"></span>\r\n        </div>\r\n        <div class=\"dialogueBox\">\r\n          <p class=\"dialogue\"></p>\r\n        </div>\r\n        <div class=\"iconViewport\"><img class=\"iconImage\" alt=\"\"></div>\r\n        <div class=\"previewChoices\"></div>\r\n      </div>\r\n    </div>" }} /></div>
    </>
  )
}
