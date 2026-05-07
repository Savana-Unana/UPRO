import { useEffect, useMemo, useState } from 'react'
import { legacyRouteRedirects, routes } from './routes.jsx'

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
  const Component = useMemo(() => route.Component, [route])

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
      window.history.pushState(null, '', nextPath)
      setRoute(getRoute())
    }

    document.addEventListener('click', handleClick)

    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    for (const anchor of document.querySelectorAll('a[href]')) {
      const nextPath = getReactPath(anchor.getAttribute('href'))
      if (nextPath) {
        anchor.setAttribute('href', nextPath)
      }
    }
  }, [route])

  return <Component key={route.path} />
}
