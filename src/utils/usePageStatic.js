import { useEffect } from 'react'

let skipStaticActivated = false
let skipStaticAudio

function getSkipStaticAudio() {
  skipStaticAudio ||= new Audio(`${import.meta.env.BASE_URL}assets/audio/static.mp3`)
  skipStaticAudio.loop = true
  skipStaticAudio.volume = 0.08
  return skipStaticAudio
}

export function activateSkipStatic() {
  skipStaticActivated = true
  getSkipStaticAudio().play().catch(() => {})
}

export function usePageStatic() {
  useEffect(() => {
    if (!skipStaticActivated) return undefined
    const audio = getSkipStaticAudio()
    const play = () => audio.play().then(() => {
      window.removeEventListener('pointerdown',play)
      window.removeEventListener('keydown',play)
    }).catch(() => {})
    play()
    window.addEventListener('pointerdown',play)
    window.addEventListener('keydown',play)
    return () => {
      window.removeEventListener('pointerdown',play)
      window.removeEventListener('keydown',play)
      audio.pause()
    }
  }, [])
}
