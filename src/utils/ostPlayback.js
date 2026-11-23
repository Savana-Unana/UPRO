const OST_QUEUE_KEY = 'upro_ost_queue'
const OST_QUEUE_MODE_KEY = 'upro_ost_queue_mode'

function loadSavedQueue() {
  if (typeof window === 'undefined') return []
  try {
    const saved = JSON.parse(window.localStorage.getItem(OST_QUEUE_KEY) || '[]')
    return Array.isArray(saved) ? saved.filter(track => track?.key && track?.file) : []
  } catch {
    return []
  }
}

export const ostPlayback = {
  audio: null,
  trackKey: '',
  offload: false,
  loopTrackKey: '',
  queue: loadSavedQueue(),
  queueMode: typeof window !== 'undefined' && window.localStorage.getItem(OST_QUEUE_MODE_KEY) === 'cycle' ? 'cycle' : 'remove',
  sequence: [],
  offloadEndedHandler: null,
}

export function getOstAudio() {
  ostPlayback.audio ||= new Audio()
  return ostPlayback.audio
}

export function setOstTrackKey(key) {
  ostPlayback.trackKey = key
}

export function setOstOffload(enabled) {
  ostPlayback.offload = enabled
}

export function setOstLoopTrackKey(key) {
  ostPlayback.loopTrackKey = key
}

export function setOstQueue(queue) {
  ostPlayback.queue = Array.isArray(queue)
    ? queue.map(track => ({ key: track.key, file: track.file, name: track.name })).filter(track => track.key && track.file)
    : []
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(OST_QUEUE_KEY, JSON.stringify(ostPlayback.queue))
  }
}

export function setOstQueueMode(mode) {
  ostPlayback.queueMode = mode === 'cycle' ? 'cycle' : 'remove'
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(OST_QUEUE_MODE_KEY, ostPlayback.queueMode)
  }
}

export function setOstSequence(tracks) {
  ostPlayback.sequence = Array.isArray(tracks)
    ? tracks.map(track => ({ key: track.key, file: track.file, name: track.name })).filter(track => track.key && track.file)
    : []
}

export function stopOstOffloadAdvance() {
  if (!ostPlayback.audio || !ostPlayback.offloadEndedHandler) return
  ostPlayback.audio.removeEventListener('ended', ostPlayback.offloadEndedHandler)
  ostPlayback.offloadEndedHandler = null
}

export function startOstOffloadAdvance() {
  const audio = getOstAudio()
  stopOstOffloadAdvance()
  ostPlayback.offloadEndedHandler = () => {
    if (!ostPlayback.offload || ostPlayback.loopTrackKey) return
    let nextTrack = null
    if (ostPlayback.queue.length) {
      nextTrack = ostPlayback.queue[0]
      const remainingQueue = ostPlayback.queue.slice(1)
      setOstQueue(ostPlayback.queueMode === 'cycle' ? [...remainingQueue, nextTrack] : remainingQueue)
    } else if (ostPlayback.sequence.length) {
      const currentIndex = ostPlayback.sequence.findIndex(track => track.key === ostPlayback.trackKey)
      nextTrack = ostPlayback.sequence[currentIndex >= ostPlayback.sequence.length - 1 ? 0 : currentIndex + 1]
    }
    if (!nextTrack) return
    setOstTrackKey(nextTrack.key)
    audio.src = nextTrack.file
    audio.load()
    audio.play().catch(() => {})
  }
  audio.addEventListener('ended', ostPlayback.offloadEndedHandler)
}
