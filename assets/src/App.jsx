import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import coverArt from './assets/UPRO-OSTs.png'

const songFiles = import.meta.glob('./assets/songs/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default',
})

const trackOrder = [
  'UPRO',
  'SpawnPoint',
  'DawnPoint',
  'Haven',
  'Tranquility',
  'CrystalineCaverns',
  'AnotherWorld',
  'InterstellarAscension',
  'CalloftheWild',
  'Snowscape',
  'ModestAshore',
  'HumbleAshore',
  'FrenzyAshore',
  'SussyAshore',
  'DistantRumbles',
  'TumblingRumbles',
  'CircuitBreaker',
  'HapticElectric',
  'HecticElectric',
  'SkepticElectric',
  'SkibidiElectric',
  'ErecticElectric',
  'Recharging',
  'SparksOfHope',
  'CalmAfterTheStorm',
  'Familiarity',
  'Reminiscence',
  'Evolution',
  'Relocation',
  'Standstill',
  'Despair',
  'Repression',
  'Relinquish',
  'Desecration',
  'DesecrationCT',
  'Fury',
  'Greatest',
  'Bait',
  'Carpet',
  'JustKidding',
  'Demo',
  'OnTheBlockDemo',
  'HumbleAshoreAcapella',
  'static',
  'construction',
]

const titleOverrides = {
  CalloftheWild: 'Call of the Wild',
  DesecrationCT: 'Desecration CT',
  OnTheBlockDemo: 'On The Block Demo',
  HumbleAshoreAcapella: 'Humble Ashore Acapella',
  static: 'Static',
  construction: 'Construction',
}

function getSongKey(path) {
  return path.split('/').pop().replace('.mp3', '')
}

function formatTitle(key) {
  if (titleOverrides[key]) {
    return titleOverrides[key]
  }

  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) {
    return '--:--'
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function formatTotalDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return 'Original soundtrack'
  }

  const minutes = Math.round(seconds / 60)

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours} hr ${remainingMinutes} min`
  }

  return `${minutes} min`
}

function App() {
  const baseTracks = useMemo(() => {
    const songsByKey = Object.entries(songFiles).reduce((songs, [path, src]) => {
      songs[getSongKey(path)] = src
      return songs
    }, {})

    return trackOrder
      .filter((key) => songsByKey[key])
      .map((key) => ({
        key,
        title: formatTitle(key),
        artist: 'UPRO',
        album: 'UPRO Original Soundtrack',
        src: songsByKey[key],
      }))
  }, [])

  const audioRef = useRef(null)
  const uploadedTracksRef = useRef([])
  const [uploadedTracks, setUploadedTracks] = useState([])
  const [durations, setDurations] = useState({})
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const tracks = useMemo(
    () => [...baseTracks, ...uploadedTracks],
    [baseTracks, uploadedTracks],
  )

  const currentTrack = tracks[currentTrackIndex] || tracks[0]

  useEffect(() => {
    const audioElements = tracks.map((track) => {
      const audio = new Audio(track.src)
      audio.preload = 'metadata'

      const handleLoadedMetadata = () => {
        setDurations((currentDurations) => ({
          ...currentDurations,
          [track.key]: audio.duration,
        }))
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.load()

      return { audio, handleLoadedMetadata }
    })

    return () => {
      audioElements.forEach(({ audio, handleLoadedMetadata }) => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      })
    }
  }, [tracks])

  useEffect(() => {
    uploadedTracksRef.current = uploadedTracks
  }, [uploadedTracks])

  useEffect(() => {
    return () => {
      uploadedTracksRef.current.forEach((track) => {
        URL.revokeObjectURL(track.src)
      })
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio || !currentTrack) {
      return
    }

    audio.src = currentTrack.src
    audio.load()
    setCurrentTime(0)
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio || !currentTrack) {
      return
    }

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [currentTrack, isPlaying])

  const totalDuration = tracks.reduce(
    (total, track) => total + (durations[track.key] || 0),
    0,
  )

  const currentDuration = durations[currentTrack?.key] || 0
  const progressPercent =
    currentDuration > 0 ? Math.min((currentTime / currentDuration) * 100, 100) : 0

  function playTrack(index) {
    setCurrentTrackIndex(index)
    setIsPlaying(true)
  }

  function togglePlaylistPlayback() {
    if (!currentTrack) {
      return
    }

    setIsPlaying((currentlyPlaying) => !currentlyPlaying)
  }

  function playPreviousTrack() {
    setCurrentTrackIndex((index) => Math.max(index - 1, 0))
    setIsPlaying(true)
  }

  function playNextTrack() {
    setCurrentTrackIndex((index) => {
      if (index >= tracks.length - 1) {
        return 0
      }

      return index + 1
    })
    setIsPlaying(true)
  }

  function handleEnded() {
    if (currentTrackIndex >= tracks.length - 1) {
      setIsPlaying(false)
      setCurrentTime(0)
      return
    }

    playNextTrack()
  }

  function handleSeek(event) {
    const audio = audioRef.current
    const nextTime = Number(event.target.value)

    if (!audio) {
      return
    }

    audio.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  function handleUpload(event) {
    const files = Array.from(event.target.files || []).filter(
      (file) => file.type === 'audio/mpeg' || file.name.endsWith('.mp3'),
    )

    if (files.length === 0) {
      return
    }

    setUploadedTracks((currentTracks) => [
      ...currentTracks,
      ...files.map((file, index) => {
        const title = file.name.replace(/\.mp3$/i, '')

        return {
          key: `upload-${Date.now()}-${index}-${file.name}`,
          title,
          artist: 'Uploaded song',
          album: 'UPRO Original Soundtrack',
          src: URL.createObjectURL(file),
        }
      }),
    ])
    setIsUploadOpen(false)
    event.target.value = ''
  }

  return (
    <main className="playlist-shell">
      <section className="playlist">
        <header className="playlist-hero">
          <div className="playlist-cover" aria-hidden="true">
            <img src={coverArt} alt="UPRO OSTs playlist cover" />
          </div>

          <div className="playlist-details">
            <p className="playlist-type">Playlist</p>
            <h1>UPRO Original Soundtrack</h1>
            <p className="playlist-description">
              The Original Soundtrack for the UPRO game.
            </p>
            <p className="playlist-meta">
              <strong>Ostify</strong>
              <span>{tracks.length} songs</span>
              <span>{formatTotalDuration(totalDuration)}</span>
            </p>
          </div>
        </header>

        <div className="playlist-actions" aria-label="Playlist controls">
          <button
            className={`play-button ${isPlaying ? 'is-playing' : ''}`}
            type="button"
            aria-label={isPlaying ? 'Pause playlist' : 'Play playlist'}
            onClick={togglePlaylistPlayback}
          >
            <span aria-hidden="true"></span>
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Add songs"
            onClick={() => setIsUploadOpen(true)}
          >
            +
          </button>
          <button className="icon-button" type="button" aria-label="More options">
            ...
          </button>
        </div>

        <section className="track-list" aria-label="Playlist songs">
          <div className="track-heading">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span className="track-duration">Time</span>
          </div>

          <div className="tracks">
            {tracks.map((track, index) => (
              <button
                className={`track-row ${index === currentTrackIndex ? 'is-current' : ''}`}
                type="button"
                key={track.key}
                onClick={() => playTrack(index)}
              >
                <span className="track-number">{index + 1}</span>
                <span className="track-title-cell">
                  <img src={coverArt} alt="" />
                  <span>
                    <span className="track-title">{track.title}</span>
                    <span className="track-artist">{track.artist}</span>
                  </span>
                </span>
                <span className="track-album">{track.album}</span>
                <span className="track-duration">
                  {formatDuration(durations[track.key])}
                </span>
              </button>
            ))}
          </div>
        </section>
      </section>

      {isUploadOpen && (
        <div
          className="upload-backdrop"
          role="presentation"
          onClick={() => setIsUploadOpen(false)}
        >
          <section
            className="upload-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div>
              <h2 id="upload-title">Add MP3 files</h2>
              <p>Uploaded songs will be added to the end of the playlist.</p>
            </div>

            <label className="upload-dropzone">
              <span>Choose MP3 files</span>
              <input type="file" accept="audio/mpeg,.mp3" multiple onChange={handleUpload} />
            </label>

            <button
              className="dialog-close"
              type="button"
              onClick={() => setIsUploadOpen(false)}
            >
              Close
            </button>
          </section>
        </div>
      )}

      <footer className="now-playing-bar" aria-label="Now playing">
        <div className="now-playing-track">
          {currentTrack && <img src={coverArt} alt="" />}
          <div>
            <p>{currentTrack?.title || 'No song selected'}</p>
            <span>{currentTrack?.artist || 'UPRO'}</span>
          </div>
          <button className="mini-add-button" type="button" aria-label="Save current song">
            +
          </button>
        </div>

        <div className="player-center">
          <div className="transport-controls">
            <button type="button" aria-label="Shuffle" className="transport-button shuffle-icon">
              <span aria-hidden="true"></span>
            </button>
            <button type="button" aria-label="Previous song" className="transport-button skip-back-icon" onClick={playPreviousTrack}>
              <span aria-hidden="true"></span>
            </button>
            <button
              type="button"
              className={`player-play-button ${isPlaying ? 'is-playing' : ''}`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlaylistPlayback}
            >
              <span aria-hidden="true"></span>
            </button>
            <button type="button" aria-label="Next song" className="transport-button skip-forward-icon" onClick={playNextTrack}>
              <span aria-hidden="true"></span>
            </button>
            <button type="button" aria-label="Repeat" className="transport-button repeat-icon">
              <span aria-hidden="true"></span>
            </button>
          </div>

          <div className="progress-row">
            <span>{formatDuration(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={currentDuration || 0}
              value={Math.min(currentTime, currentDuration || 0)}
              onChange={handleSeek}
              aria-label="Seek through current song"
              style={{ '--progress': `${progressPercent}%` }}
            />
            <span>{formatDuration(currentDuration)}</span>
          </div>
        </div>

        <div className="player-side-controls" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <div></div>
        </div>
      </footer>

      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
      />
    </main>
  )
}

export default App
