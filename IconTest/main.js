const boxOptions = document.getElementById("boxOptions");
const boxImage = document.getElementById("boxImage");
const boxTabContainer = document.getElementById("boxTabs");

const iconOptions = document.getElementById("iconOptions");
const iconTabContainer = document.getElementById("iconTabs");
const iconImage = document.getElementById("iconImage");

const speakerInput = document.getElementById("speakerInput");
const dialogueInput = document.getElementById("dialogueInput");
const charSprite = document.getElementById("charSprite");

// Load boxes.json and icons.json
Promise.all([
  fetch("boxes.json").then(r => r.json()),
  fetch("icons.json").then(r => r.json())
]).then(([boxes, icons]) => {
  setupBoxTabs(boxes, true);
  setupIconTabs(icons, true);
});

// --- BOX TABS ---
function setupBoxTabs(boxes, restore = false) {
  boxTabContainer.querySelectorAll(".tabBtn").forEach(tab => {
    tab.addEventListener("click", () => {
      boxTabContainer.querySelectorAll(".tabBtn").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      displayBoxCategory(tab.dataset.type, boxes[tab.dataset.type], restore);
      if (restore) localStorage.setItem("dialogue_box_tab", tab.dataset.type);
    });
  });

  // Restore saved tab or show first
  const savedTab = restore ? localStorage.getItem("dialogue_box_tab") : null;
  const firstTab = savedTab 
    ? boxTabContainer.querySelector(`.tabBtn[data-type="${savedTab}"]`) 
    : boxTabContainer.querySelector(".tabBtn");
  if (firstTab) firstTab.click();
}

function displayBoxCategory(cat, files, restore = false) {
  boxOptions.innerHTML = "";
  const savedBox = restore ? localStorage.getItem("dialogue_box") : null;

  files.forEach(file => {
    const img = document.createElement("img");
    img.src = `boxes/${file}`;
    img.className = "thumb";

    if (restore && savedBox && savedBox.endsWith(file)) img.classList.add("selected");

    img.addEventListener("click", () => {
      boxOptions.querySelectorAll(".thumb").forEach(t => t.classList.remove("selected"));
      img.classList.add("selected");
      boxImage.src = img.src;
      localStorage.setItem("dialogue_box", img.src);
    });
    boxOptions.appendChild(img);
  });

  if (restore && savedBox) boxImage.src = savedBox;
}

// --- ICON TABS ---
function setupIconTabs(icons, restore = false) {
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
      displayIconCategory(cat, icons[cat], restore);
      if (restore) localStorage.setItem("dialogue_icon_tab", cat);
    });

    iconTabContainer.appendChild(btn);
  }

  // Restore saved icon tab or first
  const savedIconTab = restore ? localStorage.getItem("dialogue_icon_tab") : null;
  const first = savedIconTab 
    ? iconTabContainer.querySelector(`.tabBtn[data-type="${savedIconTab}"]`) 
    : iconTabContainer.querySelector(".tabBtn");
  if (first) first.click();
}

function displayIconCategory(cat, files, restore = false) {
  iconOptions.innerHTML = "";
  const savedIcon = restore ? localStorage.getItem("dialogue_icon") : null;

  files.forEach(obj => {
    const img = document.createElement("img");
    img.src = `icons/${obj.file}`;
    img.className = "thumb";

    if (restore && savedIcon && savedIcon.endsWith(obj.file)) img.classList.add("selected");

    img.addEventListener("click", () => {
      iconOptions.querySelectorAll(".thumb").forEach(t => t.classList.remove("selected"));
      img.classList.add("selected");
      iconImage.src = img.src;
      localStorage.setItem("dialogue_icon", img.src);
      localStorage.setItem("dialogue_icon_tab", cat);
    });

    iconOptions.appendChild(img);
  });

  if (restore && savedIcon) iconImage.src = savedIcon;
}

// --- EXPORT ---
document.getElementById("exportBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const previewEl = document.getElementById("preview");
  html2canvas(previewEl, { scale: 2 }).then(canvas => {
    const link = document.createElement("a");
    link.download = "dialogue.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});

// --- TEXT SAVE/RESTORE ---
speakerInput.addEventListener("input", () => {
  document.getElementById("speaker").textContent = speakerInput.value;
  localStorage.setItem("dialogue_speaker", speakerInput.value);
});

dialogueInput.addEventListener("input", () => {
  document.getElementById("dialogue").textContent = dialogueInput.value;
  localStorage.setItem("dialogue_text", dialogueInput.value);
});

// Restore text
window.addEventListener("load", () => {
  const savedSpeaker = localStorage.getItem("dialogue_speaker");
  const savedDialogue = localStorage.getItem("dialogue_text");

  if (savedSpeaker) speakerInput.value = savedSpeaker;
  if (savedDialogue) dialogueInput.value = savedDialogue;

  document.getElementById("speaker").textContent = savedSpeaker || "";
  document.getElementById("dialogue").textContent = savedDialogue || "";
});

// --- SPRITE UPLOAD ---
document.getElementById("spriteUpload").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    charSprite.src = ev.target.result;
    localStorage.setItem("dialogue_sprite", ev.target.result);
  };
  reader.readAsDataURL(file);
});

// Restore uploaded sprite
window.addEventListener("load", () => {
  const savedSprite = localStorage.getItem("dialogue_sprite");
  if (savedSprite) charSprite.src = savedSprite;
});

window.addEventListener("DOMContentLoaded", () => {
  const resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", () => {
    // Clear all saved data
    localStorage.clear();

    // Reset input fields and preview
    document.getElementById("speakerInput").value = "";
    document.getElementById("dialogueInput").value = "";
    document.getElementById("speaker").textContent = "";
    document.getElementById("dialogue").textContent = "";
    document.getElementById("boxImage").src = "";
    document.getElementById("iconImage").src = "";
    if(document.getElementById("charSprite")) document.getElementById("charSprite").src = "";

    // Clear thumbnail selections
    document.querySelectorAll(".thumb.selected").forEach(el => el.classList.remove("selected"));

    // Reset the first box tab
    const firstBoxTab = document.querySelector("#boxTabs .tabBtn");
    if(firstBoxTab) firstBoxTab.click();

    // Reset the first icon tab
    const firstIconTab = document.querySelector("#iconTabs .tabBtn");
    if(firstIconTab) firstIconTab.click();
  });
});

