import { useEffect, useState } from 'react'
import { characters, times, selectableTimes, mergeLiveAsks } from './askData.js'
import DialogueResponse from './DialogueResponse.jsx'
import '../timeline/timeline.css'
import './asks.css'

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_ASK_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyjk7AppircS4JkwyP-8Jto8a69MCRhhqhXy4jntSpseqW1cZDMexn3Eq3pO_vIPaBNNQ/exec'

export default function AsksPage() {
  const inbox = /\/responses\/?$/i.test(window.location.pathname)
  const [character, setCharacter] = useState(characters[0])
  const [time, setTime] = useState(times[0])
  const [name, setName] = useState('')
  const [question, setQuestion] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [responses, setResponses] = useState(null)
  const [selected, setSelected] = useState(null)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    document.title = inbox ? 'Responses' : 'Asks'
    document.body.className = 'timeline-page asks-page'
    document.body.setAttribute('style', '')
  }, [inbox])

  useEffect(() => {
    if (!inbox) return
    const controller = new AbortController()
    let loading = false
    async function loadResponses() {
      if (loading || document.hidden) return
      loading = true
      try {
        const sheetUrl = new URL(GOOGLE_SCRIPT_URL)
        sheetUrl.searchParams.set('action', 'listAsks')
        sheetUrl.searchParams.set('_', Date.now())
        const [savedResult, liveResult] = await Promise.allSettled([
          fetch(`${import.meta.env.BASE_URL}data/ask.json`, { signal: controller.signal, cache: 'no-store' }),
          fetch(sheetUrl, { signal: controller.signal, cache: 'no-store' }),
        ])
        let saved = { characters: {} }
        let liveAsks = []
        let savedAvailable = false
        let liveAvailable = false
        if (savedResult.status === 'fulfilled' && savedResult.value.ok) {
          try {
            saved = await savedResult.value.json()
            savedAvailable = Boolean(saved?.characters)
          } catch { /* Try the live source below. */ }
        }
        if (liveResult.status === 'fulfilled' && liveResult.value.ok) {
          try {
            const live = await liveResult.value.json()
            if (live.ok && live.sheet === 'Asks' && Array.isArray(live.asks)) {
              liveAsks = live.asks
              liveAvailable = true
            }
          } catch { /* Fall back to committed asks below. */ }
        }
        if (!savedAvailable && !liveAvailable) throw new Error()
        setResponses(mergeLiveAsks(saved, liveAsks))
        setError('')
      } catch (error) {
        if (error.name !== 'AbortError') setError('Unable to load responses. Please try again.')
      } finally {
        loading = false
      }
    }
    function refreshWhenVisible() {
      if (!document.hidden) loadResponses()
    }
    loadResponses()
    const interval = window.setInterval(loadResponses, 30000)
    document.addEventListener('visibilitychange', refreshWhenVisible)
    return () => {
      controller.abort()
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [inbox, reload])

  async function submit(event) {
    event.preventDefault()
    if (sending || !question.trim()) return
    setSending(true)
    setError('')
    setStatus('')
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ action: 'ask', character, time, name: name.trim(), question }).toString(),
        signal: AbortSignal.timeout(30000),
      })
      if (!response.ok) throw new Error()
      const result = await response.json()
      if (!result.ok || result.sheet !== 'Asks' || !result.id) throw new Error()
      setQuestion('')
      setStatus('Your ask has been sent! Check Responses for an answer later.')
    } catch {
      setError('Your ask could not be saved. Please try again later. Your text is still here.')
    } finally {
      setSending(false)
    }
  }

  return <main className="timeline-shell asks-shell">
    <nav className="asks-nav" aria-label="Asks navigation">
      <a className="asks-button" href="/">Exit</a>
      <a className="asks-button" href={inbox ? '/asks' : '/responses'}>{inbox ? 'Asks' : 'Responses'}</a>
    </nav>
    {!inbox ? <section className="timeline-login asks-compose">
      <form onSubmit={submit}>
        <h1 className="asks-prompt">Ask{' '}
          <select aria-label="Character" value={character} disabled={sending} onChange={event => setCharacter(event.target.value)}>
            {characters.map(value => <option key={value}>{value}</option>)}
          </select>{' '}during{' '}
          <select aria-label="Moment in time" value={time} disabled={sending} onChange={event => setTime(event.target.value)}>
            {times.map(value => <option key={value} disabled={!selectableTimes.includes(value)}>{value}</option>)}
          </select>:
        </h1>
        <label htmlFor="ask-name">Name (optional)</label>
        <input id="ask-name" className="timeline-input" maxLength={80} value={name} disabled={sending}
          placeholder="Anonymous" onChange={event => setName(event.target.value)} autoComplete="nickname" />
        <label htmlFor="ask-question">Your ask</label>
        <textarea id="ask-question" className="timeline-input" rows={5} maxLength={4000} required value={question}
          disabled={sending} onChange={event => setQuestion(event.target.value)} />
        <button className="timeline-enter" disabled={sending || !question.trim()}>{sending ? 'Sending...' : 'Submit'}</button>
      </form>
      <p role="status">{status}</p>
      {error && <p role="alert">{error}</p>}
    </section> : <section className="asks-inbox" aria-labelledby="responses-heading">
      <h1 id="responses-heading">Responses</h1>
      {error ? <div role="alert">{error} <button className="asks-button" onClick={() => setReload(reload + 1)}>Retry</button></div>
        : responses === null ? <p role="status">Loading responses...</p>
          : selected ? <>
            <button className="asks-button" onClick={() => setSelected(null)}>Back to Responses</button>
            <header className="asks-message-header">
              <p>{selected.name?.trim() || 'Anonymous'} · <time dateTime={selected.date}>{new Date(selected.date).toLocaleDateString()}</time></p>
              <p>To {selected.character} during {selected.time}</p>
              <h2>{selected.question}</h2>
            </header>
            <DialogueResponse key={selected.id} cards={selected.response} />
          </> : responses.length ? <ul className="asks-messages">{responses.map(ask => <li key={ask.id}>
            <button className="asks-message" disabled={!ask.answered} onClick={() => { if (ask.answered) setSelected(ask) }}>
              <span className="asks-sender">{ask.name?.trim() || 'Anonymous'}</span>
              <span className="asks-subject">{ask.question}</span>
              <time dateTime={ask.date}>{new Date(ask.date).toLocaleDateString()}</time>
            </button>
          </li>)}</ul> : <p>No asks yet. Submitted asks will appear here after syncing.</p>}
    </section>}
  </main>
}
