import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { legacyRouteRedirects, routes } from './routes.jsx'
import { startBorgoSlorEffect } from '../utils/borgoSlorEffect.js'

const routeByPath = new Map(routes.map(route => [route.path.toLowerCase(), route]))
const basePath = normalizeBasePath(import.meta.env.BASE_URL)

function normalizeBasePath(baseUrl) {
  if (!baseUrl || baseUrl === './') return '/'

  const path = baseUrl.startsWith('http') ? new URL(baseUrl).pathname : baseUrl
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`
  const withoutTrailingSlash = withLeadingSlash.endsWith('/')
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash

  return withoutTrailingSlash || '/'
}

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function stripBasePath(pathname) {
  if (basePath === '/') return pathname

  const normalized = normalizePath(pathname)
  const lowerPath = normalized.toLowerCase()
  const lowerBase = basePath.toLowerCase()

  if (lowerPath === lowerBase) return '/'
  if (lowerPath.startsWith(`${lowerBase}/`)) {
    return normalized.slice(basePath.length) || '/'
  }

  return normalized
}

function withBasePath(pathname) {
  if (basePath === '/') return pathname
  if (pathname === '/') return `${basePath}/`
  return `${basePath}${pathname}`
}

function cleanLegacyPath(pathname) {
  const normalized = normalizePath(stripBasePath(pathname))
  return legacyRouteRedirects.get(normalized) || normalized
}

function getRoute() {
  const pathname = cleanLegacyPath(window.location.pathname)
  return routeByPath.get(pathname.toLowerCase()) || routeByPath.get('/')
}

function getReactPath(href) {
  if (!href || href.startsWith('#')) return null

  const url = new URL(href, window.location.href)

  if (url.origin !== window.location.origin) {
    return null
  }

  const pathname = cleanLegacyPath(url.pathname)

  if (!routeByPath.has(pathname.toLowerCase())) {
    return null
  }

  return `${withBasePath(pathname)}${url.search}${url.hash}`
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [effects,setEffects] = useState([])
  const [graffitiColors,setGraffitiColors] = useState(['#ff0099','#00ffff','#88ff00'])
  const [walkers,setWalkers] = useState([])
  const nextWalkerId = useRef(0)
  useEffect(() => {
    const activate = event => {
      setEffects(current => current.includes(event.detail) ? current : [...current,event.detail])
      if (event.detail==='trader'||event.detail==='blarb') {
        const walker={id:++nextWalkerId.current,effect:event.detail,top:`${8+Math.random()*64}%`,reverse:Math.random()<.5}
        setWalkers(current => [...current,walker])
      }
    }
    window.addEventListener('upro-effect',activate)
    return () => window.removeEventListener('upro-effect',activate)
  },[])
  useEffect(() => {
    if (!effects.includes('graffiti')) return undefined
    const timer = window.setInterval(() => setGraffitiColors(Array.from({length:3},()=>`#${Math.floor(Math.random()*0x1000000).toString(16).padStart(6,'0')}`)),250)
    return () => window.clearInterval(timer)
  },[effects])
  const borgoActive = effects.includes('borgo')
  useEffect(() => borgoActive ? startBorgoSlorEffect() : undefined, [borgoActive])
  const Component = useMemo(() => route.Component, [route])
  const navigateTo = useCallback((href) => {
    const nextPath = getReactPath(href)

    if (!nextPath) {
      window.location.href = href
      return false
    }

    window.history.pushState(null, '', nextPath)
    setRoute(getRoute())
    return true
  }, [])

  useEffect(() => {
    window.uproNavigate = navigateTo

    return () => {
      delete window.uproNavigate
    }
  }, [navigateTo])

  useEffect(() => {
    const cleanPath = cleanLegacyPath(window.location.pathname)
    const currentPath = normalizePath(stripBasePath(window.location.pathname))

    if (cleanPath !== currentPath) {
      window.history.replaceState(null, '', `${withBasePath(cleanPath)}${window.location.search}${window.location.hash}`)
    }
  }, [])

  useEffect(() => {
    function handlePopState() {
      setRoute(getRoute())
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    function handleClick(event) {
      const anchor = event.target.closest?.('a[href]')
      const nextPath = anchor ? getReactPath(anchor.getAttribute('href')) : null

      if (!nextPath) return

      event.preventDefault()
      navigateTo(anchor.getAttribute('href'))
    }

    document.addEventListener('click', handleClick)

    return () => document.removeEventListener('click', handleClick)
  }, [navigateTo])

  useEffect(() => {
    for (const anchor of document.querySelectorAll('a[href]')) {
      const nextPath = getReactPath(anchor.getAttribute('href'))
      if (nextPath) {
        anchor.setAttribute('href', nextPath)
      }
    }
  }, [route])

  useEffect(() => {
    const rawSequence = sessionStorage.getItem('upro_spongus_sequence')
    if (!rawSequence) return undefined

    let sequence
    try {
      sequence = JSON.parse(rawSequence)
    } catch {
      sessionStorage.removeItem('upro_spongus_sequence')
      return undefined
    }

    if (!Array.isArray(sequence) || !sequence.length) {
      sessionStorage.removeItem('upro_spongus_sequence')
      return undefined
    }

    const timer = window.setTimeout(() => {
      const [next, ...remaining] = sequence
      if (remaining.length) sessionStorage.setItem('upro_spongus_sequence', JSON.stringify(remaining))
      else sessionStorage.removeItem('upro_spongus_sequence')

      if (next === 'animate:Spongus') {
        sessionStorage.setItem('upro_open_animate', 'Spongus')
        navigateTo('/animatrix')
      } else {
        navigateTo(next)
      }
    }, 850)

    return () => window.clearTimeout(timer)
  }, [navigateTo, route])

  return <><Component key={route.path} />{effects.includes('graffiti') && <style>{`body *:not(input) { color: ${graffitiColors[0]} !important; border-color: ${graffitiColors[1]} !important; } body img { filter: hue-rotate(${parseInt(graffitiColors[2].slice(1,3),16)*1.4}deg) !important; }`}</style>}{walkers.map(({id,effect,top,reverse})=><img key={id} className={`upro-effect-walker ${effect==='blarb'?'is-blarb':''} ${reverse?'is-reverse':''}`} style={{top}} onAnimationIteration={() => setWalkers(current=>current.map(item=>item.id===id?{...item,top:`${8+Math.random()*64}%`,reverse:Math.random()<.5}:item))} src={effect==='trader'?'assets/images/ui/MysteriousTrader.png':'assets/images/mates/base/Blarb.png'} alt="" aria-hidden="true" />)}</>
}
