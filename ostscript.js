const audioFiles = [
    { name: "Humble Ashore", file: "ost/HumbleAshore.mp3", ost: 1000, type: "Lake - Theme", order: 6 },
    { name: "Recharging", file: "ost/Recharging.mp3", ost: 1000, type: "Shop - Theme", order: 8 },
    { name: "Distant Rumbles", file: "ost/DistantRumbles.mp3", ost: 1000, type: "Fordes - Theme", order: 5 },
    { name: "Tumbling Rumbles", file: "ost/TumblingRumbles.mp3", ost: 1000, type: "Desert - Theme", order: 7 },
    { name: "Skeptic Electric", file: "ost/SkepticElectric.mp3", ost: 1000, type: "Electric Gauntlet - GauntTheme", order: 1 },
    { name: "Hectic Electric", file: "ost/HecticElectric.mp3", ost: 1000, type: "Electric Gauntlet - BattleTheme", order: 2 },
    { name: "Circuit Breaker", file: "ost/CircuitBreaker.mp3", ost: 1000, type: "Electric Gauntlet - AceTheme", order: 3 },
    { name: "Erectic Electric", file: "ost/ErecticElectric.mp3", ost: 1000, type: "Electric Gauntlet - MemeTheme", order: 4 }
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
    filteredFiles.forEach(({ name, file, ost, type }) => {
        const card = document.createElement("div");
        card.className = "card";

        // Set background color based on type
        if (type.includes("Theme")) {
            if (type.includes(" Theme")) {
                card.style.backgroundColor = "lightgray";
            }
            else if (type.includes("GauntTheme")) {
                card.style.backgroundColor = "lightgreen";
            }
            else if (type.includes("BattleTheme")) {
                card.style.backgroundColor = "yellow";
            }
            else if (type.includes("AceTheme")) {
                card.style.backgroundColor = "lightcoral";
            }
            else if (type.includes("MemeTheme")) {
                card.style.backgroundColor = "#90EE90";
            }
            else {
                card.style.backgroundColor = "black";
            }
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

    if (currentAudio && currentAudio !== audio) {
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

    audio.onended = () => { button.textContent = "Play"; };
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

displaySongs(sortSongs(audioFiles));
