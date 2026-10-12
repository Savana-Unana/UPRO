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
  const [characterCostumeMode, setCharacterCostumeMode] = useState(false)
  const [costumeIndex, setCostumeIndex] = useState(0)
  const [directorySpread, setDirectorySpread] = useState(0)
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
  const sparseNpcProfile = npc && !hasField(npc, 'levels') && !hasField(npc, 'levelObtainment') && !hasField(npc, 'quests') && !hasField(npc, 'schedule')
  const levelEntries = Object.entries(npc?.levels || {})
  const levelObtainmentEntries = Object.entries(npc?.levelObtainment || {})
  const npcSprites = Array.isArray(npc?.sprites) ? npc.sprites : hasField(npc, 'sprite') ? [npc.sprite] : []
  const displayName = (value) => {
    const renamed = value?.replace(/Skip/g, 'Me').replace(/skip/g, 'me')
    return renamed?.replace(/^Me(?=\s+\S)/, 'My').replace(/^me(?=\s+\S)/, 'my')
  }
  const move = (amount) => {
    setCostumeIndex(0)
    setCharacterCostumeMode(false)
    setIndex((current) => Math.max(0, Math.min(Math.max(orderedNpcs.length - 1, 0), current + amount)))
  }
  const openNpc = (nextIndex) => {
    setIndex(nextIndex)
    setView('npc')
    setCostumeMode(false)
    setCharacterCostumeMode(false)
    setCostumeIndex(0)
  }
  const costumePages = orderedNpcs.flatMap((entry, npcIndex) => (entry.costumes || []).map((_, outfitIndex) => ({ npcIndex, outfitIndex })))
  const costumeOwners = orderedNpcs.map((entry, npcIndex) => ({ entry, npcIndex })).filter(({ entry }) => entry.costumes?.length > 0)
  const directoryEntries = view === 'costumes'
    ? orderedNpcs.map((entry, npcIndex) => ({ entry, npcIndex })).filter(({ entry }) => entry.costumes?.length > 0)
    : orderedNpcs.map((entry, npcIndex) => ({ entry, npcIndex }))
  const directoryPageSize = 9
  const directorySpreadSize = directoryPageSize * 2
  const directorySpreadCount = Math.max(1, Math.ceil(directoryEntries.length / directorySpreadSize))
  const visibleDirectoryEntries = directoryEntries.slice(directorySpread * directorySpreadSize, (directorySpread + 1) * directorySpreadSize)
  const currentCostumePage = costumePages.findIndex(page => page.npcIndex === index && page.outfitIndex === costumeIndex)
  const friendskipDirectoryPageCount = Math.max(2, Math.ceil(orderedNpcs.length / directorySpreadSize) * 2)
  const npcPageStart = friendskipDirectoryPageCount + 1
  const costumeOwnerCount = costumeOwners.length
  const costumeDirectorySpreadCount = Math.max(1, Math.ceil(costumeOwnerCount / directorySpreadSize))
  const costumeDirectoryPageCount = Math.max(2, Math.ceil(costumeOwnerCount / directorySpreadSize) * 2)
  const costumeDirectoryPageStart = npcPageStart + orderedNpcs.length * 2
  const ownerGlossaries = costumeOwners.map(owner => ({ ...owner, pageCount: Math.max(2, Math.ceil(owner.entry.costumes.length / directorySpreadSize) * 2) }))
  const characterCostumeDirectoryPageCount = ownerGlossaries.reduce((total, owner) => total + owner.pageCount, 0)
  const characterCostumeDirectoryPageStart = costumeDirectoryPageStart + costumeDirectoryPageCount
  const costumePageStart = characterCostumeDirectoryPageStart + characterCostumeDirectoryPageCount
  const currentOwnerPosition = ownerGlossaries.findIndex(owner => owner.npcIndex === index)
  const currentOwner = ownerGlossaries[currentOwnerPosition]
  const currentOwnerDirectoryStart = characterCostumeDirectoryPageStart + ownerGlossaries.slice(0, Math.max(currentOwnerPosition, 0)).reduce((total, owner) => total + owner.pageCount, 0)
  const characterCostumeSpreadCount = Math.max(1, Math.ceil((npc?.costumes?.length || 0) / directorySpreadSize))
  const visibleCharacterCostumes = (npc?.costumes || []).slice(directorySpread * directorySpreadSize, (directorySpread + 1) * directorySpreadSize)
  const directoryPageStart = characterCostumeMode ? currentOwnerDirectoryStart + directorySpread * 2 : view === 'costumes' ? costumeDirectoryPageStart + directorySpread * 2 : directorySpread * 2 + 1
  const getDirectoryTargetPage = npcIndex => {
    if (view !== 'costumes') return npcPageStart + npcIndex * 2
    const ownerPosition = ownerGlossaries.findIndex(owner => owner.npcIndex === npcIndex)
    return ownerPosition < 0 ? costumePageStart : characterCostumeDirectoryPageStart + ownerGlossaries.slice(0, ownerPosition).reduce((total, owner) => total + owner.pageCount, 0)
  }
  const canPrevious = view === 'contents' ? directorySpread > 0
    : view === 'costumes' ? orderedNpcs.length > 0
    : characterCostumeMode ? true
    : true
  const canNext = view === 'contents' ? orderedNpcs.length > 0
    : view === 'costumes' ? costumePages.length > 0
    : characterCostumeMode ? (npc?.costumes?.length || 0) > 0
    : costumeMode ? currentCostumePage < costumePages.length - 1 : orderedNpcs.length > 0
  const openCharacterCostumes = (npcIndex) => {
    setIndex(npcIndex)
    setView('npc')
    setCostumeMode(false)
    setCharacterCostumeMode(true)
    setCostumeIndex(0)
    setDirectorySpread(0)
  }
  const openCostumePage = (page) => {
    if (!page) return
    setIndex(page.npcIndex)
    setCostumeIndex(page.outfitIndex)
    setView('npc')
    setCostumeMode(true)
    setCharacterCostumeMode(false)
  }
  const turnFromPage = (direction) => {
    if (direction < 0 && !canPrevious || direction > 0 && !canNext) return
    if (view === 'contents') {
      if (direction < 0) setDirectorySpread(current => current - 1)
      else if (directorySpread < directorySpreadCount - 1) setDirectorySpread(current => current + 1)
      else openNpc(0)
    } else if (view === 'costumes') {
      if (direction < 0 && directorySpread > 0) setDirectorySpread(current => current - 1)
      else if (direction < 0) {
        setIndex(Math.max(orderedNpcs.length - 1, 0))
        setCostumeMode(false)
        setCharacterCostumeMode(false)
        setView('npc')
      } else if (directorySpread < directorySpreadCount - 1) setDirectorySpread(current => current + 1)
      else if (costumeOwners[0]) openCharacterCostumes(costumeOwners[0].npcIndex)
    } else if (characterCostumeMode) {
      if (direction < 0 && directorySpread > 0) setDirectorySpread(current => current - 1)
      else if (direction < 0) {
        setView('costumes')
        setCharacterCostumeMode(false)
        setDirectorySpread(Math.max(costumeDirectorySpreadCount - 1, 0))
      } else if (directorySpread < characterCostumeSpreadCount - 1) setDirectorySpread(current => current + 1)
      else openCostumePage({ npcIndex: index, outfitIndex: 0 })
    } else if (costumeMode) {
      if (direction < 0 && costumeIndex === 0) {
        setCostumeMode(false)
        setCharacterCostumeMode(true)
        setDirectorySpread(Math.max(characterCostumeSpreadCount - 1, 0))
      } else if (direction > 0 && costumeIndex === (npc?.costumes?.length || 0) - 1) {
        const nextOwner = ownerGlossaries[currentOwnerPosition + 1]
        if (nextOwner) openCharacterCostumes(nextOwner.npcIndex)
      } else openCostumePage({ npcIndex: index, outfitIndex: costumeIndex + direction })
    } else if (direction < 0 && index === 0) {
      setDirectorySpread(Math.max(Math.ceil(orderedNpcs.length / directorySpreadSize) - 1, 0))
      setView('contents')
    } else if (direction > 0 && index === orderedNpcs.length - 1) {
      setDirectorySpread(0)
      setView('costumes')
    } else move(direction)
  }

  return (
    <main className="friendskip-shell">
      <a href="/"><button type="button">Main Menu</button></a>
      <div className="friendskip-book-frame">
      <nav className="friendskip-bookmarks" aria-label="Book sections">
        <button type="button" className="friendskip-bookmark index-tab" aria-pressed={view === 'contents'} onClick={() => { setView('contents'); setCostumeMode(false); setCharacterCostumeMode(false); setDirectorySpread(0) }}>Friendskips</button>
        {view === 'npc' && <button type="button" className="friendskip-bookmark npc-tab" aria-pressed={!costumeMode && !characterCostumeMode} onClick={() => { setCostumeMode(false); setCharacterCostumeMode(false) }}>{displayName(npc?.name)}</button>}
        <button type="button" className="friendskip-bookmark costume-tab" aria-pressed={view === 'costumes'} aria-label="Costume index" title="Costume index" onClick={() => { setView('costumes'); setCostumeMode(false); setCharacterCostumeMode(false); setDirectorySpread(0) }}><img src={import.meta.env.BASE_URL + 'assets/images/npc/CostumeButton.png'} alt="" /></button>
        {view === 'npc' && npc?.costumes?.length > 0 && <button type="button" className="friendskip-bookmark costume-tab character-tab" aria-pressed={costumeMode || characterCostumeMode} aria-label={npc.name + ' costumes'} title={npc.name + ' costumes'} onClick={() => openCharacterCostumes(index)}><span>{displayName(npc.name)}</span></button>}
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
          const flow = event.target.closest('.friendskip-page-flow')
          if (!page && !flow) return
          if (window.matchMedia('(max-width: 760px)').matches) {
            const bounds = (page || flow).getBoundingClientRect()
            turnFromPage(event.clientX < bounds.left + bounds.width / 2 ? -1 : 1)
          } else if (flow) {
            const bounds = flow.getBoundingClientRect()
            turnFromPage(event.clientX < bounds.left + bounds.width / 2 ? -1 : 1)
          } else turnFromPage(page === page.parentElement.firstElementChild ? -1 : 1)
        }}>

        {view === 'contents' || view === 'costumes' ? (
          <div className="friendskip-spread friendskip-contents">
            <article className="friendskip-page-sheet friendskip-directory-page">
              <h2>{view === 'costumes' ? 'Costumes' : 'Friendskips'}</h2>
              <div className="friendskip-list">
                {visibleDirectoryEntries.slice(0, directoryPageSize).map(({ entry, npcIndex }) => (
                  <button key={`${entry.name}-${npcIndex}`} onClick={(event) => { event.stopPropagation(); if (view === 'costumes') openCharacterCostumes(npcIndex); else openNpc(npcIndex) }}>
                    <span className="friendskip-entry-name">{displayName(entry.name)}{view === 'contents' && entry.role === 'Main Character' && <span className="friendskip-main-character-star" aria-label="Main Character">★</span>}</span><span className="friendskip-entry-leader" aria-hidden="true" /><span className="friendskip-entry-page">{getDirectoryTargetPage(npcIndex)}</span>
                  </button>
                ))}
              </div>
              <span className="friendskip-paper-number">{directoryPageStart}</span>
            </article>
            <article className="friendskip-page-sheet friendskip-directory-page friendskip-contents-right">
              <h2>{view === 'costumes' ? 'Costumes' : 'Friendskips'}</h2>
              <div className="friendskip-list">
                {visibleDirectoryEntries.slice(directoryPageSize).map(({ entry, npcIndex }) => (
                  <button key={`${entry.name}-${npcIndex}`} onClick={(event) => { event.stopPropagation(); if (view === 'costumes') openCharacterCostumes(npcIndex); else openNpc(npcIndex) }}>
                    <span className="friendskip-entry-name">{displayName(entry.name)}{view === 'contents' && entry.role === 'Main Character' && <span className="friendskip-main-character-star" aria-label="Main Character">★</span>}</span><span className="friendskip-entry-leader" aria-hidden="true" /><span className="friendskip-entry-page">{getDirectoryTargetPage(npcIndex)}</span>
                  </button>
                ))}
              </div>
              <span className="friendskip-paper-number">{directoryPageStart + 1}</span>
            </article>
          </div>
        ) : (
          <div key={`${view}-${index}-${costumeMode}-${characterCostumeMode}`} className={`friendskip-spread friendskip-turn${characterCostumeMode ? ' friendskip-contents' : ''}`}>
            {characterCostumeMode ? (
              <>
                <article className="friendskip-page-sheet friendskip-directory-page">
                  <h2>{displayName(npc?.name)} Costumes</h2>
                  <div className="friendskip-list">
                    {visibleCharacterCostumes.slice(0, directoryPageSize).map((entry, visibleIndex) => {
                      const outfitIndex = directorySpread * directorySpreadSize + visibleIndex
                      const costumePage = costumePages.findIndex(page => page.npcIndex === index && page.outfitIndex === outfitIndex)
                      return <button key={`${entry.name}-${outfitIndex}`} onClick={(event) => { event.stopPropagation(); openCostumePage({ npcIndex: index, outfitIndex }) }}>
                        <span className="friendskip-entry-name">{displayName(entry.name)}</span><span className="friendskip-entry-leader" aria-hidden="true" /><span className="friendskip-entry-page">{costumePageStart + costumePage * 2}</span>
                      </button>
                    })}
                  </div>
                  <span className="friendskip-paper-number">{directoryPageStart}</span>
                </article>
                <article className="friendskip-page-sheet friendskip-directory-page friendskip-contents-right">
                  <h2>{displayName(npc?.name)} Costumes</h2>
                  <div className="friendskip-list">
                    {visibleCharacterCostumes.slice(directoryPageSize).map((entry, visibleIndex) => {
                      const outfitIndex = directorySpread * directorySpreadSize + directoryPageSize + visibleIndex
                      const costumePage = costumePages.findIndex(page => page.npcIndex === index && page.outfitIndex === outfitIndex)
                      return <button key={`${entry.name}-${outfitIndex}`} onClick={(event) => { event.stopPropagation(); openCostumePage({ npcIndex: index, outfitIndex }) }}>
                        <span className="friendskip-entry-name">{displayName(entry.name)}</span><span className="friendskip-entry-leader" aria-hidden="true" /><span className="friendskip-entry-page">{costumePageStart + costumePage * 2}</span>
                      </button>
                    })}
                  </div>
                  <span className="friendskip-paper-number">{directoryPageStart + 1}</span>
                </article>
              </>
            ) : costumeMode ? (
              <>
                <article className="friendskip-page-sheet friendskip-costume-page">
                  <span className="friendskip-paper-number">{costumePageStart + currentCostumePage * 2}</span>
                </article>
                <article className="friendskip-page-sheet">
                  <span className="friendskip-paper-number">{costumePageStart + currentCostumePage * 2 + 1}</span>
                </article>
                <div className="friendskip-page-flow friendskip-costume-flow">
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
                  {hasField(costume, 'notes') && <><h2>Costume Notes</h2><p className="friendskip-hand">{costume.notes}</p></>}
                </div>
              </>
            ) : (
              <>
                <article className="friendskip-page-sheet">
                  <span className="friendskip-paper-number">{npcPageStart + index * 2}</span>
                </article>
                <article className="friendskip-page-sheet">
                  <span className="friendskip-paper-number">{npcPageStart + index * 2 + 1}</span>
                </article>
                <div className={`friendskip-page-flow friendskip-npc-flow${sparseNpcProfile ? ' friendskip-sparse-flow' : ''}`}>
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
                  <div className="friendskip-levels">{levelEntries.map(([level, text]) => <p key={level} className="friendskip-hand">Level {level}: {text}</p>)}</div>
                  <div className="friendskip-normal">{levelObtainmentEntries.map(([level, text]) => <p key={level}><b>Level {level} Obtainment:</b> {text || '—'}</p>)}</div>
                  {hasField(npc, 'quests') && <h3>Quests</h3>}
                  {npc?.quests?.map((quest, questIndex) => <div className="friendskip-quest" key={questIndex}>{hasField(quest, 'goal') && <p><b>Goal:</b> {quest.goal || ''}</p>}{hasField(quest, 'reward') && <p><b>Reward:</b> {quest.reward || ''}</p>}</div>)}
                  {hasField(npc, 'schedule') && <><h3>Schedule</h3><p className="friendskip-hand friendskip-schedule">{npc.schedule || ''}</p></>}
                  {npcSprites.map((sprite, spriteIndex) => <NpcImage key={`${sprite}-${spriteIndex}`} kind="sprite" source={sprite} alt={`${npc?.name || 'NPC'} sprite ${spriteIndex + 1}`} />)}
                </div>
              </>
            )}
          </div>
        )}
      </section>
      </div>
    </main>
  )
}
