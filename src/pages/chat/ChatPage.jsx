import { useEffect } from 'react'

const pageStyles = ""
const pageScript = "// ====== DOM Refs ======\r\nconst boxOptions = document.getElementById(\"boxOptions\");\r\nconst boxTabContainer = document.getElementById(\"boxTabs\");\r\nconst iconOptions = document.getElementById(\"iconOptions\");\r\nconst iconTabContainer = document.getElementById(\"iconTabs\");\r\nconst speakerInput = document.getElementById(\"speakerInput\");\r\nconst dialogueInput = document.getElementById(\"dialogueInput\");\r\nconst cardsContainer = document.getElementById(\"cardsContainer\");\r\nconst cardTemplate = document.getElementById(\"cardTemplate\");\r\nconst nextBtn = document.getElementById(\"nextBtn\");\r\nconst exportAllBtn = document.getElementById(\"exportAllBtn\");\r\nconst resetBtn = document.getElementById(\"resetBtn\");\r\nconst spacingSlider = document.getElementById(\"spacingSlider\");\r\nconst spacingVal = document.getElementById(\"spacingVal\");\r\nconst scaleSlider = document.getElementById(\"scaleSlider\");\r\nconst scaleVal = document.getElementById(\"scaleVal\");\r\n\r\n// ====== App State ======\r\nlet BOXES = null, ICONS = null;\r\nlet cards = [];         // [{id, speaker, text, boxSrc, iconSrc, boxTab, iconTab}]\r\nlet activeId = null;\r\n\r\nconst LS_KEYS = {\r\n  CARDS: \"dialogue_cards_v2\",\r\n  ACTIVE: \"dialogue_active_v2\",\r\n  BOX_TAB: \"dialogue_box_tab\",\r\n  ICON_TAB: \"dialogue_icon_tab\",\r\n  SPACING: \"dialogue_spacing_px_v1\",\r\n  SCALE: \"dialogue_export_scale_v1\"\r\n};\r\n\r\n// Defaults:\r\nconst DEFAULTS = { spacing: -20, scale: 5 };\r\n\r\n// ====== Utilities ======\r\nconst uid = () => Math.random().toString(36).slice(2, 10);\r\nfunction normalizeAssetSrc(src) {\r\n  const value = String(src || \"\");\r\n  if (!value) return \"\";\r\n\r\n  const oldBoxMatch = value.match(/(?:^|\\/)IconTest\\/boxes\\/([^/?#]+)/i) || value.match(/^boxes\\/([^/?#]+)/i);\r\n  if (oldBoxMatch) return `assets/images/dialogue/boxes/${oldBoxMatch[1]}`;\r\n\r\n  const oldIconMatch = value.match(/(?:^|\\/)IconTest\\/icons\\/([^/?#]+)/i) || value.match(/^icons\\/([^/?#]+)/i);\r\n  if (oldIconMatch) return `assets/images/dialogue/icons/${oldIconMatch[1]}`;\r\n\r\n  return value;\r\n}\r\n\r\nconst saveState = () => {\r\n  localStorage.setItem(LS_KEYS.CARDS, JSON.stringify(cards));\r\n  localStorage.setItem(LS_KEYS.ACTIVE, activeId || \"\");\r\n};\r\nfunction loadState() {\r\n  try {\r\n    const c = JSON.parse(localStorage.getItem(LS_KEYS.CARDS) || \"[]\");\r\n    const a = localStorage.getItem(LS_KEYS.ACTIVE) || \"\";\r\n    if (Array.isArray(c) && c.length) {\r\n      cards = c.map(card => ({\r\n        ...card,\r\n        boxSrc: normalizeAssetSrc(card.boxSrc),\r\n        iconSrc: normalizeAssetSrc(card.iconSrc)\r\n      }));\r\n      activeId = a || c[0].id;\r\n    }\r\n  } catch {}\r\n}\r\nconst getActiveCard = () => cards.find(c => c.id === activeId);\r\n\r\nfunction setActive(id) {\r\n  activeId = id;\r\n  [...cardsContainer.querySelectorAll(\".dialogue-card\")].forEach(el =>\r\n    el.classList.toggle(\"active\", el.dataset.id === activeId)\r\n  );\r\n  const c = getActiveCard(); if (!c) return;\r\n  speakerInput.value = c.speaker || \"\";\r\n  dialogueInput.value = c.text || \"\";\r\n  saveState();\r\n  // Sync thumbs/tabs ONLY when switching active card\r\n  syncThumbnailsToActive();\r\n}\r\n\r\nfunction selectThumb(container, src) {\r\n  if (!src) return;\r\n  container.querySelectorAll(\".thumb\").forEach(t => {\r\n    t.classList.toggle(\"selected\", t.src === src || (t.src && src && src.endsWith(t.getAttribute(\"data-file\") || \"\")));\r\n  });\r\n}\r\nfunction syncThumbnailsToActive() {\r\n  const c = getActiveCard(); if (!c) return;\r\n\r\n  // Switch tabs to the card's saved tabs\r\n  if (c.boxTab && boxTabContainer.querySelector(`[data-type=\"${c.boxTab}\"]`)) {\r\n    boxTabContainer.querySelector(`[data-type=\"${c.boxTab}\"]`).classList.add(\"active\");\r\n    displayBoxCategory(c.boxTab, BOXES[c.boxTab]);\r\n  }\r\n  if (c.iconTab && iconTabContainer.querySelector(`[data-type=\"${c.iconTab}\"]`)) {\r\n    iconTabContainer.querySelector(`[data-type=\"${c.iconTab}\"]`).classList.add(\"active\");\r\n    displayIconCategory(c.iconTab, ICONS[c.iconTab]);\r\n  }\r\n  // Highlight current selections\r\n  selectThumb(boxOptions, c.boxSrc);\r\n  selectThumb(iconOptions, c.iconSrc);\r\n}\r\n\r\n// ====== Render ======\r\nfunction renderAllCards() {\r\n  cardsContainer.innerHTML = \"\";\r\n  cards.forEach(renderCard);\r\n  setActive(activeId);\r\n}\r\nfunction renderCard(card) {\r\n  const node = cardTemplate.content.firstElementChild.cloneNode(true);\r\n  node.dataset.id = card.id;\r\n  node.querySelector(\".boxImage\").src = card.boxSrc || \"\";\r\n  node.querySelector(\".iconImage\").src = card.iconSrc || \"\";\r\n  node.querySelector(\".speaker\").textContent = card.speaker || \"\";\r\n  node.querySelector(\".dialogue\").textContent = card.text || \"\";\r\n  node.addEventListener(\"click\", () => setActive(card.id));\r\n  node.addEventListener(\"keydown\", e => {\r\n    if (e.key === \"Enter\" || e.key === \" \") { e.preventDefault(); setActive(card.id); }\r\n  });\r\n  cardsContainer.appendChild(node);\r\n}\r\nfunction patchActiveCardDOM() {\r\n  const c = getActiveCard(); if (!c) return;\r\n  const node = cardsContainer.querySelector(`.dialogue-card[data-id=\"${c.id}\"]`);\r\n  if (!node) return;\r\n  node.querySelector(\".boxImage\").src = c.boxSrc || \"\";\r\n  node.querySelector(\".iconImage\").src = c.iconSrc || \"\";\r\n  node.querySelector(\".speaker\").textContent = c.speaker || \"\";\r\n  node.querySelector(\".dialogue\").textContent = c.text || \"\";\r\n}\r\n\r\n// ====== Create ======\r\nfunction createCardFromCurrent() {\r\n  const base = getActiveCard() || {};\r\n  const card = {\r\n    id: uid(),\r\n    speaker: speakerInput.value || base.speaker || \"\",\r\n    text: dialogueInput.value || base.text || \"\",\r\n    boxSrc: base.boxSrc || getFirstBoxSrc(),\r\n    iconSrc: base.iconSrc || getFirstIconSrc(),\r\n    boxTab: base.boxTab || getFirstBoxTabKey(),\r\n    iconTab: base.iconTab || getFirstIconTabKey()\r\n  };\r\n  cards.push(card); saveState(); renderCard(card); setActive(card.id);\r\n}\r\n\r\n// Defaults\r\nfunction getFirstBoxTabKey() {\r\n  const a = boxTabContainer.querySelector(\".tabBtn.active\");\r\n  return a ? a.dataset.type : (Object.keys(BOXES || { DialogueBox: [] })[0] || \"DialogueBox\");\r\n}\r\nfunction getFirstIconTabKey() {\r\n  const a = iconTabContainer.querySelector(\".tabBtn.active\");\r\n  return a ? a.dataset.type : (Object.keys(ICONS || {})[0] || \"\");\r\n}\r\nfunction getFirstBoxSrc() {\r\n  const tab = getFirstBoxTabKey(); const list = (BOXES && BOXES[tab]) || [];\r\n  return list.length ? `assets/images/dialogue/boxes/${list[0]}` : \"\";\r\n}\r\nfunction getFirstIconSrc() {\r\n  const tab = getFirstIconTabKey(); const list = (ICONS && ICONS[tab]) || [];\r\n  return list.length ? `assets/images/dialogue/icons/${list[0].file}` : \"\";\r\n}\r\n\r\n// ====== Tabs: Boxes ======\r\nfunction setupBoxTabs(boxes) {\r\n  // clear active class first\r\n  boxTabContainer.querySelectorAll(\".tabBtn\").forEach(t => t.classList.remove(\"active\"));\r\n\r\n  boxTabContainer.querySelectorAll(\".tabBtn\").forEach(tab => {\r\n    tab.addEventListener(\"click\", () => {\r\n      boxTabContainer.querySelectorAll(\".tabBtn\").forEach(t => t.classList.remove(\"active\"));\r\n      tab.classList.add(\"active\");\r\n      // Show the category the user clicked\r\n      displayBoxCategory(tab.dataset.type, boxes[tab.dataset.type]);\r\n      localStorage.setItem(LS_KEYS.BOX_TAB, tab.dataset.type);\r\n      // NOTE: DO NOT call syncThumbnailsToActive() here (prevents click being undone)\r\n    });\r\n  });\r\n\r\n  // initial: use saved tab or first button\r\n  const savedTab = localStorage.getItem(LS_KEYS.BOX_TAB);\r\n  const firstTab = savedTab \r\n    ? boxTabContainer.querySelector(`.tabBtn[data-type=\"${savedTab}\"]`)\r\n    : boxTabContainer.querySelector(\".tabBtn\");\r\n  if (firstTab) {\r\n    firstTab.classList.add(\"active\");\r\n    displayBoxCategory(firstTab.dataset.type, boxes[firstTab.dataset.type]);\r\n  }\r\n}\r\n\r\nfunction displayBoxCategory(cat, files) {\r\n  boxOptions.innerHTML = \"\";\r\n  files.forEach(file => {\r\n    const img = document.createElement(\"img\");\r\n    img.src = `assets/images/dialogue/boxes/${file}`;\r\n    img.className = \"thumb\";\r\n    img.setAttribute(\"data-file\", file);\r\n    img.addEventListener(\"click\", () => {\r\n      boxOptions.querySelectorAll(\".thumb\").forEach(t => t.classList.remove(\"selected\"));\r\n      img.classList.add(\"selected\");\r\n      const c = getActiveCard(); if (!c) return;\r\n      c.boxSrc = img.src;\r\n      c.boxTab = cat;\r\n      saveState();\r\n      patchActiveCardDOM();\r\n    });\r\n    boxOptions.appendChild(img);\r\n  });\r\n}\r\n\r\n// ====== Tabs: Icons ======\r\nfunction setupIconTabs(icons) {\r\n  iconTabContainer.innerHTML = \"\";\r\n  iconOptions.innerHTML = \"\";\r\n\r\n  for (const cat in icons) {\r\n    const btn = document.createElement(\"button\");\r\n    btn.textContent = cat;\r\n    btn.className = \"tabBtn\";\r\n    btn.dataset.type = cat;\r\n\r\n    btn.addEventListener(\"click\", () => {\r\n      iconTabContainer.querySelectorAll(\".tabBtn\").forEach(t => t.classList.remove(\"active\"));\r\n      btn.classList.add(\"active\");\r\n      // Show the category the user clicked\r\n      displayIconCategory(cat, icons[cat]);\r\n      localStorage.setItem(LS_KEYS.ICON_TAB, cat);\r\n      // NOTE: DO NOT call syncThumbnailsToActive() here (prevents click being undone)\r\n    });\r\n\r\n    iconTabContainer.appendChild(btn);\r\n  }\r\n\r\n  // initial: use saved tab or first\r\n  const savedIconTab = localStorage.getItem(LS_KEYS.ICON_TAB);\r\n  const first = savedIconTab \r\n    ? iconTabContainer.querySelector(`.tabBtn[data-type=\"${savedIconTab}\"]`)\r\n    : iconTabContainer.querySelector(\".tabBtn\");\r\n  if (first) {\r\n    first.classList.add(\"active\");\r\n    displayIconCategory(first.dataset.type, icons[first.dataset.type]);\r\n  }\r\n}\r\n\r\nfunction displayIconCategory(cat, files) {\r\n  iconOptions.innerHTML = \"\";\r\n  files.forEach(obj => {\r\n    const img = document.createElement(\"img\");\r\n    img.src = `assets/images/dialogue/icons/${obj.file}`;\r\n    img.className = \"thumb\";\r\n    img.setAttribute(\"data-file\", obj.file);\r\n\r\n    img.addEventListener(\"click\", () => {\r\n      iconOptions.querySelectorAll(\".thumb\").forEach(t => t.classList.remove(\"selected\"));\r\n      img.classList.add(\"selected\");\r\n      const c = getActiveCard(); if (!c) return;\r\n      c.iconSrc = img.src;\r\n      c.iconTab = cat;\r\n      saveState();\r\n      patchActiveCardDOM();\r\n    });\r\n\r\n    iconOptions.appendChild(img);\r\n  });\r\n}\r\n\r\n// ====== Inputs ======\r\nspeakerInput.addEventListener(\"input\", () => {\r\n  const c = getActiveCard(); if (!c) return;\r\n  c.speaker = speakerInput.value; saveState(); patchActiveCardDOM();\r\n});\r\ndialogueInput.addEventListener(\"input\", () => {\r\n  const c = getActiveCard(); if (!c) return;\r\n  c.text = dialogueInput.value; saveState(); patchActiveCardDOM();\r\n});\r\n\r\n// ====== Spacing slider ======\r\nfunction applySpacing(px) {\r\n  document.documentElement.style.setProperty(\"--card-gap\", `${px}px`);\r\n  spacingVal.textContent = `${px}px`;\r\n  localStorage.setItem(LS_KEYS.SPACING, String(px));\r\n}\r\nspacingSlider.addEventListener(\"input\", () => applySpacing(Number(spacingSlider.value)));\r\n\r\n// ====== Scale slider ======\r\nfunction applyScale(v) {\r\n  scaleVal.textContent = `×${v}`;\r\n  localStorage.setItem(LS_KEYS.SCALE, String(v));\r\n}\r\nscaleSlider.addEventListener(\"input\", () => applyScale(Number(scaleSlider.value)));\r\n\r\n// ====== Buttons ======\r\nnextBtn.addEventListener(\"click\", createCardFromCurrent);\r\n\r\nexportAllBtn.addEventListener(\"click\", async () => {\r\n  const scale = Number(localStorage.getItem(LS_KEYS.SCALE)) || DEFAULTS.scale;\r\n  const actives = [...cardsContainer.querySelectorAll(\".dialogue-card.active\")];\r\n  actives.forEach(el => el.classList.remove(\"active\"));\r\n\r\n  const canvas = await html2canvas(cardsContainer, { scale, backgroundColor: null, useCORS: true });\r\n\r\n  setActive(activeId); // restore outline\r\n\r\n  const link = document.createElement(\"a\");\r\n  link.download = \"dialogues.png\";\r\n  link.href = canvas.toDataURL(\"image/png\");\r\n  link.click();\r\n});\r\n\r\nresetBtn.addEventListener(\"click\", () => {\r\n  Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k));\r\n  spacingSlider.value = DEFAULTS.spacing; applySpacing(DEFAULTS.spacing);\r\n  scaleSlider.value = DEFAULTS.scale; applyScale(DEFAULTS.scale);\r\n\r\n  cards = []; activeId = null; cardsContainer.innerHTML = \"\";\r\n  const first = { id: uid(), speaker: \"\", text: \"\", boxSrc: getFirstBoxSrc(), iconSrc: getFirstIconSrc(), boxTab: getFirstBoxTabKey(), iconTab: getFirstIconTabKey() };\r\n  cards.push(first); renderAllCards(); setActive(first.id);\r\n});\r\n\r\n// ====== Boot ======\r\nPromise.all([ fetch(\"data/dialogue/boxes.json\").then(r=>r.json()), fetch(\"data/dialogue/icons.json\").then(r=>r.json()) ])\r\n.then(([boxes, icons]) => {\r\n  BOXES = boxes; ICONS = icons;\r\n  setupBoxTabs(BOXES);\r\n  setupIconTabs(ICONS);\r\n\r\n  // init sliders\r\n  const savedSpacing = Number(localStorage.getItem(LS_KEYS.SPACING));\r\n  const spacing = Number.isFinite(savedSpacing) ? savedSpacing : DEFAULTS.spacing;\r\n  spacingSlider.value = spacing; applySpacing(spacing);\r\n\r\n  const savedScale = Number(localStorage.getItem(LS_KEYS.SCALE));\r\n  const scale = Number.isFinite(savedScale) ? savedScale : DEFAULTS.scale;\r\n  scaleSlider.value = scale; applyScale(scale);\r\n\r\n  loadState();\r\n  if (cards.length === 0) {\r\n    const first = { id: uid(), speaker: localStorage.getItem(\"dialogue_speaker\") || \"\", text: localStorage.getItem(\"dialogue_text\") || \"\", boxSrc: getFirstBoxSrc(), iconSrc: getFirstIconSrc(), boxTab: getFirstBoxTabKey(), iconTab: getFirstIconTabKey() };\r\n    cards.push(first); activeId = first.id;\r\n  }\r\n  renderAllCards();\r\n  setActive(activeId);\r\n  // one-time sync at boot so tabs match the first card\r\n  syncThumbnailsToActive();\r\n});\r\n"
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

      if (cancelled || !pageScript) return

      window.onload = null
      new Function(`${pageScript}\n//# sourceURL=ChatPage.legacy.js`)()
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
      <div className="upro-page-root"><div style={{display: 'flex'}}>
    <div id="nav-btn">
      <a href="/">
        <button>Main Menu</button>
      </a>
    </div>
  </div>
  <div id="editor">
    <div className="panel">
      <h1>Dialogue Box</h1>
      <div id="boxTabs">
        <button className="tabBtn active" data-type="DialogueBox">Dialogue</button>
        <button className="tabBtn" data-type="ChoiceBox">Choice</button>
        <button className="tabBtn" data-type="FacelessBox">Faceless</button>
        <button className="tabBtn" data-type="FacelessChoice">Faceless Choice</button>
      </div>
      <div id="boxOptions" />
      <h3>Icons</h3>
      <div id="iconTabs" />
      <div id="iconOptions" />
      <h3>Speaker &amp; Text</h3>
      <input id="speakerInput" placeholder="Speaker Name" /><br /><br />
      <textarea id="dialogueInput" placeholder="Dialogue text..." rows={4} cols={30} defaultValue={""} /><br /><br />
      <h3>Layout &amp; Export</h3>
      <label>
        Spacing (px, negative = overlap):
        <input id="spacingSlider" type="range" min={-100} max={100} step={1} />
        <span id="spacingVal" />
      </label>
      <br />
      <label>
        Export scale (x):
        <input id="scaleSlider" type="range" min={1} max={8} step="0.5" />
        <span id="scaleVal" />
      </label>
      <div className="buttons">
        <button id="nextBtn" type="button">Next (Add Dialogue)</button>
        <button id="exportAllBtn" type="button">Export All (PNG)</button>
        <button id="resetBtn" type="button">Reset Website</button>
      </div>
    </div>
    <div className="panel">
      <h1>Stacked Preview (Click any to edit)</h1>
      <div id="cardsContainer" />
    </div>
  </div>
  <template id="cardTemplate" dangerouslySetInnerHTML={{ __html: "<div class=\"dialogue-card\" tabindex=\"0\">\r\n      <div class=\"preview-box\">\r\n        <img class=\"boxImage\" style=\"position:absolute;width:100%;height:100%;object-fit:contain;top:0;left:0;\" alt=\"\">\r\n        <div class=\"nameBox\">\r\n          <span class=\"speaker\"></span>\r\n        </div>\r\n        <div class=\"dialogueBox\">\r\n          <p class=\"dialogue\"></p>\r\n        </div>\r\n        <img class=\"iconImage\" alt=\"\">\r\n      </div>\r\n    </div>" }} /></div>
    </>
  )
}
