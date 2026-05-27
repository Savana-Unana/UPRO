import { useEffect } from 'react'

const pageStyles = ""

const SKIP_PIXELS_PER_SECOND = 780
const GUESS_WHO_CLICK_WINDOW_MS = 2000
const GUESS_WHO_UNLOCK_CLICKS = 10

const normalPositions = [
  { top: "6%", left: "42%" },
  { top: "7%", left: "67%" },
  { top: "41%", left: "44.5%" },
  { top: "42%", left: "70%" },
]

const switchedPositions = [
  { top: "10%", left: "10%" },
  { top: "9%", left: "35%" },
  { top: "43%", left: "7.5%" },
  { top: "42%", left: "32%" },
]

const normalButtonConfigs = [
  { text: "Animatrix", href: "/animatrix", bg: "linear-gradient(135deg, #a3e635, #65a30d)" },
  { text: "OST", href: "/ost", bg: "linear-gradient(135deg, #f87171, #b91c1c)" },
  { text: "Battle", href: "/construction", bg: "linear-gradient(135deg, #fde68a, #ca8a04)" },
  { text: "Map", href: "/construction", bg: "linear-gradient(135deg, #93c5fd, #2563eb)" },
]

const switchedButtonConfigs = [
  { text: "Type Chart", href: "/typechart", bg: "linear-gradient(135deg, #e48dff, #c300ff)" },
  { text: "Chat", href: "/chat", bg: "linear-gradient(135deg, #eaa78f, #c96e4e)" },
  { text: "Moves/Abilities", href: "/hurty", bg: "linear-gradient(135deg, #ffbc62, #ff9200)" },
  { text: "Credits", href: "/credtrix", bg: "linear-gradient(135deg, #ffd0d0, #fd9595)" },
]

export default function MainMenuPage() {
  useEffect(() => {
    document.title = "Erm Ma Ha Sigma"
    document.body.className = ""
    document.body.setAttribute('style', "align-items: center")

    let switcherooActive = false
    let skipTargetRight = false
    let skipMoveToken = 0
    let skipCrossTimeoutId
    let skipSettleTimeoutId
    let switcherooClickTimes = []

    function updateButtonPositions() {
      const positions = switcherooActive ? switchedPositions : normalPositions

      positions.forEach((pos, index) => {
        const overlayBtn = document.getElementById(`btn${index + 1}`)
        if (!overlayBtn) return

        overlayBtn.style.top = pos.top
        overlayBtn.style.left = pos.left
      })
    }

    function updateButtons() {
      const capsuleImg = document.getElementById("capsule-img")
      const switchImg = document.getElementById("switcheroo-btn")

      if (capsuleImg) {
        capsuleImg.src = switcherooActive
          ? "assets/images/ui/Animated_Capsule_Back.gif"
          : "assets/images/ui/Animated_Capsule.gif"
      }

      if (switchImg) {
        switchImg.src = switcherooActive
          ? "assets/images/ui/WorseSwitch.png"
          : "assets/images/ui/BadSwitch.png"
      }

      updateButtonPositions()

      const configs = switcherooActive ? switchedButtonConfigs : normalButtonConfigs

      configs.forEach((cfg, index) => {
        const overlayBtn = document.getElementById(`btn${index + 1}`)
        const altBtn = document.getElementById(`btn${index + 1}-alt`)

        if (overlayBtn) {
          overlayBtn.textContent = cfg.text
          overlayBtn.style.background = cfg.bg
          overlayBtn.setAttribute('href', cfg.href)
        }

        if (altBtn) {
          altBtn.textContent = cfg.text
          altBtn.style.background = cfg.bg
          altBtn.parentElement?.setAttribute('href', cfg.href)
        }
      })
    }

    function getSkipMetrics(skipRunner) {
      const capsuleContainer = skipRunner.parentElement
      const capsuleStyles = window.getComputedStyle(capsuleContainer)
      const capsuleWidth = parseFloat(capsuleStyles.getPropertyValue("--capsule-width")) || 400
      const leftPoint = parseFloat(capsuleStyles.getPropertyValue("--skip-left-point")) || -80
      const rightPoint = parseFloat(capsuleStyles.getPropertyValue("--skip-right-point")) || (capsuleWidth + 80)

      return {
        leftAnchor: leftPoint,
        rightAnchor: rightPoint,
        crossPoint: capsuleWidth / 2,
      }
    }

    function getSkipLeft(skipRunner) {
      const capsuleContainer = skipRunner.parentElement
      const runnerRect = skipRunner.getBoundingClientRect()
      const containerRect = capsuleContainer.getBoundingClientRect()

      return (runnerRect.left - containerRect.left) + (runnerRect.width / 2)
    }

    function triggerSkipRun() {
      const skipRunner = document.getElementById("skip-runner")
      const skipImgLeft = document.getElementById("skip-img-left")
      const skipImgRight = document.getElementById("skip-img-right")

      if (!skipRunner || !skipImgLeft || !skipImgRight) return

      const { leftAnchor, rightAnchor, crossPoint } = getSkipMetrics(skipRunner)
      const nextTargetRight = !skipTargetRight
      const moveToken = ++skipMoveToken
      const startLeft = getSkipLeft(skipRunner)
      const endLeft = nextTargetRight ? rightAnchor : leftAnchor
      const totalDistance = Math.abs(endLeft - startLeft)
      const travelDurationMs = totalDistance === 0
        ? 0
        : Math.round((totalDistance / SKIP_PIXELS_PER_SECOND) * 1000)

      skipTargetRight = nextTargetRight
      skipImgLeft.classList.toggle("is-visible", !nextTargetRight)
      skipImgRight.classList.toggle("is-visible", nextTargetRight)

      window.clearTimeout(skipCrossTimeoutId)
      window.clearTimeout(skipSettleTimeoutId)
      skipRunner.style.transition = "none"
      skipRunner.classList.remove("skip-front", "skip-behind", "is-moving")
      skipRunner.style.left = `${startLeft}px`
      void skipRunner.offsetWidth
      skipRunner.classList.add("skip-front")
      skipRunner.style.transition = `left ${travelDurationMs}ms linear`
      skipRunner.classList.add("is-moving")
      skipRunner.classList.remove("skip-left", "skip-right")
      skipRunner.style.left = `${endLeft}px`

      if (
        (startLeft <= crossPoint && endLeft >= crossPoint) ||
        (startLeft >= crossPoint && endLeft <= crossPoint)
      ) {
        const distanceToCenter = Math.abs(crossPoint - startLeft)
        const crossDelay = totalDistance === 0
          ? 0
          : Math.round((distanceToCenter / totalDistance) * travelDurationMs)

        skipCrossTimeoutId = window.setTimeout(() => {
          if (moveToken !== skipMoveToken) return
          switcherooActive = !switcherooActive
          updateButtons()
        }, crossDelay)
      }

      skipSettleTimeoutId = window.setTimeout(() => {
        if (moveToken !== skipMoveToken) return
        skipRunner.classList.remove("is-moving", "skip-left", "skip-right")
        skipRunner.classList.add(nextTargetRight ? "skip-right" : "skip-left")
        skipRunner.style.transition = "none"
        skipRunner.style.left = `${endLeft}px`
      }, travelDurationMs)
    }

    function triggerSwitcheroo() {
      triggerSkipRun()

      const now = performance.now()
      switcherooClickTimes.push(now)
      switcherooClickTimes = switcherooClickTimes.filter(time => now - time <= GUESS_WHO_CLICK_WINDOW_MS)

      if (switcherooClickTimes.length >= GUESS_WHO_UNLOCK_CLICKS) {
        sessionStorage.setItem("upro_guesswho_unlocked", "true")

        if (typeof window.uproNavigate === "function") {
          window.uproNavigate("/normal")
        } else {
          window.location.href = "/normal"
        }
      }
    }

    updateButtons()

    const switcherooBtn = document.getElementById("switcheroo-btn")
    switcherooBtn?.addEventListener("click", triggerSwitcheroo)

    return () => {
      switcherooBtn?.removeEventListener("click", triggerSwitcheroo)
      window.clearTimeout(skipCrossTimeoutId)
      window.clearTimeout(skipSettleTimeoutId)
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
