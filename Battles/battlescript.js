// Ariel Salama was here
// Code from the fist script section

let currentShiverianIndex = 0;

function autoTriggerSearch() {
    const searchInput = document.getElementById("search");
    const originalValue = searchInput.value;
    searchInput.value += " ";
    searchInput.dispatchEvent(new Event('input')); 
    setTimeout(() => {
        searchInput.value = originalValue;
        searchInput.dispatchEvent(new Event('input'));
    }, 100);
    document.querySelector("button").style.display = "none";
    closeDetails();
}
document.addEventListener("DOMContentLoaded", () => {
    displayShivrian();
    autoTriggerSearch();
    document.getElementById("search").addEventListener("input", filterShivrian);
});


// Code from the second script section
let Main = true;
let Juvie = false;
let Events = false;

function setEvent() {
    Main = !Main;
    Juvie = false;
    Events = !Events;
    document.getElementById('eventLabel').textContent = Events ? "Normal Game" : "Events";
    autoTriggerSearch();
    console.log("Main Route is now:", Main);
}

function setRoute() {
    Main = !Main;
    Juvie = !Juvie;
    Events = false;
    document.getElementById('routeLabel').textContent = Juvie ? "Main Route" : "Juvie Route";
    autoTriggerSearch();
    console.log("Main Route is now:", Main);
}

// Code from the third script section
const defaultImage = '../lostimages/MissingNo.png'; 
    const shivrianList = [
        {name: "Water Gauntlet", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Water-type themed. Gauntlet. located in the Lake. led by Arlan."},

        {name: "Bug Gauntlet", image: "../lostimages/MissingNo.png", typings: "Bug", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Bug-type themed. Gauntlet. located in the Swamp."},

        {name: "Dark Gauntlet", image: "../lostimages/MissingNo.png", typings: "Dark", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Dark-type themed. Gauntlet."},

        {name: "Dragon Gauntlet", image: "../lostimages/MissingNo.png", typings: "Dragon", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Dragon-type themed. Gauntlet."},

        {name: "Fairy Gauntlet", image: "../lostimages/MissingNo.png", typings: "Fairy", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Fairy-type themed. Gauntlet. led by Chef. Ace is Frankfortress."},

        {name: "Fighting Gauntlet", image: "../lostimages/MissingNo.png", typings: "Fighting", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Fighting-type themed. Gauntlet."},

        {name: "Fire Gauntlet", image: "../lostimages/MissingNo.png", typings: "Fire", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Fire-type themed. Gauntlet. located in the Volcano. Ace is Pydromaglar."},

        {name: "Flying Gauntlet", image: "../lostimages/MissingNo.png", typings: "Flying", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Flying-type themed. Gauntlet."},

        {name: "Ghost Gauntlet", image: "../lostimages/MissingNo.png", typings: "Ghost", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Ghost-type themed. Gauntlet."},

        {name: "Grass Gauntlet", image: "../lostimages/MissingNo.png", typings: "Grass", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Grass-type themed. Gauntlet."},

        {name: "Ground Gauntlet", image: "../lostimages/MissingNo.png", typings: "Ground", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Ground-type themed. Gauntlet."},

        {name: "Ice Gauntlet", image: "../lostimages/MissingNo.png", typings: "Ice", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Ice-type themed. Gauntlet. located in the Ice-Caps. Ace is Reptundra."},

        {name: "Normal Gauntlet", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Normal-type themed. Gauntlet."},

        {name: "Poison Gauntlet", image: "../lostimages/MissingNo.png", typings: "Poison", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Poison-type themed. Gauntlet."},

        {name: "Psychic Gauntlet", image: "../lostimages/MissingNo.png", typings: "Psychic", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Psychic-type themed. Gauntlet."},

        {name: "Rock Gauntlet", image: "../lostimages/MissingNo.png", typings: "Rock", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Rock-type themed. Gauntlet."},

        {name: "Steel Gauntlet", image: "../lostimages/MissingNo.png", typings: "Steel", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Steel-type themed. Gauntlet."},

        {name: "Light Gauntlet", image: "../lostimages/MissingNo.png", typings: "Light", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Light-type themed. Gauntlet."},

        {name: "Cruise Ship", image: "../lostimages/MissingNo.png", typings: "Water, Fire, Grass", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Water, Fire, Grass-type themed. Gauntlet. located in the Ocean. Ace is Hileaph, Axolarg, Blazuki."},

        {name: "Charquid Games", image: "../lostimages/MissingNo.png", typings: "Fire", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Fire-type themed. Gauntlet. located in the Ice-Caps. Ace is Nonignite."},

        {name: "Radioactive Randal", image: "../lostimages/MissingNo.png", typings: "Steel, Electric", paratypings: "", category: "Single", artist: "", credits: "",
        description: "Steel, Electric-type themed. Single. located in the Plains. led by Radioactive Randal."},

        {name: "Operation Pseudo Gauntlet", image: "../lostimages/MissingNo.png", typings: "Psychic", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Psychic-type themed. Gauntlet. located in the Secret Area. led by Operation Pseudo."},

        {name: "Dopplegrail", image: "../lostimages/MissingNo.png", typings: "Psychic", paratypings: "", category: "Single", artist: "", credits: "",
        description: "Psychic-type themed. Single. located in the Secret Area. led by Dopplergrail. Ace is Dopplegrail."},

        {name: "Radioactive Ronald", image: "../lostimages/MissingNo.png", typings: "Ice", paratypings: "", category: "Single", artist: "", credits: "",
        description: "Ice-type themed. Single. located in the Frozen Wasteland. led by Radioactive Ronald."},

        {name: "Credits Gauntlet", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "Gauntlet", artist: "", credits: "",
        description: "Normal-type themed. Gauntlet. located in the Secret Area. led by Creators."},

        {name: "Operation Pseudo Juvie Gauntlet", image: "../lostimages/MissingNo.png", typings: "Steel", paratypings: "", category: "Gauntlet, Juvie", artist: "", credits: "",
        description: "Steel-type themed. Gauntlet. located in the Secret Area. led by Capture Capsule. Ace is Capture Capsule, Dopplegrail."},

        {name: "JaviorDaSavior", image: "../lostimages/MissingNo.png", typings: "Fighting", paratypings: "", category: "Single, Juvie", artist: "", credits: "",
        description: "Fighting-type themed. Single, Juvie. located in the Secret Area. led by Jake."},

        {name: "Tal", image: "../lostimages/MissingNo.png", typings: "Fighting", paratypings: "", category: "Single, Juvie", artist: "", credits: "",
        description: "Fighting-type themed. Single, Juvie. located in the Secret Area. led by Tal."},

        {name: "BloxxyMech", image: "../lostimages/MissingNo.png", typings: "Fighting", paratypings: "", category: "Single, Juvie", artist: "", credits: "",
        description: "Fighting-type themed. Single, Juvie. located in the Secret Area. led by Shane."},
    ];
    function displayShivrian() {
        const catalog = document.getElementById("catalog");
        catalog.innerHTML = ""; 
        shivrianList.sort((a, b) => a.id - b.id);
        shivrianList.forEach(shivrian => {
            const card = document.createElement("div");
            card.className = "shivrian-card";
            card.setAttribute("data-id", shivrian.id);
            card.innerHTML = `
                <img src="${shivrian.image}" alt="${shivrian.name}">
                <h3>${shivrian.name}</h3>                `;
            card.onclick = () => showDetails(shivrian);
            catalog.appendChild(card);
        });
    }

let lastQuery = "";
function filterShivrian() {
    const searchInput = document.getElementById("search");
    lastQuery = searchInput.value.toLowerCase().trim();
    const catalog = document.getElementById("catalog");
    const cards = catalog.getElementsByClassName("shivrian-card");

    Array.from(cards).forEach((card, index) => {
        const shivrian = shivrianList[index];
        const name = shivrian.name.toLowerCase();
        const category = shivrian.category ? shivrian.category.toLowerCase() : "";

        const isNameMatch = name.includes(lastQuery);
        const isJuvie = category.includes("juvie");
        const isEvent = category.includes("event");
        const isMain = !isJuvie && !isEvent;

        let shouldDisplay = isNameMatch;

        // Filter by route if name matches
        if (shouldDisplay) {
            if (Juvie && !isJuvie) shouldDisplay = false;
            if (Main && !isMain) shouldDisplay = false;
            if (typeof Events !== 'undefined' && Events && !isEvent) shouldDisplay = false;
        }

        // Special return command
        if (lastQuery === "return") {
            window.location.href = "../Catalog/catalog.html";
        }

        card.style.display = shouldDisplay ? "block" : "none";
    });
}

function showDetails(shivrian) {
    currentShiverianIndex = shivrianList.findIndex(s => s.id === shivrian.id);
    console.log(currentShiverianIndex);
    document.getElementById("catalog").style.display = "none";
    document.getElementById("shivrian-details").style.display = "block";
    document.getElementById("search").style.display = "none"; 
    document.getElementById("search").style.display = "none"; 
    document.querySelector("button").style.display = "none";
    document.getElementById("nav-buttons").style.display = "none";
    document.getElementById("shivrian-name").innerText = shivrian.name;
    let imageElement = document.getElementById("shivrian-image");
    
    imageElement.onload = () => {
        if (shivrian.name === "Ariel Salama") {
            imageElement.style.width = (imageElement.naturalWidth / 12) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 12) + "px";
        }  
        else if (shivrian.name === "TwoMew.jpeg.png.gif.webp.jif") {
            imageElement.style.width = (imageElement.naturalWidth / 2) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 2) + "px";
        }
        else if (shivrian.name === "Skip") {
            imageElement.style.width = (imageElement.naturalWidth / 1.1) + "px";
            imageElement.style.height = (imageElement.naturalWidth / 1.2) + "px";
        }
        else if (shivrian.name === "Capture Capsule") {
            imageElement.style.width = (imageElement.naturalWidth * 4) + "px";
            imageElement.style.height = (imageElement.naturalHeight * 4) + "px";
        }
        else if (shivrian.name === "Juvie Capture Capsule") {
            imageElement.style.width = (imageElement.naturalWidth / 0.9) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 0.9) + "px";
        }
        else if (shivrian.name === "Cheetalon") {
            imageElement.style.width = (imageElement.naturalWidth / 4) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 4) + "px";
        }
        else {
            imageElement.style.width = (imageElement.naturalWidth * 3) + "px";
            imageElement.style.height = (imageElement.naturalHeight * 3) + "px";
        }
    };
    
    imageElement.src = shivrian.image;
    if (shivrian.name === "Ariel Salama") {
        imageElement.style.width = (imageElement.naturalWidth / 12) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 12) + "px";
    }  
    else if (shivrian.name === "TwoMew.jpeg.png.gif.webp.jif") {
        imageElement.style.width = (imageElement.naturalWidth / 2) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 2) + "px";
    }
    else if (shivrian.name === "Capture Capsule") {
        imageElement.style.width = (imageElement.naturalWidth * 4) + "px";
        imageElement.style.height = (imageElement.naturalHeight * 4) + "px";
    }
    else if (shivrian.name === "Juvie Capture Capsule") {
        imageElement.style.width = (imageElement.naturalWidth / 0.9) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 0.9) + "px";
    }
    else if (shivrian.name === "Cheetalon") {
        imageElement.style.width = (imageElement.naturalWidth / 4) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 4) + "px";
    }
    else {
        imageElement.style.width = (imageElement.naturalWidth * 4) + "px";
        imageElement.style.height = (imageElement.naturalHeight * 4) + "px";
    }
    document.getElementById("shivrian-description").innerText = shivrian.description;
    document.body.style.backgroundColor = "gray";
}

function closeDetails() {
    document.getElementById("catalog").style.display = "flex";
    document.getElementById("shivrian-details").style.display = "none";
    document.getElementById("nav-buttons").style.display = "block";
    let searchBar = document.getElementById("search");
    let routebutton = document.querySelector("button");
    searchBar.style.display = "block";
    searchBar.style.margin = "0 auto";
    searchBar.style.textAlign = "center";
    routebutton.style.display = "block";
    routebutton.style.margin = "0 auto";
    routebutton.style.textAlign = "center";
    document.body.style.backgroundColor = "White";
}
    displayShivrian();
// Ariel Salama was also here