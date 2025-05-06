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
    document.getElementById('routeLabel').textContent = Juvie ? "Main Route" : "Juvie Route";
    autoTriggerSearch();
    console.log("Event Condition is now:", Main);
}

function setRoute() {
    Main = !Main;
    Juvie = !Juvie;
    Events = false;
    document.getElementById('routeLabel').textContent = Juvie ? "Main Route" : "Juvie Route";
    document.getElementById('eventLabel').textContent = Events ? "Normal Game" : "Events";
    autoTriggerSearch();
    console.log("Main Route is now:", Main);
}
    const shivrianList = [
        {name: "Starter Jump", region: "", typings: "Grass, Water, Fire", category: "Gauntlet", helpers: "",
        description: "Water-type themed. Gauntlet. located in the Lake. led by Arlan."},

        {name: "Water Gauntlet", region: "", typings: "Water", category: "Gauntlet", helpers: "",
        description: "Water-type themed. Gauntlet. located in the Lake. led by Arlan."},

        {name: "Demolition Lake Helicopter", region: "", typings: "Artillery, Water", category: "Single", helpers: "",
        description: "Water-type themed. Gauntlet. located in the Lake. led by Arlan."},

        {name: "Bug Gauntlet", region: "", typings: "Bug", category: "Gauntlet", helpers: "",
        description: "Bug-type themed. Gauntlet. located in the Swamp."},

        {name: "Dark Gauntlet", region: "", typings: "Dark", category: "Gauntlet", helpers: "",
        description: "Dark-type themed. Gauntlet."},

        {name: "Dragon Gauntlet", region: "", typings: "Dragon", category: "Gauntlet", helpers: "",
        description: "Dragon-type themed. Gauntlet."},

        {name: "Fairy Gauntlet", region: "", typings: "Fairy", category: "Gauntlet", helpers: "",
        description: "Fairy-type themed. Gauntlet. led by Chef. Ace is Frankfortress."},

        {name: "Fighting Gauntlet", region: "", typings: "Fighting", category: "Gauntlet", helpers: "",
        description: "Fighting-type themed. Gauntlet."},

        {name: "Fire Gauntlet", region: "", typings: "Fire", category: "Gauntlet", helpers: "",
        description: "Fire-type themed. Gauntlet. located in the Volcano. Ace is Pydromaglar."},

        {name: "Flying Gauntlet", region: "", typings: "Flying", category: "Gauntlet", helpers: "",
        description: "Flying-type themed. Gauntlet."},

        {name: "Ghost Gauntlet", region: "", typings: "Ghost", category: "Gauntlet", helpers: "",
        description: "Ghost-type themed. Gauntlet."},

        {name: "Grass Gauntlet", region: "", typings: "Grass", category: "Gauntlet", helpers: "",
        description: "Grass-type themed. Gauntlet."},

        {name: "Ground Gauntlet", region: "", typings: "Ground", category: "Gauntlet", helpers: "",
        description: "Ground-type themed. Gauntlet."},

        {name: "Ice Gauntlet", region: "", typings: "Ice", category: "Gauntlet", helpers: "",
        description: "Ice-type themed. Gauntlet. located in the Ice-Caps. Ace is Reptundra."},

        {name: "Normal Gauntlet", region: "", typings: "Normal", category: "Gauntlet", helpers: "",
        description: "Normal-type themed. Gauntlet."},

        {name: "Poison Gauntlet", region: "", typings: "Poison", category: "Gauntlet", helpers: "",
        description: "Poison-type themed. Gauntlet."},

        {name: "Psychic Gauntlet", region: "", typings: "Psychic", category: "Gauntlet", helpers: "",
        description: "Psychic-type themed. Gauntlet."},

        {name: "Rock Gauntlet", region: "", typings: "Rock", category: "Gauntlet", helpers: "",
        description: "Rock-type themed. Gauntlet."},

        {name: "Steel Gauntlet", region: "", typings: "Steel", category: "Gauntlet", helpers: "",
        description: "Steel-type themed. Gauntlet."},

        {name: "Light Gauntlet", region: "", typings: "Light", category: "Gauntlet", helpers: "",
        description: "Light-type themed. Gauntlet."},

        {name: "Artillery Gauntlet", region: "", typings: "Artillery", category: "Gauntlet", helpers: "",
        description: "Artillery-type themed. Gauntlet."},

        {name: "Cruise Ship", region: "", typings: "Water, Fire, Grass", category: "Gauntlet", helpers: "",
        description: "Water, Fire, Grass-type themed. Gauntlet. located in the Ocean. Ace is Hileaph, Axolarg, Blazuki."},

        {name: "Charquid Games", region: "", typings: "Fire", category: "Gauntlet", helpers: "",
        description: "Fire-type themed. Gauntlet. located in the Ice-Caps. Ace is Nonignite."},

        {name: "Radioactive Randal", region: "", typings: "Steel, Electric", category: "Single", helpers: "",
        description: "Steel, Electric-type themed. Single. located in the Plains. led by Radioactive Randal."},

        {name: "Operation Pseudo Gauntlet", region: "", typings: "Psychic", category: "Gauntlet", helpers: "",
        description: "Psychic-type themed. Gauntlet. located in the Secret Area. led by Operation Pseudo."},

        {name: "Dopplergrail", region: "", typings: "Psychic", category: "Single", helpers: "",
        description: "Psychic-type themed. Single. located in the Secret Area. led by Dopplergrail. Ace is Dopplegrail."},

        {name: "Radioactive Ronald", region: "", typings: "Ice", category: "Single, Event", helpers: "",
        description: "Ice-type themed. Single. located in the Frozen Wasteland. led by Radioactive Ronald."},

        {name: "Credits Gauntlet", region: "", typings: "Normal", category: "Gauntlet", helpers: "",
        description: "Normal-type themed. Gauntlet. located in the Secret Area. led by Creators."},

        {name: "Operation Pseudo Juvie Gauntlet", region: "", typings: "Steel", category: "Gauntlet, Juvie", helpers: "",
        description: "Steel-type themed. Gauntlet. located in the Secret Area. led by Capture Capsule. Ace is Capture Capsule, Dopplegrail."},

        {name: "JaviorDaSavior", region: "", typings: "Fighting", category: "Single, Juvie", helpers: "",
        description: "Fighting-type themed. Single, Juvie. located in the Secret Area. led by Jake."},

        {name: "Tal", region: "", typings: "Fighting", category: "Single, Juvie", helpers: "",
        description: "Fighting-type themed. Single, Juvie. located in the Secret Area. led by Tal."},

        {name: "BloxxyMech", region: "", typings: "Fighting", category: "Single, Juvie", helpers: "",
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