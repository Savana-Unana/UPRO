const audioFiles = [
    { name: "Voodoo", file: "../Songs/static.mp3", ost: 666, type: "Dead Doll Island - Theme", typing: "Dark", order: 0 }
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
            "Normal": "DimGray",
            "Fire": "Cyan",
            "Water": "DarkBlue",
            "Electric": "DarkOrange",
            "Grass": "DarkGreen",
            "Ice": "DarkCyan",
            "Fighting": "LightSalmon",
            "Poison": "DarkViolet",
            "Ground": "SaddleBrown",
            "Flying": "DarkSlateBlue",
            "Psychic": "DeepPink",
            "Bug": "LightGreen",
            "Rock": "LightGoldenRodYellow",
            "Ghost": "LightSteelBlue",
            "Dragon": "Cyan",
            "Dark": "LightGray",
            "Steel": "DarkSlateGray",
            "Fairy": "MediumVioletRed",
            "Light": "Black",
            "Artillery": "White",
        };        
        
        if (typing in typingcolors) {
            card.style.backgroundColor = typingcolors[typing];
        } else {
            card.style.backgroundColor = "Black";
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

displaySongs(sortSongs(audioFiles));
