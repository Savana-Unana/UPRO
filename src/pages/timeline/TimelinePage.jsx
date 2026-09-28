import { useEffect } from 'react'
import './timeline.css'

export default function TimelinePage() {
  useEffect(() => {
    document.title = 'Timeline'
    document.body.className = 'timeline-page'
    document.body.setAttribute('style', '')
  }, [])

  return (
    <main className="timeline-shell">
      <a className="timeline-back" href="/">Main Menu</a>
      <h1>Timeline</h1>
      <section className="timeline-empty" aria-label="Timeline events">
        <p>No timeline events yet.</p>
      </section>
    </main>
  )
}
