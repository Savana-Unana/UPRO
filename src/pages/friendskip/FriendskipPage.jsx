import { useEffect, useMemo, useRef, useState } from 'react'
import './friendskip.css'
import { sortCostumesByUpdate } from '../../utils/costumeOrder.js'

const hasField = (entry, field) => entry != null && Object.hasOwn(entry, field)

function NpcImage({ kind, source, alt = '' }) {
  const folder = kind === 'sprite' ? 'sprites' : 'images'
  const placeholder = kind === 'sprite' ? 'YouKnowWhoIAm.gif' : 'ICantRemember.gif'
  const fallback = `${import.meta.env.BASE_URL}assets/images/npc/${folder}/${placeholder}`
  let path = String(source || '').trim().replace(/^\/?assets\/npc\//, 'assets/images/npc/')
  if (path && !path.includes('/')) path = `assets/images/npc/${folder}/${path}`
  const src = path
    ? /^(?:https?:|data:|blob:|\/)/i.test(path) ? path : `${import.meta.env.BASE_URL}${path}`
    : fallback
  return <img className={`friendskip-${kind}`} src={src} alt={alt} onError={(event) => {
    const image = event.currentTarget
    if (image.src !== new URL(fallback, window.location.href).href) image.src = fallback
  }} />
}

export default function FriendskipPage() {
  const [npcs, setNpcs] = useState([])
  const [order, setOrder] = useState([])
  const [view, setView] = useState('contents')
  const [index, setIndex] = useState(0)
  const [costumeMode, setCostumeMode] = useState(false)
  const [costumeIndex, setCostumeIndex] = useState(0)
  const gesture = useRef(null)
  const suppressClick = useRef(false)

  useEffect(() => {
    document.title = 'Friendskip'
    document.body.className = 'friendskip-page'
    document.body.setAttribute('style', '')
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/Friends/npc.json`).then((response) => response.json()),
      fetch(`${import.meta.env.BASE_URL}data/Friends/npcorder.json`).then((response) => response.json()),
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
    return [...listed, ...npcs.filter((npc) => !order.includes(npc.name))].map(npc =>
      Array.isArray(npc.costumes) ? { ...npc, costumes: sortCostumesByUpdate(npc.costumes) } : npc
    )
  }, [npcs, order])

  const npc = orderedNpcs[index]
  const costume = npc?.costumes?.[costumeIndex] || npc?.costumes?.[0]
  const displayName = (value) => value?.replace(/Skip/g, 'Me').replace(/skip/g, 'me')
  const move = (amount) => {
    setCostumeIndex(0)
    setIndex((current) => Math.max(0, Math.min(Math.max(orderedNpcs.length - 1, 0), current + amount)))
  }
  const openNpc = (nextIndex) => {
    setIndex(nextIndex)
    setView('npc')
    setCostumeMode(false)
    setCostumeIndex(0)
  }
  const costumePages = orderedNpcs.flatMap((entry, npcIndex) => (entry.costumes || []).map((_, outfitIndex) => ({ npcIndex, outfitIndex })))
  const currentCostumePage = costumePages.findIndex(page => page.npcIndex === index && page.outfitIndex === costumeIndex)
  const canPrevious = view !== 'contents'
  const canNext = view === 'contents' ? orderedNpcs.length > 0
    : view === 'costumes' ? costumePages.length > 0
    : costumeMode ? currentCostumePage < costumePages.length - 1 : index < orderedNpcs.length - 1
  const openCostumePage = (page) => {
    if (!page) return
    setIndex(page.npcIndex)
    setCostumeIndex(page.outfitIndex)
    setView('npc')
    setCostumeMode(true)
  }
  const turnFromPage = (direction) => {
    if (direction < 0 && !canPrevious || direction > 0 && !canNext) return
    if (view === 'contents') openNpc(0)
    else if (view === 'costumes') {
      if (direction < 0) setView('contents')
      else openCostumePage(costumePages[0])
    } else if (costumeMode) {
      if (direction < 0 && currentCostumePage === 0) setView('costumes')
      else openCostumePage(costumePages[currentCostumePage + direction])
    } else if (direction < 0 && index === 0) setView('contents')
    else move(direction)
  }

  return (
    <main className="friendskip-shell">
      <a href="/"><button type="button">Main Menu</button></a>
      <div className="friendskip-book-frame">
      <nav className="friendskip-bookmarks" aria-label="Book sections">
        <button type="button" className="friendskip-bookmark index-tab" aria-pressed={view === 'contents'} onClick={() => { setView('contents'); setCostumeMode(false) }}>Contents</button>
        {view === 'npc' && <button type="button" className="friendskip-bookmark npc-tab" aria-pressed={!costumeMode} onClick={() => setCostumeMode(false)}>{displayName(npc?.name)}</button>}
        <button type="button" className="friendskip-bookmark costume-tab" aria-pressed={view === 'costumes'} aria-label="Costume index" title="Costume index" onClick={() => setView('costumes')}><img src={import.meta.env.BASE_URL + 'assets/images/npc/CostumeButton.png'} alt="" /></button>
        {view === 'npc' && npc?.costumes?.length > 0 && <button type="button" className="friendskip-bookmark costume-tab character-tab" aria-pressed={costumeMode} aria-label={npc.name + ' costumes'} title={npc.name + ' costumes'} onClick={() => { setCostumeIndex(0); setCostumeMode(true) }}><img src={import.meta.env.BASE_URL + 'assets/images/npc/CostumeButton.png'} alt="" /></button>}
      </nav>
      <section className="friendskip-book"
        onPointerDown={(event) => {
          suppressClick.current = false
          gesture.current = event.target.closest('button, a, select, input, label') ? null : { x: event.clientX, y: event.clientY }
        }}
        onPointerCancel={() => { gesture.current = null }}
        onPointerUp={(event) => {
          const start = gesture.current
          gesture.current = null
          if (!start) return
          const dx = event.clientX - start.x
          const dy = event.clientY - start.y
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            suppressClick.current = true
            turnFromPage(dx < 0 ? 1 : -1)
          }
        }}
        onClick={(event) => {
          if (suppressClick.current) { suppressClick.current = false; return }
          if (event.target.closest('button, a, select, input, label')) return
          const page = event.target.closest('.friendskip-page-sheet')
          if (!page) return
          if (window.matchMedia('(max-width: 760px)').matches) {
            const bounds = page.getBoundingClientRect()
            turnFromPage(event.clientX < bounds.left + bounds.width / 2 ? -1 : 1)
          } else turnFromPage(page === page.parentElement.firstElementChild ? -1 : 1)
        }}>

        {view === 'contents' || view === 'costumes' ? (
          <div className="friendskip-spread friendskip-contents">
            <article className="friendskip-page-sheet">
              <h2>{view === 'costumes' ? 'Costumes' : 'Friendskip Tracker'}</h2>
              <div className="friendskip-list">
                {orderedNpcs.map((entry, entryIndex) => (view !== 'costumes' || entry.costumes?.length > 0) && (
                  <button key={`${entry.name}-${entryIndex}`} onClick={(event) => { event.stopPropagation(); openNpc(entryIndex); if (view === 'costumes') setCostumeMode(true) }}>
                    <span className="friendskip-entry-name">{displayName(entry.name)}</span><span className="friendskip-entry-leader" aria-hidden="true" /><span className="friendskip-entry-page">{entryIndex * 2 + 2}</span>
                  </button>
                ))}
              </div>
            </article>
            <article className="friendskip-page-sheet friendskip-contents-right" aria-hidden="true" />
          </div>
        ) : (
          <div key={`${view}-${index}-${costumeMode}`} className="friendskip-spread friendskip-turn">
            {costumeMode ? (
              <>
                <article className="friendskip-page-sheet friendskip-costume-page">
                  <h2>{costume?.name || `${npc?.name || 'NPC'} Costume`}</h2>
                  {hasField(costume, 'drawing') && <NpcImage kind="drawing" source={costume?.drawing} />}
                  {hasField(costume, 'opinion') && <p className="friendskip-hand">{costume?.opinion || ''}</p>}
                  <div className="friendskip-normal">
                    {hasField(costume, 'reference') && <p><b>Reference:</b> {costume?.reference || '—'}</p>}
                    {hasField(costume, 'firstObtainableUpdate') && <p><b>First Obtainable Update:</b> {costume?.firstObtainableUpdate || '—'}</p>}
                    {hasField(costume, 'obtainment') && <p><b>Obtainment:</b> {costume?.obtainment || '—'}</p>}
                  </div>
                  {hasField(costume, 'sprite') && <NpcImage kind="sprite" source={costume?.sprite} alt={costume?.name || 'Costume'} />}
                  {hasField(costume, 'callside') && <p className="friendskip-hand">{costume?.callside || ''}</p>}
                </article>
                <article className="friendskip-page-sheet">{hasField(costume, 'notes') && <><h2>Costume Notes</h2><p className="friendskip-hand">{costume.notes}</p></>}</article>
              </>
            ) : (
              <>
                <article className="friendskip-page-sheet">
                  <h2>{displayName(npc?.name) || 'NPC'}</h2>
                  <div className="friendskip-normal">
                    {hasField(npc, 'role') && <p><b>Role:</b> {npc?.role || '—'}</p>}
                    {hasField(npc, 'versions') && <p><b>Versions:</b> {npc?.versions || '—'}</p>}
                    {hasField(npc, 'found') && <p><b>Found:</b> {npc?.found || '—'}</p>}
                  </div>
                  <div className="friendskip-profile"><div>
                    {hasField(npc, 'drawing') && <NpcImage kind="drawing" source={npc?.drawing} />}
                  </div><div className="friendskip-normal">
                    {hasField(npc, 'height') && <p><b>Height:</b> {npc.height || '?'}</p>}
                    {hasField(npc, 'age') && <p><b>Age:</b> {npc.age || '?'}</p>}
                  </div></div>
                  <div className="friendskip-levels">{Object.entries(npc?.levels || {}).map(([level, text]) => <p key={level} className="friendskip-hand">Level {level}: {text}</p>)}</div>
                  <div className="friendskip-normal">{Object.entries(npc?.levelObtainment || {}).map(([level, text]) => <p key={level}><b>Level {level} Obtainment:</b> {text || '—'}</p>)}</div>
                </article>
                <article className="friendskip-page-sheet">
                  {hasField(npc, 'quests') && <h3>Quests</h3>}
                  {npc?.quests?.map((quest, questIndex) => <div className="friendskip-quest" key={questIndex}>{hasField(quest, 'goal') && <p><b>Goal:</b> {quest.goal || ''}</p>}{hasField(quest, 'reward') && <p><b>Reward:</b> {quest.reward || ''}</p>}</div>)}
                  {hasField(npc, 'schedule') && <><h3>Schedule</h3><p className="friendskip-hand friendskip-schedule">{npc.schedule || ''}</p></>}
                  {hasField(npc, 'sprite') && <NpcImage kind="sprite" source={npc?.sprite} />}
                </article>
              </>
            )}
          </div>
        )}
      </section>
      </div>
    </main>
  )
}
