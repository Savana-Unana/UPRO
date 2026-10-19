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

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdMBtvITZc_PWwlQzZMU3H2JivtIkdkfn7ZB0Y6UvxXeZUIWXRsHOY01iN117fVkknjw/exec'

const starQuestionnaire = {
  outside: {
    prompt: 'Are the stars outside?',
    choices: [
      { label: 'Yes', next: 'falling' },
      { label: 'No', next: 'missing' },
    ],
  },
  falling: {
    prompt: 'Are the stars falling?',
    choices: [
      { label: 'Yes', next: 'sky' },
      { label: 'No', next: 'missing' },
    ],
  },
  missing: {
    prompt: 'Are the stars missing?',
    choices: [
      { label: 'Yes', message: 'Well then, you should begin to open your eyes.' },
      { label: 'No', next: 'identifiable' },
    ],
  },
  sky: {
    prompt: 'Are the stars still in the sky?',
    choices: [
      { label: 'Yes', message: 'Well then, we still have time.' },
      { label: 'No', next: 'ground' },
    ],
  },
  identifiable: {
    prompt: 'Are the stars identifiable?',
    choices: [
      { label: 'Yes', next: 'star' },
      { label: 'No', message: 'Then they might as well be missing.' },
    ],
  },
  ground: {
    prompt: 'Are the stars on the ground?',
    choices: [
      { label: 'Yes', message: '"Canis 9 Major"' },
      { label: 'No', next: 'perfect' },
    ],
  },
  star: {
    prompt: 'Can I be a star?',
    choices: [
      { label: 'Yes', next: 'definition' },
      { label: 'No', message: 'I apologize.' },
    ],
  },
  perfect: {
    prompt: 'Are the stars perfect?',
    choices: [
      { label: 'Yes', message: 'Thank you. I forgive you, if you forgive me for wasting your time.' },
      { label: 'No', message: "You're wrong." },
    ],
  },
  definition: {
    prompt: 'What is a star?',
    response: true,
  },
}

function navigateTo(path) {
  if (typeof window.uproNavigate === 'function' && window.uproNavigate(path)) return
  window.location.href = path
}

async function sendStarResponse(answer) {
  const body = new URLSearchParams({
    action: 'historyResponse',
    question: starQuestionnaire.definition.prompt,
    answer,
  })

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: body.toString(),
    keepalive: true,
    signal: AbortSignal.timeout(30000),
  })

  if (!response.ok) throw new Error('Unable to save your answer. Please try again.')
  const result = await response.json()
  if (result.ok !== true || result.sheet !== 'History Responses') {
    throw new Error(result.error === 'Invalid payload.'
      ? 'The response form is unavailable. Your answer has not been saved.'
      : 'Unable to confirm your answer was saved. Please try again.')
  }
}

export default function TimelinePage() {
  const [username, setUsername] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [mode, setMode] = useState('terminal')
  const [status, setStatus] = useState('')
  const [chipDrops, setChipDrops] = useState(0)
  const [starStep, setStarStep] = useState(() => (Math.floor(Math.random() * 30) === 0 ? 'outside' : ''))
  const [starMessage, setStarMessage] = useState('')
  const [starAnswer, setStarAnswer] = useState('')
  const [starSending, setStarSending] = useState(false)
  const [starError, setStarError] = useState('')
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

  function chooseStarPath(choice) {
    if (choice.message) {
      setStarMessage(choice.message)
      setStarStep('')
      return
    }

    setStarStep(choice.next)
  }

  async function submitStarAnswer(event) {
    event.preventDefault()

    const answer = starAnswer.trim()
    if (!answer || starSending) return

    setStarSending(true)
    setStarError('')
    try {
      await sendStarResponse(answer)
      setStarMessage('You are a star.')
      setStarAnswer('')
      setStarStep('')
    } catch (error) {
      setStarError(error instanceof Error && error.name === 'Error'
        ? error.message
        : 'Unable to confirm your answer was saved. Please try again.')
    } finally {
      setStarSending(false)
    }
  }

  const starQuestion = starStep ? starQuestionnaire[starStep] : null
  const shellMode = starQuestion || starMessage ? 'yellow' : mode

  return (
    <main className={`timeline-shell is-${shellMode}`}>
      <button className="timeline-exit" type="button" onClick={() => navigateTo('/')}>
        Exit
      </button>
      {starQuestion || starMessage ? (
        <section className="timeline-login timeline-questionnaire" aria-labelledby="timeline-question">
          {starQuestion ? (
            <>
              <h1 id="timeline-question">{starQuestion.prompt}</h1>
              {starQuestion.response ? (
                <form className="timeline-form timeline-response-form" onSubmit={submitStarAnswer}>
                  <input
                    className="timeline-input"
                    type="text"
                    value={starAnswer}
                    disabled={starSending}
                    onChange={(event) => setStarAnswer(event.target.value)}
                    aria-label="Text response"
                    autoComplete="off"
                    spellCheck="false"
                    autoFocus
                  />
                  <button className="timeline-enter" type="submit" disabled={starSending || !starAnswer.trim()}>
                    {starSending ? 'Sending...' : 'Send'}
                  </button>
                  <p className="timeline-status is-incorrect" role="alert">{starError}</p>
                </form>
              ) : (
                <div className="timeline-choices" role="group" aria-label={starQuestion.prompt}>
                  {starQuestion.choices.map((choice, index) => (
                    <button
                      className="timeline-choice"
                      type="button"
                      key={choice.label}
                      onClick={() => chooseStarPath(choice)}
                    >
                      <span>{index + 1}.</span>
                      {choice.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h1 id="timeline-question" className="timeline-message">
                {starMessage}
              </h1>
            </>
          )}
        </section>
      ) : (
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
      )}
    </main>
  )
}
