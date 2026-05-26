import { useEffect, useMemo, useState } from 'react'
import '/assets/css/mapstyle.css'

const regionData = {
  region1: {
    name: 'Home',
    image: 'assets/images/mates/lost/MissingNo.png',
    description: 'Where Skip and his family live.',
    link: '/',
    color: '#8d5131',
  },
  region2: {
    name: 'Homegrounds',
    image: 'assets/images/mates/lost/MissingNo.png',
    description: 'Ariel Salama is here.',
    link: '/',
    color: '#4fb06d',
  },
  region3: {
    name: 'Lake Wyonaut',
    image: 'assets/images/mates/lost/MissingNo.png',
    description: 'Deep waters. Great for fishing!',
    link: '/',
    color: '#3ba5ff',
  },
}

const regions = [
  { id: 'region1', x: 0, y: 400, width: 25, height: 25 },
  { id: 'region2', x: 0, y: 425, width: 25, height: 25 },
  { id: 'region3', x: 25, y: 400, width: 25, height: 25 },
]

export default function MapPage() {
  const [selectedRegionId, setSelectedRegionId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    document.title = 'Shiverica Map'
    document.body.className = 'map-body'
    document.body.setAttribute('style', '')

    return () => {
      document.body.classList.remove('map-body')
    }
  }, [])

  const selectedRegion = selectedRegionId ? regionData[selectedRegionId] : null
  const normalizedSearch = searchTerm.trim().toLowerCase()

  const visibleRegionIds = useMemo(() => {
    if (!normalizedSearch) return new Set(regions.map(region => region.id))

    return new Set(
      regions
        .filter(region => {
          const data = regionData[region.id]
          return data.name.toLowerCase().includes(normalizedSearch) || region.id.includes(normalizedSearch)
        })
        .map(region => region.id),
    )
  }, [normalizedSearch])

  function openSelectedLocation() {
    if (selectedRegion?.link) {
      window.location.href = selectedRegion.link
    }
  }

  return (
    <main className="upro-page-root map-page">
      <header className="map-header">
        <h1>Shiverica Map</h1>
        <input
          type="text"
          id="search"
          placeholder="Type Location"
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
        />
      </header>

      <section className="map-stage" aria-label="Shiverica map">
        <div id="map-container">
          <svg id="map" viewBox="0 0 500 500" role="img" aria-label="Clickable map regions">
            {regions.map(region => {
              const data = regionData[region.id]
              const isDimmed = !visibleRegionIds.has(region.id)

              return (
                <rect
                  key={region.id}
                  id={region.id}
                  className={`map-region${isDimmed ? ' is-dimmed' : ''}`}
                  x={region.x}
                  y={region.y}
                  width={region.width}
                  height={region.height}
                  fill={data.color}
                  tabIndex={0}
                  aria-label={data.name}
                  onClick={() => setSelectedRegionId(region.id)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedRegionId(region.id)
                    }
                  }}
                />
              )
            })}
          </svg>
        </div>

        <aside
          id="location-details"
          className={!selectedRegion ? 'location-details-empty' : undefined}
          aria-live="polite">
          {selectedRegion ? (
            <>
              <p className="location-kicker">Location</p>
              <h2 id="location-name">{selectedRegion.name}</h2>
              <button
                className="location-image-button"
                type="button"
                onClick={openSelectedLocation}
                aria-label={`Open ${selectedRegion.name}`}>
                <img id="location-image" src={selectedRegion.image} alt={selectedRegion.name} />
              </button>
              <p id="location-description">{selectedRegion.description}</p>
              <div className="location-actions">
                <button className="map-button" type="button" onClick={() => setSelectedRegionId(null)}>
                  Back
                </button>
              </div>
            </>
          ) : (
            <p id="location-description">Select a region to view details.</p>
          )}
        </aside>
      </section>

      <nav id="nav-buttons" aria-label="Map navigation">
        <a className="map-button" href="/">
          Return
        </a>
      </nav>
    </main>
  )
}
