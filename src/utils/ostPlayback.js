export const ostPlayback = {
  audio: null,
  trackKey: '',
  offload: false,
  loopTrackKey: '',
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
