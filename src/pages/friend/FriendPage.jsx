import { useEffect } from 'react'

const pageStyles = "/* Center the video on the page */\r\n        .video-container {\r\n            display: flex;\r\n            justify-content: center;\r\n            margin-top: 20px;\r\n        }"
function runPageScript() {

}
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

export default function FriendPage() {
  useEffect(() => {
    document.title = "Friend In Us"
    document.body.className = ""
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
      <div className="upro-page-root"><h1 style={{textAlign: 'center'}}>There is a Friend in ME</h1>
  <div style={{display: 'flex', justifyContent: 'center'}}>
    <div id="nav-btn">
      <a href="/">
        <button>Main Menu</button>
      </a>
    </div>
  </div>
  <div className="video-container">
    <video width={640} height={360} autoPlay loop>
      <source src="assets/images/ui/Friend.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div></div>
    </>
  )
}
