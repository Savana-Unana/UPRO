import { useEffect, useRef, useState } from 'react'
import '/assets/css/mapstyle.css'

/* **Information pertaining to the map regions.** */
const regionData = {
  region1: {
    name: 'Northshore',
    image: 'assets/images/map/northshore.png',
    description: 'A beautiful shoreline region with forests and sandy beaches.',
    link: '/',
    color: '#7cb342',
  },
  region2: {
    name: 'Home',
    image: 'assets/images/map/home.png',
    description: 'Where Skip and his family live.',
    link: '/',
    color: '#8d5131',
  },
  region3: {
    name: 'Bay',
    image: 'assets/images/map/bay.png',
    description: 'A scenic bay area with water and coastal features.',
    link: '/',
    color: '#558b2f',
  },
  region4: {
    name: 'Spawn Point City',
    image: 'assets/images/map/spawnpoin_city.png',
    description: 'A bustling city where adventures begin.',
    link: '/',
    color: '#ff6f00',
  },
}

const MAP_IMAGE_SCALE = 0.42

const regions = [
  { id: 'region3', x: 0, y: 130, width: 378 * MAP_IMAGE_SCALE, height: 568 * MAP_IMAGE_SCALE },
  { id: 'region1', x: 158, y: 83, width: 452 * MAP_IMAGE_SCALE, height: 266 * MAP_IMAGE_SCALE },
  { id: 'region2', x: 107, y: 368, width: 378 * MAP_IMAGE_SCALE, height: 377 * MAP_IMAGE_SCALE },
  { id: 'region4', x: 335, y: -10, width: 570 * MAP_IMAGE_SCALE, height: 527 * MAP_IMAGE_SCALE },
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
const MIN_MAP_ZOOM = 0.9
const MAX_MAP_ZOOM = 10
const DEFAULT_MAP_ZOOM = 0.9
const MAP_ZOOM_STEP = 0.05
const DEFAULT_MAP_VIEW = { scale: DEFAULT_MAP_ZOOM, x: 0, y: 0 }
const DEFAULT_REGION_WINDOW_OFFSET = 16

export default function MapPage() {
  const [selectedRegionId, setSelectedRegionId] = useState(null)
  const [mapView, setMapView] = useState(DEFAULT_MAP_VIEW)
  const [regionWindowPosition, setRegionWindowPosition] = useState(null)
  const mapContainerRef = useRef(null)
  const regionWindowRef = useRef(null)
  const svgRef = useRef(null)
  const mapViewRef = useRef(DEFAULT_MAP_VIEW)
  const pointersRef = useRef(new Map())
  const dragRef = useRef(null)
  const pinchRef = useRef(null)
  const pendingMapViewRef = useRef(null)
  const animationFrameRef = useRef(null)
  const suppressClickRef = useRef(false)
  const regionWindowDragRef = useRef(null)

  useEffect(() => {
    document.title = 'Shiverica Map'
    document.body.className = 'map-body'
    document.body.setAttribute('style', '')

    return () => {
      document.body.classList.remove('map-body')
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    mapViewRef.current = mapView
  }, [mapView])

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

  function scheduleMapView(nextView) {
    pendingMapViewRef.current = nextView
    mapViewRef.current = nextView

    if (animationFrameRef.current) return

    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = null
      const queuedView = pendingMapViewRef.current
      pendingMapViewRef.current = null

      if (queuedView) {
        setMapView(queuedView)
      }
    })
  }

  function getRegionEntries() {
    return regions.map(region => ({
      ...region,
      data: regionData[region.id],
    }))
  }

  function clampRegionWindowPosition(nextPosition) {
    const container = mapContainerRef.current
    const regionWindow = regionWindowRef.current
    if (!container || !regionWindow) return nextPosition

    const containerRect = container.getBoundingClientRect()
    const windowRect = regionWindow.getBoundingClientRect()
    const maxX = Math.max(DEFAULT_REGION_WINDOW_OFFSET, containerRect.width - windowRect.width - DEFAULT_REGION_WINDOW_OFFSET)
    const maxY = Math.max(DEFAULT_REGION_WINDOW_OFFSET, containerRect.height - windowRect.height - DEFAULT_REGION_WINDOW_OFFSET)

    return {
      x: Math.min(maxX, Math.max(DEFAULT_REGION_WINDOW_OFFSET, nextPosition.x)),
      y: Math.min(maxY, Math.max(DEFAULT_REGION_WINDOW_OFFSET, nextPosition.y)),
    }
  }

  function selectRegion(regionId) {
    if (regionData[regionId]) {
      setSelectedRegionId(regionId)
    }
  }

  function handleMapWheel(event) {
    event.preventDefault()
    const point = getSvgPoint(event)
    const wheelDirection = event.deltaY > 0 ? -1 : 1
    const nextZoom = mapViewRef.current.scale + wheelDirection * MAP_ZOOM_STEP
    updateMapZoom(nextZoom, point)
  }

  function handleMapPointerDown(event) {
    const point = getSvgPoint(event)
    const regionElement = event.target.closest?.('.map-region')
    pointersRef.current.set(event.pointerId, point)
    event.currentTarget.setPointerCapture(event.pointerId)

    if (pointersRef.current.size === 1) {
      dragRef.current = {
        pointerId: event.pointerId,
        lastPoint: point,
        moved: false,
        regionId: regionElement?.id || null,
      }
      pinchRef.current = null
      return
    }

    if (pointersRef.current.size === 2) {
      const [firstPoint, secondPoint] = Array.from(pointersRef.current.values())
      const midpoint = getMidpoint(firstPoint, secondPoint)
      const currentView = mapViewRef.current

      dragRef.current = null
      pinchRef.current = {
        distance: getDistance(firstPoint, secondPoint),
        mapOffsetX: (midpoint.x - MAP_FRAME_CENTER - currentView.x) / currentView.scale,
        mapOffsetY: (midpoint.y - MAP_FRAME_CENTER - currentView.y) / currentView.scale,
        scale: currentView.scale,
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
      scheduleMapView({
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
        const currentView = mapViewRef.current
        scheduleMapView({
          ...currentView,
          x: currentView.x + deltaX,
          y: currentView.y + deltaY,
        })
      }

      dragRef.current.lastPoint = point
    }
  }

  function handleMapPointerEnd(event) {
    const finishedDrag = dragRef.current?.pointerId === event.pointerId ? dragRef.current : null
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

    if (event.type === 'pointerup' && finishedDrag?.regionId && !finishedDrag.moved) {
      selectRegion(finishedDrag.regionId)
    }

    if (suppressClickRef.current) {
      setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
  }

  function handleRegionClick(regionId) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    selectRegion(regionId)
  }

  function handleRegionWindowPointerDown(event) {
    if (event.button !== 0 || event.target.closest?.('button')) return

    const container = mapContainerRef.current
    const regionWindow = regionWindowRef.current
    if (!container || !regionWindow) return

    const containerRect = container.getBoundingClientRect()
    const windowRect = regionWindow.getBoundingClientRect()
    const startPosition = {
      x: windowRect.left - containerRect.left,
      y: windowRect.top - containerRect.top,
    }

    regionWindowDragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - windowRect.left,
      offsetY: event.clientY - windowRect.top,
    }

    setRegionWindowPosition(startPosition)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleRegionWindowPointerMove(event) {
    const drag = regionWindowDragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const container = mapContainerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    setRegionWindowPosition(clampRegionWindowPosition({
      x: event.clientX - containerRect.left - drag.offsetX,
      y: event.clientY - containerRect.top - drag.offsetY,
    }))
  }

  function handleRegionWindowPointerEnd(event) {
    const drag = regionWindowDragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    regionWindowDragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const selectedRegion = selectedRegionId ? regionData[selectedRegionId] : null
  const regionWindowStyle = regionWindowPosition
    ? { left: `${regionWindowPosition.x}px`, top: `${regionWindowPosition.y}px`, right: 'auto', bottom: 'auto' }
    : undefined

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
        <div ref={mapContainerRef} id="map-container">
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
            aria-label="Map regions"
            onWheel={handleMapWheel}
            onPointerDown={handleMapPointerDown}
            onPointerMove={handleMapPointerMove}
            onPointerUp={handleMapPointerEnd}
            onPointerCancel={handleMapPointerEnd}
            onPointerLeave={handleMapPointerEnd}>
            <g className="map-layer" transform={mapLayerTransform}>
              {getRegionEntries().map(region => {
                return (
                  <image
                    key={region.id}
                    id={region.id}
                    className={`map-region${selectedRegionId === region.id ? ' is-selected' : ''}`}
                    x={region.x}
                    y={region.y}
                    width={region.width}
                    height={region.height}
                    href={region.data.image}
                    preserveAspectRatio="xMidYMid slice"
                    tabIndex={0}
                    aria-label={region.data.name}
                    onClick={() => handleRegionClick(region.id)}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        selectRegion(region.id)
                      }
                    }}
                  />
                )
              })}
            </g>
          </svg>
          {selectedRegion && (
            <aside
              ref={regionWindowRef}
              className="map-region-window"
              style={regionWindowStyle}
              aria-label={`${selectedRegion.name} region data`}>
              <div
                className="map-region-window-header"
                onPointerDown={handleRegionWindowPointerDown}
                onPointerMove={handleRegionWindowPointerMove}
                onPointerUp={handleRegionWindowPointerEnd}
                onPointerCancel={handleRegionWindowPointerEnd}>
                <h2>{selectedRegion.name}</h2>
                <button
                  className="map-region-close"
                  type="button"
                  onPointerDown={event => event.stopPropagation()}
                  onClick={() => setSelectedRegionId(null)}
                  aria-label="Close region data">
                  x
                </button>
              </div>
              <div className="map-region-detail">
                <span className="map-region-swatch" style={{ backgroundColor: selectedRegion.color }} />
                <img className="map-region-image" src={selectedRegion.image} alt={selectedRegion.name} />
                <p>{selectedRegion.description}</p>
                <a className="map-region-link" href={selectedRegion.link}>
                  Open
                </a>
              </div>
            </aside>
          )}
        </div>
      </section>
    </main>
  )
}
