import { useEffect } from 'react'

const pageStyles = ""
function runPageScript() {
  const guessWhoLink = document.getElementById("normalHubGuessWho");

  if (guessWhoLink) {
    guessWhoLink.addEventListener("click", () => {
      sessionStorage.setItem("upro_guesswho_unlocked", "true");
    });
  }
}
const remoteScripts = []
const mainMenuHref = import.meta.env.BASE_URL || '/'

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

export default function NormalPage() {
  useEffect(() => {
    document.title = "Normal Mode"
    document.body.className = "normal-hub-page"
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
      <div className="upro-page-root"><main className="normal-hub-shell">
    <div className="normal-hub-grid" aria-label="Hidden mode menu">
      <a className="normal-hub-tile normal-hub-green" href="/guesswho" id="normalHubGuessWho">
        <span>Guess Who</span>
      </a>
      <a className="normal-hub-tile normal-hub-red" href="/guessr">
        <span>Guessr</span>
      </a>
      <button className="normal-hub-tile normal-hub-yellow" type="button" aria-disabled="true">
        <span>Coming Soon</span>
      </button>
      <a className="normal-hub-tile normal-hub-blue" href="/upro-rdle">
        <span>UPROrdle</span>
      </a>
    </div>
    <a className="normal-hub-center-button" href={mainMenuHref} aria-label="Back to main page">
      <img src="assets/images/ui/BadSwitch.png" alt="Switcheroo" className="normal-hub-center-image" />
    </a>
  </main></div>
    </>
  )
}
