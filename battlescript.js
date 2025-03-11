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
            { id: 1000, name: "Water Gauntlet", theme: "Water", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Bug Gauntlet", theme: "Bug", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Dark Gauntlet", theme: "Dark", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Dragon Gauntlet", theme: "Dragon", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Fairy Gauntlet", theme: "Fairy", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "Frankfortress" },
            { id: 1000, name: "Fighting Gauntlet", theme: "Fighting", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Fire Gauntlet", theme: "Fire", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "Pydromaglar" },
            { id: 1000, name: "Flying Gauntlet", theme: "Flying", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Ghost Gauntlet", theme: "Ghost", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Grass Gauntlet", theme: "Grass", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Ground Gauntlet", theme: "Ground", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Ice Gauntlet", theme: "Ice", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Normal Gauntlet", theme: "Normal", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Poison Gauntlet", theme: "Poison", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Psychic Gauntlet", theme: "Psychic", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Rock Gauntlet", theme: "Rock", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Steel Gauntlet", theme: "Steel", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Light Gauntlet", theme: "Light", category: "Gauntlet", Opposition: "", Region: "", Enemies: "", Ace: "" },
            { id: 1000, name: "Radioactive Randal", theme: "Steel, Electric", category: "Single", Opposition: "Radioactive Randal", Region: "Plains", Enemies: "", Ace: "" },
            { id: 1000, name: "Dopplergrail", theme: "Psychic", category: "Single", Opposition: "DopplerGrail", Region: "Secret Area", Enemies: "", Ace: "" },
            { id: 1000, name: "Radioactive Ronald", theme: "Ice", category: "Single", Opposition: "Radioactive Ronald", Region: "Frozen Wasteland", Enemies: "", Ace: "" }

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
                    <h3>${shivrian.name}</h3>
                `;
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
        const id = shivrian.id.toString().toLowerCase();
        const name = shivrian.name.toLowerCase();
        const theme = shivrian.theme.toLowerCase();
        const category = shivrian.category ? shivrian.category.toLowerCase() : "";
        const opposition = shivrian.opposition ? shivrian.opposition.toLowerCase() : "";
        const region = shivrian.region ? shivrian.region.toLowerCase() : "";
        // const enemies = shivrian.region ? shivrian.region.toLowerCase() : "";
        const ace = shivrian.ace ? shivrian.ace.toLowerCase() : "";
        const isMatch = (name.includes(lastQuery) || lastQuery === id);

        const typeFilters = {
            fire: isFire, water: isWater, grass: isGrass, electric: isElectric,
            ice: isIce, fighting: isFighting, poison: isPoison, ground: isGround,
            flying: isFlying, psychic: isPsychic, bug: isBug, rock: isRock,
            ghost: isGhost, dragon: isDragon, dark: isDark, steel: isSteel,
            fairy: isFairy, normal: isNormal, light: isLight
        };
        
        const categoryFilters = {
            single: isSingle, double: isDouble, triple: isTriple, 
            gauntlet: isGauntlet, wild: isWild, legendary: isLegendary
        };
        
        const regionFilters = {
            plains: isPlains, ocean: isOcean, cruise: isCruise,
            lake: isLake, forest: isForest, desert: isDesert,
            volcano: isVolcano, river: isRiver, swamp: isSwamp,
            icecaps: isIceCaps, mountainrange: isMountainRange,
            shiverco: isShiverCo, cave: isCave, secretarea: isSecretArea,
            cafe: isCafe, spookyfactory: isSpookyFactory,
            spookyjungle: isSpookyJungle, frozenwasteland: isFrozenWasteland,
            unobtainable: isUnobtainable
        };
        
        card.style.display = typeFilters[lastQuery] || categoryFilters[lastQuery] || regionFilters[lastQuery] ? "block" : "none";
        
        const isChef = opposition.includes("chef");
        const isRadioactiveRandal = opposition.includes("radioactive randal");
        const isDopplerGrail = opposition.includes("dopplergrail");
        const isRadioactiveRonald = opposition.includes("radioactive ronald");

        const isNinignite = ace.includes("ninignite");
        const isPydromaglar = ace.includes("pydromaglar");
        const isFrankfortress = ace.includes("frankfortress");
        const isHileaph = ace.includes("hileaph");
        const isBlazuki = ace.includes("blazkui");
        const isAxolitl = ace.includes("axolitl");

        const isHalloweenMatch = category.includes("halloween");
        const isFrostbiteMatch = category.includes("frostbite");

        if (lastQuery === "fire") {
            card.style.display = isFire ? "block" : "none";
        } 
        else if (lastQuery === "water") {
            card.style.display = isWater ? "block" : "none";
        } 
        else if (lastQuery === "grass") {
            card.style.display = isGrass ? "block" : "none";
        } 
        else if (lastQuery === "electric") {
            card.style.display = isElectric ? "block" : "none";
        } 
        else if (lastQuery === "ice") {
            card.style.display = isIce ? "block" : "none";
        } 
        else if (lastQuery === "fighting") {
            card.style.display = isFighting ? "block" : "none";
        } 
        else if (lastQuery === "poison") {
            card.style.display = isPoison ? "block" : "none";
        } 
        else if (lastQuery === "ground") {
            card.style.display = isGround ? "block" : "none";
        } 
        else if (lastQuery === "flying") {
            card.style.display = isFlying ? "block" : "none";
        } 
        else if (lastQuery === "psychic") {
            card.style.display = isPsychic ? "block" : "none";
        } 
        else if (lastQuery === "bug") {
            card.style.display = isBug ? "block" : "none";
        } 
        else if (lastQuery === "rock") {
            card.style.display = isRock ? "block" : "none";
        } 
        else if (lastQuery === "ghost") {
            card.style.display = isGhost ? "block" : "none";
        } 
        else if (lastQuery === "dragon") {
            card.style.display = isDragon ? "block" : "none";
        } 
        else if (lastQuery === "dark") {
            card.style.display = isDark ? "block" : "none";
        } 
        else if (lastQuery === "steel") {
            card.style.display = isSteel ? "block" : "none";
        } 
        else if (lastQuery === "fairy") {
            card.style.display = isFairy ? "block" : "none";
        } 
        else if (lastQuery === "normal") {
            card.style.display = isNormal ? "block" : "none";
        } 
        else if (lastQuery === "light") {
            card.style.display = isLight ? "block" : "none";
        }
        if (lastQuery === "single") {
            card.style.display = isSingle ? "block" : "none";
        } 
        else if (lastQuery === "double") {
            card.style.display = isDouble ? "block" : "none";
        } 
        else if (lastQuery === "triple") {
            card.style.display = isTriple ? "block" : "none";
        } 
        else if (lastQuery === "gauntlet") {
            card.style.display = isGauntlet ? "block" : "none";
        } 
        else if (lastQuery === "wild") {
            card.style.display = isWild ? "block" : "none";
        } 
        else if (lastQuery === "legendary") {
            card.style.display = isLegendary ? "block" : "none";
        } 
        if (lastQuery === "chef") {
            card.style.display = isChef ? "block" : "none";
        } 
        else if (lastQuery === "radioactive randal") {
            card.style.display = isRadioactiveRandal ? "block" : "none";
        } 
        else if (lastQuery === "radioactive ronald") {
            card.style.display = isRadioactiveRonald ? "block" : "none";
        } 
        else if (lastQuery === "dopplergrail") {
            card.style.display = isDopplerGrail ? "block" : "none";
        } 
        if (lastQuery === "plains") {
            card.style.display = isPlains ? "block" : "none";
        } 
        else if (lastQuery === "ocean") {
            card.style.display = isOcean ? "block" : "none";
        } 
        else if (lastQuery === "cruise") {
            card.style.display = isCruise ? "block" : "none";
        } 
        else if (lastQuery === "lake") {
            card.style.display = isLake ? "block" : "none";
        } 
        else if (lastQuery === "forest") {
            card.style.display = isForest ? "block" : "none";
        } 
        else if (lastQuery === "desert") {
            card.style.display = isDesert ? "block" : "none";
        } 
        else if (lastQuery === "volcano") {
            card.style.display = isVolcano ? "block" : "none";
        } 
        else if (lastQuery === "river") {
            card.style.display = isRiver ? "block" : "none";
        } 
        else if (lastQuery === "swamp") {
            card.style.display = isSwamp ? "block" : "none";
        } 
        else if (lastQuery === "icecaps") {
            card.style.display = isIceCaps ? "block" : "none";
        }
        else if (lastQuery === "mountainrange") {
            card.style.display = isMountainRange ? "block" : "none";
        }
        else if (lastQuery === "shiverco") {
            card.style.display = isShiverCo ? "block" : "none";
        } 
        else if (lastQuery === "cave") {
            card.style.display = isCave ? "block" : "none";
        } 
        else if (lastQuery === "secretarea") {
            card.style.display = isSecretArea ? "block" : "none";
        } 
        else if (lastQuery === "cafe") {
            card.style.display = isCafe ? "block" : "none";
        } 
        else if (lastQuery === "spookyfactory") {
            card.style.display = isSpookyFactory ? "block" : "none";
        }
        else if (lastQuery === "spookyjungle") {
            card.style.display = isSpookyJungle ? "block" : "none";
        }
        else if (lastQuery === "frozenwasteland") {
            card.style.display = isFrozenWasteland ? "block" : "none";
        }
        else if (lastQuery === "unobtainable") {
            card.style.display = isUnobtainable ? "block" : "none";
        }
        if (lastQuery === "ninignite") {
            card.style.display = isNinignite ? "block" : "none";
        } 
        else if (lastQuery === "pydromaglar") {
            card.style.display = isPydromaglar ? "block" : "none";
        } 
        else if (lastQuery === "frankfortress") {
            card.style.display = isFrankfortress ? "block" : "none";
        } 
        else if (lastQuery === "hileaph") {
            card.style.display = isHileaph ? "block" : "none";
        } 
        else if (lastQuery === "blazuki") {
            card.style.display = isBlazuki ? "block" : "none";
        } 
        else if (lastQuery === "axolitl") {
            card.style.display = isAxolitl ? "block" : "none";
        } 

        if (lastQuery === "halloween") {
            document.body.style.backgroundColor = "#ED6942";
            card.style.backgroundColor = "#8B5CF6";
            card.style.border = "black";
            isHalloweenMatch ? "block" : "none";
        } 
        if (lastQuery === "frostbite") {
            document.body.style.backgroundColor = "Aqua";
            card.style.backgroundColor = "Gray";
            card.style.border = "Gray";
            isFrostbiteMatch ? "block" : "none";
        } 
        else {
            document.body.style.backgroundColor = "";
            card.style.backgroundColor = "";
            card.style.border = "";
        }
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
    document.getElementById("shivrian-description").textContent = shivrian.description || "No description available.";
    document.getElementById("shivrian-opposition").textContent = shivrian.opposition || "No opposition info.";
    document.getElementById("shivrian-ace").textContent = shivrian.ace || "No ace Pokémon.";
    document.getElementById("nav-buttons").style.display = "none";

    document.getElementById("shivrian-details").style.display = "block";
}

function closeDetails() {
    document.getElementById("catalog").style.display = "flex";
    document.getElementById("shivrian-details").style.display = "none";
    document.getElementById("nav-buttons").style.display = "block";
    let searchBar = document.getElementById("search");
    searchBar.style.display = "block";
    searchBar.style.margin = "0 auto";
    searchBar.style.textAlign = "center";
    if (lastQuery === "frostbite") {
        document.body.style.backgroundColor = "Aqua";
    } 
    else if (lastQuery === "halloween") {
        document.body.style.backgroundColor = "#ED6942";
    } 
    else {
        document.body.style.backgroundColor = "White";
    }
}
    displayShivrian();
// Ariel Salama was also here