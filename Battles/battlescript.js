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
let Secrets = false;

function setSecret() {
    Main = !Main;
    Juvie = false;
    Secrets = !Secrets;
    document.getElementById('secretLabel').textContent = Secrets ? "Normal Game" : "Secrets";
    document.getElementById('routeLabel').textContent = Juvie ? "Main Route" : "Juvie Route";
    autoTriggerSearch();
    console.log("Secret Condition is now:", Main);
}

function setRoute() {
    Main = !Main;
    Juvie = !Juvie;
    Secrets = false;
    document.getElementById('routeLabel').textContent = Juvie ? "Main Route" : "Juvie Route";
    document.getElementById('secretLabel').textContent = Secrets ? "Normal Game" : "Secrets";
    autoTriggerSearch();
    console.log("Main Route is now:", Main);
}
    const shivericanList = [
        {name: "Starter Jump", region: "", typings: "Grass, Water, Fire", category: "Gauntlet",
        description: "Water-type themed. Gauntlet. located in the Lake. led by Arlan."},

        {name: "Reposition Rally", region: "", typings: "Grass, Bug", category: "Single",
        description: "Rally happening the in the SpawnPoint Town."},

        {name: "Water Gauntlet", region: "", typings: "Water", category: "Gauntlet",
        description: "Water-type themed. Gauntlet. located in the Lake. led by Arlan."},

        {name: "Demolition Helicopter", region: "", typings: "Artillery, Water", category: "Double",
        description: "Water-type themed. Gauntlet. located in the Lake. led by Arlan."},

        {name: "Ecological Dead Zone", region: "", typings: "Artillery, Water", category: "Secret",
        description: "Under the Water Gauntlet during its repairs."},

        {name: "Bug Gauntlet", region: "", typings: "Bug", category: "Gauntlet",
        description: "Bug-type themed. Gauntlet. located in the Swamp."},

        {name: "Dark Gauntlet", region: "", typings: "Dark", category: "Gauntlet",
        description: "Dark-type themed. Gauntlet."},

        {name: "Dragon Gauntlet", region: "", typings: "Dragon", category: "Gauntlet",
        description: "Dragon-type themed. Gauntlet."},

        {name: "Fairy Gauntlet", region: "", typings: "Fairy", category: "Gauntlet",
        description: "Fairy-type themed. Gauntlet. led by Chef. Ace is Frankfortress."},

        {name: "Fighting Gauntlet", region: "", typings: "Fighting", category: "Gauntlet",
        description: "Fighting-type themed. Gauntlet."},

        {name: "Fire Gauntlet", region: "", typings: "Fire", category: "Gauntlet",
        description: "Fire-type themed. Gauntlet. located in the Volcano. Ace is Pydromaglar."},

        {name: "Flying Gauntlet", region: "", typings: "Flying", category: "Gauntlet",
        description: "Flying-type themed. Gauntlet."},

        {name: "Ghost Gauntlet", region: "", typings: "Ghost", category: "Gauntlet",
        description: "Ghost-type themed. Gauntlet."},

        {name: "Empire Vigilith", region: "", typings: "Stone, Ghost", category: "Single",
        description: "Water-type themed. Gauntlet. located in the Lake. led by Arlan."},

        {name: "Grass Gauntlet", region: "", typings: "Grass", category: "Gauntlet",
        description: "Grass-type themed. Gauntlet."},

        {name: "Ground Gauntlet", region: "", typings: "Ground", category: "Gauntlet",
        description: "Ground-type themed. Gauntlet."},

        {name: "Ice Gauntlet", region: "", typings: "Ice", category: "Gauntlet",
        description: "Ice-type themed. Gauntlet. located in the Ice-Caps. Ace is Reptundra."},

        {name: "Normal Gauntlet", region: "", typings: "Normal", category: "Gauntlet",
        description: "Normal-type themed. Gauntlet."},

        {name: "Poison Gauntlet", region: "", typings: "Poison", category: "Gauntlet",
        description: "Poison-type themed. Gauntlet."},

        {name: "Psychic Gauntlet", region: "", typings: "Psychic", category: "Gauntlet",
        description: "Psychic-type themed. Gauntlet."},

        {name: "Rock Gauntlet", region: "", typings: "Rock", category: "Gauntlet",
        description: "Rock-type themed. Gauntlet."},

        {name: "Steel Gauntlet", region: "", typings: "Steel", category: "Gauntlet",
        description: "Steel-type themed. Gauntlet."},

        {name: "Light Gauntlet", region: "", typings: "Light", category: "Gauntlet",
        description: "Light-type themed. Gauntlet."},

        {name: "Artillery Gauntlet", region: "", typings: "Artillery", category: "Gauntlet",
        description: "Artillery-type themed. Gauntlet."},

        {name: "Cruise Ship", region: "", typings: "Water, Fire, Grass", category: "Gauntlet",
        description: "Water, Fire, Grass-type themed. Gauntlet. located in the Ocean. Ace is Hileaph, Axolarg, Blazuki."},

        {name: "Charquid Games", region: "", typings: "Fire", category: "Gauntlet",
        description: "Fire-type themed. Gauntlet. located in the Ice-Caps. Ace is Nonignite."},

        {name: "Radioactive Randal", region: "", typings: "Steel, Electric", category: "Single",
        description: "Steel, Electric-type themed. Single. located in the Plains. led by Radioactive Randal."},

        {name: "Operation Pseudo Gauntlet", region: "", typings: "Psychic", category: "Gauntlet",
        description: "Psychic-type themed. Gauntlet. located in the Secret Area. led by Operation Pseudo."},

        {name: "Dopplergrail", region: "", typings: "Psychic", category: "Single",
        description: "Psychic-type themed. Single. located in the Secret Area. led by Dopplergrail. Ace is Dopplegrail."},

        {name: "Radioactive Ronald", region: "", typings: "Ice", category: "Single, Secret",
        description: "Ice-type themed. Single. located in the Frozen Wasteland. led by Radioactive Ronald."},

        {name: "Credits Gauntlet", region: "", typings: "Normal", category: "Gauntlet",
        description: "Normal-type themed. Gauntlet. located in the Secret Area. led by Creators."},

        {name: "Operation Judgement Gauntlet", region: "", typings: "Steel", category: "Gauntlet, Juvie",
        description: "Steel-type themed. Gauntlet. located in the Secret Area. led by Capture Capsule. Ace is Capture Capsule, Dopplegrail."},
    ];
    function displayShiverican() {
        const catalog = document.getElementById("catalog");
        catalog.innerHTML = ""; 
        shivericanList.sort((a, b) => a.id - b.id);
        shivericanList.forEach(shiverican => {
            const card = document.createElement("div");
            card.className = "shiverican-card";
    
            const category = shiverican.category.toLowerCase();
            if (category.includes("gauntlet")) {
                card.classList.add("gauntlet");
            } 
            else if (category.includes("single")) {
                card.classList.add("single");
            } 
            else if (category.includes("double")) {
                card.classList.add("double");
            } 
            else {
                card.classList.add("other");
            }
    
            card.setAttribute("data-id", shiverican.id);
            card.innerHTML = `<h3>${shiverican.name}</h3>`;
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
        const isJuvie = category.includes("juvie");
        const isSecret = category.includes("secret");
        const isMain = !isJuvie && !isSecret;

        // For Juvie Route
        if (Juvie) {
            card.style.display = isJuvie && isNameMatch ? "block" : "none";
        } 
        // For Secret Route
        else if (Secrets) {
            card.style.display = isSecret && isNameMatch ? "block" : "none";
        } 
        // For Main Route
        else if (Main) {
            card.style.display = isMain && isNameMatch ? "block" : "none";
        } else {
            card.style.display = isNameMatch ? "block" : "none";
        }

        // Special case for the "return" query
        if (lastQuery === "return") {
            window.location.href = "../Catalog/catalog.html";
        }
    });
}

// When toggling the Secret state
function setSecret() {
    Main = !Main;
    Juvie = false;
    Secrets = !Secrets;
    document.getElementById('secretLabel').textContent = Secrets ? "Normal Game" : "Secrets";
    document.getElementById('routeLabel').textContent = Juvie ? "Main Route" : "Juvie Route";
    autoTriggerSearch();  // Re-trigger the search to apply the new filter
    console.log("Secret Condition is now:", Secrets);
    filterShiverican();  // Apply filter after route change
}

// When toggling the Route state
function setRoute() {
    Main = !Main;
    Juvie = !Juvie;
    Secrets = false;
    document.getElementById('routeLabel').textContent = Juvie ? "Main Route" : "Juvie Route";
    document.getElementById('secretLabel').textContent = Secrets ? "Normal Game" : "Secrets";
    autoTriggerSearch();  // Re-trigger the search to apply the new filter
    console.log("Main Route is now:", Main);
    filterShiverican();  // Apply filter after route change
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