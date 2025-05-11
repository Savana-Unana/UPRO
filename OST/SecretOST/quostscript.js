if (performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
    if (document.referrer) {
        console.log("User came from: " + document.referrer);
        if (document.referrer.includes("/OST/ost.html")) {
        } else {
            if (!localStorage.getItem("redirected")) {
                localStorage.setItem("redirected", "true");
                window.location.href = "../../Index/index.html";
            }
        }
    } else {
        console.log("No referrer information available.");
        window.location.href = "../../Index/index.html";
    }
}



const audioFiles = [
    { name: "Snowscape", file: "../../Songs/Snowscape.mp3", ost: 0, composer: "Skiehie", type: "Frostbite:Juvie - Theme", typing: "Ice, Ghost", order: 0 },
    { name: "Barracuda", file: "../../Songs/Barracuda.mp3", ost: 0, composer: "NoiseStorm", type: "Psychic Gauntlet - AceTheme", typing: "Ice, Ghost", order: 1 },
];

const secretSequence = [""];
let playHistory = [];

let coincidencePlay = true;
let currentAudio = null;
let massPlayActive = false;
let sortByOrder = false;
let secretButtonDisplayed = false;



const container = document.getElementById("cards-container");

let searchInput = document.getElementById("search");
searchInput.addEventListener("input", filterSongs);

let sortButton = document.getElementById("button");
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

function filterSongs() {
    const query = searchInput.value.toLowerCase();
    const searchedSongs = audioFiles.filter(song => song.name.toLowerCase().includes(query));
    const sortedAndFiltered = sortSongs(searchedSongs);
    displaySongs(sortedAndFiltered);
}


function displaySongs(filteredFiles) {
    container.innerHTML = "";
    filteredFiles = filterSongsList(filteredFiles);

    filteredFiles.forEach(({ name, file, ost, composer, type, typing }) => {
        const card = document.createElement("div");
        card.className = "card";

        const typingcolors = {
            "Normal": "LightGray", "Fire": "OrangeRed", "Water": "LightBlue",
            "Electric": "Gold", "Grass": "LimeGreen", "Ice": "LightCyan",
            "Fighting": "Chocolate", "Poison": "Violet", "Ground": "BurlyWood",
            "Flying": "Lavender", "Psychic": "HotPink", "Bug": "OliveDrab",
            "Rock": "DarkKhaki", "Ghost": "SlateBlue", "Dragon": "Red",
            "Dark": "DarkGray", "Steel": "LightSlateGray", "Fairy": "Pink",
            "Light": "White", "Artillery": "Black"
        };

        card.style.backgroundColor = typingcolors[typing] || "White";

        card.innerHTML = `
            <h3>${name}</h3>
            <p>OST: ${ost}</p>
            <p>Composer: ${composer}</p>
            <button onclick="playAudio(this)">Play</button>
            <div class="progress"><div class="progress-bar"></div></div>
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

    if (coincidencePlay) {
        const allAudios = document.querySelectorAll("audio");
        allAudios.forEach(a => {
            if (a !== audio && !a.paused) {
                a.pause();
                const btn = a.parentElement.querySelector("button");
                if (btn) btn.textContent = "Play";
            }
        });
    }

    if (audio.paused) {
        audio.play();
        if (coincidencePlay) {
            const name = card.querySelector("h3").textContent;
            playHistory.push(name);
            if (playHistory.length > secretSequence.length) {
                playHistory.shift();
            }
            if (!secretButtonDisplayed && JSON.stringify(playHistory) === JSON.stringify(secretSequence)) {
                secretButtonDisplayed = true;
            }
        }        
        button.textContent = "Pause";
        currentAudio = audio;
    } else {
        audio.pause();
        button.textContent = "Play";
        if (currentAudio === audio) currentAudio = null;
    }

    audio.onended = () => {
        button.textContent = "Play";
        if (coincidencePlay && currentAudio === audio) currentAudio = null;
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
    if (!isNaN(audio.duration)) audio.currentTime = percentage * audio.duration;
}



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

document.body.appendChild(toggleCoincidenceButton);

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
        const btn = audio.parentElement.querySelector("button");
        if (massPlayActive) {
            audio.pause();
            if (btn) btn.textContent = "Play";
        } else {
            audio.play();
            if (btn) btn.textContent = "Pause";
        }
    });
    massPlayActive = !massPlayActive;
    toggleMassButton.textContent = massPlayActive ? "Mass Pause" : "Mass Play";
};

document.body.appendChild(toggleMassButton);

displaySongs(sortSongs(audioFiles));
