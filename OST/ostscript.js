const audioFiles = [
    { name: "Humble Ashore", file: "../Songs/HumbleAshore.mp3", ost: 1000, type: "Lake - Theme", typing: "Water", order: 6 },
    { name: "Sigma Ashore", file: "../Songs/SigmaAshore.mp3", ost: 1000, type: "Lake - Theme", typing: "Water", order: 12},
    { name: "Calm After The Storm", file: "../Songs/CalmAfterTheStorm.mp3", ost: 1000, type: "Shop - Theme", typing: "Normal", order: 8 },
    { name: "Distant Rumbles", file: "../Songs/DistantRumbles.mp3", ost: 1000, type: "Fordes - Theme", typing: "Poison", order: 5 },
    { name: "Tumbling Rumbles", file: "../Songs/TumblingRumbles.mp3", ost: 1000, type: "Desert - Theme", typing: "Ground", order: 7 },
    { name: "Skeptic Electric", file: "../Songs/SkepticElectric.mp3", ost: 1000, type: "Electric Gauntlet - GauntTheme", typing: "Electric", order: 1 },
    { name: "Hectic Electric", file: "../Songs/HecticElectric.mp3", ost: 1000, type: "Electric Gauntlet - BattleTheme", typing: "Electric", order: 2 },
    { name: "Circuit Breaker", file: "../Songs/CircuitBreaker.mp3", ost: 1000, type: "Electric Gauntlet - AceTheme", typing: "Electric", order: 3 },
    { name: "Skibidi Electric", file: "../Songs/SkibidiElectric.mp3", ost: 1000, type: "Electric Gauntlet - MemeTheme", typing: "Electric", order: 4 },
    { name: "Fury", file: "../Songs/Fury.mp3", ost: 1000, type: "Dragon Gauntlet - BattleTheme", typing: "Dragon", order: 10},
    { name: "---", file: "../Songs/---.mp3", ost: 1000, type: "??? - Theme", typing: "Normal", order: 11}
];

const container = document.getElementById("cards-container");

const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Search for a song...";
searchInput.id = "search-bar";
searchInput.addEventListener("input", filterSongs);
document.body.insertBefore(searchInput, container);

function filterSongs() {
    const query = searchInput.value.toLowerCase();
    const filteredFiles = audioFiles.filter(song => song.name.toLowerCase().includes(query));
    displaySongs(sortSongs(filteredFiles));
}

let currentAudio = null;

function displaySongs(filteredFiles) {
    container.innerHTML = "";
    filteredFiles = filterSongsList(filteredFiles); 
    filteredFiles.forEach(({ name, file, ost, type, typing }) => {
        const card = document.createElement("div");
        card.className = "card";
        
        const typingcolors = {
            "Normal": "LightGray",
            "Fire": "OrangeRed",
            "Water": "LightBlue",
            "Electric": "Gold",
            "Grass": "LimeGreen",
            "Ice": "LightCyan",
            "Fighting": "Chocolate",
            "Poison": "Violet",
            "Ground": "BurlyWood",
            "Flying": "Lavender",
            "Psychic": "HotPink",
            "Bug": "OliveDrab",
            "Rock": "DarkKhaki",
            "Ghost": "SlateBlue",
            "Dragon": "Red",
            "Dark": "DarkGray",
            "Steel": "LightSlateGray",
            "Fairy": "Pink",
            "Light": "White",
            "Artillery": "Black",
        };
        
        if (typing in typingcolors) {
            card.style.backgroundColor = typingcolors[typing];
        } else {
            card.style.backgroundColor = "White";
        }        
        card.innerHTML = `
            <h3>${name}</h3>
            <p>OST: ${ost}</p>
            <button onclick="playAudio(this)">Play</button>
            <div class="progress">
                <div class="progress-bar"></div>
            </div>
            <p class="time-display">0:00 / 0:00</p>
            <audio src="${file}" loop onloadedmetadata="updateTotalTime(this)" ontimeupdate="updateProgress(this)"></audio>
        `;

        const progress = card.querySelector(".progress");
        let isDragging = false;

        progress.addEventListener("mousedown", (event) => {
            isDragging = true;
            seekAudio(event, progress);
        });

        document.addEventListener("mousemove", (event) => {
            if (isDragging) seekAudio(event, progress);
        });

        document.addEventListener("mouseup", () => { isDragging = false; });
        document.addEventListener("mouseleave", () => { isDragging = false; });

        container.appendChild(card);
    });
}


function playAudio(button) {
    const card = button.parentElement;
    const audio = card.querySelector("audio");

    if (coincidencePlay && currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.parentElement.querySelector("button").textContent = "Play";
    }

    if (audio.paused) {
        audio.play();
        button.textContent = "Pause";
        currentAudio = audio;
    } else {
        audio.pause();
        button.textContent = "Play";
    }

    audio.onended = () => {
        button.textContent = "Play";
        if (coincidencePlay && currentAudio === audio) {
            currentAudio = null;
        }
    };
}

function updateProgress(audio) {
    if (!audio.duration) return;
    const progressBar = audio.parentElement.querySelector(".progress-bar");
    const timeDisplay = audio.parentElement.querySelector(".time-display");
    
    const currentTime = formatTime(audio.currentTime);
    const totalTime = formatTime(audio.duration);
    
    progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    timeDisplay.textContent = `${currentTime} / ${totalTime}`;
}

function updateTotalTime(audio) {
    const timeDisplay = audio.parentElement.querySelector(".time-display");
    timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function seekAudio(event, progressElement) {
    const audio = progressElement.parentElement.querySelector("audio");
    const rect = progressElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.min(Math.max(clickX / rect.width, 0), 1);
    
    if (!isNaN(audio.duration)) {
        audio.currentTime = percentage * audio.duration;
    }
}

let sortByOrder = false;
const sortButton = document.createElement("button");
sortButton.textContent = "Sort by Creation";
sortButton.onclick = toggleSorting;
document.body.insertBefore(sortButton, container);

function toggleSorting() {
    sortByOrder = !sortByOrder;
    sortButton.textContent = sortByOrder ? "Sort by OST" : "Sort by Creation";
    displaySongs(sortSongs(audioFiles));
}

function sortSongs(songs) {
    return songs.slice().sort((a, b) => sortByOrder ? a.order - b.order : a.ost - b.ost);
}
const filters = {};
const filterContainer = document.createElement("div");
filterContainer.id = "filter-container";
filterContainer.style.display = "flex";
filterContainer.style.flexDirection = "column";
filterContainer.style.alignItems = "flex-start";
document.body.insertBefore(filterContainer, container);

const categories = [" Theme", "GauntTheme", "BattleTheme", "AceTheme", "MemeTheme"];
categories.forEach(category => {
    filters[category] = "neutral";
    const filterLabel = document.createElement("label");
    filterLabel.className = "filter-label";
    filterLabel.style.display = "flex";
    filterLabel.style.alignItems = "center";
    filterLabel.style.marginBottom = "5px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.category = category;
    checkbox.addEventListener("change", () => toggleFilter(category, checkbox));

    filterLabel.appendChild(checkbox);
    filterLabel.appendChild(document.createTextNode(category));
    filterContainer.appendChild(filterLabel);
});

function toggleFilter(category, checkbox) {
    filters[category] = checkbox.checked ? "include" : "neutral";
    displaySongs(sortSongs(audioFiles));
}

function filterSongsList(songs) {
    let includeFilters = Object.keys(filters).filter(category => filters[category] === "include");
    
    return songs.filter(song => {
        if (includeFilters.length > 0) return includeFilters.some(category => song.type.includes(category));
        return true;
    });
}

let coincidencePlay = true;
let currentAudio = null; // Make sure this gets set when a song is played

const toggleCoincidenceButton = document.createElement("button");
toggleCoincidenceButton.textContent = "Single-Songs: ON";
toggleCoincidenceButton.style.position = "fixed";
toggleCoincidenceButton.style.top = "10px";
toggleCoincidenceButton.style.right = "10px";
toggleCoincidenceButton.style.zIndex = "1000";
toggleCoincidenceButton.style.padding = "5px 10px";
toggleCoincidenceButton.style.fontSize = "12px";

toggleCoincidenceButton.onclick = () => {
    coincidencePlay = !coincidencePlay;
    toggleCoincidenceButton.textContent = `Single-Songs: ${coincidencePlay ? "ON" : "OFF"}`;

    if (coincidencePlay && currentAudio) {
        // Pause all other audio except the current one
        const allAudios = document.querySelectorAll("audio");
        allAudios.forEach(audio => {
            if (audio !== currentAudio) {
                audio.pause();
                const btn = audio.parentElement.querySelector("button");
                if (btn) btn.textContent = "Play";
            }
        });
    }
};

const toggleMassButton = document.createElement("button");
toggleMassButton.textContent = "Mass Play";
toggleMassButton.style.position = "fixed";
toggleMassButton.style.top = "50px";
toggleMassButton.style.right = "10px";
toggleMassButton.style.zIndex = "1000";
toggleMassButton.style.padding = "5px 10px";
toggleMassButton.style.fontSize = "12px";

toggleMassButton.onclick = () => {
    const allAudios = document.querySelectorAll("audio");
    allAudios.forEach(audio => {
        audio.play();
        const btn = audio.parentElement.querySelector("button");
        if (btn) btn.textContent = "Pause";
    });
};

document.body.appendChild(toggleCoincidenceButton);
document.body.appendChild(toggleMassButton);

displaySongs(sortSongs(audioFiles)); // Assuming these functions exist and work
