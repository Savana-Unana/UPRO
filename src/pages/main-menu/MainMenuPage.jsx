import { useEffect } from 'react'

const pageStyles = ""
const pageScript = "let switcherooActive = false;\r\nlet skipTargetRight = false;\r\nlet skipMoveToken = 0;\r\nlet skipCrossTimeoutId;\r\nlet skipSettleTimeoutId;\r\nconst skipPixelsPerSecond = 780;\r\nconst guessWhoClickWindowMs = 2000;\r\nconst guessWhoUnlockClicks = 15;\r\nlet switcherooClickTimes = [];\r\n\r\n// Original positions (from your CSS)\r\nconst normalPositions = [\r\n  { top: \"9%\", left: \"42%\" },    // btn1\r\n  { top: \"10%\", left: \"67%\" },   // btn2\r\n  { top: \"41%\", left: \"44.5%\" }, // btn3\r\n  { top: \"42%\", left: \"70%\" }    // btn4\r\n];\r\n\r\n// Swapped positions (1↔3, 2↔4)\r\nconst switchedPositions = [\r\n  { top: \"13%\", left: \"10%\" },    // btn1\r\n  { top: \"12%\", left: \"35%\" },   // btn2\r\n  { top: \"43%\", left: \"7.5%\" }, // btn3\r\n  { top: \"42%\", left: \"32%\" }    // btn4\r\n];\r\n\r\nfunction updateButtonPositions() {\r\n  const positions = switcherooActive ? switchedPositions : normalPositions;\r\n  positions.forEach((pos, i) => {\r\n    const overlayBtn = document.getElementById(`btn${i + 1}`);\r\n    overlayBtn.style.top = pos.top;\r\n    overlayBtn.style.left = pos.left;\r\n  });\r\n}\r\n\r\nfunction updateButtons() {\r\n  const capsuleImg = document.getElementById(\"capsule-img\");\r\n  const switchImg = document.getElementById(\"switcheroo-btn\");\r\n\r\n  // Update images based on state\r\n  capsuleImg.src = switcherooActive\r\n    ? \"assets/images/ui/Animated_Capsule_Back.gif\"\r\n    : \"assets/images/ui/Animated_Capsule.gif\";\r\n\r\n  switchImg.src = switcherooActive\r\n    ? \"assets/images/ui/WorseSwitch.png\"\r\n    : \"assets/images/ui/BadSwitch.png\";\r\n\r\n    updateButtonPositions();\r\n\r\n  const configs = switcherooActive\r\n    ? [\r\n        { text: \"Type Chart\", href: \"/typechart\", bg: \"linear-gradient(135deg, #e48dff, #c300ff)\" },\r\n        { text: \"Chat\", href: \"/chat\", bg: \"linear-gradient(135deg, #eaa78f, #c96e4e)\" },\r\n        { text: \"Moves/Abilities\", href: \"/hurty\", bg: \"linear-gradient(135deg, #ffbc62, #ff9200)\" },\r\n        { text: \"Credits\", href: \"/friend\", bg: \"linear-gradient(135deg, #ffd0d0, #fd9595)\" }\r\n      ]\r\n    : [\r\n        { text: \"Animatrix\", href: \"/animatrix\", bg: \"linear-gradient(135deg, #a3e635, #65a30d)\" },\r\n        { text: \"OST\", href: \"/ost\", bg: \"linear-gradient(135deg, #f87171, #b91c1c)\" },\r\n        { text: \"Battle\", href: \"/construction\", bg: \"linear-gradient(135deg, #fde68a, #ca8a04)\" },\r\n        { text: \"Map\", href: \"/construction\", bg: \"linear-gradient(135deg, #93c5fd, #2563eb)\" }\r\n      ];\r\n\r\n  configs.forEach((cfg, i) => {\r\n    const overlayBtn = document.getElementById(`btn${i + 1}`);\r\n    overlayBtn.textContent = cfg.text;\r\n    overlayBtn.style.background = cfg.bg;\r\n    overlayBtn.href = cfg.href;\r\n\r\n    const altBtn = document.getElementById(`btn${i + 1}-alt`);\r\n    altBtn.textContent = cfg.text;\r\n    altBtn.style.background = cfg.bg;\r\n    altBtn.parentElement.href = cfg.href;\r\n  });\r\n}\r\n\r\nfunction getSkipMetrics(skipRunner) {\r\n  const capsuleContainer = skipRunner.parentElement;\r\n  const capsuleStyles = window.getComputedStyle(capsuleContainer);\r\n  const capsuleWidth = parseFloat(capsuleStyles.getPropertyValue(\"--capsule-width\")) || 400;\r\n  const leftPoint = parseFloat(capsuleStyles.getPropertyValue(\"--skip-left-point\")) || -80;\r\n  const rightPoint = parseFloat(capsuleStyles.getPropertyValue(\"--skip-right-point\")) || (capsuleWidth + 80);\r\n\r\n  return {\r\n    leftAnchor: leftPoint,\r\n    rightAnchor: rightPoint,\r\n    crossPoint: capsuleWidth / 2\r\n  };\r\n}\r\n\r\nfunction getSkipLeft(skipRunner) {\r\n  const capsuleContainer = skipRunner.parentElement;\r\n  const runnerRect = skipRunner.getBoundingClientRect();\r\n  const containerRect = capsuleContainer.getBoundingClientRect();\r\n\r\n  return (runnerRect.left - containerRect.left) + (runnerRect.width / 2);\r\n}\r\n\r\nfunction triggerSkipRun() {\r\n  const skipRunner = document.getElementById(\"skip-runner\");\r\n  const skipImgLeft = document.getElementById(\"skip-img-left\");\r\n  const skipImgRight = document.getElementById(\"skip-img-right\");\r\n  const { leftAnchor, rightAnchor, crossPoint } = getSkipMetrics(skipRunner);\r\n  const nextTargetRight = !skipTargetRight;\r\n  const moveToken = ++skipMoveToken;\r\n  const startLeft = getSkipLeft(skipRunner);\r\n  const endLeft = nextTargetRight ? rightAnchor : leftAnchor;\r\n  const totalDistance = Math.abs(endLeft - startLeft);\r\n  const travelDurationMs = totalDistance === 0\r\n    ? 0\r\n    : Math.round((totalDistance / skipPixelsPerSecond) * 1000);\r\n\r\n  skipTargetRight = nextTargetRight;\r\n\r\n  skipImgLeft.classList.toggle(\"is-visible\", !nextTargetRight);\r\n  skipImgRight.classList.toggle(\"is-visible\", nextTargetRight);\r\n\r\n  window.clearTimeout(skipCrossTimeoutId);\r\n  window.clearTimeout(skipSettleTimeoutId);\r\n  skipRunner.style.transition = \"none\";\r\n  skipRunner.classList.remove(\"skip-front\", \"skip-behind\", \"is-moving\");\r\n  skipRunner.style.left = `${startLeft}px`;\r\n  void skipRunner.offsetWidth;\r\n  skipRunner.classList.add(\"skip-front\");\r\n  skipRunner.style.transition = `left ${travelDurationMs}ms linear`;\r\n  skipRunner.classList.add(\"is-moving\");\r\n  skipRunner.classList.remove(\"skip-left\", \"skip-right\");\r\n  skipRunner.style.left = `${endLeft}px`;\r\n\r\n  if (\r\n    (startLeft <= crossPoint && endLeft >= crossPoint) ||\r\n    (startLeft >= crossPoint && endLeft <= crossPoint)\r\n  ) {\r\n    const distanceToCenter = Math.abs(crossPoint - startLeft);\r\n    const crossDelay = totalDistance === 0\r\n      ? 0\r\n      : Math.round((distanceToCenter / totalDistance) * travelDurationMs);\r\n\r\n    skipCrossTimeoutId = window.setTimeout(() => {\r\n      if (moveToken !== skipMoveToken) {\r\n        return;\r\n      }\r\n      switcherooActive = !switcherooActive;\r\n      updateButtons();\r\n    }, crossDelay);\r\n  }\r\n\r\n  skipSettleTimeoutId = window.setTimeout(() => {\r\n    if (moveToken !== skipMoveToken) {\r\n      return;\r\n    }\r\n    skipRunner.classList.remove(\"is-moving\", \"skip-left\", \"skip-right\");\r\n    skipRunner.classList.add(nextTargetRight ? \"skip-right\" : \"skip-left\");\r\n    skipRunner.style.transition = \"none\";\r\n    skipRunner.style.left = `${endLeft}px`;\r\n  }, travelDurationMs);\r\n}\r\n\r\nfunction triggerSwitcheroo() {\r\n  triggerSkipRun();\r\n\r\n  const now = performance.now();\r\n  switcherooClickTimes.push(now);\r\n  switcherooClickTimes = switcherooClickTimes.filter(time => now - time <= guessWhoClickWindowMs);\r\n\r\n  if (switcherooClickTimes.length >= guessWhoUnlockClicks) {\r\n    sessionStorage.setItem(\"upro_guesswho_unlocked\", \"true\");\r\n    window.location.href = \"/normal\";\r\n  }\r\n}\r\n\r\n// Initialize page without toggling\r\nwindow.onload = () => {\r\n  updateButtons(); // just set correct state\r\n  document.getElementById(\"switcheroo-btn\").addEventListener(\"click\", triggerSwitcheroo);\r\n};\r\n"
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

export default function MainMenuPage() {
  useEffect(() => {
    document.title = "Erm Ma Ha Sigma"
    document.body.className = ""
    document.body.setAttribute('style', "align-items: center")

    let cancelled = false

    async function startPage() {
      for (const src of remoteScripts) {
        await loadRemoteScript(src)
      }

      if (cancelled || !pageScript) return

      window.onload = null
      new Function(`${pageScript}\n//# sourceURL=MainMenuPage.legacy.js`)()
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
      <div className="upro-page-root"><h1>Main Menu</h1>
  <div className="capsule-container">
    <a id="skip-runner" className="skip-runner skip-left skip-front" href="/construction">
      <img id="skip-img-left" className="skip-sprite is-visible" src="assets/images/ui/Skip_Left.gif" alt="Skip" />
      <img id="skip-img-right" className="skip-sprite" src="assets/images/ui/Skip_Right.gif" alt="Skip" />
    </a>
    <img id="capsule-img" src="assets/images/ui/Animated_Capsule.gif" alt="Capture Capsule" />
    <div className="image-buttons">
      <a id="btn1" href="/animatrix" className="overlay-btn">Animatrix</a>
      <a id="btn2" href="/ost" className="overlay-btn">OST</a>
      <a id="btn3" href="/construction" className="overlay-btn">Battle</a>
      <a id="btn4" href="/construction" className="overlay-btn">Map</a>
    </div>
  </div>
  <div className="buttons">
    <a href="/animatrix"><button id="btn1-alt">Animatrix</button></a>
    <a href="/ost"><button id="btn2-alt">OST</button></a>
    <a href="/construction"><button id="btn3-alt">Battle</button></a>
    <a href="/construction"><button id="btn4-alt">Map</button></a>
  </div>
  <div className="switcheroo-container">
    <img src="assets/images/ui/BadSwitch.png" alt="Switcheroo" id="switcheroo-btn" />
  </div></div>
    </>
  )
}
