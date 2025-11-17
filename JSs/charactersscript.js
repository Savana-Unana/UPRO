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
    displayShiverican();
    autoTriggerSearch();
    document.getElementById("search").addEventListener("input", filterShiverican);
});


// Code from the second script section
let Main = true;
let Juvie = false;

function setRoute() {
    Main = !Main;
    Juvie = !Juvie;
    document.getElementById('routeLabel').textContent = Juvie ? "Main Route" : "Juvie Route";
    autoTriggerSearch();
    console.log("Main Route is now:", Main);
}

// Code from the third script section
const defaultImage = '../lostimages/MissingNo.png'; 
    const shivericanList = [
        {name: "Skip", image: "../images/Skip.gif", typings: "Normal", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+Jake+", 
        description: "The Main Character of the Game. Is a 17 year old that wants to be a very good capsuler.", region: "Plains"},

        {name: "Sheriff Stanford", image: "../lostimages/MissingNo.png", typings: "Normal, Artillery", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "The Sheriff. Ground Gauntlet leader, but gives the CC Upgrade for helping him catch some bandits.", region: "Desert"},
            
        {name: "Randal Shivers", image: "../lostimages/MissingNo.png", typings: "Normal, Poison", paratypings: "Fighting", category: "", artist: "", credits: "Idea-Shane+", 
        description: "The Founder of ShiverCo. Descendent, more specifically the grandson, of Ronald Shivers, the Founding Father of Shiverica.", region: "ShiverCo"}  
    ];
    function displayShiverican() {
        const catalog = document.getElementById("catalog");
        catalog.innerHTML = ""; 
        shivericanList.sort((a, b) => a.id - b.id);
        shivericanList.forEach(shiverican => {
            const card = document.createElement("div");
            card.className = "shiverican-card";
            card.setAttribute("data-id", shiverican.id);
            card.innerHTML = `
                <img src="${shiverican.image}" alt="${shiverican.name}">
                <h3>${shiverican.name}</h3>                `;
            card.onclick = () => showDetails(shiverican);
            catalog.appendChild(card);
        });
    }

let lastQuery = "";
function filterShiverican() {
    const searchInput = document.getElementById("search");
    lastQuery = searchInput.value.toLowerCase().trim();
    const catalog = document.getElementById("catalog");
    const cards = catalog.getElementsByClassName("shiverican-card");

    Array.from(cards).forEach((card, index) => {
        const shiverican = shivericanList[index];
        const name = shiverican.name.toLowerCase();
        const category = shiverican.category ? shiverican.category.toLowerCase() : "";

        const isNameMatch = name.includes(lastQuery);
        const isJuvieMatch = category.includes("juvie");
        const isMainMatch = !isJuvieMatch;

        let shouldDisplay = isNameMatch;

        if (shouldDisplay) {
            if (Juvie && !isJuvieMatch) shouldDisplay = false;
            if (Main && !isMainMatch) shouldDisplay = false;
        }

        if (lastQuery === "return") {
            window.location.href = "../Catalog/catalog.html";
        }

        card.style.display = shouldDisplay ? "block" : "none";
    });
}
function showDetails(shiverican) {
    currentShiverianIndex = shivericanList.findIndex(s => s.id === shiverican.id);
    console.log(currentShiverianIndex);
    document.getElementById("catalog").style.display = "none";
    document.getElementById("shiverican-details").style.display = "block";
    document.getElementById("search").style.display = "none"; 
    document.getElementById("search").style.display = "none"; 
    document.querySelector("button").style.display = "none";
    document.getElementById("nav-buttons").style.display = "none";
    document.getElementById("shiverican-name").innerText = shiverican.name;
    let imageElement = document.getElementById("shiverican-image");
    
    imageElement.onload = () => {
        if (shiverican.name === "Ariel Salama") {
            imageElement.style.width = (imageElement.naturalWidth / 12) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 12) + "px";
        }  
        else if (shiverican.name === "TwoMew.jpeg.png.gif.webp.jif") {
            imageElement.style.width = (imageElement.naturalWidth / 2) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 2) + "px";
        }
        else if (shiverican.name === "Skip") {
            imageElement.style.width = (imageElement.naturalWidth / 1.1) + "px";
            imageElement.style.height = (imageElement.naturalWidth / 1.2) + "px";
        }
        else if (shiverican.name === "Capture Capsule") {
            imageElement.style.width = (imageElement.naturalWidth * 4) + "px";
            imageElement.style.height = (imageElement.naturalHeight * 4) + "px";
        }
        else if (shiverican.name === "Juvie Capture Capsule") {
            imageElement.style.width = (imageElement.naturalWidth / 0.9) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 0.9) + "px";
        }
        else if (shiverican.name === "Cheetalon") {
            imageElement.style.width = (imageElement.naturalWidth / 4) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 4) + "px";
        }
        else {
            imageElement.style.width = (imageElement.naturalWidth * 3) + "px";
            imageElement.style.height = (imageElement.naturalHeight * 3) + "px";
        }
    };
    
    imageElement.src = shiverican.image;
    if (shiverican.name === "Ariel Salama") {
        imageElement.style.width = (imageElement.naturalWidth / 12) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 12) + "px";
    }  
    else if (shiverican.name === "TwoMew.jpeg.png.gif.webp.jif") {
        imageElement.style.width = (imageElement.naturalWidth / 2) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 2) + "px";
    }
    else if (shiverican.name === "Capture Capsule") {
        imageElement.style.width = (imageElement.naturalWidth * 4) + "px";
        imageElement.style.height = (imageElement.naturalHeight * 4) + "px";
    }
    else if (shiverican.name === "Juvie Capture Capsule") {
        imageElement.style.width = (imageElement.naturalWidth / 0.9) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 0.9) + "px";
    }
    else if (shiverican.name === "Cheetalon") {
        imageElement.style.width = (imageElement.naturalWidth / 4) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 4) + "px";
    }
    else {
        imageElement.style.width = (imageElement.naturalWidth * 4) + "px";
        imageElement.style.height = (imageElement.naturalHeight * 4) + "px";
    }
    document.getElementById("shiverican-description").innerText = shiverican.description;
    document.body.style.backgroundColor = "gray";
}

function closeDetails() {
    document.getElementById("catalog").style.display = "flex";
    document.getElementById("shiverican-details").style.display = "none";
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
    displayShiverican();
// Ariel Salama was also here