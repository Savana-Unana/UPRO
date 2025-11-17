let sortMode = "OST";

let songs = [];
const ostGrid = document.getElementById('ostGrid');
const searchInput = document.getElementById('search');

let activeTypes = [];
let activeSongTypes = [];
let activeAreas = [];
let searchQuery = '';
let currentAudio = null;
let currentButton = null;

const typeColors = {
  Normal: "white",
  Plant: "#6BBF59",
  Water: "#3BA5FF",
  Ice: "#C9F0FF",
  Fire: "#FF7A4D",
  Earth: "#C99C6B",
  Mystic: "#BFA6FF",
  Air: "#9ED8FF",
  Savage: "#D6C79B",
  Metal: "#B0B8C1",
  Electric: "#F6C94C",
  Artillery: "#D88F8F",
  Light: "#FFF3B0",
  Dark: "#3B3B3F",
  Gross: "#A8A77A",
  Spectral: "#8F7AE6",
  Lucid: "#9FE5D1"
};

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

// ----------------- FILTER TOGGLE EVENTS -----------------
document.getElementById('typeToggle').addEventListener('click', () => {
  document.getElementById('typePanel').classList.toggle('open');
});
document.getElementById('areaToggle').addEventListener('click', () => {
  document.getElementById('areaPanel').classList.toggle('open');
});
document.getElementById('songTypeToggle').addEventListener('click', () => {
  document.getElementById('songTypePanel').classList.toggle('open');
});

// click outside closes panels
document.addEventListener('click', e => {
  if(!e.target.closest('.multi-filter')){
    document.querySelectorAll('.filter-panel.open').forEach(p => p.classList.remove('open'));
  }
});

// ----------------- LOAD SONGS -----------------
fetch('../Data/songs.json')
  .then(res => res.json())
  .then(data => {
    songs = data.map(s => {
      const song = {...s};
      if(!Array.isArray(song.typing)) song.typing = song.typing ? [song.typing] : ['Unknown'];
      if(!song.area || !song.theme){
        const typeField = song.type || (Array.isArray(song.types)? song.types[0] : song.types);
        const { area, theme } = splitTypeField(typeField || '');
        song.area = song.area || area;
        song.theme = song.theme || theme;
      }
      return song;
    });

    initFilters();
    renderSongs();
  })
  .catch(err => console.error(err));

// ----------------- INIT FILTERS -----------------
function initFilters(){
  const typeOptions = document.getElementById('typeOptions');
  const songTypeOptions = document.getElementById('songTypeOptions');
  const areaOptions = document.getElementById('areaOptions');

  const typings = [...new Set(songs.flatMap(s=>s.typing))].sort();
  typings.forEach(t => {
    const label = document.createElement('label');
    label.className='filter-label';
    label.innerHTML = `<input type="checkbox" value="${t}"> ${t}`;
    typeOptions.appendChild(label);
    label.querySelector('input').addEventListener('change', e => {
      if(e.target.checked) activeTypes.push(t);
      else activeTypes = activeTypes.filter(x=>x!==t);
      renderSongs();
    });
  });

  const themes = [...new Set(songs.map(s=>s.theme))].sort();
  themes.forEach(th => {
    const label = document.createElement('label');
    label.className='filter-label';
    label.innerHTML = `<input type="checkbox" value="${th}"> ${th}`;
    songTypeOptions.appendChild(label);
    label.querySelector('input').addEventListener('change', e => {
      if(e.target.checked) activeSongTypes.push(th);
      else activeSongTypes = activeSongTypes.filter(x=>x!==th);
      renderSongs();
    });
  });

  const areas = [...new Set(songs.map(s=>s.area))].sort();
  areas.forEach(a => {
    const label = document.createElement('label');
    label.className='filter-label';
    label.innerHTML = `<input type="checkbox" value="${a}"> ${a}`;
    areaOptions.appendChild(label);
    label.querySelector('input').addEventListener('change', e => {
      if(e.target.checked) activeAreas.push(a);
      else activeAreas = activeAreas.filter(x=>x!==a);
      renderSongs();
    });
  });

  // Clear buttons
  document.getElementById('clearTypes').addEventListener('click', ()=>{
    activeTypes=[]; typeOptions.querySelectorAll('input').forEach(i=>i.checked=false); renderSongs();
  });
  document.getElementById('clearSongTypes').addEventListener('click', ()=>{
    activeSongTypes=[]; songTypeOptions.querySelectorAll('input').forEach(i=>i.checked=false); renderSongs();
  });
  document.getElementById('clearAreas').addEventListener('click', ()=>{
    activeAreas=[]; areaOptions.querySelectorAll('input').forEach(i=>i.checked=false); renderSongs();
  });
}

// ----------------- RENDER SONGS -----------------
function renderSongs(){
  ostGrid.innerHTML = '';

  const filtered = songs.filter(song => {
    const matchSearch = song.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = activeTypes.length===0 || song.typing.some(t=>activeTypes.includes(t));
    const matchSongType = activeSongTypes.length===0 || activeSongTypes.includes(song.theme);
    const matchArea = activeAreas.length===0 || activeAreas.includes(song.area);
    return matchSearch && matchType && matchSongType && matchArea;
  });

  filtered.sort((a,b)=>{
    return sortMode==='OST' ? (Number(a.ost)||0)-(Number(b.ost)||0) : (Number(a.order)||0)-(Number(b.order)||0);
  });

  filtered.forEach(song => {
    const card = document.createElement('div'); card.classList.add('card');
    const songTyping = Array.isArray(song.typing)? song.typing : [song.typing||'Unknown'];
    card.style.border=`4px solid ${typeColors[songTyping[0]]||'#0ff'}`;

    const audio = new Audio(song.file); audio.preload='metadata';

    const title = document.createElement('h3'); title.textContent=song.name;
    const composer = document.createElement('p'); composer.className='composer'; composer.textContent=`Composer: ${song.composer||'Unknown'}`;

    const areaEl=document.createElement('div'); areaEl.className='types';
    const areaSpan=document.createElement('span'); areaSpan.textContent=song.area||'Unknown'; areaEl.appendChild(areaSpan);

    const themeEl=document.createElement('div'); themeEl.className='types';
    const themeSpan=document.createElement('span'); themeSpan.textContent=song.theme||'Theme'; themeEl.appendChild(themeSpan);

    const playBtn=document.createElement('button'); playBtn.classList.add('play-btn'); playBtn.textContent='Play';
    playBtn.addEventListener('click', ()=>{
      if(currentAudio && currentAudio!==audio){ currentAudio.pause(); if(currentButton)currentButton.textContent='Play'; }
      if(audio.paused){ audio.play(); playBtn.textContent='Pause'; currentAudio=audio; currentButton=playBtn;}
      else { audio.pause(); playBtn.textContent='Play'; if(currentAudio===audio){currentAudio=null; currentButton=null;}}
    });

    card.append(title, composer, areaEl, themeEl, playBtn);
    ostGrid.appendChild(card);
  });
}

// ----------------- SORT TOGGLE -----------------
document.getElementById('sortToggle').addEventListener('click', ()=>{
  sortMode = (sortMode==='OST')?'Order':'OST';
  document.getElementById('sortToggle').textContent='Sort: '+sortMode;
  renderSongs();
});

// ----------------- SEARCH -----------------
searchInput.addEventListener('input', e=>{ searchQuery=e.target.value||''; renderSongs(); });
