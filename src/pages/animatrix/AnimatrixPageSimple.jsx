import { useEffect, useState } from 'react'
import { fetchMateBuckets } from '../../utils/mateData'

export default function AnimatrixPageSimple() {
  const [mates, setMates] = useState([])
  const [types, setTypes] = useState([])
  useEffect(() => {
    document.title = 'Animatrix Simple'
    Promise.all([
      fetchMateBuckets(),
      fetch('data/types.json').then(response => response.json()),
    ]).then(([mateBuckets, typeData]) => {
      setMates(mateBuckets.base || [])
      setTypes(typeData)
    })
  }, [])
  const typeColors = new Map(types.map(type => [type.name, type.color]))
  return (
    <div className="upro-page-root">
      <main id="animatrix" className="grid">
        {mates.map((mate, index) => (
          <article className="card" key={`${mate.name}-${index}`}>
            <div className="card-id">{String(index + 1).padStart(4, '0')}</div>
            <img src={mate.image} alt={mate.name} />
            <h3>{mate.name}</h3>
            <div className="types">
              {(mate.types || []).map(type => (
                <span
                  key={type}
                  style={{ backgroundColor: typeColors.get(type) }}>
                  {type}
                </span>
              ))}
            </div>
          </article>
        ))}
      </main>
    </div>
  )
}
