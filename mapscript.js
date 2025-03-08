// Code from the fist script section
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
let Alt = false; 

    function setAltTrue() {
        Alt = !Alt;
        autoTriggerSearch();
        console.log("Alt is now:", Alt);
    }

// Code from the third script section
const defaultImage = 'images/MissingNo.png';
        const shivrianList = [
            {id: 150, name: "TwoMew.jpeg.png.gif.webp.jif", image: "images/TwoMew.jpeg.png.gif.webp.jif.png", typings: "", paratypings: "", category: "", artist: "Shane", credits: "Drawn-Shane+", 
            description: "WALK INTO MY MYSTERY"},
            {id: 150, name: "TwoMew.jpeg.png.gif.webp.jif", image: "images/TwoMew.jpeg.png.gif.webp.jif.png", typings: "", paratypings: "", category: "", artist: "Shane", credits: "Drawn-Shane+", 
            description: "WALK INTO MY MYSTERY"},
            {id: 150, name: "TwoMew.jpeg.png.gif.webp.jif", image: "images/TwoMew.jpeg.png.gif.webp.jif.png", typings: "", paratypings: "", category: "", artist: "Shane", credits: "Drawn-Shane+", 
            description: "WALK INTO MY MYSTERY"},
            {id: 150, name: "TwoMew.jpeg.png.gif.webp.jif", image: "images/TwoMew.jpeg.png.gif.webp.jif.png", typings: "", paratypings: "", category: "", artist: "Shane", credits: "Drawn-Shane+", 
            description: "WALK INTO MY MYSTERY"},
            {id: 150, name: "TwoMew.jpeg.png.gif.webp.jif", image: "images/TwoMew.jpeg.png.gif.webp.jif.png", typings: "", paratypings: "", category: "", artist: "Shane", credits: "Drawn-Shane+", 
            description: "WALK INTO MY MYSTERY"},
            {id: 150, name: "TwoMew.jpeg.png.gif.webp.jif", image: "images/TwoMew.jpeg.png.gif.webp.jif.png", typings: "", paratypings: "", category: "", artist: "Shane", credits: "Drawn-Shane+", 
            description: "WALK INTO MY MYSTERY"},
            {id: 150, name: "TwoMew.jpeg.png.gif.webp.jif", image: "images/TwoMew.jpeg.png.gif.webp.jif.png", typings: "", paratypings: "", category: "", artist: "Shane", credits: "Drawn-Shane+", 
            description: "WALK INTO MY MYSTERY"},
            {id: 150, name: "TwoMew.jpeg.png.gif.webp.jif", image: "images/TwoMew.jpeg.png.gif.webp.jif.png", typings: "", paratypings: "", category: "", artist: "Shane", credits: "Drawn-Shane+", 
            description: "WALK INTO MY MYSTERY"},
                
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
        const name = shivrian.name.toLowerCase();
        const id = shivrian.id.toString().toLowerCase();
        const category = shivrian.category ? shivrian.category.toLowerCase() : "";
        const credits = shivrian.credits ? shivrian.credits.toLowerCase() : "";
        const artist = shivrian.artist ? shivrian.artist.toLowerCase() : "";
        const typings = shivrian.typings ? shivrian.typings.toLowerCase() : "";
        const paratypings = shivrian.paratypings ? shivrian.paratypings.toLowerCase() : "";
        const isMatch = (name.includes(lastQuery) || lastQuery === id) && !category.includes("halloween") && !category.includes("frostbite") && (!category.includes("alt") || Alt);
        
        const isTalHelp = credits.includes("tal+") && category==("");
        const isTaltHelp = credits.includes("tal+") && category!=("");
        const isJakeHelp = credits.includes("jake+") && category==("");
        const isJaltHelp = credits.includes("jake+") && category!=("");
        const isShaneHelp = credits.includes("shane+") && category==("");
        const isShaltHelp = credits.includes("shane+") && category!=("");
        const isArielHelp = credits.includes("ariel+") && category==("");
        const isArialtHelp = credits.includes("ariel+") && category!=("");
        const isIvriHelp = credits.includes("ivri+") && category==("");
        const isIvraltHelp = credits.includes("ivri+") && category!=("");
        const isAmoHelp = credits.includes("amo+") && category==("");
        const isAmaltHelp = credits.includes("amo+") && category!=("");

        const isTals = artist == ("tal") && category==("");
        const isTalts = artist == ("tal") && category!=("");
        const isJakes = artist == ("jake") && category==("");
        const isJalts =  artist == ("jake") && category!=("");
        const isShanes =  artist == ("shane") && category==("");
        const isShalts =  artist == ("shane") && category!=("");
        const isArialt =  artist == ("ivri") && category==("");
        const isAriels =  artist == ("ivri") && category!=("");
        const isIvris =  artist == ("ivri") && category==("");
        const isIvralts = artist == ("ivri") && category!=("");
        const isAmos =  artist == ("amo") && category==("");
        const isAmalts =  artist == ("amo") && category!=("");

        const isFire = typings.includes("fire") && category == ("");
        const isWater = typings.includes("water") && category == ("");
        const isGrass = typings.includes("grass") && category == ("");
        const isElectric = typings.includes("electric") && category == ("");
        const isIce = typings.includes("ice") && category == ("");
        const isFighting = typings.includes("fighting") && category == ("");
        const isPoison = typings.includes("poison") && category == ("");
        const isGround = typings.includes("ground") && category == ("");
        const isFlying = typings.includes("flying") && category == ("");
        const isPsychic = typings.includes("psychic") && category == ("");
        const isBug = typings.includes("bug") && category == ("");
        const isRock = typings.includes("rock") && category == ("");
        const isGhost = typings.includes("ghost") && category == ("");
        const isDragon = typings.includes("dragon") && category == ("");
        const isDark = typings.includes("dark") && category == ("");
        const isSteel = typings.includes("steel") && category == ("");
        const isFairy = typings.includes("fairy") && category == ("");
        const isNormal = typings.includes("normal") && category == ("");
        const isLight = typings.includes("light") && category == ("");

        const isFireAlt = typings.includes("fire") && category != ("");
        const isWaterAlt = typings.includes("water") && category != ("");
        const isGrassAlt = typings.includes("grass") && category != ("");
        const isElectricAlt = typings.includes("electric") && category != ("");
        const isIceAlt = typings.includes("ice") && category != ("");
        const isFightingAlt = typings.includes("fighting") && category != ("");
        const isPoisonAlt = typings.includes("poison") && category != ("");
        const isGroundAlt = typings.includes("ground") && category != ("");
        const isFlyingAlt = typings.includes("flying") && category != ("");
        const isPsychicAlt = typings.includes("psychic") && category != ("");
        const isBugAlt = typings.includes("bug") && category != ("");
        const isRockAlt = typings.includes("rock") && category != ("");
        const isGhostAlt = typings.includes("ghost") && category != ("");
        const isDragonAlt = typings.includes("dragon") && category != ("");
        const isDarkAlt = typings.includes("dark") && category != ("");
        const isSteelAlt = typings.includes("steel") && category != ("");
        const isFairyAlt = typings.includes("fairy") && category != ("");
        const isNormalAlt = typings.includes("normal") && category != ("");
        const isLightAlt = typings.includes("light") && category != ("");

        const isParaFire = paratypings.includes("fire") && category == ("");
        const isParaWater = paratypings.includes("water") && category == ("");
        const isParaGrass = paratypings.includes("grass") && category == ("");
        const isParaElectric = paratypings.includes("electric") && category == ("");
        const isParaIce = paratypings.includes("ice") && category == ("");
        const isParaFighting = paratypings.includes("fighting") && category == ("");
        const isParaPoison = paratypings.includes("poison") && category == ("");
        const isParaGround = paratypings.includes("ground") && category == ("");
        const isParaFlying = paratypings.includes("flying") && category == ("");
        const isParaPsychic = paratypings.includes("psychic") && category == ("");
        const isParaBug = paratypings.includes("bug") && category == ("");
        const isParaRock = paratypings.includes("rock") && category == ("");
        const isParaGhost = paratypings.includes("ghost") && category == ("");
        const isParaDragon = paratypings.includes("dragon") && category == ("");
        const isParaDark = paratypings.includes("dark") && category == ("");
        const isParaSteel = paratypings.includes("steel") && category == ("");
        const isParaFairy = paratypings.includes("fairy") && category == ("");
        const iParaNormal = paratypings.includes("normal") && category == ("");
        const isParaLight = paratypings.includes("light") && category == ("");

        const isParaFireAlt = paratypings.includes("fire") && category != ("");
        const isParaWaterAlt = paratypings.includes("water") && category != ("");
        const isParaGrassAlt = paratypings.includes("grass") && category != ("");
        const isParaElectricAlt = paratypings.includes("electric") && category != ("");
        const isvIceAlt = paratypings.includes("ice") && category != ("");
        const isParaFightingAlt = paratypings.includes("fighting") && category != ("");
        const isParaPoisonAlt = paratypings.includes("poison") && category != ("");
        const isParaGroundAlt = paratypings.includes("ground") && category != ("");
        const isParaFlyingAlt = paratypings.includes("flying") && category != ("");
        const isParaPsychicAlt = paratypings.includes("psychic") && category != ("");
        const isParaBugAlt = paratypings.includes("bug") && category != ("");
        const isParaRockAlt = paratypings.includes("rock") && category != ("");
        const isParaGhostAlt = paratypings.includes("ghost") && category != ("");
        const isParaDragonAlt = paratypings.includes("dragon") && category != ("");
        const isParaDarkAlt = paratypings.includes("dark") && category != ("");
        const isParaSteelAlt = paratypings.includes("steel") && category != ("");
        const isParaFairyAlt = paratypings.includes("fairy") && category != ("");
        const isParaNormalAlt = paratypings.includes("normal") && category != ("");
        const isParaLightAlt = paratypings.includes("light") && category != ("");

        const isHalloweenMatch = category.includes("halloween") && !category.includes("halloweenforme");
        const isHalloweenAltMatch = category.includes("halloweenforme");
        const isFrostbiteMatch = category.includes("frostbite");
        const isFrostbiteAltMatch = category.includes("frozen");
        const isAltMatch = (name.includes(lastQuery) || lastQuery === id) && (category.includes("alt"));
        if (Alt) {
            card.style.display = isAltMatch ? "block" : "none";
        } 
        else {
            card.style.display = isMatch ? "block" : "none";
        }
        if (lastQuery === "tal") {
            if (Alt) {
                card.style.display = isTalts ? "block" : "none";
            } 
            else {
                card.style.display = isTals ? "block" : "none";
            }
        } 
        else if (lastQuery === "jake") {
            if (Alt) {
                card.style.display = isJalts ? "block" : "none";
            } 
            else {
                card.style.display = isJakes ? "block" : "none";
            }
        } 
        else if (lastQuery === "shane") {
            if (Alt) {
                card.style.display = isShalts ? "block" : "none";
            } 
            else {
                card.style.display = isShanes ? "block" : "none";
            }
        } 
        else if (lastQuery === "ariel") {
            if (Alt) {
                card.style.display = isArialt ? "block" : "none";
            } 
            else {
                card.style.display = isAriels ? "block" : "none";
            }
        } 
        else if (lastQuery === "ivri") {
            if (Alt) {
                card.style.display = isIvralts ? "block" : "none";
            } 
            else {
                card.style.display = isIvris ? "block" : "none";
            }
        } 
        else if (lastQuery === "amo" || lastQuery === "amorayah") {
            if (Alt) {
                card.style.display = isAmalts ? "block" : "none";
            } 
            else {
                card.style.display = isAmos ? "block" : "none";
            }
        } 
        if (lastQuery.includes("tal+")) {
            if (Alt) {
                card.style.display = isTaltHelp ? "block" : "none";
            } 
            else {
                card.style.display = isTalHelp ? "block" : "none";
            }
        } 
        else if (lastQuery.includes("jake+")) {
            if (Alt) {
                card.style.display = isJaltHelp ? "block" : "none";
            } 
            else {
                card.style.display = isJakeHelp ? "block" : "none";
            }
        } 
        else if (lastQuery.includes("shane+")) {
            if (Alt) {
                card.style.display = isShaltHelp ? "block" : "none";
            } 
            else {
                card.style.display = isShaneHelp ? "block" : "none";
            }
        } 
        else if (lastQuery.includes("ariel+")) {
            if (Alt) {
                card.style.display = isArialtHelp ? "block" : "none";
            } 
            else {
                card.style.display = isArielHelp ? "block" : "none";
            }
        } 
        else if (lastQuery.includes("ivri+")) {
            if (Alt) {
                card.style.display = isIvraltHelp ? "block" : "none";
            } 
            else {
                card.style.display = isIvriHelp ? "block" : "none";
            }
        } 
        else if (lastQuery.includes("amo+") || lastQuery.includes("amorayah+")) {
            if (Alt) {
                card.style.display = isAmaltHelp ? "block" : "none";
            } 
            else {
                card.style.display = isAmoHelp ? "block" : "none";
            }
        } 
        if (lastQuery === "fire") {
            if (Alt) {
                card.style.display = isFireAlt ? "block" : "none";
            } 
            else {
                card.style.display = isFire ? "block" : "none";
            }
        } 
        else if (lastQuery === "water") {
            if (Alt) {
                card.style.display = isWaterAlt ? "block" : "none";
            } 
            else {
                card.style.display = isWater ? "block" : "none";
            }
        } 
        else if (lastQuery === "grass") {
            if (Alt) {
                card.style.display = isGrassAlt ? "block" : "none";
            } 
            else {
                card.style.display = isGrass ? "block" : "none";
            }
        } 
        else if (lastQuery === "electric") {
            if (Alt) {
                card.style.display = isElectricAlt ? "block" : "none";
            } 
            else {
                card.style.display = isElectric ? "block" : "none";
            }
        } 
        else if (lastQuery === "ice") {
            if (Alt) {
                card.style.display = isIceAlt ? "block" : "none";
            } 
            else {
                card.style.display = isIce ? "block" : "none";
            }
        } 
        else if (lastQuery === "fighting") {
            if (Alt) {
                card.style.display = isFightingAlt ? "block" : "none";
            } 
            else {
                card.style.display = isFighting ? "block" : "none";
            }
        } 
        else if (lastQuery === "poison") {
            if (Alt) {
                card.style.display = isPoisonAlt ? "block" : "none";
            } 
            else {
                card.style.display = isPoison ? "block" : "none";
            }
        } 
        else if (lastQuery === "ground") {
            if (Alt) {
                card.style.display = isGroundAlt ? "block" : "none";
            } 
            else {
                card.style.display = isGround ? "block" : "none";
            }
        } 
        else if (lastQuery === "flying") {
            if (Alt) {
                card.style.display = isFlyingAlt ? "block" : "none";
            } 
            else {
                card.style.display = isFlying ? "block" : "none";
            }
        } 
        else if (lastQuery === "psychic") {
            if (Alt) {
                card.style.display = isPsychicAlt ? "block" : "none";
            } 
            else {
                card.style.display = isPsychic ? "block" : "none";
            }
        } 
        else if (lastQuery === "bug") {
            if (Alt) {
                card.style.display = isBugAlt ? "block" : "none";
            } 
            else {
                card.style.display = isBug ? "block" : "none";
            }
        } 
        else if (lastQuery === "rock") {
            if (Alt) {
                card.style.display = isRockAlt ? "block" : "none";
            } 
            else {
                card.style.display = isRock ? "block" : "none";
            }
        } 
        else if (lastQuery === "ghost") {
            if (Alt) {
                card.style.display = isGhostAlt ? "block" : "none";
            } 
            else {
                card.style.display = isGhost ? "block" : "none";
            }
        } 
        else if (lastQuery === "dragon") {
            if (Alt) {
                card.style.display = isDragonAlt ? "block" : "none";
            } 
            else {
                card.style.display = isDragon ? "block" : "none";
            }
        } 
        else if (lastQuery === "dark") {
            if (Alt) {
                card.style.display = isDarkAlt ? "block" : "none";
            } 
            else {
                card.style.display = isDark ? "block" : "none";
            }
        } 
        else if (lastQuery === "steel") {
            if (Alt) {
                card.style.display = isSteelAlt ? "block" : "none";
            } 
            else {
                card.style.display = isSteel ? "block" : "none";
            }
        } 
        else if (lastQuery === "fairy") {
            if (Alt) {
                card.style.display = isFairyAlt ? "block" : "none";
            } 
            else {
                card.style.display = isFairy ? "block" : "none";
            }
        } 
        else if (lastQuery === "normal") {
            if (Alt) {
                card.style.display = isNormalAlt ? "block" : "none";
            } 
            else {
                card.style.display = isNormal ? "block" : "none";
            }
        }
        if (lastQuery === "fire+") {
            if (Alt) {
                card.style.display = isParaFireAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaFire ? "block" : "none";
            }
        } 
        else if (lastQuery === "water+") {
            if (Alt) {
                card.style.display = isParaWaterAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaWater ? "block" : "none";
            }
        } 
        else if (lastQuery === "grass+") {
            if (Alt) {
                card.style.display = isParaGrassAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaGrass ? "block" : "none";
            }
        } 
        else if (lastQuery === "electric+") {
            if (Alt) {
                card.style.display = isParaElectricAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaElectric ? "block" : "none";
            }
        } 
        else if (lastQuery === "ice+") {
            if (Alt) {
                card.style.display = isParaIceAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaIce ? "block" : "none";
            }
        } 
        else if (lastQuery === "fighting+") {
            if (Alt) {
                card.style.display = isParaFightingAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaFighting ? "block" : "none";
            }
        } 
        else if (lastQuery === "poison+") {
            if (Alt) {
                card.style.display = isParaPoisonAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaPoison ? "block" : "none";
            }
        } 
        else if (lastQuery === "ground+") {
            if (Alt) {
                card.style.display = isParaGroundAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaGround ? "block" : "none";
            }
        } 
        else if (lastQuery === "flying+") {
            if (Alt) {
                card.style.display = isParaFlyingAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaFlying ? "block" : "none";
            }
        } 
        else if (lastQuery === "psychic+") {
            if (Alt) {
                card.style.display = isParaPsychicAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaPsychic ? "block" : "none";
            }
        } 
        else if (lastQuery === "bug+") {
            if (Alt) {
                card.style.display = isParaBugAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaBug ? "block" : "none";
            }
        } 
        else if (lastQuery === "rock+") {
            if (Alt) {
                card.style.display = isParaRockAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaRock ? "block" : "none";
            }
        } 
        else if (lastQuery === "ghost+") {
            if (Alt) {
                card.style.display = isParaGhostAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaGhost ? "block" : "none";
            }
        } 
        else if (lastQuery === "dragon+") {
            if (Alt) {
                card.style.display = isParaDragonAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaDragon ? "block" : "none";
            }
        } 
        else if (lastQuery === "dark+") {
            if (Alt) {
                card.style.display = isParaDarkAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaDark ? "block" : "none";
            }
        } 
        else if (lastQuery === "steel+") {
            if (Alt) {
                card.style.display = isParaSteelAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaSteel ? "block" : "none";
            }
        } 
        else if (lastQuery === "fairy+") {
            if (Alt) {
                card.style.display = isParaFairyAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaFairy ? "block" : "none";
            }
        } 
        else if (lastQuery === "normal+") {
            if (Alt) {
                card.style.display = isParaNormalAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaNormal ? "block" : "none";
            }
        }

        if (lastQuery === "halloween") {
            document.body.style.backgroundColor = "#ED6942";
            card.style.backgroundColor = "#8B5CF6";
            card.style.border = "black";
            card.style.display = Alt ? (isHalloweenAltMatch ? "block" : "none") : (isHalloweenMatch ? "block" : "none");
        } 
        else if (lastQuery === "frostbite") {
            document.body.style.backgroundColor = "Aqua";
            card.style.backgroundColor = "Gray";
            card.style.border = "Gray";
            card.style.display = Alt ? (isFrostbiteAltMatch ? "block" : "none") : (isFrostbiteMatch ? "block" : "none");
        } 
        else {
            document.body.style.backgroundColor = "";
            card.style.backgroundColor = "";
            card.style.border = "";
        }
    });
}
function showDetails(shivrian) {
    document.getElementById("catalog").style.display = "none";
    document.getElementById("shivrian-details").style.display = "block";
    document.getElementById("search").style.display = "none"; 
    document.querySelector("button").style.display = "none";
    document.getElementById("shivrian-name").innerText = shivrian.name;
    let imageElement = document.getElementById("shivrian-image");
    imageElement.src = shivrian.image;
    if (shivrian.name === "Ariel Salama") {
        imageElement.style.width = (imageElement.naturalWidth / 12) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 12) + "px";
    }  
    else if (shivrian.name === "TwoMew.jpeg.png.gif.webp.jif") {
        imageElement.style.width = (imageElement.naturalWidth / 2) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 2) + "px";
    }
    else {
        imageElement.style.width = (imageElement.naturalWidth * 2) + "px";
        imageElement.style.height = (imageElement.naturalHeight * 2) + "px";
    }
    document.getElementById("shivrian-description").innerText = shivrian.description;
    document.body.style.backgroundColor = "gray";
}

function closeDetails() {
    document.getElementById("catalog").style.display = "flex";
    document.getElementById("shivrian-details").style.display = "none";
    let searchBar = document.getElementById("search");
    let altButton = document.querySelector("button");
    searchBar.style.display = "block";
    searchBar.style.margin = "0 auto";
    searchBar.style.textAlign = "center";
    altButton.style.display = "block";
    altButton.style.margin = "0 auto";
    altButton.style.textAlign = "center";
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