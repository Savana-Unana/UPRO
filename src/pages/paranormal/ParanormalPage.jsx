import { useEffect } from 'react'

export default function ParanormalPage() {
  useEffect(() => {
    document.title = 'Paranormal Mode'
    document.body.className = 'normal-hub-page paranormal-hub-page'
    document.body.setAttribute('style', '')
  }, [])

  return <div className="upro-page-root">
    <main className="normal-hub-shell paranormal-hub-shell">
      <div className="normal-hub-grid" aria-label="Paranormal mode menu">
        <a className="normal-hub-tile paranormal-hub-magenta" href="/construction" aria-label="Under Construction" />
        <a className="normal-hub-tile paranormal-hub-cyan" href="/construction" aria-label="Under Construction" />
        <a className="normal-hub-tile paranormal-hub-aqua" href="/construction" aria-label="Under Construction" />
        <a className="normal-hub-tile paranormal-hub-orange-orange" href="/sudupro">
          <span>SudUPRO</span>
        </a>
      </div>
      <a className="normal-hub-center-button" href="/normal" aria-label="Return to Normal Mode">
        <img src="assets/images/ui/WorseSwitch.png" alt="Reverse" className="normal-hub-center-image" />
      </a>
    </main>
  </div>
}
