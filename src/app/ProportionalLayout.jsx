import { useLayoutEffect, useRef } from 'react'

// Scale the entire composition with one factor, including its text and controls.
export default function ProportionalLayout({ children, width = 1080 }) {
  const frameRef = useRef(null)
  const contentRef = useRef(null)

  useLayoutEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current
    function resize() {
      const availableHeight = document.documentElement.clientHeight
      const scale = Math.min(frame.clientWidth / width, availableHeight / content.offsetHeight)
      if (!Number.isFinite(scale) || scale <= 0) return
      content.style.transform = `scale(${scale})`
      frame.style.height = `${content.offsetHeight * scale}px`
    }
    const observer = new ResizeObserver(resize)
    observer.observe(frame)
    observer.observe(content)
    window.addEventListener('resize', resize)
    resize()
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [width])

  return (
    <div className="proportional-frame" ref={frameRef}>
      <div className="proportional-content" ref={contentRef} style={{ width }}>
        {children}
      </div>
    </div>
  )
}
