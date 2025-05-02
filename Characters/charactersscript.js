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
    const shivrianList = [
        {name: "Skip", image: "../images/Skip.gif", typings: "Normal", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+Jake+", 
        description: "The Main Character of the Game. Is a 17 year old that wants to be a very good capsuler.", region: "Plains"},
            
        {name: "Randal Shivers", image: "../lostimages/MissingNo.png", typings: "Normal, Poison", paratypings: "Fighting", category: "", artist: "", credits: "Idea-Shane+", 
        description: "The Founder of ShiverCo. Descendent of Ronald Shivers, the Founding Father of Shivria.", region: "ShiverCo"}  
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
        const isMatch = name.includes(lastQuery);
        const category = shivrian.category ? shivrian.category.toLowerCase() : "";
        const isJuvieMatch = category.includes("juvie");
        const isMainMatch = !category.includes("juvie");

        if (lastQuery == "return") {
            window.location.href = "../Catalog/catalog.html";
        } 
        card.style.display = isMatch ? "block" : "none";
        if (Juvie) {
            card.style.display = isJuvieMatch ? "block" : "none";
        }
        else if (Main) {
            card.style.display = isMainMatch ? "block" : "none";
        }
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