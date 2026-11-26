import { useEffect, useMemo, useState } from 'react'
import { buildEvolutionStageIndex, fetchMateBuckets, getMateStatus } from '../../utils/mateData'
import './sudupro.css'

const MAX_GUESSES = 9
const EMPTY_BOARD = Array(9).fill(null)
const emptyAttempts = () => Array.from({ length: 9 }, () => [])
const ARCHIVE_START_DATE = '2026-11-25'
const PUZZLE_VERSION = 6
const PROGRESS_RESET_KEY = 'sudupro-progress-reset-2026-11-26'

function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function shiftDate(dateString, amount) {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day + amount)
  return localDateKey(date)
}

function displayDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function dateRange(start, end) {
  const dates = []
  for (let date = end; date >= start; date = shiftDate(date, -1)) dates.push(date)
  return dates
}

function hashString(value) {
  let hash = 2166136261
  for (const character of value) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seededShuffle(items, seed) {
  const result = [...items]
  let state = seed || 1
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const swapIndex = state % (index + 1)
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function makeClue(kind, value, label = value) {
  const eyebrows = { type: 'Type', biome: 'Biome', stage: 'Stage Position', para: 'Para Typing', acifiable: 'Acifability', update: 'First Catchable in' }
  return { id: `${kind}:${value}`, kind, value, label, eyebrow: eyebrows[kind] || kind }
}

function normalizeCustomClue(clue) {
  if (!clue || !['type', 'biome', 'stage', 'para', 'acifiable', 'update'].includes(clue.kind) || !clue.value) return null
  return makeClue(clue.kind, String(clue.value), String(clue.label || clue.value))
}

function normalizeCustomPuzzle(entry) {
  const rows = Array.isArray(entry?.rows) ? entry.rows.map(normalizeCustomClue) : []
  const columns = Array.isArray(entry?.columns) ? entry.columns.map(normalizeCustomClue) : []
  if (!entry?.date || rows.length !== 3 || columns.length !== 3 || [...rows, ...columns].some(clue => !clue)) return null
  return { date: String(entry.date), word: String(entry.word || 'Randomized'), rows, columns }
}

function normalizeStoredPuzzle(entry) {
  const rows = Array.isArray(entry?.rows) ? entry.rows.map(normalizeCustomClue) : []
  const columns = Array.isArray(entry?.columns) ? entry.columns.map(normalizeCustomClue) : []
  return rows.length === 3 && columns.length === 3 && ![...rows, ...columns].some(clue => !clue)
    ? { rows, columns }
    : null
}

function clueMatches(mate, clue) {
  if (clue.kind === 'type') return mate.types.includes(clue.value)
  if (clue.kind === 'biome') return mate.biomes.includes(clue.value)
  if (clue.kind === 'para') return mate.paraTypes.includes(clue.value)
  if (clue.kind === 'update') return mate.update === clue.value
  if (clue.kind === 'acifiable') return clue.value === 'Acifiable' ? mate.acifiable : !mate.acifiable
  if (clue.kind === 'stage') {
    if (clue.value === 'First Stage') return mate.stage.first
    if (clue.value === 'Middle Stage') return mate.stage.middle
    if (clue.value === 'Final Stage') return mate.stage.final
    if (clue.value === 'Can Evolve') return mate.stage.evolvable
    if (clue.value === 'Cannot Evolve') return !mate.stage.evolvable
  }
  return false
}

function canFillBoard(candidates, cellIndex = 0, used = new Set()) {
  if (cellIndex === candidates.length) return true
  return candidates[cellIndex].some(mate => {
    if (used.has(mate.name)) return false
    used.add(mate.name)
    const works = canFillBoard(candidates, cellIndex + 1, used)
    used.delete(mate.name)
    return works
  })
}

function makeRandomizedPuzzle(pool, seed) {
  const counts = new Map()
  const add = (kind, value) => {
    if (!value || value === 'Ungathered') return
    const key = `${kind}:${value}`
    counts.set(key, (counts.get(key) || 0) + 1)
  }

  pool.forEach(mate => {
    mate.types.forEach(value => add('type', value))
    mate.biomes.forEach(value => add('biome', value))
    mate.paraTypes.forEach(value => add('para', value))
    if (mate.stage.first) add('stage', 'First Stage')
    if (mate.stage.middle) add('stage', 'Middle Stage')
    if (mate.stage.final) add('stage', 'Final Stage')
    add('stage', mate.stage.evolvable ? 'Can Evolve' : 'Cannot Evolve')
    add('acifiable', mate.acifiable ? 'Acifiable' : 'Not Acifiable')
    add('update', mate.update)
  })

  const clues = [...counts]
    .filter(([, count]) => count >= 4 && count <= Math.max(12, pool.length * .82))
    .map(([key]) => {
      const separator = key.indexOf(':')
      return makeClue(key.slice(0, separator), key.slice(separator + 1))
    })

  const shuffled = seededShuffle(clues, seed)
  const tryPuzzle = (rows, columns) => {
    const candidates = rows.flatMap(row => columns.map(column => pool.filter(mate => clueMatches(mate, row) && clueMatches(mate, column))))
    return candidates.every(options => options.length) && canFillBoard(candidates) ? { rows, columns } : null
  }

  for (let offset = 0; offset < Math.min(500, shuffled.length * shuffled.length); offset += 1) {
    const start = offset % shuffled.length
    const selected = [...shuffled.slice(start), ...shuffled.slice(0, start)].slice(0, 6)
    if (selected.length < 6 || new Set(selected.map(clue => clue.id)).size < 6) continue
    const rows = selected.slice(0, 3)
    const columns = selected.slice(3)
    const puzzle = tryPuzzle(rows, columns)
    if (puzzle) return puzzle
  }

  // Exhaust the remaining clue combinations instead of returning an
  // unchecked fallback. A randomized grid is only returned when all nine
  // intersections can be filled by nine different finalized animates.
  for (let first = 0; first < shuffled.length - 2; first += 1) {
    for (let second = first + 1; second < shuffled.length - 1; second += 1) {
      for (let third = second + 1; third < shuffled.length; third += 1) {
        const rows = [shuffled[first], shuffled[second], shuffled[third]]
        const rowIds = new Set(rows.map(clue => clue.id))
        const possibleColumns = shuffled.filter(column =>
          !rowIds.has(column.id) && rows.every(row => pool.some(mate => clueMatches(mate, row) && clueMatches(mate, column)))
        )
        for (let left = 0; left < possibleColumns.length - 2; left += 1) {
          for (let middle = left + 1; middle < possibleColumns.length - 1; middle += 1) {
            for (let right = middle + 1; right < possibleColumns.length; right += 1) {
              const puzzle = tryPuzzle(rows, [possibleColumns[left], possibleColumns[middle], possibleColumns[right]])
              if (puzzle) return puzzle
            }
          }
        }
      }
    }
  }

  const broadClue = shuffled.find(clue => pool.filter(mate => clueMatches(mate, clue)).length >= 9)
  if (broadClue) {
    return {
      rows: [0, 1, 2].map(index => ({ ...broadClue, id: `${broadClue.id}:row-${index}` })),
      columns: [0, 1, 2].map(index => ({ ...broadClue, id: `${broadClue.id}:column-${index}` }))
    }
  }

  throw new Error('The finalized animate pool does not contain nine valid answers for any clue.')
}

function normalizeUpdate(value) {
  const label = String(value || '').trim().replace(/^Demo\s+/i, 'Update ')
  return label.match(/^(Update\s+\d+(?:\.\d+)?)/i)?.[1] || ''
}

function normalizeGroupName(value) {
  return String(value || '').trim().toLowerCase().replace(/^(?:ace|sacred)\s+/, '')
}

function normalizePool(items, stageIndex, acifiableGroups) {
  return items.map((item, index) => ({
    id: index + 1,
    name: String(item.name || 'Unknown'),
    image: String(item.image || ''),
    types: Array.isArray(item.types) ? item.types.filter(Boolean) : [],
    biomes: Array.isArray(item.biomes) ? item.biomes.filter(Boolean) : [],
    paraTypes: Array.isArray(item.paraTypes) ? item.paraTypes.filter(Boolean) : [],
    update: normalizeUpdate(item.firstWildCatchableUpdate),
    acifiable: acifiableGroups.has(normalizeGroupName(item.__groupName || item.name)),
    stage: (() => {
      const info = stageIndex.get(item.name) || { first: false, middle: false, final: true }
      return { ...info, evolvable: !info.final }
    })()
  })).filter(item => {
    const path = item.image.toLowerCase().replaceAll('\\', '/')
    return path && getMateStatus(item) === 'finalized' && !path.includes('missingno') && item.name !== 'Ones'
  }).sort((left, right) => left.name.localeCompare(right.name))
}

function Clue({ clue }) {
  const iconOnly = clue?.kind === 'type' || clue?.kind === 'para'
  return <div className={`sudupro-clue${iconOnly ? ' is-icon' : ''}`}>
    {iconOnly ? <>
      {clue.kind === 'para' && <span>Para Typing</span>}
      <img className="sudupro-type-icon" src={`assets/images/ui/types/${encodeURIComponent(clue.value)}.png`} alt={clue.value} title={clue.value} />
    </> : <div className="sudupro-clue-text"><span>{clue?.eyebrow || ''}</span><strong>{clue?.label || '-'}</strong></div>}
  </div>
}

export default function SudUproPage() {
  const today = localDateKey()
  const [pool, setPool] = useState([])
  const [customPuzzles, setCustomPuzzles] = useState(new Map())
  const [savedDailyPuzzle, setSavedDailyPuzzle] = useState(null)
  const [selectedDate, setSelectedDate] = useState(today)
  const [randomSeed, setRandomSeed] = useState(null)
  const [board, setBoard] = useState([...EMPTY_BOARD])
  const [wrongAttempts, setWrongAttempts] = useState(emptyAttempts)
  const [guesses, setGuesses] = useState(0)
  const [activeCell, setActiveCell] = useState(null)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('Loading today’s puzzle...')
  const [copied, setCopied] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const archiveDates = useMemo(() => dateRange(ARCHIVE_START_DATE, today), [today])

  const customPuzzle = randomSeed === null ? customPuzzles.get(selectedDate) : null
  const seed = randomSeed ?? hashString(`SudUPRO:${selectedDate}`)
  const puzzle = useMemo(() => customPuzzle || savedDailyPuzzle || (pool.length ? makeRandomizedPuzzle(pool, seed) : { rows: [], columns: [] }), [customPuzzle, pool, savedDailyPuzzle, seed])
  const cornerWord = customPuzzle?.word || 'Randomized'
  const storageKey = randomSeed === null ? `sudupro-daily-${selectedDate}` : ''
  const usedNames = useMemo(() => new Set(board.filter(Boolean).map(cell => cell.mate.name)), [board])
  const complete = board.every(Boolean)
  const outOfGuesses = guesses >= MAX_GUESSES && !complete

  function restoreDaily(date, mates) {
    let restored = null
    try { restored = JSON.parse(localStorage.getItem(`sudupro-daily-${date}`) || 'null') } catch { /* Ignore malformed saves. */ }
    const compatibleSave = restored?.puzzleVersion === PUZZLE_VERSION
    if (compatibleSave && restored?.board && Array.isArray(restored.board)) {
      setBoard(restored.board.map(cell => {
        if (!cell) return null
        const mate = mates.find(entry => entry.name === cell.name)
        return mate ? { mate, correct: true } : null
      }))
      setGuesses(Number(restored.guesses) || 0)
      setMessage(restored.message || `Continue ${displayDate(date)}.`)
      setWrongAttempts(Array.from({ length: 9 }, (_, index) =>
        Array.isArray(restored.wrongAttempts?.[index]) ? restored.wrongAttempts[index].map(String) : []
      ))
    } else {
      setBoard([...EMPTY_BOARD])
      setGuesses(0)
      setMessage('')
      setWrongAttempts(emptyAttempts())
    }
    setSavedDailyPuzzle(compatibleSave ? normalizeStoredPuzzle(restored?.puzzle) : null)
    setActiveCell(null)
    setSearch('')
    setCopied(false)
  }

  useEffect(() => {
    document.title = 'SudUPRO'
    document.body.className = 'sudupro-page'
    if (!localStorage.getItem(PROGRESS_RESET_KEY)) {
      Object.keys(localStorage)
        .filter(key => key.startsWith('sudupro-daily-'))
        .forEach(key => localStorage.removeItem(key))
      localStorage.setItem(PROGRESS_RESET_KEY, 'complete')
    }
    Promise.all([
      fetchMateBuckets({ includeNpc: false }),
      fetch('data/sudupro/puzzles.json').then(response => response.ok ? response.json() : []).catch(() => [])
    ]).then(([buckets, puzzleData]) => {
      const evolutionMates = [...(buckets.evolution?.base || []), ...(buckets.evolution?.goner || [])]
      const stageIndex = buildEvolutionStageIndex(evolutionMates)
      const acifiableGroups = new Set((buckets.ace || []).map(mate => normalizeGroupName(mate.__groupName || mate.name)))
      const nextPool = normalizePool(buckets.base || [], stageIndex, acifiableGroups)
      const entries = (Array.isArray(puzzleData) ? puzzleData : puzzleData?.puzzles || []).map(normalizeCustomPuzzle).filter(Boolean)
      setPool(nextPool)
      setCustomPuzzles(new Map(entries.map(entry => [entry.date, entry])))
      restoreDaily(today, nextPool)
    }).catch(() => setMessage('SudUPRO could not load its data.'))
  }, [today])

  useEffect(() => {
    if (!storageKey || !pool.length) return
    localStorage.setItem(storageKey, JSON.stringify({
      puzzleVersion: PUZZLE_VERSION,
      guesses,
      message,
      puzzle: { rows: puzzle.rows, columns: puzzle.columns },
      wrongAttempts,
      board: board.map(cell => cell ? { name: cell.mate.name } : null)
    }))
  }, [board, guesses, message, pool.length, puzzle, storageKey, wrongAttempts])

  const visibleMates = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) return []
    return pool.filter(mate => mate.name.toLowerCase().includes(needle)).slice(0, 80)
  }, [pool, search])

  function selectDaily(date) {
    if (date < ARCHIVE_START_DATE || date > today) return
    setSelectedDate(date)
    setRandomSeed(null)
    restoreDaily(date, pool)
    setArchiveOpen(false)
  }

  function chooseMate(mate) {
    if (activeCell === null || outOfGuesses || complete || usedNames.has(mate.name) || wrongAttempts[activeCell]?.includes(mate.name)) return
    const row = puzzle.rows[Math.floor(activeCell / 3)]
    const column = puzzle.columns[activeCell % 3]
    const correct = clueMatches(mate, row) && clueMatches(mate, column)
    const nextGuesses = guesses + 1
    const nextBoard = [...board]
    if (correct) nextBoard[activeCell] = { mate, correct: true }
    if (!correct) {
      setWrongAttempts(current => current.map((attempts, index) =>
        index === activeCell && !attempts.includes(mate.name) ? [...attempts, mate.name] : attempts
      ))
    }
    setBoard(nextBoard)
    setGuesses(nextGuesses)
    setActiveCell(null)
    setSearch('')
    const isComplete = nextBoard.every(Boolean)
    setMessage(isComplete ? 'Perfect grid! You solved SudUPRO.' : correct ? `${mate.name} fits!` : nextGuesses >= MAX_GUESSES ? `No guesses left. You completed ${nextBoard.filter(Boolean).length}/9 cells.` : `${mate.name} does not match both clues.`)
  }

  function newRandomPuzzle() {
    setRandomSeed(Math.floor(Math.random() * 0xffffffff))
    setSavedDailyPuzzle(null)
    setBoard([...EMPTY_BOARD])
    setWrongAttempts(emptyAttempts())
    setGuesses(0)
    setActiveCell(null)
    setSearch('')
    setMessage('Random grid ready. Choose an animate that matches both clues.')
    setCopied(false)
  }

  async function share() {
    const squares = board.map(cell => cell ? '🟩' : '⬜')
    const label = randomSeed === null ? selectedDate : 'Random'
    const lines = [`SudUPRO ${label} ${board.filter(Boolean).length}/9`, ...[0, 1, 2].map(row => squares.slice(row * 3, row * 3 + 3).join('')), `${guesses}/${MAX_GUESSES} guesses`]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
    } catch { setMessage('Could not copy the result to your clipboard.') }
  }

  return <main className="sudupro-shell">
    <header className="sudupro-header">
      <a href="/normal" className="sudupro-icon" aria-label="Back">←</a>
      <div className="sudupro-brand">
        <p>SudUPRO</p>
        <h1>{randomSeed !== null ? 'Random Puzzle' : selectedDate === today ? "Today's Puzzle" : displayDate(selectedDate)}</h1>
      </div>
      <div className="sudupro-header-actions">
        <button type="button" className="sudupro-icon" onClick={newRandomPuzzle} title="New random puzzle">↻</button>
      </div>
    </header>

    <section className="sudupro-game-area">
      <div className="sudupro-grid" aria-label="SudUPRO puzzle grid">
        <button type="button" className="sudupro-corner" onClick={() => setArchiveOpen(true)} title="Open puzzle archive">{cornerWord}</button>
        {puzzle.columns.map(clue => <Clue key={clue.id} clue={clue} />)}
        {[0, 1, 2].map(row => <div className="sudupro-grid-row" key={row}>
          <Clue clue={puzzle.rows[row]} />
          {[0, 1, 2].map(column => {
            const index = row * 3 + column
            const cell = board[index]
            return <button type="button" key={index} className={`sudupro-cell${cell ? ' is-filled' : ''}`} onClick={() => !cell && !outOfGuesses && setActiveCell(index)} disabled={Boolean(cell) || outOfGuesses}>
              {cell ? <><img src={cell.mate.image} alt="" /><span>{cell.mate.name}</span></> : null}
            </button>
          })}
        </div>)}
      </div>
      <aside className="sudupro-stats" aria-live="polite">
        <div><span>Guesses</span><strong>{MAX_GUESSES - guesses}</strong></div>
        <div><span>Filled</span><strong>{board.filter(Boolean).length}/9</strong></div>
        <p>{message}</p>
      </aside>
    </section>

    <footer className="sudupro-footer">
      <span>{randomSeed === null ? displayDate(selectedDate) : 'Unlimited'}</span>
      <button type="button" onClick={share} disabled={!complete && !outOfGuesses}>{copied ? 'Copied!' : 'Share'}</button>
    </footer>

    {archiveOpen && <div className="sudupro-modal-backdrop" onMouseDown={() => setArchiveOpen(false)}>
      <section className="sudupro-archive" role="dialog" aria-modal="true" onMouseDown={event => event.stopPropagation()}>
        <button className="sudupro-close" type="button" onClick={() => setArchiveOpen(false)}>×</button>
        <h2>Puzzle Archive</h2>
        <p>Every daily grid stays available. Progress is saved separately for each date.</p>
        <div className="sudupro-archive-list">
          {archiveDates.map(date => {
            let saved = null
            try { saved = JSON.parse(localStorage.getItem(`sudupro-daily-${date}`) || 'null') } catch { /* Ignore malformed saves. */ }
            const solved = saved?.puzzleVersion === PUZZLE_VERSION && Array.isArray(saved?.board) && saved.board.every(Boolean)
            return <button type="button" key={date} className={date === selectedDate && randomSeed === null ? 'is-current' : ''} onClick={() => selectDaily(date)}>
              <span>{date === today ? 'Today' : displayDate(date)}</span>
              <small>{customPuzzles.has(date) ? customPuzzles.get(date).word : 'Randomized'}{solved ? ' · Solved' : ''}</small>
            </button>
          })}
        </div>
      </section>
    </div>}

    {activeCell !== null && <div className="sudupro-modal-backdrop" onMouseDown={() => setActiveCell(null)}>
      <section className="sudupro-modal" role="dialog" aria-modal="true" onMouseDown={event => event.stopPropagation()}>
        <button className="sudupro-close" type="button" onClick={() => setActiveCell(null)}>×</button>
        <h2>Choose an animate</h2>
        <div className="sudupro-intersection"><Clue clue={puzzle.rows[Math.floor(activeCell / 3)]} /><span>+</span><Clue clue={puzzle.columns[activeCell % 3]} /></div>
        <input autoFocus value={search} onChange={event => setSearch(event.target.value)} placeholder="Search animates..." />
        <div className="sudupro-picker-list">
          {visibleMates.map(mate => {
            const used = usedNames.has(mate.name)
            const triedHere = wrongAttempts[activeCell]?.includes(mate.name)
            return <button type="button" key={mate.name} onClick={() => chooseMate(mate)} disabled={used || triedHere}>
              <img src={mate.image} alt="" /><span>{mate.name}</span>
            </button>
          })}
          {!search.trim() && <p className="sudupro-search-prompt">Start typing to see animates.</p>}
          {search.trim() && !visibleMates.length && <p className="sudupro-search-prompt">No animates found.</p>}
        </div>
      </section>
    </div>}
  </main>
}
