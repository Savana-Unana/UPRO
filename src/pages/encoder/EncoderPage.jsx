import { useEffect, useState } from 'react'
import { fetchMateBuckets } from '../../utils/mateData'
import './encoder.css'

function createRandom(seedText) {
  let seed = 2166136261
  for (const character of seedText) {
    seed ^= character.charCodeAt(0)
    seed = Math.imul(seed, 16777619)
  }
  return () => {
    seed += 0x6D2B79F5
    let value = seed
    value = Math.imul(value ^ value >>> 15, value | 1)
    value ^= value + Math.imul(value ^ value >>> 7, value | 61)
    return ((value ^ value >>> 14) >>> 0) / 4294967296
  }
}

function shuffle(items, random = Math.random) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]]
  }
  return shuffled
}

export default function EncoderPage() {
  const [screen, setScreen] = useState('menu')
  const [cards, setCards] = useState([])
  const [code, setCode] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [status, setStatus] = useState('')
  const [showRoles, setShowRoles] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [gameStatus, setGameStatus] = useState('')
  const [turn, setTurn] = useState(1)
  const [turnMessage, setTurnMessage] = useState('Choose a card or stop guessing.')

  useEffect(() => {
    document.title = 'Encoder'
    document.body.className = 'encoder-page'
    document.body.setAttribute('style', '')
  }, [])

  const getPool = async () => {
    const buckets = await fetchMateBuckets()
    return (buckets.base || []).filter((item) => {
      const image = String(item?.image || '').toLowerCase()
      const special = ['missingno', 'ones', 'mos.png', 'mois.png', 'l.mos.png'].some(marker => image.includes(marker) || String(item?.name || '').toLowerCase() === marker)
      return item?.name && image.includes('assets/images/mates/base/') && !special
    })
  }

  const loadBoard = async (gameCode, host) => {
    const normalizedCode = gameCode.trim().toUpperCase()
    const pool = shuffle(await getPool(), createRandom(`${normalizedCode}:board`))
    const selected = pool.slice(0, 25)
    const roles = shuffle([...Array(10).fill('green'), ...Array(3).fill('red'), ...Array(11).fill('neutral'), 'black'], createRandom(`${normalizedCode}:roles`))
    setCards(selected.map((item, index) => ({ ...item, role: roles[index], crossedOut: false, selected: false })))
    setCode(normalizedCode)
    setShowRoles(host)
    setIsHost(host)
    setGameStatus('')
    setTurn(1)
    setTurnMessage('Choose a card or stop guessing.')
    setScreen('game')
  }

  const makeBoard = async () => {
    const nextCode = Math.random().toString(36).slice(2, 8).toUpperCase()
    await loadBoard(nextCode, true)
  }

  const join = async () => {
    if (!joinCode.trim()) return setStatus('Enter a game code first.')
    await loadBoard(joinCode, false)
    setStatus('Joined as an uncolored player view.')
  }

  const finishTurn = (reason) => {
    if (turn >= 7) {
      setGameStatus('You lose! All seven turns have been used.')
      return
    }
    setTurn(current => current + 1)
    setTurnMessage(`${reason} Turn ${turn + 1} begins.`)
  }

  const stopGuessing = () => {
    if (!gameStatus) finishTurn('The player stopped guessing.')
  }

  const toggleCard = (target) => {
    if (gameStatus) return
    setCards((current) => {
      if (isHost ? target.crossedOut : target.selected) return current
      const next = current.map((item) => item === target
        ? isHost ? { ...item, crossedOut: true } : { ...item, selected: true }
        : item)
      const chosen = next.filter(item => isHost ? item.crossedOut : item.selected)
      if (chosen.some(item => item.role === 'black')) setGameStatus('You lose! The Black animate was selected.')
      else if (chosen.filter(item => item.role === 'red').length >= 2) setGameStatus('You lose! Two Red animates were selected.')
      else if (chosen.filter(item => item.role === 'green').length === 10) setGameStatus('You win! All ten Green animates were selected.')
      else if (target.role === 'red') finishTurn('A Red animate ended the turn.')
      else if (target.role === 'neutral') finishTurn('A Neutral animate ended the turn.')
      else setTurnMessage('Green! The player may keep guessing or stop.')
      return next
    })
  }

  return <main className="encoder-shell">
    <a className="encoder-back" href="/normal">◀ Main Menu</a>
    {screen === 'menu' && <section className="encoder-menu">
      <h1>Encoder</h1><p>Find all ten Green animates. Avoid two Reds and the Black animate.</p>
      <button onClick={makeBoard}>Create Game</button>
      <button onClick={() => setScreen('join')}>Join Game</button>
      <button onClick={() => setScreen('instructions')}>Instructions</button>
    </section>}
    {screen === 'instructions' && <section className="encoder-panel encoder-instructions"><h2>How to Play</h2><ol><li>One player creates a game and sends the displayed code to their teammate.</li><li>The host sees every role. The teammate sees the same board without its colors.</li><li>Players may communicate using only one or two words at a time.</li><li>A player may keep selecting cards for as long as they choose during their turn.</li><li>Each selected card reveals its color. Green allows the turn to continue.</li><li>The player may stop guessing voluntarily. Selecting a Neutral or Red animate also ends the turn.</li><li>Select all ten Green animates to win.</li><li>Selecting two Red animates loses the game.</li><li>Selecting the Black animate loses the game immediately.</li><li>The team has a maximum of seven turns.</li><li>The host can cross out each animate their teammate selects.</li></ol><button onClick={() => setScreen('menu')}>Back</button></section>}
    {screen === 'join' && <section className="encoder-panel"><h2>Join Game</h2><input value={joinCode} onChange={(event) => setJoinCode(event.target.value)} placeholder="Game code" /><button onClick={join}>Join</button><button onClick={() => setScreen('menu')}>Back</button><p>{status}</p></section>}
    {screen === 'game' && <section className="encoder-game"><header><h2>Encoder</h2><span>Game code: {code}</span><span>Turn {turn}/7</span><span>{turnMessage}</span><button onClick={stopGuessing}>Stop Guessing</button><button onClick={() => setScreen('menu')}>Leave</button></header>{gameStatus && <div className={`encoder-result ${gameStatus.startsWith('You win') ? 'win' : 'lose'}`}>{gameStatus}</div>}<div className="encoder-grid">{cards.map((card) => <button key={`${card.name}-${card.image}`} className={`encoder-card ${(showRoles || card.selected) ? card.role : ''} ${card.crossedOut ? 'crossed-out' : ''} ${card.selected ? 'selected' : ''}`} onClick={() => toggleCard(card)}><img src={card.image} alt="" /><span>{card.name}</span></button>)}</div></section>}
  </main>
}
