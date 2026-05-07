import { useEffect, useRef } from 'react'

const pageStyles = `body {
  background-color: #111;
  color: red;
  font-family: papyrus;
  font-size: 3rem;
  height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}`

export default function ConstructionPage() {
  const audioRef = useRef(null)

  useEffect(() => {
    document.title = 'Under Construction'
    document.body.className = ''
    document.body.setAttribute('style', '')

    const audio = audioRef.current
    let musicStarted = false

    function tryPlayMusic() {
      if (!audio || musicStarted) return

      audio.play().then(() => {
        musicStarted = true
        document.removeEventListener('mousemove', tryPlayMusic)
      }).catch(() => {})
    }

    audio?.play().catch(() => {
      document.addEventListener('mousemove', tryPlayMusic)
    })

    return () => {
      document.removeEventListener('mousemove', tryPlayMusic)

      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [])

  return (
    <>
      <style>{pageStyles}</style>
      <div className="upro-page-root">
        <div style={{ display: 'flex' }}>
          <div id="nav-btn">
            <a href="/">
              <button>Main Menu</button>
            </a>
          </div>
        </div>
        Under Construction
        <audio ref={audioRef} id="bg-audio" loop>
          <source src="assets/audio/construction.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </>
  )
}
