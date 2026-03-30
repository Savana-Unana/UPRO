let switcherooActive = false;
let skipTargetRight = false;
let skipMoveToken = 0;
let skipCrossTimeoutId;
let skipSettleTimeoutId;
const skipPixelsPerSecond = 780;
const guessWhoClickWindowMs = 2000;
const guessWhoUnlockClicks = 15;
let switcherooClickTimes = [];

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
    ? "assets/images/ui/Animated_Capsule_Back.gif"
    : "assets/images/ui/Animated_Capsule.gif";

  switchImg.src = switcherooActive
    ? "assets/images/ui/WorseSwitch.png"
    : "assets/images/ui/BadSwitch.png";

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

function getSkipMetrics(skipRunner) {
  const capsuleContainer = skipRunner.parentElement;
  const capsuleStyles = window.getComputedStyle(capsuleContainer);
  const capsuleWidth = parseFloat(capsuleStyles.getPropertyValue("--capsule-width")) || 400;
  const leftPoint = parseFloat(capsuleStyles.getPropertyValue("--skip-left-point")) || -80;
  const rightPoint = parseFloat(capsuleStyles.getPropertyValue("--skip-right-point")) || (capsuleWidth + 80);

  return {
    leftAnchor: leftPoint,
    rightAnchor: rightPoint,
    crossPoint: capsuleWidth / 2
  };
}

function getSkipLeft(skipRunner) {
  const capsuleContainer = skipRunner.parentElement;
  const runnerRect = skipRunner.getBoundingClientRect();
  const containerRect = capsuleContainer.getBoundingClientRect();

  return (runnerRect.left - containerRect.left) + (runnerRect.width / 2);
}

function triggerSkipRun() {
  const skipRunner = document.getElementById("skip-runner");
  const skipImgLeft = document.getElementById("skip-img-left");
  const skipImgRight = document.getElementById("skip-img-right");
  const { leftAnchor, rightAnchor, crossPoint } = getSkipMetrics(skipRunner);
  const nextTargetRight = !skipTargetRight;
  const moveToken = ++skipMoveToken;
  const startLeft = getSkipLeft(skipRunner);
  const endLeft = nextTargetRight ? rightAnchor : leftAnchor;
  const totalDistance = Math.abs(endLeft - startLeft);
  const travelDurationMs = totalDistance === 0
    ? 0
    : Math.round((totalDistance / skipPixelsPerSecond) * 1000);

  skipTargetRight = nextTargetRight;

  skipImgLeft.classList.toggle("is-visible", !nextTargetRight);
  skipImgRight.classList.toggle("is-visible", nextTargetRight);

  window.clearTimeout(skipCrossTimeoutId);
  window.clearTimeout(skipSettleTimeoutId);
  skipRunner.style.transition = "none";
  skipRunner.classList.remove("skip-front", "skip-behind", "is-moving");
  skipRunner.style.left = `${startLeft}px`;
  void skipRunner.offsetWidth;
  skipRunner.classList.add("skip-front");
  skipRunner.style.transition = `left ${travelDurationMs}ms linear`;
  skipRunner.classList.add("is-moving");
  skipRunner.classList.remove("skip-left", "skip-right");
  skipRunner.style.left = `${endLeft}px`;

  if (
    (startLeft <= crossPoint && endLeft >= crossPoint) ||
    (startLeft >= crossPoint && endLeft <= crossPoint)
  ) {
    const distanceToCenter = Math.abs(crossPoint - startLeft);
    const crossDelay = totalDistance === 0
      ? 0
      : Math.round((distanceToCenter / totalDistance) * travelDurationMs);

    skipCrossTimeoutId = window.setTimeout(() => {
      if (moveToken !== skipMoveToken) {
        return;
      }
      switcherooActive = !switcherooActive;
      updateButtons();
    }, crossDelay);
  }

  skipSettleTimeoutId = window.setTimeout(() => {
    if (moveToken !== skipMoveToken) {
      return;
    }
    skipRunner.classList.remove("is-moving", "skip-left", "skip-right");
    skipRunner.classList.add(nextTargetRight ? "skip-right" : "skip-left");
    skipRunner.style.transition = "none";
    skipRunner.style.left = `${endLeft}px`;
  }, travelDurationMs);
}

function triggerSwitcheroo() {
  triggerSkipRun();

  const now = performance.now();
  switcherooClickTimes.push(now);
  switcherooClickTimes = switcherooClickTimes.filter(time => now - time <= guessWhoClickWindowMs);

  if (switcherooClickTimes.length >= guessWhoUnlockClicks) {
    sessionStorage.setItem("upro_guesswho_unlocked", "true");
    window.location.href = "normal.html";
  }
}

// Initialize page without toggling
window.onload = () => {
  updateButtons(); // just set correct state
  document.getElementById("switcheroo-btn").addEventListener("click", triggerSwitcheroo);
};
