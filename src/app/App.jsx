import { useEffect, useMemo, useState } from 'react'
import { legacyRouteRedirects, routes } from './routes.jsx'

const routeByPath = new Map(routes.map(route => [route.path.toLowerCase(), route]))

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function cleanLegacyPath(pathname) {
  const normalized = normalizePath(pathname)
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

  return `${pathname}${url.search}${url.hash}`
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const Component = useMemo(() => route.Component, [route])

  useEffect(() => {
    const cleanPath = cleanLegacyPath(window.location.pathname)

    if (cleanPath !== normalizePath(window.location.pathname)) {
      window.history.replaceState(null, '', `${cleanPath}${window.location.search}${window.location.hash}`)
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
      window.history.pushState(null, '', nextPath)
      setRoute(getRoute())
    }

    document.addEventListener('click', handleClick)

    return () => document.removeEventListener('click', handleClick)
  }, [])

  return <Component key={route.path} />
}
