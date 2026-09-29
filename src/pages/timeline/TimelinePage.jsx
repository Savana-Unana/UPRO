import { useEffect, useRef, useState } from 'react'
import './timeline.css'

const destinations = new Map([
  ['glitched 0ut', '/ost'],
  ['michael', '/ost'],
  ['octoking', '/ost'],
  ['eliav', '/ost'],
  ['arifilms', '/ost'],
  ['ari', '/ost'],
  ['mark', '/normal'],
  ['masrich', '/catalog'],
  ['smogsworth', '/catalog'],
  ['ariel', '/'],
  ['amo', '/'],
  ['amorayah', '/'],
  ['ivri', '/'],
  ['irvi', '/'],
  ['aviva', '/'],
  ['shaina', '/'],
  ['tal', '/'],
])

function navigateTo(path) {
  if (typeof window.uproNavigate === 'function' && window.uproNavigate(path)) return
  window.location.href = path
}

export default function TimelinePage() {
  const [username, setUsername] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [mode, setMode] = useState('terminal')
  const [status, setStatus] = useState('')
  const [chipDrops, setChipDrops] = useState(0)
  const inputRef = useRef(null)
  const staticAudioRef = useRef(null)

  useEffect(() => {
    document.title = 'ʘ'
    document.body.className = 'timeline-page'
    document.body.setAttribute('style', '')

    return () => {
      staticAudioRef.current?.pause()
    }
  }, [])

  function refocusInput() {
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function submitUsername(event) {
    event.preventDefault()
    const name = username.trim().toLowerCase()
    setUsername('')

    if (name === 'jakedacake' || name === 'jake') {
      setMode('basic')
      setStatus('')
      refocusInput()
      return
    }

    if (name === 'randy') {
      setMode('yellow')
      setStatus('')
      refocusInput()
      return
    }

    if (name === 'marvin') {
      setStatus('accepted')
      refocusInput()
      return
    }

    if (name === 'shane' || name === 'cran_bot') {
      window.location.assign('https://www.google.com/')
      return
    }

    if (name === 'randal') {
      window.location.assign('https://savana-unana.github.io/Mall/')
      return
    }

    if (name === 'skip') {
      if (!staticAudioRef.current) {
        staticAudioRef.current = new Audio('assets/audio/static.mp3')
      }

      staticAudioRef.current.volume = 0.05
      staticAudioRef.current.currentTime = 0
      staticAudioRef.current.play().catch(() => {})
      setStatus('')
      refocusInput()
      return
    }

    if (name === 'chip') {
      setChipDrops(currentDrops => currentDrops + 1)
      setStatus('')
      refocusInput()
      return
    }

    if (name === 'kal') {
      window.location.reload()
      return
    }

    const destination = destinations.get(name)
    if (destination) {
      navigateTo(destination)
      return
    }

    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    setStatus('incorrect')

    if (nextAttempts >= 3) {
      navigateTo('/')
      return
    }

    refocusInput()
  }

  return (
    <main className={`timeline-shell is-${mode}`}>
      <section className="timeline-login" aria-labelledby="timeline-prompt">
        <h1 id="timeline-prompt">Please Enter Username</h1>
        <form className="timeline-form" onSubmit={submitUsername}>
          <input
            ref={inputRef}
            className="timeline-input"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            aria-label="Username"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck="false"
            autoFocus
          />
          <button className="timeline-enter" type="submit" style={{ marginTop: `${chipDrops * 10}px` }}>Enter</button>
        </form>
        <p className={`timeline-status ${status ? `is-${status}` : ''}`} aria-live="polite">
          {status === 'accepted' ? 'Accepted!' : status === 'incorrect' ? 'Incorrect.' : ''}
        </p>
      </section>
    </main>
  )
}
