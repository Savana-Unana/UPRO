import { useEffect, useState } from 'react'
import './media.css'

const playlistId = 'PLB__2Z9D7u_U'

export default function MediaPage() {
  const [posts, setPosts] = useState([])
  const [postError, setPostError] = useState('')
  useEffect(() => {
    document.title = 'Socials'
    document.body.className = 'media-page'
    document.body.setAttribute('style', '')
  }, [])

  useEffect(() => {
    fetch('data/media/x-posts.json')
      .then(async response => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error || 'Unable to load X posts')
        return body
      })
      .then(body => setPosts(Array.isArray(body.data) ? body.data : []))
      .catch(error => setPostError(error.message))
  }, [])

  const sendYoutubeCommand = (func) => {
    document.getElementById('media-youtube-frame')?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*')
  }

  return (
    <main className="media-shell">
      <a className="media-back" href="/">Main Menu</a>
      <h1>Media</h1>
      <section className="media-feeds">
        <div className="media-panel media-feed">
          <h2>YouTube</h2>
          <iframe
            id="media-youtube-frame"
            className="media-youtube"
            src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&index=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
            title="UPRO YouTube playlist"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <div className="media-controls"><button type="button" onClick={() => sendYoutubeCommand('previousVideo')} aria-label="Previous video">←</button><button type="button" onClick={() => sendYoutubeCommand('nextVideo')} aria-label="Next video">→</button></div>
        </div>
        <div className="media-panel media-feed">
          <h2>X Posts</h2>
          <div className="media-x-text">
            {posts.length ? posts.map(post => <article className="media-post" key={post.id}>{post.text}</article>) : (postError || 'X posts are not configured yet.')}
          </div>
        </div>
      </section>
    </main>
  )
}
