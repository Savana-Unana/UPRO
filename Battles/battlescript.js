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
const shivrianList = [
    {id: 1000, name: "Water Gauntlet", theme: "Water", category: "Gauntlet", Opposition: "Arlan", Region: "Lake", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Bug Gauntlet", theme: "Bug", category: "Gauntlet", Opposition: "", Region: "Swamp", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Dark Gauntlet", theme: "Dark", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Dragon Gauntlet", theme: "Dragon", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Fairy Gauntlet", theme: "Fairy", category: "Gauntlet", Opposition: "Chef", Region: "", Enemies: "", Ace: "Frankfortress", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Fighting Gauntlet", theme: "Fighting", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Fire Gauntlet", theme: "Fire", category: "Gauntlet", Opposition: "", Region: "Volcano", Enemies: "", Ace: "Pydromaglar", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Flying Gauntlet", theme: "Flying", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Ghost Gauntlet", theme: "Ghost", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Grass Gauntlet", theme: "Grass", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Ground Gauntlet", theme: "Ground", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Ice Gauntlet", theme: "Ice", category: "Gauntlet", Opposition: "", Region: "Ice-Caps", Enemies: "", Ace: "Reptundra", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Normal Gauntlet", theme: "Normal", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Poison Gauntlet", theme: "Poison", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Psychic Gauntlet", theme: "Psychic", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Rock Gauntlet", theme: "Rock", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Steel Gauntlet", theme: "Steel", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Light Gauntlet", theme: "Light", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Cruise Ship", theme: "Water, Fire, Grass", category: "Gauntlet", Opposition: "", Region: "Ocean", Enemies: "", Ace: "Hileaph, Axolarg, Blazuki", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Charquid Games", theme: "Fire", category: "Gauntlet", Opposition: "", Region: "Ice-Caps", Enemies: "", Ace: "Nonignite", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Radioactive Randal", theme: "Steel, Electric", category: "Single", Opposition: "Radioactive Randal", Region: "Plains", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Operation Pseudo Gauntlet", theme: "Psychic", category: "Gauntlet", Opposition: "Operation Pseudo", Region: "Secret Area", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Dopplegrail", theme: "Psychic", category: "Single", Opposition: "Dopplergrail", Region: "Secret Area", Enemies: "", Ace: "Dopplegrail", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Radioactive Ronald", theme: "Ice", category: "Single", Opposition: "Radioactive Ronald", Region: "Frozen Wasteland", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Credits Gauntlet", theme: "Normal", category: "Gauntlet", Opposition: "Creators", Region: "Secret Area", Enemies: "", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Operation Pseudo Juvie Gauntlet", theme: "Steel", category: "Gauntlet", Opposition: "Capture Capsule", Region: "Secret Area", Enemies: "", Ace: "Capture Capsule, Dopplegrail", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "JaviorDaSavior", theme: "Fighting", category: "Single, Juvie", Opposition: "Jake", Region: "Secret Area", Enemies: "JaviorDaSavior", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "Tal", theme: "Fighting", category: "Single, Juvie", Opposition: "Tal", Region: "Secret Area", Enemies: "Tal", Ace: "", Image: "../lostimages/MissingNo.png"},
    {id: 1000, name: "BloxxyMech", theme: "Fighting", category: "Single, Juvie", Opposition: "Shane", Region: "Secret Area", Enemies: "BloxxyMech", Ace: "", Image: "../lostimages/MissingNo.png"}
];

let lastQuery = "";

function displayShivrian() {
    const catalog = document.getElementById("catalog");
    catalog.innerHTML = "";
    shivrianList.sort((a, b) => a.id - b.id);
    shivrianList.forEach(shivrian => {
        const card = document.createElement("div");
        card.className = "shivrian-card";
        card.setAttribute("data-id", shivrian.id);
        card.innerHTML = `
    <h3>${shivrian.name}</h3><img src="${shivrian.Image || '../lostimages/MissingNo.png'}" alt="${shivrian.name}" class="shivrian-img">
    `;
        if (shivrian.category ==="Juvie") {
            card.style.filter = "invert(1)";
        }
        card.onclick = () => showDetails(shivrian);
        catalog.appendChild(card);
    });
}

function filterShivrian() {
    const searchInput = document.getElementById("search");
    lastQuery = searchInput.value.toLowerCase().trim();
    const catalog = document.getElementById("catalog");
    const cards = catalog.getElementsByClassName("shivrian-card");

    shivrianList.forEach((shivrian, index) => {
        const card = cards[index];
        if (!card) return;

        const searchFields = [
            shivrian.name,
            shivrian.theme,
            shivrian.category,
            shivrian.Opposition,
            shivrian.Region,
            shivrian.Enemies,
            shivrian.Ace
        ].join(" ").toLowerCase();

        const isMatch = searchFields.includes(lastQuery);
        card.style.display = isMatch ? "block" : "none";
    });
}
function showDetails(shivrian) {
    if (!shivrian) {
        console.error("Shivrian data is missing or undefined.");
        return;
    }
    document.getElementById("catalog").style.display = "none";
    document.getElementById("shivrian-details").style.display = "block";
    document.getElementById("search").style.display = "none";
    document.querySelector("button").style.display = "none";
    document.getElementById("shivrian-name").textContent = shivrian.name || "Unknown Name";
    document.getElementById("shivrian-description").textContent = "Description not available.";
    document.getElementById("shivrian-opposition").textContent = shivrian.Opposition || "No opposition info.";
    document.getElementById("shivrian-ace").textContent = shivrian.Ace || "No ace Pokémon.";
}

function closeDetails() {
    document.getElementById("catalog").style.display = "flex";
    document.getElementById("shivrian-details").style.display = "none";
    document.getElementById("search").style.display = "block";
    document.querySelector("button").style.display = "block";
}

document.addEventListener("DOMContentLoaded", displayShivrian);
