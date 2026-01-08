let switcherooActive = false;

// Original positions (from your CSS)
const normalPositions = [
  { top: "9%", left: "42%" },    // btn1
  { top: "10%", left: "67%" },   // btn2
  { top: "41%", left: "44.5%" }, // btn3
  { top: "42%", left: "70%" }    // btn4
];

// Swapped positions (1↔3, 2↔4)
const switchedPositions = [
  { top: "13%", left: "10%" },    // btn1
  { top: "12%", left: "35%" },   // btn2
  { top: "43%", left: "7.5%" }, // btn3
  { top: "42%", left: "32%" }    // btn4
];

function updateButtonPositions() {
  const positions = switcherooActive ? switchedPositions : normalPositions;
  positions.forEach((pos, i) => {
    const overlayBtn = document.getElementById(`btn${i + 1}`);
    overlayBtn.style.top = pos.top;
    overlayBtn.style.left = pos.left;
  });
}

function updateButtons() {
  const capsuleImg = document.getElementById("capsule-img");
  const switchImg = document.getElementById("switcheroo-btn");

  // Update images based on state
  capsuleImg.src = switcherooActive
    ? "webimages/Animated_Capsule_Back.gif"
    : "webimages/Animated_Capsule.gif";

  switchImg.src = switcherooActive
    ? "webimages/WorseSwitch.png"
    : "webimages/BadSwitch.png";

    updateButtonPositions();

  const configs = switcherooActive
    ? [
        { text: "Type Chart", href: "typechart.html", bg: "linear-gradient(135deg, #e48dff, #c300ff)" },
        { text: "Chat", href: "IconTest/index.html", bg: "linear-gradient(135deg, #eaa78f, #c96e4e)" },
        { text: "Moves/Abilities", href: "hurty.html", bg: "linear-gradient(135deg, #ffbc62, #ff9200)" },
        { text: "Credits", href: "friend.html", bg: "linear-gradient(135deg, #ffd0d0, #fd9595)" }
      ]
    : [
        { text: "Animatrix", href: "animatrix.html", bg: "linear-gradient(135deg, #a3e635, #65a30d)" },
        { text: "OST", href: "ost.html", bg: "linear-gradient(135deg, #f87171, #b91c1c)" },
        { text: "Battle", href: "construction.html", bg: "linear-gradient(135deg, #fde68a, #ca8a04)" },
        { text: "Map", href: "construction.html", bg: "linear-gradient(135deg, #93c5fd, #2563eb)" }
      ];

  configs.forEach((cfg, i) => {
    const overlayBtn = document.getElementById(`btn${i + 1}`);
    overlayBtn.textContent = cfg.text;
    overlayBtn.style.background = cfg.bg;
    overlayBtn.href = cfg.href;

    const altBtn = document.getElementById(`btn${i + 1}-alt`);
    altBtn.textContent = cfg.text;
    altBtn.style.background = cfg.bg;
    altBtn.parentElement.href = cfg.href;
  });
}

function triggerSwitcheroo() {
  switcherooActive = !switcherooActive;
  updateButtons();
}

// Initialize page without toggling
window.onload = () => {
  updateButtons(); // just set correct state
  document.getElementById("switcheroo-btn").addEventListener("click", triggerSwitcheroo);
};
