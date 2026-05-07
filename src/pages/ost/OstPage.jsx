import { useEffect } from 'react'

const pageStyles = ""
const pageScript = "let sortMode = \"OST\"; // or \"Order\"\r\nlet playlistMode = false;\r\nlet playlist = [];   // array of song objects or indexes\r\nlet playlistIndex = 0;\r\nlet playlistAudio = null;\r\nlet playlistButton = null;\r\nlet isPlaylistPlaying = false;\r\n\r\nlet songs = [];\r\nconst ostGrid = document.getElementById('ostGrid');\r\nconst typeOptions = document.getElementById('typeOptions');\r\nconst songTypeOptions = document.getElementById('songTypeOptions');\r\nconst searchInput = document.getElementById('search');\r\n\r\nlet activeTypes = [];\r\nlet activeSongTypes = [];\r\nlet activeAreas = [];\r\nlet searchQuery = '';\r\nlet currentAudio = null;\r\nlet currentButton = null;\r\n\r\nfunction isSongPlayable(song) {\r\n  return typeof song?.file === \"string\" && song.file.trim().length > 0;\r\n}\r\n\r\n// Type colors\r\nconst typeColors = {\r\n  Normal: \"white\", Plant: \"#6BBF59\", Water: \"#3BA5FF\", Ice: \"#C9F0FF\",\r\n  Fire: \"#FF7A4D\", Earth: \"#C99C6B\", Mystic: \"#BFA6FF\", Air: \"#9ED8FF\",\r\n  Savage: \"#D6C79B\", Metal: \"#B0B8C1\", Electric: \"#F6C94C\", Artillery: \"#D88F8F\",\r\n  Light: \"#FFF3B0\", Dark: \"#3B3B3F\", Gross: \"#A8A77A\", Spectral: \"#8F7AE6\", Lucid: \"#9FE5D1\"\r\n};\r\n\r\n// helper\r\nfunction formatTime(sec) {\r\n  if (!sec || !isFinite(sec)) return '0:00';\r\n  const minutes = Math.floor(sec / 60);\r\n  const seconds = Math.floor(sec % 60);\r\n  return `${minutes}:${seconds.toString().padStart(2,'0')}`;\r\n}\r\n\r\nfunction splitTypeField(t) {\r\n  if (!t || typeof t !== 'string') return { area: 'Unknown', theme: 'Theme' };\r\n  const parts = t.split(' - ');\r\n  const area = parts[0]?.trim() || 'Unknown';\r\n  const right = (parts[1] || '').trim();\r\n  if (/Acapella/i.test(right)) return { area, theme: 'AcapellaTheme' };\r\n  if (/Meme/i.test(right)) return { area, theme: 'MemeTheme' };\r\n  if (right.length > 0) return { area, theme: right.replace(/\\s+/g,'') };\r\n  return { area, theme: 'Theme' };\r\n}\r\n\r\n// Panel toggle helper\r\nfunction addToggle(toggleId, panelId) {\r\n  const t = document.getElementById(toggleId);\r\n  const p = document.getElementById(panelId);\r\n  if (!t || !p) return;\r\n  t.addEventListener('click', ev => {\r\n    ev.stopPropagation();\r\n    p.classList.toggle('open');\r\n  });\r\n}\r\n\r\n// Close panels on outside click\r\ndocument.addEventListener('click', ev => {\r\n  if (!ev.target.closest('.multi-filter')) {\r\n    document.querySelectorAll('.filter-panel.open').forEach(panel => panel.classList.remove('open'));\r\n  }\r\n});\r\n\r\n// Load songs\r\nfetch('data/songs.json')\r\n  .then(res => res.json())\r\n  .then(data => {\r\n    songs = data.map(s => {\r\n      const song = {...s};\r\n      if (!Array.isArray(song.typing)) song.typing = song.typing ? [song.typing] : ['Unknown'];\r\n      if (!song.area || !song.theme) {\r\n        const typeField = song.type || (Array.isArray(song.types) ? song.types[0] : song.types);\r\n        const { area, theme } = splitTypeField(typeField || '');\r\n        song.area = song.area || area;\r\n        song.theme = song.theme || theme;\r\n      }\r\n      return song;\r\n    });\r\n    initFilters();\r\n    renderSongs();\r\n  })\r\n  .catch(err => console.error(\"Error loading songs.json:\", err));\r\n\r\n// Render songs\r\nfunction renderSongs() {\r\n  ostGrid.innerHTML = '';\r\n\r\n  const filtered = songs.filter(song => {\r\n    const matchSearch = song.name.toLowerCase().includes(searchQuery.toLowerCase());\r\n    const matchType = activeTypes.length === 0 || song.typing.some(t => activeTypes.includes(t));\r\n    const isFakeTheme = song.theme === 'FakeTheme';\r\n    const matchSongType = isFakeTheme\r\n      ? activeSongTypes.includes('FakeTheme')\r\n      : activeSongTypes.length === 0 || activeSongTypes.includes(song.theme);\r\n    const matchArea = activeAreas.length === 0 || activeAreas.includes(song.area);\r\n    return matchSearch && matchType && matchSongType && matchArea;\r\n  });\r\n\r\n  filtered.sort((a, b) => sortMode === \"OST\" ? (Number(a.ost) || 0) - (Number(b.ost) || 0) : (Number(a.order) || 0) - (Number(b.order) || 0));\r\n\r\n  filtered.forEach(song => {\r\n    const card = document.createElement('div');\r\n    card.classList.add('card');\r\n    const playable = isSongPlayable(song);\r\n    if (playable) {\r\n      card.dataset.file = song.file;\r\n    } else {\r\n      card.classList.add('song-unavailable');\r\n    }\r\n\r\n    const songTyping = Array.isArray(song.typing) ? song.typing : [song.typing || 'Unknown'];\r\n    card.style.border = `4px solid ${typeColors[songTyping[0]] || \"#0ff\"}`;\r\n\r\n    let audio = null;\r\n    if (playable) {\r\n      audio = document.createElement(\"audio\");\r\n      audio.src = song.file;\r\n      audio.preload = \"metadata\";\r\n      audio.onended = () => {\r\n          if (!playlistMode) {\r\n              audio.currentTime = 0;\r\n              audio.play();\r\n              if (currentButton) currentButton.textContent = \"Pause\";\r\n          }\r\n      };\r\n      card.appendChild(audio);\r\n    }\r\n\r\n    const title = document.createElement('h3'); title.textContent = song.name;\r\n    const composer = document.createElement('p'); composer.className = 'composer'; composer.textContent = `Composer: ${song.composer || 'Unknown'}`;\r\n\r\n    const infoWrap = document.createElement('div');\r\n    infoWrap.className = 'song-info-wrap';\r\n    const infoBtn = document.createElement('span');\r\n    infoBtn.className = 'song-info-icon';\r\n    infoBtn.textContent = 'i';\r\n    const infoBox = document.createElement('div');\r\n    infoBox.className = 'song-info-box';\r\n    const infoTitle = song[\"description-title\"] || \"Info\";\r\n    const infoText = song.description || \"No description yet.\";\r\n    infoBox.innerHTML = `<strong>${infoTitle}</strong><p>${infoText}</p>`;\r\n    infoWrap.appendChild(infoBtn);\r\n    infoWrap.appendChild(infoBox);\r\n\r\n    const areaEl = document.createElement('div'); areaEl.className = 'types';\r\n    const areaSpan = document.createElement('span'); areaSpan.textContent = song.area || 'Unknown'; areaEl.appendChild(areaSpan);\r\n\r\n    const themeEl = document.createElement('div'); themeEl.className = 'types';\r\n    const themeSpan = document.createElement('span'); themeSpan.textContent = song.theme || 'Theme'; themeEl.appendChild(themeSpan);\r\n\r\n    const selectBtn = document.createElement('button');\r\n    selectBtn.textContent = (playlistMode && playable) ? 'Add to Playlist' : '';\r\n    selectBtn.classList.add('playlist-btn');\r\n    if (!playable) selectBtn.disabled = true;\r\n\r\n    selectBtn.addEventListener('click', () => {\r\n        if (!playable) return;\r\n        if (!playlist.includes(song)) {\r\n            playlist.push(song);\r\n            updatePlaylistUI();\r\n            selectBtn.textContent = 'Added ✓';\r\n        }\r\n    });\r\n\r\n    const playBtn = document.createElement('button'); playBtn.textContent = 'Play'; playBtn.classList.add('play-btn');\r\n    if (!playable) {\r\n      playBtn.textContent = 'Unavailable';\r\n      playBtn.disabled = true;\r\n    }\r\n    playBtn.addEventListener('click', () => {\r\n    if (!playable) return;\r\n    if (playlistMode && playlist.length > 0) {\r\n        // Toggle play/pause for playlist\r\n        playPlaylistSong(true);\r\n        return;\r\n    }\r\n\r\n    // Normal single-song logic\r\n    if (currentAudio && currentAudio !== audio) {\r\n        currentAudio.pause();\r\n        if(currentButton) currentButton.textContent=\"Play\";\r\n    }\r\n\r\n    if(audio.paused){\r\n        audio.play();\r\n        playBtn.textContent = \"Pause\";\r\n        currentAudio = audio;\r\n        currentButton = playBtn;\r\n    } else {\r\n        audio.pause();\r\n        playBtn.textContent = \"Play\";\r\n    }\r\n  });\r\n\r\n\r\n    const timeDisplay = document.createElement('div'); timeDisplay.classList.add('time-display'); timeDisplay.textContent = '0:00 / 0:00';\r\n    if (!playable) timeDisplay.textContent = '--:-- / --:--';\r\n\r\n    const progressContainer = document.createElement('div'); progressContainer.classList.add('progress-container');\r\n    const progressBar = document.createElement('div'); progressBar.classList.add('progress-bar'); progressContainer.appendChild(progressBar);\r\n    const handle = document.createElement('div'); handle.classList.add('progress-handle'); progressContainer.appendChild(handle);\r\n    if (!playable) progressContainer.classList.add('disabled-progress');\r\n\r\n    function updateProgress() {\r\n      if (!audio) return;\r\n      const percent = (audio.currentTime / audio.duration) * 100 || 0;\r\n      progressBar.style.width = percent+'%'; handle.style.left = percent+'%';\r\n      timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;\r\n    }\r\n\r\n    if (audio) {\r\n      audio.addEventListener('loadedmetadata', updateProgress);\r\n      audio.addEventListener(\"timeupdate\", updateProgress);\r\n    }\r\n\r\n    let dragging = false;\r\n    handle.addEventListener('pointerdown', ev => {\r\n      if (!audio) return;\r\n      ev.preventDefault();\r\n      dragging=true;\r\n      handle.setPointerCapture(ev.pointerId);\r\n      if (!audio.paused) audio.pause();\r\n    });\r\n    handle.addEventListener('pointermove', ev => {\r\n      if (!audio) return;\r\n      if (!dragging) return;\r\n      const rect = progressContainer.getBoundingClientRect();\r\n      let newPercent = ((ev.clientX - rect.left)/rect.width)*100;\r\n      newPercent = Math.max(0, Math.min(100, newPercent));\r\n      progressBar.style.width = newPercent+'%'; handle.style.left = newPercent+'%';\r\n      if (audio.duration) audio.currentTime = (newPercent/100)*audio.duration;\r\n      updateProgress();\r\n    });\r\n    handle.addEventListener('pointerup', ev => {\r\n      if (!audio) return;\r\n      if (!dragging) return; dragging=false; try { handle.releasePointerCapture(ev.pointerId); } catch{}\r\n      const rect = progressContainer.getBoundingClientRect();\r\n      let newPercent = ((ev.clientX - rect.left)/rect.width); newPercent = Math.max(0, Math.min(1,newPercent));\r\n      if (audio.duration) audio.currentTime = newPercent*audio.duration;\r\n      if (currentAudio && currentAudio !== audio) { currentAudio.pause(); if(currentButton) currentButton.textContent='Play'; }\r\n      audio.play();\r\n      audio.addEventListener(\"timeupdate\", updateProgress);\r\n      currentAudio = audio;\r\n      currentButton = playBtn;\r\n      playBtn.textContent = 'Pause';\r\n    });\r\n\r\n    progressContainer.addEventListener('click', e => {\r\n      if (!audio) return;\r\n      const rect = progressContainer.getBoundingClientRect();\r\n      const clickX = e.clientX - rect.left;\r\n      const newPercent = Math.max(0, Math.min(1, clickX/rect.width));\r\n      if(audio.duration) audio.currentTime = newPercent*audio.duration; updateProgress();\r\n      if(currentAudio && currentAudio !== audio){ currentAudio.pause(); if(currentButton) currentButton.textContent='Play'; }\r\n      audio.play();\r\n      audio.addEventListener(\"timeupdate\", updateProgress);\r\n      currentAudio = audio;\r\n      currentButton = playBtn;\r\n      playBtn.textContent = 'Pause';\r\n    });\r\n\r\n    card.appendChild(infoWrap);\r\n    card.appendChild(title); card.appendChild(composer); card.appendChild(areaEl); card.appendChild(themeEl);\r\n    card.appendChild(playBtn); card.appendChild(timeDisplay); card.appendChild(progressContainer);\r\n    card.appendChild(selectBtn);\r\n    ostGrid.appendChild(card);\r\n  });\r\n}\r\n\r\n// Sort toggle\r\ndocument.getElementById(\"sortToggle\").addEventListener(\"click\", () => {\r\n  sortMode = (sortMode === \"OST\") ? \"Order\" : \"OST\";\r\n  document.getElementById(\"sortToggle\").textContent = \"Sort: \"+sortMode;\r\n  renderSongs();\r\n});\r\n\r\n// Search input\r\nsearchInput.addEventListener('input', e => { searchQuery = e.target.value||''; renderSongs(); });\r\n\r\n// Initialize filters\r\nfunction initFilters() {\r\n  typeOptions.innerHTML = '';\r\n  songTypeOptions.innerHTML = '';\r\n\r\n  const typings = [...new Set(songs.flatMap(s=>s.typing))].filter(Boolean).sort();\r\n  const themes = [...new Set(songs.map(s=>s.theme))].filter(Boolean).sort();\r\n  const areas = [...new Set(songs.map(s=>s.area))].filter(Boolean).sort();\r\n\r\n  typings.forEach(t => {\r\n    const label = document.createElement('label'); label.className='filter-label';\r\n    label.innerHTML = `<input type=\"checkbox\" value=\"${t}\"> ${t}`;\r\n    typeOptions.appendChild(label);\r\n    label.querySelector('input').addEventListener('change', e => {\r\n      if(e.target.checked) activeTypes.push(t); else activeTypes = activeTypes.filter(x=>x!==t);\r\n      renderSongs();\r\n    });\r\n  });\r\n\r\n  themes.forEach(th => {\r\n    const label = document.createElement('label'); label.className='filter-label';\r\n    label.innerHTML = `<input type=\"checkbox\" value=\"${th}\"> ${th}`;\r\n    songTypeOptions.appendChild(label);\r\n    label.querySelector('input').addEventListener('change', e => {\r\n      if(e.target.checked) activeSongTypes.push(th); else activeSongTypes = activeSongTypes.filter(x=>x!==th);\r\n      renderSongs();\r\n    });\r\n  });\r\n\r\n  // Area panel\r\n  const areaOptions = document.getElementById('areaOptions');\r\n  if(areaOptions){\r\n    areas.forEach(a=>{\r\n      const label = document.createElement('label'); label.className='filter-label';\r\n      label.innerHTML = `<input type=\"checkbox\" value=\"${a}\"> ${a}`;\r\n      areaOptions.appendChild(label);\r\n      label.querySelector('input').addEventListener('change', e=>{\r\n        if(e.target.checked) activeAreas.push(a); else activeAreas = activeAreas.filter(x=>x!==a);\r\n        renderSongs();\r\n      });\r\n    });\r\n  }\r\n\r\n  // Clear buttons\r\n  const clearTypesBtn = document.getElementById('clearTypes');\r\n  if(clearTypesBtn) clearTypesBtn.addEventListener('click', ()=>{ activeTypes=[]; typeOptions.querySelectorAll('input').forEach(i=>i.checked=false); renderSongs(); });\r\n  const clearSongTypesBtn = document.getElementById('clearSongTypes');\r\n  if(clearSongTypesBtn) clearSongTypesBtn.addEventListener('click', ()=>{ activeSongTypes=[]; songTypeOptions.querySelectorAll('input').forEach(i=>i.checked=false); renderSongs(); });\r\n  const clearAreasBtn = document.getElementById('clearAreas');\r\n  if(clearAreasBtn) clearAreasBtn.addEventListener('click', ()=>{ activeAreas=[]; areaOptions.querySelectorAll('input').forEach(i=>i.checked=false); renderSongs(); });\r\n\r\n  // Attach panel toggles\r\n  addToggle('typeToggle','typePanel');\r\n  addToggle('areaToggle','areaPanel');\r\n  addToggle('songTypeToggle','songTypePanel');\r\n}\r\ndocument.getElementById('playAllBtn').addEventListener('click', () => {\r\n  document.querySelectorAll('#ostGrid .card audio').forEach(a => a.play());\r\n});\r\n\r\ndocument.getElementById('pauseAllBtn').addEventListener('click', () => {\r\n  document.querySelectorAll('#ostGrid .card audio').forEach(a => {\r\n    a.pause();\r\n    a.currentTime = 0;\r\n  });\r\n  if (currentButton) currentButton.textContent = 'Play';\r\n});\r\n\r\ndocument.getElementById('playlistModeBtn').addEventListener('click', () => {\r\n  playlistMode = !playlistMode;\r\n\r\n  // Update toggle button text\r\n  document.getElementById('playlistModeBtn').textContent =\r\n    `Playlist Mode: ${playlistMode ? 'ON' : 'OFF'}`;\r\n\r\n  // CSS handles visibility\r\n  document.body.classList.toggle(\"playlist-mode\", playlistMode);\r\n\r\n  // Update text only\r\n  document.querySelectorAll('.playlist-btn').forEach(btn => {\r\n    const card = btn.closest('.card');\r\n    const playable = card && !card.classList.contains('song-unavailable');\r\n    btn.textContent = (playlistMode && playable) ? \"Add to Playlist\" : \"\";\r\n  });\r\n\r\n  updatePlaylistUI();\r\n});\r\n\r\nfunction playPlaylistSong(pauseToggle=false) {\r\n    if (!playlistMode || playlist.length === 0) return;\r\n\r\n    const song = playlist[playlistIndex];\r\n    const card = document.querySelector(`.card[data-file=\"${song.file}\"]`);\r\n    if (!card) return;\r\n\r\n    const audio = card.querySelector(\"audio\");\r\n    const btn = card.querySelector(\".play-btn\");\r\n\r\n    // Pause/resume toggle\r\n    if (pauseToggle && playlistAudio === audio) {\r\n        if (!audio.paused) {\r\n            audio.pause();\r\n            btn.textContent = \"Play\";\r\n            isPlaylistPlaying = false;\r\n        } else {\r\n            audio.play();\r\n            btn.textContent = \"Pause\";\r\n            isPlaylistPlaying = true;\r\n        }\r\n        return;\r\n    }\r\n\r\n    // Stop all other audio\r\n    document.querySelectorAll('#ostGrid .card audio').forEach(a => { if(a!==audio) a.pause(); });\r\n\r\n    audio.currentTime = 0;\r\n    audio.play();\r\n    btn.textContent = \"Pause\";\r\n\r\n    playlistAudio = audio;\r\n    playlistButton = btn;\r\n    isPlaylistPlaying = true;\r\n\r\n    audio.onended = () => {\r\n        if (!playlistMode) return;\r\n        playlistIndex = (playlistIndex + 1) % playlist.length;\r\n        playPlaylistSong();\r\n    };\r\n}\r\n\r\n\r\nfunction updatePlaylistUI() {\r\n    const panel = document.getElementById('playlistPanel');\r\n    const list = document.getElementById('playlistList');\r\n\r\n    // Show panel if playlist has items\r\n    panel.style.display = playlist.length > 0 ? 'block' : 'none';\r\n\r\n    list.innerHTML = \"\";\r\n\r\n    playlist.forEach((song, index) => {\r\n        const li = document.createElement('li');\r\n        li.style.display = \"flex\";\r\n        li.style.justifyContent = \"space-between\";\r\n        li.style.alignItems = \"center\";\r\n        li.style.marginBottom = \"6px\";\r\n\r\n        li.innerHTML = `\r\n            <span>${index + 1}. ${song.name}</span>\r\n            <button data-index=\"${index}\" style=\"\r\n                background:#333;\r\n                color:white;\r\n                border:none;\r\n                padding:3px 7px;\r\n                cursor:pointer;\r\n                border-radius:5px;\r\n            \">X</button>\r\n        `;\r\n\r\n        list.appendChild(li);\r\n    });\r\n\r\n    // Removal functionality\r\n    document.querySelectorAll('#playlistList button').forEach(btn => {\r\n        btn.addEventListener('click', () => {\r\n        const removeIndex = Number(btn.dataset.index);\r\n        const removedSong = playlist[removeIndex];\r\n\r\n        // Remove from playlist\r\n        playlist.splice(removeIndex, 1);\r\n\r\n        // Reset Add button on its card\r\n        const card = document.querySelector(`.card[data-file=\"${removedSong.file}\"]`);\r\n        if (card) {\r\n            const addBtn = card.querySelector('.playlist-btn');\r\n            if (addBtn) addBtn.textContent = \"Add to Playlist\";\r\n        }\r\n\r\n        playlistIndex = 0;\r\n        updatePlaylistUI();\r\n    });\r\n  });\r\n}\r\n"
const remoteScripts = []

function loadRemoteScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-upro-src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.dataset.uproSrc = src
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

export default function OstPage() {
  useEffect(() => {
    document.title = "Le Official Soundtrack"
    document.body.className = "ost-page"
    document.body.setAttribute('style', "")

    let cancelled = false

    async function startPage() {
      for (const src of remoteScripts) {
        await loadRemoteScript(src)
      }

      if (cancelled || !pageScript) return

      window.onload = null
      new Function(`${pageScript}\n//# sourceURL=OstPage.legacy.js`)()
      document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }))
      window.dispatchEvent(new Event('load'))
      if (typeof window.onload === 'function') {
        window.onload()
      }
    }

    startPage().catch(error => console.error(error))

    return () => {
      cancelled = true
      window.onload = null
    }
  }, [])

  return (
    <>
      {pageStyles && <style>{pageStyles}</style>}
      <div className="upro-page-root"><header>
    <div style={{display: 'flex'}}>
      <div id="nav-btn">
        <a href="/">
          <button>Main Menu</button>
        </a>
      </div>
      <div id="nav-btn">
        <a href="/songvote">
          <button>Song Vote</button>
        </a>
      </div>
    </div>
    <h1>Soundtrack</h1>
    {/* Search bar */}
    <div className="controls">
      <input type="text" id="search" placeholder="Search Songs..." />
    </div>
    <div id="playlistPanel" style={{position: 'fixed', right: 20, bottom: 20, background: '#111', border: '2px solid #444', padding: 15, width: 260, maxHeight: 300, overflowY: 'auto', borderRadius: 10, fontSize: 14, color: 'white', display: 'none'}}>
      <h3 style={{marginTop: 0}}>Playlist</h3>
      <ul id="playlistList" style={{listStyle: 'none', padding: 0, margin: 0}} />
    </div>
    <div className="controls">
      <button id="sortToggle">Sort: OST</button>
      <button id="playAllBtn">Play All</button>
      <button id="pauseAllBtn">Pause All</button>
      <button id="playlistModeBtn">Playlist Mode: OFF</button>
    </div>
    {/* Type filters */}
    <div className="controls">
      <div className="multi-filter" id="typeFilterWrapper">
        <button className="filter-toggle" id="typeToggle">Typing ▾</button>
        <div className="filter-panel" id="typePanel">
          <div className="panel-actions">
            <button id="clearTypes" className="clear-btn">Clear</button>
          </div>
          <div className="options" id="typeOptions" />
        </div>
      </div>
      <div className="multi-filter" id="areaWrapper">
        <button className="filter-toggle" id="areaToggle">Area ▾</button>
        <div className="filter-panel" id="areaPanel">
          <div className="panel-actions">
            <button id="clearAreas" className="clear-btn">Clear</button>
          </div>
          <div className="options" id="areaOptions" />
        </div>
      </div>
      <div className="multi-filter" id="songTypeWrapper">
        <button className="filter-toggle" id="songTypeToggle">Song Type ▾</button>
        <div className="filter-panel" id="songTypePanel">
          <div className="panel-actions">
            <button id="clearSongTypes" className="clear-btn">Clear</button>
          </div>
          <div className="options" id="songTypeOptions" />
        </div>
      </div>
    </div></header>
  {/* OST grid */}
  <main id="ostGrid" />
  {/* Optional Player Modal */}
  <div id="playerModal" className="modal hidden">
    <div className="modal-content">
      <button id="closeModal" className="close-btn">✕</button>
      <div className="modal-header">
        <h2 id="songName" />
        <p id="songComposer" />
      </div>
      <div className="modal-body">
        <audio id="songAudio" controls />
        <div className="progress-container">
          <div id="songProgress" className="progress-bar" />
        </div>
      </div>
    </div>
  </div>
  <div className="multi-filter">
  </div>
  {/* JS */}</div>
    </>
  )
}
