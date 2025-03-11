const audioFiles = [
    { name: "Humble Ashore", file: "ost/HumbleAshore.mp3", image: ".png", ost: 1000 },
    { name: "Skeptic Electric", file: "ost/SkepticElectric.mp3", image: ".png", ost: 1000 },
    { name: "Hectic Electric", file: "ost/HecticElectric.mp3", image: ".png", ost: 1000 },
    { name: "Circuit Breaker", file: "ost/CircuitBreaker.mp3", image: ".png", ost: 1000 },
    { name: "Erectic Electric", file: "ost/ErectedElectric.mp3", image: ".png", ost: 1000 },
    { name: "Distant Rumbles", file: "ost/DistantRumbles.mp3", image: ".png", ost: 1000 },
    { name: "Tumbling Rumbles", file: "ost/TumblingRumbles.mp3", image: ".png", ost: 1000 }
];

const container = document.getElementById("cards-container");

function displaySongs(filteredFiles) {
    container.innerHTML = "";
    filteredFiles.forEach(({ name, file, image }) => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-name", name.toLowerCase());

        card.innerHTML = `
            <img src="${image}" alt="${name}" width="100%">
            <h3>${name}</h3>
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
            if (isDragging) {
                seekAudio(event, progress);
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        document.addEventListener("mouseleave", () => {
            isDragging = false;
        });

        container.appendChild(card);
    });
}

function playAudio(button) {
    const card = button.parentElement;
    const audio = card.querySelector("audio");

    if (audio.paused) {
        audio.play();
        button.textContent = "Pause";
    } else {
        audio.pause();
        button.textContent = "Play";
    }

    audio.onended = () => { button.textContent = "Play"; };
}

function updateProgress(audio) {
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

displaySongs(audioFiles);
