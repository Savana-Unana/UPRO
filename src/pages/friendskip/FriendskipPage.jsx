import { useEffect, useMemo, useState } from 'react'
import './friendskip.css'

export default function FriendskipPage() {
  const [npcs, setNpcs] = useState([])
  const [order, setOrder] = useState([])
  const [view, setView] = useState('contents')
  const [index, setIndex] = useState(0)
  const [costumeMode, setCostumeMode] = useState(false)
  const [dragStart, setDragStart] = useState(null)

  useEffect(() => {
    document.title = 'Friendskip'
    document.body.className = 'friendskip-page'
    document.body.setAttribute('style', '')
    Promise.all([
      fetch('/data/Friends/npc.json').then((response) => response.json()),
      fetch('/data/Friends/npcorder.json').then((response) => response.json()),
    ]).then(([entries, names]) => {
      setNpcs(Array.isArray(entries) ? entries : [])
      setOrder(Array.isArray(names) ? names : [])
    }).catch(() => {
      setNpcs([])
      setOrder([])
    })
  }, [])

  const orderedNpcs = useMemo(() => {
    const byName = new Map(npcs.map((npc) => [npc.name, npc]))
    const listed = order.map((name) => byName.get(name)).filter(Boolean)
    return [...listed, ...npcs.filter((npc) => !order.includes(npc.name))]
  }, [npcs, order])

  const npc = orderedNpcs[index]
  const costume = npc?.costumes?.[0]
  const displayName = (value) => value?.replace(/Skip/g, 'Me').replace(/skip/g, 'me')
  const move = (amount) => {
    setIndex((current) => Math.max(0, Math.min(Math.max(orderedNpcs.length - 1, 0), current + amount)))
  }
  const openNpc = (nextIndex) => {
    setIndex(nextIndex)
    setView('npc')
    setCostumeMode(false)
  }
  const previousPage = () => {
    if (view === 'contents') {
      window.location.href = '/'
      return
    }
    if (costumeMode) {
      setCostumeMode(false)
      return
    }
    if (index === 0) {
      setView('contents')
      return
    }
    move(-1)
  }
  const turnFromPage = (direction) => {
    if (direction < 0) previousPage()
    else if (view === 'contents') openNpc(0)
    else move(1)
  }
  const onPointerDown = (event) => setDragStart(event.clientX)
  const onPointerUp = (event) => {
    if (dragStart == null) return
    const distance = event.clientX - dragStart
    if (Math.abs(distance) > 40) move(distance < 0 ? 1 : -1)
    setDragStart(null)
  }

  return (
    <main className="friendskip-shell">
      <a href="/"><button type="button">Main Menu</button></a>
      <section className="friendskip-book" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        {view === 'contents' ? (
          <div className="friendskip-spread friendskip-contents">
            <article className="friendskip-page-sheet" onClick={() => turnFromPage(-1)}>
              <h2>Friendskip Tracker</h2>
              <div className="friendskip-list">
                {orderedNpcs.map((entry, entryIndex) => (
                  <button key={`${entry.name}-${entryIndex}`} onClick={(event) => { event.stopPropagation(); openNpc(entryIndex) }}>
                    <span className="friendskip-entry-name">{displayName(entry.name)}</span><span className="friendskip-entry-leader" aria-hidden="true" /><span className="friendskip-entry-page">{entryIndex * 2 + 2}</span>
                  </button>
                ))}
              </div>
            </article>
            <article className="friendskip-page-sheet friendskip-contents-right" aria-hidden="true" onClick={() => turnFromPage(1)} />
          </div>
        ) : (
          <div key={`${view}-${index}-${costumeMode}`} className="friendskip-spread friendskip-turn">
            {costumeMode ? (
              <>
                <article className="friendskip-page-sheet friendskip-costume-page" onClick={() => turnFromPage(-1)}>
                  <button className="friendskip-bookmark left" onClick={() => setCostumeMode(false)}>NPC</button>
                  <h2>{costume?.name || `${npc?.name || 'NPC'} Costume`}</h2>
                  {costume?.drawing && <img className="friendskip-drawing" src={costume.drawing} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}
                  <p className="friendskip-hand">{costume?.opinion || ''}</p>
                  <div className="friendskip-normal">
                    <p><b>Reference:</b> {costume?.reference || '—'}</p>
                    <p><b>First Obtainable Update:</b> {costume?.firstObtainableUpdate || '—'}</p>
                    <p><b>Obtainment:</b> {costume?.obtainment || '—'}</p>
                  </div>
                  {costume?.sprite && <img className="friendskip-sprite" src={costume.sprite} alt={costume.name || 'Costume'} />}
                  <p className="friendskip-hand">{costume?.callside || ''}</p>
                </article>
                <article className="friendskip-page-sheet" onClick={() => turnFromPage(1)}><h2>Costume Notes</h2><p className="friendskip-hand">Add notes here.</p></article>
              </>
            ) : (
              <>
                <article className="friendskip-page-sheet" onClick={() => turnFromPage(-1)}>
                  {npc?.costumes?.length > 0 && <button className="friendskip-bookmark top" onClick={() => setCostumeMode(true)}>Costumes</button>}
                  <h2>{displayName(npc?.name) || 'NPC'}</h2>
                  <div className="friendskip-profile"><div>
                    {npc?.drawing && <img className="friendskip-drawing" src={npc.drawing} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}
                  </div><div className="friendskip-normal"><p><b>Height:</b> {npc?.height || '—'}</p><p><b>Age:</b> {npc?.age || '—'}</p></div></div>
                  <div className="friendskip-levels">{Object.entries(npc?.levels || {}).map(([level, text]) => <p key={level} className="friendskip-hand">Level {level}: {text}</p>)}</div>
                </article>
                <article className="friendskip-page-sheet" onClick={() => turnFromPage(1)}>
                  <h3>Quests</h3>
                  {npc?.quests?.map((quest, questIndex) => <div className="friendskip-quest" key={questIndex}><p><b>Goal:</b> {quest.goal || ''}</p><p><b>Reward:</b> {quest.reward || ''}</p></div>)}
                  <h3>Schedule</h3><p className="friendskip-hand friendskip-schedule">{npc?.schedule || ''}</p>
                  {npc?.sprite && <img className="friendskip-sprite" src={npc.sprite} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}
                </article>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
