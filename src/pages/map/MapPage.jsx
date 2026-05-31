import { useEffect, useRef, useState } from 'react'
import '/assets/css/mapstyle.css'

/* **Information pertaining to the map regions.** */
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
/* **Information pertaining to the map regions.** */

const mapBounds = regions.reduce(
  (bounds, region) => ({
    minX: Math.min(bounds.minX, region.x),
    minY: Math.min(bounds.minY, region.y),
    maxX: Math.max(bounds.maxX, region.x + region.width),
    maxY: Math.max(bounds.maxY, region.y + region.height),
  }),
  { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
)

const mapContentCenter = {
  x: (mapBounds.minX + mapBounds.maxX) / 2,
  y: (mapBounds.minY + mapBounds.maxY) / 2,
}

const MAP_FRAME_CENTER = 250
const MIN_MAP_ZOOM = 4
const MAX_MAP_ZOOM = 10
const DEFAULT_MAP_ZOOM = 6
const MAP_ZOOM_STEP = 0.5
const DEFAULT_MAP_VIEW = { scale: DEFAULT_MAP_ZOOM, x: 0, y: 0 }

export default function MapPage() {
  const [selectedRegionId, setSelectedRegionId] = useState(null)
  const [mapView, setMapView] = useState(DEFAULT_MAP_VIEW)
  const svgRef = useRef(null)
  const pointersRef = useRef(new Map())
  const dragRef = useRef(null)
  const pinchRef = useRef(null)
  const suppressClickRef = useRef(false)

  useEffect(() => {
    document.title = 'Shiverica Map'
    document.body.className = 'map-body'
    document.body.setAttribute('style', '')

    return () => {
      document.body.classList.remove('map-body')
    }
  }, [])

  function clampZoom(nextZoom) {
    return Math.min(MAX_MAP_ZOOM, Math.max(MIN_MAP_ZOOM, Number(nextZoom)))
  }

  function getSvgPoint(event) {
    const svg = svgRef.current
    if (!svg) return { x: MAP_FRAME_CENTER, y: MAP_FRAME_CENTER }

    const rect = svg.getBoundingClientRect()
    const scaleX = 500 / rect.width
    const scaleY = 500 / rect.height

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    }
  }

  function getDistance(firstPoint, secondPoint) {
    return Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y)
  }

  function getMidpoint(firstPoint, secondPoint) {
    return {
      x: (firstPoint.x + secondPoint.x) / 2,
      y: (firstPoint.y + secondPoint.y) / 2,
    }
  }

  function zoomViewAtPoint(view, nextZoom, point) {
    const nextScale = clampZoom(nextZoom)
    const mapOffsetX = (point.x - MAP_FRAME_CENTER - view.x) / view.scale
    const mapOffsetY = (point.y - MAP_FRAME_CENTER - view.y) / view.scale

    return {
      scale: nextScale,
      x: point.x - MAP_FRAME_CENTER - nextScale * mapOffsetX,
      y: point.y - MAP_FRAME_CENTER - nextScale * mapOffsetY,
    }
  }

  function updateMapZoom(nextZoom, point = { x: MAP_FRAME_CENTER, y: MAP_FRAME_CENTER }) {
    setMapView(view => zoomViewAtPoint(view, nextZoom, point))
  }

  function resetMapView() {
    setMapView(DEFAULT_MAP_VIEW)
  }

  function getRegionEntries() {
    return regions.map(region => ({
      ...region,
      data: regionData[region.id],
    }))
  }

  function handleMapWheel(event) {
    event.preventDefault()
    const point = getSvgPoint(event)
    const wheelDirection = event.deltaY > 0 ? -1 : 1
    const nextZoom = mapView.scale + wheelDirection * MAP_ZOOM_STEP
    updateMapZoom(nextZoom, point)
  }

  function handleMapPointerDown(event) {
    const point = getSvgPoint(event)
    pointersRef.current.set(event.pointerId, point)
    event.currentTarget.setPointerCapture(event.pointerId)

    if (pointersRef.current.size === 1) {
      dragRef.current = { pointerId: event.pointerId, lastPoint: point, moved: false }
      pinchRef.current = null
      return
    }

    if (pointersRef.current.size === 2) {
      const [firstPoint, secondPoint] = Array.from(pointersRef.current.values())
      const midpoint = getMidpoint(firstPoint, secondPoint)

      dragRef.current = null
      pinchRef.current = {
        distance: getDistance(firstPoint, secondPoint),
        mapOffsetX: (midpoint.x - MAP_FRAME_CENTER - mapView.x) / mapView.scale,
        mapOffsetY: (midpoint.y - MAP_FRAME_CENTER - mapView.y) / mapView.scale,
        scale: mapView.scale,
      }
    }
  }

  function handleMapPointerMove(event) {
    if (!pointersRef.current.has(event.pointerId)) return

    const point = getSvgPoint(event)
    pointersRef.current.set(event.pointerId, point)

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const [firstPoint, secondPoint] = Array.from(pointersRef.current.values())
      const midpoint = getMidpoint(firstPoint, secondPoint)
      const nextScale = clampZoom(
        pinchRef.current.scale * (getDistance(firstPoint, secondPoint) / pinchRef.current.distance),
      )

      suppressClickRef.current = true
      setMapView({
        scale: nextScale,
        x: midpoint.x - MAP_FRAME_CENTER - nextScale * pinchRef.current.mapOffsetX,
        y: midpoint.y - MAP_FRAME_CENTER - nextScale * pinchRef.current.mapOffsetY,
      })
      return
    }

    if (dragRef.current?.pointerId === event.pointerId) {
      const deltaX = point.x - dragRef.current.lastPoint.x
      const deltaY = point.y - dragRef.current.lastPoint.y

      if (Math.hypot(deltaX, deltaY) > 0.8 || dragRef.current.moved) {
        suppressClickRef.current = true
        dragRef.current.moved = true
        setMapView(view => ({
          ...view,
          x: view.x + deltaX,
          y: view.y + deltaY,
        }))
      }

      dragRef.current.lastPoint = point
    }
  }

  function handleMapPointerEnd(event) {
    pointersRef.current.delete(event.pointerId)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (pointersRef.current.size < 2) {
      pinchRef.current = null
    }

    if (pointersRef.current.size === 1) {
      const [pointerId, point] = Array.from(pointersRef.current.entries())[0]
      dragRef.current = { pointerId, lastPoint: point, moved: false }
    } else {
      dragRef.current = null
    }
  }

  function handleMapClick(event) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    const regionElement = event.target.closest?.('.map-region')
    if (regionElement?.id && regionData[regionElement.id]) {
      setSelectedRegionId(regionElement.id)
    }
  }

  const mapLayerTransform = [
    `translate(${MAP_FRAME_CENTER + mapView.x} ${MAP_FRAME_CENTER + mapView.y})`,
    `scale(${mapView.scale})`,
    `translate(${-mapContentCenter.x} ${-mapContentCenter.y})`,
  ].join(' ')

  return (
    <main className="upro-page-root map-page">
      <header className="map-header">
        <a className="map-button map-back-button" href="/">
          Back
        </a>
        <h1>Shiverica Map</h1>
      </header>

      <section className="map-stage" aria-label="Shiverica map">
        <div id="map-container">
          <div className="map-zoom-controls" aria-label="Map zoom controls">
            <button
              className="map-button map-zoom-button"
              type="button"
              onClick={() => updateMapZoom(mapView.scale - MAP_ZOOM_STEP)}
              aria-label="Zoom out">
              -
            </button>
            <input
              className="map-zoom-slider"
              type="range"
              min={MIN_MAP_ZOOM}
              max={MAX_MAP_ZOOM}
              step={MAP_ZOOM_STEP}
              value={mapView.scale}
              onChange={event => updateMapZoom(event.target.value)}
              aria-label="Map zoom"
            />
            <button
              className="map-button map-zoom-button"
              type="button"
              onClick={() => updateMapZoom(mapView.scale + MAP_ZOOM_STEP)}
              aria-label="Zoom in">
              +
            </button>
            <button
              className="map-button map-reset-button"
              type="button"
              onClick={resetMapView}>
              Center
            </button>
          </div>
          <svg
            ref={svgRef}
            id="map"
            viewBox="0 0 500 500"
            role="img"
            aria-label="Clickable map regions"
            onWheel={handleMapWheel}
            onPointerDown={handleMapPointerDown}
            onPointerMove={handleMapPointerMove}
            onPointerUp={handleMapPointerEnd}
            onPointerCancel={handleMapPointerEnd}
            onPointerLeave={handleMapPointerEnd}
            onClick={handleMapClick}>
            <g className="map-layer" transform={mapLayerTransform}>
              {getRegionEntries().map(region => {
                return (
                  <rect
                    key={region.id}
                    id={region.id}
                    className={`map-region${selectedRegionId === region.id ? ' is-selected' : ''}`}
                    x={region.x}
                    y={region.y}
                    width={region.width}
                    height={region.height}
                    fill={region.data.color}
                    stroke="#0d0d0f"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    tabIndex={0}
                    aria-label={region.data.name}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedRegionId(region.id)
                      }
                    }}
                  />
                )
              })}
            </g>
          </svg>
          <aside className="map-region-window" aria-label="Map region data">
            <div className="map-region-list">
              {getRegionEntries().map(region => (
                <article
                  key={region.id}
                  className={`map-region-card${selectedRegionId === region.id ? ' is-selected' : ''}`}>
                  <button
                    className="map-region-card-button"
                    type="button"
                    onClick={() => setSelectedRegionId(region.id)}
                    aria-label={`Select ${region.data.name}`}>
                    <span className="map-region-swatch" style={{ backgroundColor: region.data.color }} />
                    <img className="map-region-image" src={region.data.image} alt={region.data.name} />
                    <span className="map-region-copy">
                      <strong>{region.data.name}</strong>
                      <span>{region.data.description}</span>
                    </span>
                  </button>
                  <a className="map-region-link" href={region.data.link}>
                    Open
                  </a>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
