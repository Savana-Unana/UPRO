import { useEffect, useMemo, useState } from 'react'

export default function AnimatrixPageSimple() {
  const [mates, setMates] = useState([])
  const [types, setTypes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Animatrix Simple'
    document.body.className = ''
    document.body.setAttribute('style', '')

    Promise.all([
      fetch('data/mates/base.json').then(response => response.json()),
      fetch('data/types.json').then(response => response.json()),
    ])
      .then(([baseMates, typeData]) => {
        setMates(baseMates || [])
        setTypes(typeData || [])
      })
      .catch(() => {
        setError('Could not load Animates.')
      })
  }, [])

  const typeColors = useMemo(() => {
    return new Map(types.map(type => [type.name, type.color]))
  }, [types])

  return (
    <div className="upro-page-root">
      <header>
        <div style={{ display: 'flex' }}>
          <a href="/">
            <button>Main Menu</button>
          </a>
        </div>
        <h1>The Animatrix</h1>
      </header>

      {error ? (
        <main className="cat-empty">{error}</main>
      ) : (
        <main id="animatrix" className="grid">
          {mates.map((mate, index) => (
            <article className="card" key={`${mate.name}-${index}`}>
              <div className="card-id">{String(index + 1).padStart(4, '0')}</div>
              <img src={mate.image} alt={mate.name} />
              <h3>{mate.name}</h3>
              <div className="types">
                {(mate.types || []).filter(Boolean).map(type => (
                  <span
                    key={type}
                    style={{ backgroundColor: typeColors.get(type) || '#0ff' }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </main>
      )}
    </div>
  )
}
