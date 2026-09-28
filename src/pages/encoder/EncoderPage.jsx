import { useEffect, useState } from 'react'
import { fetchMateBuckets } from '../../utils/mateData'
import './encoder.css'

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export default function EncoderPage() {
  const [screen, setScreen] = useState('menu')
  const [cards, setCards] = useState([])
  const [code, setCode] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [status, setStatus] = useState('')
  const [showRoles, setShowRoles] = useState(false)

  useEffect(() => {
    document.title = 'Encoder'
    document.body.className = 'encoder-page'
    document.body.setAttribute('style', '')
  }, [])

  const makeBoard = async () => {
    const buckets = await fetchMateBuckets()
    const pool = shuffle((buckets.base || []).filter((item) => {
      const image = String(item?.image || '').toLowerCase()
      const special = ['missingno', 'ones', 'mos.png', 'mois.png', 'l.mos.png'].some(marker => image.includes(marker) || String(item?.name || '').toLowerCase() === marker)
      return item?.name && image.includes('assets/images/mates/base/') && !special
    }))
    const selected = pool.slice(0, 25)
    const roles = shuffle([...Array(10).fill('green'), ...Array(3).fill('red'), ...Array(12).fill('neutral')])
    setCards(selected.map((item, index) => ({ ...item, role: roles[index], revealed: false })))
    const nextCode = Math.random().toString(36).slice(2, 8).toUpperCase()
    setCode(nextCode)
    setShowRoles(true)
    setScreen('game')
  }

  const join = () => {
    if (!joinCode.trim()) return setStatus('Enter a game code first.')
    setCode(joinCode.trim().toUpperCase())
    setShowRoles(false)
    setStatus('Joined as an uncolored player view.')
    setScreen('game')
  }

  return <main className="encoder-shell">
    <a className="encoder-back" href="/normal">◀ Main Menu</a>
    {screen === 'menu' && <section className="encoder-menu">
      <h1>Encoder</h1><p>Encode the board. Find the ten green animates and avoid the three red ones.</p>
      <button onClick={makeBoard}>Create Game</button>
      <button onClick={() => setScreen('join')}>Join Game</button>
    </section>}
    {screen === 'join' && <section className="encoder-panel"><h2>Join Game</h2><input value={joinCode} onChange={(event) => setJoinCode(event.target.value)} placeholder="Game code" /><button onClick={join}>Join</button><button onClick={() => setScreen('menu')}>Back</button><p>{status}</p></section>}
    {screen === 'game' && <section className="encoder-game"><header><h2>Encoder</h2><span>Game code: {code}</span><button onClick={() => setScreen('menu')}>Leave</button></header><div className="encoder-grid">{cards.map((card) => <button key={`${card.name}-${card.image}`} className={`encoder-card ${(showRoles || card.revealed) ? card.role : ''}`} onClick={() => setCards((current) => current.map((item) => item === card ? { ...item, revealed: !item.revealed } : item))}><img src={card.image} alt="" /><span>{card.name}</span></button>)}</div></section>}
  </main>
}
