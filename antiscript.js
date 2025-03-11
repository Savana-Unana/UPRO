// Ariel Salama was here
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
                {id: -0.5, name: "Capture Capsule", image: "images/Anti-Animated_Capsule.gif", typings: "", paratypings: "", category: "", artist: "Shane", credits: "Idea-Shane+",
                description: "The Portal To This Other Realm Overloaded the Capture Capsule, And It Transformed Into Another Variant Of Itself.", region: ""},

                {id: -0.5, name: "Anti-Oreo", image: "images/Oriel.PNG", typings: "", paratypings: "", category: "Alt", artist: "Shane", credits: "Idea-Shane+, Credits-Ariel+",
                description: "", region: ""},

                {id: 0, name: "Aurorial", image: "images/MissingNo.png", typings: "", paratypings: "", category: "", artist: "Shane", credits: "Idea-Shane+",
                description: "", region: ""},

                {id: 0, name: "--", image: "images/MissingNo.png", typings: "", paratypings: "", category: "Alt", artist: "Shane", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 1, name: "--", image: "images/MissingNo.png", typings: "Grass", paratypings: "", category: "", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 1, name: "Sacred --", image: "images/MissingNo.png", typings: "Grass", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 2, name: "--", image: "images/MissingNo.png", typings: "Grass", paratypings: "", category: "", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 2, name: "Sacred --", image: "images/MissingNo.png", typings: "Grass", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 3, name: "--", image: "images/MissingNo.png", typings: "Grass", paratypings: "", category: "", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 3, name: "Sacred --", image: "images/MissingNo.png", typings: "Grass", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 4, name: "Hooglet", image: "images/MissingNo.png", typings: "Water", paratypings: "", category: "", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 4, name: "Sacred Hooglet", image: "images/MissingNo.png", typings: "Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 5, name: "Owlquava", image: "images/MissingNo.png", typings: "Water, Flying", paratypings: "", category: "", artist: "Amo", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 5, name: "Sacred Owlquava", image: "images/MissingNo.png", typings: "Water, Flying", paratypings: "", category: "Alt", artist: "Amo", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 6, name: "--", image: "images/MissingNo.png", typings: "Water", paratypings: "", category: "", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},

                {id: 6, name: "Sacred --", image: "images/MissingNo.png", typings: "Water", paratypings: "", category: "Alt", artist: "Alt", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 7, name: "Pythra", image: "images/MissingNo.png", typings: "Fire", paratypings: "", category: "", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 7, name: "Sacred Pythra", image: "images/MissingNo.png", typings: "Fire", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 8, name: "--", image: "images/MissingNo.png", typings: "Fire", paratypings: "", category: "", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 8, name: "Sacred --", image: "images/MissingNo.png", typings: "Fire", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 9, name: "--", image: "images/MissingNo.png", typings: "Fire", paratypings: "", category: "", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
    
                {id: 9, name: "Sacred --", image: "images/MissingNo.png", typings: "Fire", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
                description: "", region: ""},
       
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
        const region = shivrian.region ? shivrian.region.toLowerCase() : "";
        const isMatch = (name.includes(lastQuery) || lastQuery === id) && !category.includes("halloween") && !category.includes("frostbite") && (!category.includes("alt") || Alt) && !category.includes("npc") && !category.includes("npcalt");
        const isAltMatch = (name.includes(lastQuery) || lastQuery === id) && (category.includes("alt"));
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

        const isTals = artist == ("tal") && category==("") ; 
        const isTalts = artist == ("tal") && category!=("") ;
        const isJakes = artist == ("jake") && category==("") ;
        const isJalts =  artist == ("jake") && category!=("") ;
        const isShanes =  artist == ("shane") && category==("") ;
        const isShalts =  artist == ("shane") && category!=("") ;
        const isArialt =  artist == ("ariel") && category!=("") ;
        const isAriels =  artist == ("ariel") && category==("") ;
        const isIvris =  artist == ("ivri") && category==("") ;
        const isIvralts = artist == ("ivri") && category!=("") ;
        const isAmos =  artist == ("amo") && category==("") ;
        const isAmalts =  artist == ("amo") && category!=("") ;

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
        const isParaNormal = paratypings.includes("normal") && category == ("");
        const isParaLight = paratypings.includes("light") && category == ("");

        const isParaFireAlt = paratypings.includes("fire") && category != ("");
        const isParaWaterAlt = paratypings.includes("water") && category != ("");
        const isParaGrassAlt = paratypings.includes("grass") && category != ("");
        const isParaElectricAlt = paratypings.includes("electric") && category != ("");
        const isParaIceAlt = paratypings.includes("ice") && category != ("");
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

        const isPlains = region.includes("plains") && category == ("");
        const isOcean = region.includes("ocean") && category == ("");
        const isCruise = region.includes("cruise") && category == ("");
        const isLake = region.includes("lake") && category == ("");
        const isForest = region.includes("forest") && category == ("");
        const isDesert = region.includes("desert") && category == ("");
        const isVolcano = region.includes("volcano") && category == ("");
        const isRiver = region.includes("river") && category == ("");
        const isSwamp = region.includes("swamp") && category == ("");
        const isIceCaps = region.includes("icecaps") && category == ("");
        const isMountainRange = region.includes("mountainrange") && category == ("");
        const isShiverCo = region.includes("shiverco") && category == ("");
        const isCave = region.includes("cave") && category == ("");
        const isSecretArea = region.includes("secretarea") && category == ("");
        const isCafe = region.includes("cafe") && category == ("");
        const isSpookyFactory = region.includes("spookyfactory") && category == ("");
        const isSpookyJungle = region.includes("spookyjungle") && category == ("");
        const isFrozenWasteland = region.includes("frozenwasteland") && category == ("");
        const isUnobtainable = region.includes("unobtainable") && category == ("");

        const isPlainsAlt = region.includes("plains") && category != ("");
        const isOceanAlt = region.includes("ocean") && category != ("");
        const isCruiseAlt = region.includes("cruise") && category != ("");
        const isLakeAlt = region.includes("lake") && category != ("");
        const isForestAlt = region.includes("forest") && category != ("");
        const isDesertAlt = region.includes("desert") && category != ("");
        const isVolcanoAlt = region.includes("volcano") && category != ("");
        const isRiverAlt = region.includes("river") && category != ("");
        const isSwampAlt = region.includes("swamp") && category != ("");
        const isIceCapsAlt = region.includes("icecaps") && category != ("");
        const isMountainRangeAlt = region.includes("mountainrange") && category != ("");
        const isShiverCoAlt = region.includes("shiverco") && category != ("");
        const isCaveAlt = region.includes("cave") && category != ("");
        const isSecretAreaAlt = region.includes("secretarea") && category != ("");
        const isCafeAlt = region.includes("cafe") && category != ("");
        const isSpookyFactoryAlt = region.includes("spookyfactory") && category != ("");
        const isSpookyJungleAlt = region.includes("spookyjungle") && category != ("");
        const isFrozenWastelandAlt = region.includes("frozenwasteland") && category != ("");
        const isUnobtainableAlt = region.includes("unobtainable") && category != ("");

        const isNPC = category.includes("npc");
        const isNPCAlt = category.includes("npca");

        const isHalloweenMatch = category.includes("halloween") && !category.includes("halloweenforme");
        const isHalloweenAltMatch = category.includes("halloweenforme");
        const isFrostbiteMatch = category.includes("frostbite");
        const isFrostbiteAltMatch = category.includes("frozen");

        if (Alt) {
            card.style.display = isAltMatch ? "block" : "none";
        } 
        else {
            card.style.display = isMatch ? "block" : "none";
        }
        if (lastQuery === "npc") {
            if (Alt) {
                card.style.display = isNPCAlt ? "block" : "none";
            } 
            else {
                card.style.display = isNPC ? "block" : "none";
            }
            return;
        } 
        if (lastQuery === "tal") {
            if (Alt) {
                card.style.display = isTalts ? "block" : "none";
            } 
            else {
                card.style.display = isTals ? "block" : "none";
            }
            return;
        } 
        else if (lastQuery === "jake") {
            if (Alt) {
                card.style.display = isJalts ? "block" : "none";
            } 
            else {
                card.style.display = isJakes ? "block" : "none";
            }
            return;
        } 
        else if (lastQuery === "shane") {
            if (Alt) {
                card.style.display = isShalts ? "block" : "none";
            } 
            else {
                card.style.display = isShanes ? "block" : "none";
            }
            return;
        } 
        else if (lastQuery === "ariel") {
            if (Alt) {
                card.style.display = isArialt ? "block" : "none";
            } 
            else {
                card.style.display = isAriels ? "block" : "none";
            }
            return;
        } 
        else if (lastQuery === "ivri") {
            if (Alt) {
                card.style.display = isIvralts ? "block" : "none";
            } 
            else {
                card.style.display = isIvris ? "block" : "none";
            }
            return;
        } 
        else if (lastQuery === "amo" || lastQuery === "amorayah") {
            if (Alt) {
                card.style.display = isAmalts ? "block" : "none";
            } 
            else {
                card.style.display = isAmos ? "block" : "none";
            }
            return;
        } 
        if (lastQuery.includes("tal+")) {
            if (Alt) {
                card.style.display = isTaltHelp ? "block" : "none";
            } 
            else {
                card.style.display = isTalHelp ? "block" : "none";
            }
            return;
        } 
        else if (lastQuery.includes("jake+")) {
            if (Alt) {
                card.style.display = isJaltHelp ? "block" : "none";
            } 
            else {
                card.style.display = isJakeHelp ? "block" : "none";
            }
            return;
        } 
        else if (lastQuery.includes("shane+")) {
            if (Alt) {
                card.style.display = isShaltHelp ? "block" : "none";
            } 
            else {
                card.style.display = isShaneHelp ? "block" : "none";
            }
            return;
        } 
        else if (lastQuery.includes("ariel+")) {
            if (Alt) {
                card.style.display = isArialtHelp ? "block" : "none";
            } 
            else {
                card.style.display = isArielHelp ? "block" : "none";
            }
            return;
        } 
        else if (lastQuery.includes("ivri+")) {
            if (Alt) {
                card.style.display = isIvraltHelp ? "block" : "none";
            } 
            else {
                card.style.display = isIvriHelp ? "block" : "none";
            }
            return;
        } 
        else if (lastQuery.includes("amo+") || lastQuery.includes("amorayah+")) {
            if (Alt) {
                card.style.display = isAmaltHelp ? "block" : "none";
            } 
            else {
                card.style.display = isAmoHelp ? "block" : "none";
            }
            return;
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
        else if (lastQuery === "light") {
            if (Alt) {
                card.style.display = isLightAlt ? "block" : "none";
            } 
            else {
                card.style.display = isLight ? "block" : "none";
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
        else if (lastQuery === "light+") {
            if (Alt) {
                card.style.display = isParaLightAlt ? "block" : "none";
            } 
            else {
                card.style.display = isParaLight ? "block" : "none";
            }
        }

        if (lastQuery === "plains") {
            if (Alt) {
                card.style.display = isPlainsAlt ? "block" : "none";
            } 
            else {
                card.style.display = isPlains ? "block" : "none";
            }
        } 
        else if (lastQuery === "ocean") {
            if (Alt) {
                card.style.display = isOceanAlt ? "block" : "none";
            } 
            else {
                card.style.display = isOcean ? "block" : "none";
            }
        } 
        else if (lastQuery === "cruise") {
            if (Alt) {
                card.style.display = isCruiseAlt ? "block" : "none";
            } 
            else {
                card.style.display = isCruise ? "block" : "none";
            }
        } 
        else if (lastQuery === "lake") {
            if (Alt) {
                card.style.display = isLakeAlt ? "block" : "none";
            } 
            else {
                card.style.display = isLake ? "block" : "none";
            }
        } 
        else if (lastQuery === "forest") {
            if (Alt) {
                card.style.display = isForestAlt ? "block" : "none";
            } 
            else {
                card.style.display = isForest ? "block" : "none";
            }
        } 
        else if (lastQuery === "desert") {
            if (Alt) {
                card.style.display = isDesertAlt ? "block" : "none";
            } 
            else {
                card.style.display = isDesert ? "block" : "none";
            }
        } 
        else if (lastQuery === "volcano") {
            if (Alt) {
                card.style.display = isVolcanoAlt ? "block" : "none";
            } 
            else {
                card.style.display = isVolcano ? "block" : "none";
            }
        } 
        else if (lastQuery === "river") {
            if (Alt) {
                card.style.display = isRiverAlt ? "block" : "none";
            } 
            else {
                card.style.display = isRiver ? "block" : "none";
            }
        } 
        else if (lastQuery === "swamp") {
            if (Alt) {
                card.style.display = isSwampAlt ? "block" : "none";
            } 
            else {
                card.style.display = isSwamp ? "block" : "none";
            }
        } 
        else if (lastQuery === "icecaps") {
            if (Alt) {
                card.style.display = isIceCapsAlt ? "block" : "none";
            } 
            else {
                card.style.display = isIceCaps ? "block" : "none";
            }
        }
        else if (lastQuery === "mountainrange") {
            if (Alt) {
                card.style.display = isMountainRangeAlt ? "block" : "none";
            } 
            else {
                card.style.display = isMountainRange ? "block" : "none";
            }
        }
        else if (lastQuery === "shiverco") {
            if (Alt) {
                card.style.display = isShiverCoAlt ? "block" : "none";
            } 
            else {
                card.style.display = isShiverCo ? "block" : "none";
            }
        } 
        else if (lastQuery === "cave") {
            if (Alt) {
                card.style.display = isCaveAlt ? "block" : "none";
            } 
            else {
                card.style.display = isCave ? "block" : "none";
            }
        } 
        else if (lastQuery === "secretarea") {
            if (Alt) {
                card.style.display = isSecretAreaAlt ? "block" : "none";
            } 
            else {
                card.style.display = isSecretArea ? "block" : "none";
            }
        } 
        else if (lastQuery === "cafe") {
            if (Alt) {
                card.style.display = isCafeAlt ? "block" : "none";
            } 
            else {
                card.style.display = isCafe ? "block" : "none";
            }
        } 
        else if (lastQuery === "spookyfactory") {
            if (Alt) {
                card.style.display = isSpookyFactoryAlt ? "block" : "none";
            } 
            else {
                card.style.display = isSpookyFactory ? "block" : "none";
            }
        }
        else if (lastQuery === "spookyjungle") {
            if (Alt) {
                card.style.display = isSpookyJungleAlt ? "block" : "none";
            } 
            else {
                card.style.display = isSpookyJungle ? "block" : "none";
            }
        }
        else if (lastQuery === "frozenwasteland") {
            if (Alt) {
                card.style.display = isFrozenWastelandAlt ? "block" : "none";
            } 
            else {
                card.style.display = isFrozenWasteland ? "block" : "none";
            }
        }
        else if (lastQuery === "unobtainable") {
            if (Alt) {
                card.style.display = isUnobtainableAlt ? "block" : "none";
            } 
            else {
                card.style.display = isUnobtainable ? "block" : "none";
            }
        }

        if (lastQuery === "halloween") {
            card.style.display = Alt ? (isHalloweenAltMatch ? "block" : "none") : (isHalloweenMatch ? "block" : "none");
        } 
        else if (lastQuery === "frostbite") {
            card.style.display = Alt ? (isHalloweenAltMatch ? "block" : "none") : (isHalloweenMatch ? "block" : "none");
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
    document.getElementById("search").style.display = "none"; 
    document.querySelector("button").style.display = "none";
    document.getElementById("nav-buttons").style.display = "none";
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
    else if (shivrian.name === "Capture Capsule") {
        imageElement.style.width = (imageElement.naturalWidth / 4) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 4) + "px";
    }
    else {
        imageElement.style.width = (imageElement.naturalWidth * 2) + "px";
        imageElement.style.height = (imageElement.naturalHeight * 2) + "px";
    }
    document.getElementById("shivrian-description").innerText = shivrian.description;
}

function closeDetails() {
    document.getElementById("catalog").style.display = "flex";
    document.getElementById("shivrian-details").style.display = "none";
    document.getElementById("nav-buttons").style.display = "block";
    let searchBar = document.getElementById("search");
    let altButton = document.querySelector("button");
    searchBar.style.display = "block";
    searchBar.style.margin = "0 auto";
    searchBar.style.textAlign = "center";
    altButton.style.display = "block";
    altButton.style.margin = "0 auto";
    altButton.style.textAlign = "center";
}
    displayShivrian();
// Ariel Salama was also here