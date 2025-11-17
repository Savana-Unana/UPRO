let sortMode = "OST"; // or "Order"
let playlistMode = false;
let playlist = [];   // array of song objects or indexes
let playlistIndex = 0;

let songs = [];
const ostGrid = document.getElementById('ostGrid');
const typeOptions = document.getElementById('typeOptions');
const songTypeOptions = document.getElementById('songTypeOptions');
const searchInput = document.getElementById('search');

let activeTypes = [];
let activeSongTypes = [];
let activeAreas = [];
let searchQuery = '';
let currentAudio = null;
let currentButton = null;

// Type colors
const typeColors = {
  Normal: "white", Plant: "#6BBF59", Water: "#3BA5FF", Ice: "#C9F0FF",
  Fire: "#FF7A4D", Earth: "#C99C6B", Mystic: "#BFA6FF", Air: "#9ED8FF",
  Savage: "#D6C79B", Metal: "#B0B8C1", Electric: "#F6C94C", Artillery: "#D88F8F",
  Light: "#FFF3B0", Dark: "#3B3B3F", Gross: "#A8A77A", Spectral: "#8F7AE6", Lucid: "#9FE5D1"
};

// helper
function formatTime(sec) {
  if (!sec || !isFinite(sec)) return '0:00';
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds.toString().padStart(2,'0')}`;
}

function splitTypeField(t) {
  if (!t || typeof t !== 'string') return { area: 'Unknown', theme: 'Theme' };
  const parts = t.split(' - ');
  const area = parts[0]?.trim() || 'Unknown';
  const right = (parts[1] || '').trim();
  if (/Acapella/i.test(right)) return { area, theme: 'AcapellaTheme' };
  if (/Meme/i.test(right)) return { area, theme: 'MemeTheme' };
  if (right.length > 0) return { area, theme: right.replace(/\s+/g,'') };
  return { area, theme: 'Theme' };
}

// Panel toggle helper
function addToggle(toggleId, panelId) {
  const t = document.getElementById(toggleId);
  const p = document.getElementById(panelId);
  if (!t || !p) return;
  t.addEventListener('click', ev => {
    ev.stopPropagation();
    p.classList.toggle('open');
  });
}

// Close panels on outside click
document.addEventListener('click', ev => {
  if (!ev.target.closest('.multi-filter')) {
    document.querySelectorAll('.filter-panel.open').forEach(panel => panel.classList.remove('open'));
  }
});

// Load songs
fetch('data/songs.json')
  .then(res => res.json())
  .then(data => {
    songs = data.map(s => {
      const song = {...s};
      if (!Array.isArray(song.typing)) song.typing = song.typing ? [song.typing] : ['Unknown'];
      if (!song.area || !song.theme) {
        const typeField = song.type || (Array.isArray(song.types) ? song.types[0] : song.types);
        const { area, theme } = splitTypeField(typeField || '');
        song.area = song.area || area;
        song.theme = song.theme || theme;
      }
      return song;
    });
    initFilters();
    renderSongs();
  })
  .catch(err => console.error("Error loading songs.json:", err));

// Render songs
function renderSongs() {
  ostGrid.innerHTML = '';

  const filtered = songs.filter(song => {
    const matchSearch = song.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = activeTypes.length === 0 || song.typing.some(t => activeTypes.includes(t));
    const matchSongType = activeSongTypes.length === 0 || activeSongTypes.includes(song.theme);
    const matchArea = activeAreas.length === 0 || activeAreas.includes(song.area);
    return matchSearch && matchType && matchSongType && matchArea;
  });

  filtered.sort((a, b) => sortMode === "OST" ? (Number(a.ost) || 0) - (Number(b.ost) || 0) : (Number(a.order) || 0) - (Number(b.order) || 0));

  filtered.forEach(song => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.file = song.file;

    const songTyping = Array.isArray(song.typing) ? song.typing : [song.typing || 'Unknown'];
    card.style.border = `4px solid ${typeColors[songTyping[0]] || "#0ff"}`;

    const audio = document.createElement("audio");
    audio.src = song.file;
    audio.preload = "metadata";
    card.appendChild(audio);

    const title = document.createElement('h3'); title.textContent = song.name;
    const composer = document.createElement('p'); composer.className = 'composer'; composer.textContent = `Composer: ${song.composer || 'Unknown'}`;

    const areaEl = document.createElement('div'); areaEl.className = 'types';
    const areaSpan = document.createElement('span'); areaSpan.textContent = song.area || 'Unknown'; areaEl.appendChild(areaSpan);

    const themeEl = document.createElement('div'); themeEl.className = 'types';
    const themeSpan = document.createElement('span'); themeSpan.textContent = song.theme || 'Theme'; themeEl.appendChild(themeSpan);

    const selectBtn = document.createElement('button');
    selectBtn.textContent = playlistMode ? 'Add to Playlist' : '';
    selectBtn.classList.add('playlist-btn');

    selectBtn.addEventListener('click', () => {
        if (!playlist.includes(song)) {
            playlist.push(song);
            updatePlaylistUI();
            selectBtn.textContent = 'Added ✓';
        }
    });

    const playBtn = document.createElement('button'); playBtn.textContent = 'Play'; playBtn.classList.add('play-btn');
    playBtn.addEventListener('click', () => {
        // If playlist mode ON → always start playlist from first song
        if (playlistMode && playlist.length > 0) {
            playlistIndex = 0;
            playPlaylistSong();
            return;
        }

        // --- Normal Play mode ---
        // Pause any other audio
        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            if (currentButton) currentButton.textContent = "Play";
        }

        // Toggle play/pause on this audio
        if (audio.paused) {
            audio.play();
            audio.addEventListener("timeupdate", updateProgress);
            playBtn.textContent = "Pause";
            currentAudio = audio;
            currentButton = playBtn;
        } else {
            audio.pause();
            playBtn.textContent = "Play";
        }
    });

    const timeDisplay = document.createElement('div'); timeDisplay.classList.add('time-display'); timeDisplay.textContent = '0:00 / 0:00';

    const progressContainer = document.createElement('div'); progressContainer.classList.add('progress-container');
    const progressBar = document.createElement('div'); progressBar.classList.add('progress-bar'); progressContainer.appendChild(progressBar);
    const handle = document.createElement('div'); handle.classList.add('progress-handle'); progressContainer.appendChild(handle);

    function updateProgress() {
      const percent = (audio.currentTime / audio.duration) * 100 || 0;
      progressBar.style.width = percent+'%'; handle.style.left = percent+'%';
      timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }

    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener("timeupdate", updateProgress);

    let dragging = false;
    handle.addEventListener('pointerdown', ev => { ev.preventDefault(); dragging=true; handle.setPointerCapture(ev.pointerId); if (!audio.paused) audio.pause(); });
    handle.addEventListener('pointermove', ev => {
      if (!dragging) return;
      const rect = progressContainer.getBoundingClientRect();
      let newPercent = ((ev.clientX - rect.left)/rect.width)*100;
      newPercent = Math.max(0, Math.min(100, newPercent));
      progressBar.style.width = newPercent+'%'; handle.style.left = newPercent+'%';
      if (audio.duration) audio.currentTime = (newPercent/100)*audio.duration;
      updateProgress();
    });
    handle.addEventListener('pointerup', ev => {
      if (!dragging) return; dragging=false; try { handle.releasePointerCapture(ev.pointerId); } catch{}
      const rect = progressContainer.getBoundingClientRect();
      let newPercent = ((ev.clientX - rect.left)/rect.width); newPercent = Math.max(0, Math.min(1,newPercent));
      if (audio.duration) audio.currentTime = newPercent*audio.duration;
      if (currentAudio && currentAudio !== audio) { currentAudio.pause(); if(currentButton) currentButton.textContent='Play'; }
      audio.play();
      audio.addEventListener("timeupdate", updateProgress);
      currentAudio = audio;
      currentButton = playBtn;
      playBtn.textContent = 'Pause';
    });

    progressContainer.addEventListener('click', e => {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newPercent = Math.max(0, Math.min(1, clickX/rect.width));
      if(audio.duration) audio.currentTime = newPercent*audio.duration; updateProgress();
      if(currentAudio && currentAudio !== audio){ currentAudio.pause(); if(currentButton) currentButton.textContent='Play'; }
      audio.play();
      audio.addEventListener("timeupdate", updateProgress);
      currentAudio = audio;
      currentButton = playBtn;
      playBtn.textContent = 'Pause';
    });

    card.appendChild(title); card.appendChild(composer); card.appendChild(areaEl); card.appendChild(themeEl);
    card.appendChild(playBtn); card.appendChild(timeDisplay); card.appendChild(progressContainer);
    card.appendChild(selectBtn);
    ostGrid.appendChild(card);
  });
}

// Sort toggle
document.getElementById("sortToggle").addEventListener("click", () => {
  sortMode = (sortMode === "OST") ? "Order" : "OST";
  document.getElementById("sortToggle").textContent = "Sort: "+sortMode;
  renderSongs();
});

// Search input
searchInput.addEventListener('input', e => { searchQuery = e.target.value||''; renderSongs(); });

// Initialize filters
function initFilters() {
  typeOptions.innerHTML = '';
  songTypeOptions.innerHTML = '';

  const typings = [...new Set(songs.flatMap(s=>s.typing))].filter(Boolean).sort();
  const themes = [...new Set(songs.map(s=>s.theme))].filter(Boolean).sort();
  const areas = [...new Set(songs.map(s=>s.area))].filter(Boolean).sort();

  typings.forEach(t => {
    const label = document.createElement('label'); label.className='filter-label';
    label.innerHTML = `<input type="checkbox" value="${t}"> ${t}`;
    typeOptions.appendChild(label);
    label.querySelector('input').addEventListener('change', e => {
      if(e.target.checked) activeTypes.push(t); else activeTypes = activeTypes.filter(x=>x!==t);
      renderSongs();
    });
  });

  themes.forEach(th => {
    const label = document.createElement('label'); label.className='filter-label';
    label.innerHTML = `<input type="checkbox" value="${th}"> ${th}`;
    songTypeOptions.appendChild(label);
    label.querySelector('input').addEventListener('change', e => {
      if(e.target.checked) activeSongTypes.push(th); else activeSongTypes = activeSongTypes.filter(x=>x!==th);
      renderSongs();
    });
  });

  // Area panel
  const areaOptions = document.getElementById('areaOptions');
  if(areaOptions){
    areas.forEach(a=>{
      const label = document.createElement('label'); label.className='filter-label';
      label.innerHTML = `<input type="checkbox" value="${a}"> ${a}`;
      areaOptions.appendChild(label);
      label.querySelector('input').addEventListener('change', e=>{
        if(e.target.checked) activeAreas.push(a); else activeAreas = activeAreas.filter(x=>x!==a);
        renderSongs();
      });
    });
  }

  // Clear buttons
  const clearTypesBtn = document.getElementById('clearTypes');
  if(clearTypesBtn) clearTypesBtn.addEventListener('click', ()=>{ activeTypes=[]; typeOptions.querySelectorAll('input').forEach(i=>i.checked=false); renderSongs(); });
  const clearSongTypesBtn = document.getElementById('clearSongTypes');
  if(clearSongTypesBtn) clearSongTypesBtn.addEventListener('click', ()=>{ activeSongTypes=[]; songTypeOptions.querySelectorAll('input').forEach(i=>i.checked=false); renderSongs(); });
  const clearAreasBtn = document.getElementById('clearAreas');
  if(clearAreasBtn) clearAreasBtn.addEventListener('click', ()=>{ activeAreas=[]; areaOptions.querySelectorAll('input').forEach(i=>i.checked=false); renderSongs(); });

  // Attach panel toggles
  addToggle('typeToggle','typePanel');
  addToggle('areaToggle','areaPanel');
  addToggle('songTypeToggle','songTypePanel');
}
document.getElementById('playAllBtn').addEventListener('click', () => {
  document.querySelectorAll('audio').forEach(a => a.play());
});

document.getElementById('pauseAllBtn').addEventListener('click', () => {
  document.querySelectorAll('audio').forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
  if (currentButton) currentButton.textContent = 'Play';
});

document.getElementById('playlistModeBtn').addEventListener('click', () => {
  playlistMode = !playlistMode;

  // Update toggle button text
  document.getElementById('playlistModeBtn').textContent =
    `Playlist Mode: ${playlistMode ? 'ON' : 'OFF'}`;

  // CSS handles visibility
  document.body.classList.toggle("playlist-mode", playlistMode);

  // Update text only
  document.querySelectorAll('.playlist-btn').forEach(btn => {
    btn.textContent = playlistMode ? "Add to Playlist" : "";
  });

  updatePlaylistUI();
});


function playPlaylistSong() {
    if (!playlistMode || playlist.length === 0) return;

    const song = playlist[playlistIndex];

    const card = document.querySelector(`.card[data-file="${song.file}"]`);
    if (!card) return;

    const audio = card.querySelector("audio");
    const btn = card.querySelector(".play-btn");

    // Stop all other audio
    document.querySelectorAll('audio').forEach(a => {
        if (a !== audio) a.pause();
    });

    audio.currentTime = 0;
    audio.play();
    audio.addEventListener("timeupdate", updateProgress);
    btn.textContent = "Pause";

    audio.onended = () => {
        if (!playlistMode) return;
        playlistIndex = (playlistIndex + 1) % playlist.length;
        playPlaylistSong();
    };
}


function updatePlaylistUI() {
    const panel = document.getElementById('playlistPanel');
    const list = document.getElementById('playlistList');

    // Show panel if playlist has items
    panel.style.display = playlist.length > 0 ? 'block' : 'none';

    list.innerHTML = "";

    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "6px";

        li.innerHTML = `
            <span>${index + 1}. ${song.name}</span>
            <button data-index="${index}" style="
                background:#333;
                color:white;
                border:none;
                padding:3px 7px;
                cursor:pointer;
                border-radius:5px;
            ">X</button>
        `;

        list.appendChild(li);
    });

    // Removal functionality
    document.querySelectorAll('#playlistList button').forEach(btn => {
        btn.addEventListener('click', () => {
        const removeIndex = Number(btn.dataset.index);
        const removedSong = playlist[removeIndex];

        // Remove from playlist
        playlist.splice(removeIndex, 1);

        // Reset Add button on its card
        const card = document.querySelector(`.card[data-file="${removedSong.file}"]`);
        if (card) {
            const addBtn = card.querySelector('.playlist-btn');
            if (addBtn) addBtn.textContent = "Add to Playlist";
        }

        playlistIndex = 0;
        updatePlaylistUI();
    });
  });
}
