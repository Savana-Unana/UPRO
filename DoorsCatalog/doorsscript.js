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
let Alt = false;
let Ace = false;
let NPCs = false;
let Made = false;
let UnMade = false;

function setAltTrue() {
    Alt = !Alt;
    Ace = false;
    NPCs = false;
    document.getElementById('altLabel').textContent = Alt ? "Deactivate Alt" : "Activate Alt";
    document.getElementById('aceLabel').textContent = Ace ? "Deactivate Ace" : "Activate Ace";
    autoTriggerSearch();
    console.log("Alt is now:", Alt);
}
function setMadeTrue() {
    if (Made) {
        // Made → UnMade
        Made = false;
        UnMade = true;
        document.getElementById('madeLabel').textContent = "Switch to Both";
    } 
    else if (UnMade) {
        // UnMade → None
        Made = false;
        UnMade = false;
        document.getElementById('madeLabel').textContent = "Switch to Made";
    } 
    else {
        // None → Made
        Made = true;
        UnMade = false;
        document.getElementById('madeLabel').textContent = "Switch to UnMade";
    }
    autoTriggerSearch();
    console.log("Made is now:", Made);
    console.log("UnMade is now:", UnMade);
}


function setAceTrue() {
    Ace = !Ace;
    Alt = false;
    NPCs = false;
    document.getElementById('altLabel').textContent = Alt ? "Deactivate Alt" : "Activate Alt";
    document.getElementById('aceLabel').textContent = Ace ? "Deactivate Ace" : "Activate Ace";
    document.getElementById('npcLabel').textContent = NPCs ? "Hide Characters" : "Show Characters";
    autoTriggerSearch();
    console.log("Ace is now:", Ace);
}

function setAceTrue() {
    Ace = !Ace;
    Alt = false;
    NPCs = false;
    document.getElementById('altLabel').textContent = Alt ? "Deactivate Alt" : "Activate Alt";
    document.getElementById('aceLabel').textContent = Ace ? "Deactivate Ace" : "Activate Ace";
    document.getElementById('npcLabel').textContent = NPCs ? "Hide Characters" : "Show Characters";
    autoTriggerSearch();
    console.log("Ace is now:", Ace);
}
function setNPCsTrue() {
    NPCs = !NPCs;
    Alt = false;
    Ace = false;
    document.getElementById('altLabel').textContent = Alt ? "Deactivate Alt" : "Activate Alt";
    document.getElementById('aceLabel').textContent = Ace ? "Deactivate Ace" : "Activate Ace";
    document.getElementById('npcLabel').textContent = NPCs ? "Hide Characters" : "Show Characters";
    autoTriggerSearch();
}

// Code from the third script section
const defaultImage = "../lostimages/MissingNo.png"; 
        const shivrianList = [
            {id: 1000, name: "Rush", image: "../doorsimages/rush.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Ambush", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "Alt", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Seek", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Dam Seek", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "Ace", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Giggle", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Screech", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Figure", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Halt", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Glitch", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Jack", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Shadow", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Sally", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Eyes", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Timothy", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Dupe", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Snare", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Void", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Jeff", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "El Goblino", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Bob", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Gloombat", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Grumble", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Queen Grumble", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
            {id: 1000, name: "Louie", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},        
            {id: 1000, name: "Louie", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "", artist: "", credits: "", description: "", region: ""},
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
        const id = shivrian.id.toString().toLowerCase();
        const image = shivrian.image ? shivrian.image.toLowerCase() : "";
        const category = shivrian.category ? shivrian.category.toLowerCase() : "";
        const credits = shivrian.credits ? shivrian.credits.toLowerCase() : "";
        const artist = shivrian.artist ? shivrian.artist.toLowerCase() : "";
        const typings = shivrian.typings ? shivrian.typings.toLowerCase() : "";
        const paratypings = shivrian.paratypings ? shivrian.paratypings.toLowerCase() : "";
        const region = shivrian.region ? shivrian.region.toLowerCase() : "";
        const isMatch = (name.includes(lastQuery) || lastQuery === id) && (!category.includes("ace") || Ace) && !category.includes("halloween") && !category.includes("frostbite") && (!category.includes("alt") || Alt) && !category.includes("npc") && !category.includes("npcalt") && !category.includes("solstice");
        const isAltMatch = (name.includes(lastQuery) || lastQuery === id) && (category.includes("alt"));
        const isAceMatch = (name.includes(lastQuery) || lastQuery === id) && (category.includes("ace"));
        const isNPCsMatch = category === ("npc");

        const isTalHelp = credits.includes("tal+") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isTaltHelp = credits.includes("tal+") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isJakeHelp = credits.includes("jake+") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isJaltHelp = credits.includes("jake+") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isShaneHelp = credits.includes("shane+") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isShaltHelp = credits.includes("shane+") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isArielHelp = credits.includes("ariel+") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isArialtHelp = credits.includes("ariel+") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isIvriHelp = credits.includes("ivri+") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isIvraltHelp = credits.includes("ivri+") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isAmoHelp = credits.includes("amo+") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isAmaltHelp = credits.includes("amo+") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));

        const isTaceHelp = credits.includes("tal") && category.includes("ace"); 
        const isJaceHelp = credits.includes("jake") && category.includes("ace");
        const isShaceHelp = credits.includes("shane") && category.includes("ace");
        const isAraceHelp = credits.includes("ariel") && category.includes("ace");
        const isIvaceHelp = credits.includes("ivri") && category.includes("ace");
        const isAmaceHelp = credits.includes("amo") && category.includes("ace");

        const isTace = artist.includes("tal") && category.includes("ace"); 
        const isJace = artist.includes("jake") && category.includes("ace");
        const isShace =  artist.includes("shane") && category.includes("ace");
        const isArace =  artist.includes("ariel") && category.includes("ace");
        const isIvace =  artist.includes("ivri") && category.includes("ace");
        const isAmace =  artist.includes("amo") && category.includes("ace");
        
        const isTals = artist.includes("tal") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isJakes = artist.includes("jake")& (category == ("")  || category == ("legendary") || category == ("modernized"));
        const isShanes =  artist.includes("shane")& (category == ("")  || category == ("legendary") || category == ("modernized"));
        const isAriels =  artist.includes("ariel")& (category == ("")  || category == ("legendary") || category == ("modernized"));
        const isIvris =  artist.includes("ivri")& (category == ("")  || category == ("legendary") || category == ("modernized"));
        const isAmos =  artist.includes("amo")& (category == ("")  || category == ("legendary") || category == ("modernized"));
        
        const isTalts = artist.includes("tal") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isJalts =  artist.includes("jake") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isShalts =  artist.includes("shane")  && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isArialts =  artist.includes("ariel")  && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isIvralts = artist.includes("ivri") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isAmalts =  artist.includes("amo") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));

        const isFire = typings.includes("fire") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isWater = typings.includes("water") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isGrass = typings.includes("grass") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isElectric = typings.includes("electric") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isIce = typings.includes("ice") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isFighting = typings.includes("fighting") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isPoison = typings.includes("poison") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isGround = typings.includes("ground") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isFlying = typings.includes("flying") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isPsychic = typings.includes("psychic") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isBug = typings.includes("bug") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isRock = typings.includes("rock") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isGhost = typings.includes("ghost") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isDragon = typings.includes("dragon") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isDark = typings.includes("dark") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isSteel = typings.includes("steel") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isFairy = typings.includes("fairy") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isNormal = typings.includes("normal") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isLight = typings.includes("light") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));

        const isFireAlt = typings.includes("fire") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isWaterAlt = typings.includes("water") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isGrassAlt = typings.includes("grass") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isElectricAlt = typings.includes("electric") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isIceAlt = typings.includes("ice") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isFightingAlt = typings.includes("fighting") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isPoisonAlt = typings.includes("poison") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isGroundAlt = typings.includes("ground") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isFlyingAlt = typings.includes("flying") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isPsychicAlt = typings.includes("psychic") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isBugAlt = typings.includes("bug") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isRockAlt = typings.includes("rock") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isGhostAlt = typings.includes("ghost") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isDragonAlt = typings.includes("dragon") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isDarkAlt = typings.includes("dark") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isSteelAlt = typings.includes("steel") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isFairyAlt = typings.includes("fairy") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isNormalAlt = typings.includes("normal") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isLightAlt = typings.includes("light") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));

        const isFireAce = typings.includes("fire") && category.includes("ace");
        const isWaterAce = typings.includes("water") && category.includes("ace");
        const isGrassAce = typings.includes("grass") && category.includes("ace");
        const isElectricAce = typings.includes("electric") && category.includes("ace");
        const isIceAce = typings.includes("ice") && category.includes("ace");
        const isFightingAce = typings.includes("fighting") && category.includes("ace");
        const isPoisonAce = typings.includes("poison") && category.includes("ace");
        const isGroundAce = typings.includes("ground") && category.includes("ace");
        const isFlyingAce = typings.includes("flying") && category.includes("ace");
        const isPsychicAce = typings.includes("psychic") && category.includes("ace");
        const isBugAce = typings.includes("bug") && category.includes("ace");
        const isRockAce = typings.includes("rock") && category.includes("ace");
        const isGhostAce = typings.includes("ghost") && category.includes("ace");
        const isDragonAce = typings.includes("dragon") && category.includes("ace");
        const isDarkAce = typings.includes("dark") && category.includes("ace");
        const isSteelAce = typings.includes("steel") && category.includes("ace");
        const isFairyAce = typings.includes("fairy") && category.includes("ace");
        const isNormalAce = typings.includes("normal") && category.includes("ace");
        const isLightAce = typings.includes("light") && category.includes("ace");

        const isParaFire = paratypings.includes("fire") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaWater = paratypings.includes("water") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaGrass = paratypings.includes("grass") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaElectric = paratypings.includes("electric") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaIce = paratypings.includes("ice") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaFighting = paratypings.includes("fighting") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaPoison = paratypings.includes("poison") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaGround = paratypings.includes("ground") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaFlying = paratypings.includes("flying") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaPsychic = paratypings.includes("psychic") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaBug = paratypings.includes("bug") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaRock = paratypings.includes("rock") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaGhost = paratypings.includes("ghost") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaDragon = paratypings.includes("dragon") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaDark = paratypings.includes("dark") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaSteel = paratypings.includes("steel") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaFairy = paratypings.includes("fairy") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaNormal = paratypings.includes("normal") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaLight = paratypings.includes("light") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));

        const isParaFireAlt = paratypings.includes("fire") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaWaterAlt = paratypings.includes("water") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaGrassAlt = paratypings.includes("grass") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaElectricAlt = paratypings.includes("electric") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaIceAlt = paratypings.includes("ice") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaFightingAlt = paratypings.includes("fighting") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaPoisonAlt = paratypings.includes("poison") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaGroundAlt = paratypings.includes("ground") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaFlyingAlt = paratypings.includes("flying") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaPsychicAlt = paratypings.includes("psychic") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaBugAlt = paratypings.includes("bug") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaRockAlt = paratypings.includes("rock") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaGhostAlt = paratypings.includes("ghost") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaDragonAlt = paratypings.includes("dragon") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaDarkAlt = paratypings.includes("dark") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaSteelAlt = paratypings.includes("steel") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaFairyAlt = paratypings.includes("fairy") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaNormalAlt = paratypings.includes("normal") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaLightAlt = paratypings.includes("light") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));

        const isParaFireAce = paratypings.includes("fire") && category.includes("ace");
        const isParaWaterAce = paratypings.includes("water") && category.includes("ace");
        const isParaGrassAce = paratypings.includes("grass") && category.includes("ace");
        const isParaElectricAce = paratypings.includes("electric") && category.includes("ace");
        const isParaIceAce = paratypings.includes("ice") && category.includes("ace");
        const isParaFightingAce = paratypings.includes("fighting") && category.includes("ace");
        const isParaPoisonAce = paratypings.includes("poison") && category.includes("ace");
        const isParaGroundAce = paratypings.includes("ground") && category.includes("ace");
        const isParaFlyingAce = paratypings.includes("flying") && category.includes("ace");
        const isParaPsychicAce = paratypings.includes("psychic") && category.includes("ace");
        const isParaBugAce = paratypings.includes("bug") && category.includes("ace");
        const isParaRockAce = paratypings.includes("rock") && category.includes("ace");
        const isParaGhostAce = paratypings.includes("ghost") && category.includes("ace");
        const isParaDragonAce = paratypings.includes("dragon") && category.includes("ace");
        const isParaDarkAce = paratypings.includes("dark") && category.includes("ace");
        const isParaSteelAce = paratypings.includes("steel") && category.includes("ace");
        const isParaFairyAce = paratypings.includes("fairy") && category.includes("ace");
        const isParaNormalAce = paratypings.includes("normal") && category.includes("ace");
        const isParaLightAce = paratypings.includes("light") && category.includes("ace");

        const isPlains = region.includes("plains") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isOcean = region.includes("ocean") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isCruise = region.includes("cruise") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isLake = region.includes("lake") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isForest = region.includes("forest") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isDesert = region.includes("desert") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isVolcano = region.includes("volcano") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isRiver = region.includes("river") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isSwamp = region.includes("swamp") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isIceCaps = region.includes("icecaps") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isMountainRange = region.includes("mountainrange") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isCave = region.includes("cave") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isSecretArea = region.includes("secretarea") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isCafe = region.includes("cafe") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isSpookyFactory = region.includes("spookyfactory") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isSpookyJungle = region.includes("spookyjungle") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isFrozenWasteland = region.includes("frozenwasteland") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isUnobtainable = region.includes("unobtainable") && (category == ("")  || category == ("legendary") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));

        const isPlainsAlt = region.includes("plains") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isOceanAlt = region.includes("ocean") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isCruiseAlt = region.includes("cruise") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isLakeAlt = region.includes("lake") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isForestAlt = region.includes("forest") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isDesertAlt = region.includes("desert") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isVolcanoAlt = region.includes("volcano") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isRiverAlt = region.includes("river") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isSwampAlt = region.includes("swamp") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isIceCapsAlt = region.includes("icecaps") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isMountainRangeAlt = region.includes("mountainrange") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isShiverCoAlt = region.includes("shiverco") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isCaveAlt = region.includes("cave") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isSecretAreaAlt = region.includes("secretarea") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isCafeAlt = region.includes("cafe") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isSpookyFactoryAlt = region.includes("spookyfactory") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isSpookyJungleAlt = region.includes("spookyjungle") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isFrozenWastelandAlt = region.includes("frozenwasteland") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isUnobtainableAlt = region.includes("unobtainable") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));

        const isPlainsAce = region.includes("plains") && category.includes("ace");
        const isOceanAce = region.includes("ocean") && category.includes("ace");
        const isCruiseAce = region.includes("cruise") && category.includes("ace");
        const isLakeAce = region.includes("lake") && category.includes("ace");
        const isForestAce = region.includes("forest") && category.includes("ace");
        const isDesertAce = region.includes("desert") && category.includes("ace");
        const isVolcanoAce = region.includes("volcano") && category.includes("ace");
        const isRiverAce = region.includes("river") && category.includes("ace");
        const isSwampAce = region.includes("swamp") && category.includes("ace");
        const isIceCapsAce = region.includes("icecaps") && category.includes("ace");
        const isMountainRangeAce = region.includes("mountainrange") && category.includes("ace");
        const isShiverCoAce = region.includes("shiverco") && category.includes("ace");
        const isCaveAce = region.includes("cave") && category.includes("ace");
        const isSecretAreaAce = region.includes("secretarea") && category.includes("ace");
        const isCafeAce = region.includes("cafe") && category.includes("ace");
        const isSpookyFactoryAce = region.includes("spookyfactory") && category.includes("ace");
        const isSpookyJungleAce = region.includes("spookyjungle") && category.includes("ace");
        const isFrozenWastelandAce = region.includes("frozenwasteland") && category.includes("ace");
        const isUnobtainableAce = region.includes("unobtainable") && category.includes("ace");

        const lostimages = image.includes("lostimage") || image.includes("pre");
        const normimages = !image.includes("lostimage") && !image.includes("pre");

        const isLegendaryMatch = category.includes("legendary") && !category.includes("-");
        const isLegendaryAltMatch = category.includes("legendary-") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isLegendaryAceMatch = category.includes("legendary-") && category.includes("ace");
        const isModernizedMatch = category.includes("modernized") && !category.includes("-");
        const isModernizedAltMatch = category.includes("modernized-") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isModernizedAceMatch = category.includes("modernized-") && category.includes("ace");


        const isHalloweenMatch = category.includes("halloween") && !category.includes("halloweenforme");
        const isHalloweenAltMatch = category.includes("halloweenforme");
        const isHalloweenAceMatch = category.includes("halloween") && category.includes("ace");
        const isFrostbiteMatch = category.includes("frostbite") && !category.includes("frozen");
        const isFrostbiteAltMatch = category.includes("frozen");
        const isFrostbiteAceMatch = category.includes("frostbite") && category.includes("ace");
        const isSolsticeMatch = category.includes("solstice") && !category.includes("solsticeother");
        const isSolsticeAltMatch = category.includes("solsticeother");
        const isSolsticeAceMatch = category.includes("solstice") && category.includes("ace");

        if (lastQuery == "return") {
            window.location.href = "../Catalog/catalog.html";
        }
        if (Alt) {
            card.style.display = isAltMatch ? "block" : "none";
        } 
        if (Ace && !Alt){
            card.style.display = isAceMatch ? "block" : "none";
        }
        if (NPCs){
            card.style.display = isNPCsMatch ? "block" : "none";
        }
        if (!Alt && !Ace && !NPCs) {
            card.style.display = isMatch ? "block" : "none";
        }
        if (lastQuery === "tal") {
            if (Alt) {
                card.style.display = isTalts ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isTace ? "block" : "none";
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
            else if (Ace) {
                card.style.display = isJace ? "block" : "none";
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
            else if (Ace) {
                card.style.display = isShace ? "block" : "none";
            } 
            else {
                card.style.display = isShanes ? "block" : "none";
            }
            return;
        } 
        else if (lastQuery === "ariel") {
            if (Alt) {
                card.style.display = isArialts ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isArace ? "block" : "none";
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
            else if (Ace) {
                card.style.display = isIvace ? "block" : "none";
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
            else if (Ace) {
                card.style.display = isAmace ? "block" : "none";
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
            else if (Ace) {
                card.style.display = isTaceHelp ? "block" : "none";
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
            else if (Ace) {
                card.style.display = isJaceHelp ? "block" : "none";
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
            else if (Ace) {
                card.style.display = isShaceHelp ? "block" : "none";
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
            else if (Ace) {
                card.style.display = isAraceHelp ? "block" : "none";
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
            else if (Ace) {
                card.style.display = isIvaceHelp ? "block" : "none";
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
            else if (Ace) {
                card.style.display = isAmaceHelp ? "block" : "none";
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
            else if (Ace) {
                card.style.display = isFireAce ? "block" : "none";
            } 
            else {
                card.style.display = isFire ? "block" : "none";
            }
        } 
        else if (lastQuery === "water") {
            if (Alt) {
                card.style.display = isWaterAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isWaterAce ? "block" : "none";
            } 
            else {
                card.style.display = isWater ? "block" : "none";
            }
        } 
        else if (lastQuery === "grass") {
            if (Alt) {
                card.style.display = isGrassAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isGrassAce ? "block" : "none";
            } 
            else {
                card.style.display = isGrass ? "block" : "none";
            }
        } 
        else if (lastQuery === "electric") {
            if (Alt) {
                card.style.display = isElectricAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isElectricAce ? "block" : "none";
            } 
            else {
                card.style.display = isElectric ? "block" : "none";
            }
        } 
        else if (lastQuery === "ice") {
            if (Alt) {
                card.style.display = isIceAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isIceAce ? "block" : "none";
            } 
            else {
                card.style.display = isIce ? "block" : "none";
            }
        } 
        else if (lastQuery === "fighting") {
            if (Alt) {
                card.style.display = isFightingAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isFightingAce ? "block" : "none";
            } 
            else {
                card.style.display = isFighting ? "block" : "none";
            }
        } 
        else if (lastQuery === "poison") {
            if (Alt) {
                card.style.display = isPoisonAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isPoisonAce ? "block" : "none";
            } 
            else {
                card.style.display = isPoison ? "block" : "none";
            }
        } 
        else if (lastQuery === "ground") {
            if (Alt) {
                card.style.display = isGroundAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isGroundAce ? "block" : "none";
            } 
            else {
                card.style.display = isGround ? "block" : "none";
            }
        } 
        else if (lastQuery === "flying") {
            if (Alt) {
                card.style.display = isFlyingAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isFlyingAce ? "block" : "none";
            } 
            else {
                card.style.display = isFlying ? "block" : "none";
            }
        } 
        else if (lastQuery === "psychic") {
            if (Alt) {
                card.style.display = isPsychicAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isPsychicAce ? "block" : "none";
            } 
            else {
                card.style.display = isPsychic ? "block" : "none";
            }
        } 
        else if (lastQuery === "bug") {
            if (Alt) {
                card.style.display = isBugAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isBugAce ? "block" : "none";
            } 
            else {
                card.style.display = isBug ? "block" : "none";
            }
        } 
        else if (lastQuery === "rock") {
            if (Alt) {
                card.style.display = isRockAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isRockAce ? "block" : "none";
            } 
            else {
                card.style.display = isRock ? "block" : "none";
            }
        } 
        else if (lastQuery === "ghost") {
            if (Alt) {
                card.style.display = isGhostAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isGhostAce ? "block" : "none";
            } 
            else {
                card.style.display = isGhost ? "block" : "none";
            }
        } 
        else if (lastQuery === "dragon") {
            if (Alt) {
                card.style.display = isDragonAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isDragonAce ? "block" : "none";
            } 
            else {
                card.style.display = isDragon ? "block" : "none";
            }
        } 
        else if (lastQuery === "dark") {
            if (Alt) {
                card.style.display = isDarkAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isDarkAce ? "block" : "none";
            } 
            else {
                card.style.display = isDark ? "block" : "none";
            }
        } 
        else if (lastQuery === "steel") {
            if (Alt) {
                card.style.display = isSteelAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isSteelAce ? "block" : "none";
            } 
            else {
                card.style.display = isSteel ? "block" : "none";
            }
        } 
        else if (lastQuery === "fairy") {
            if (Alt) {
                card.style.display = isFairyAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isFairyAce ? "block" : "none";
            } 
            else {
                card.style.display = isFairy ? "block" : "none";
            }
        } 
        else if (lastQuery === "normal") {
            if (Alt) {
                card.style.display = isNormalAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isNormalAce ? "block" : "none";
            } 
            else {
                card.style.display = isNormal ? "block" : "none";
            }
        }
        else if (lastQuery === "light") {
            if (Alt) {
                card.style.display = isLightAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isLightAce ? "block" : "none";
            } 
            else {
                card.style.display = isLight ? "block" : "none";
            }
        }
        if (lastQuery === "fire+") {
            if (Alt) {
                card.style.display = isParaFireAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaFireAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaFire ? "block" : "none";
            }
        } 
        else if (lastQuery === "water+") {
            if (Alt) {
                card.style.display = isParaWaterAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaWaterAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaWater ? "block" : "none";
            }
        } 
        else if (lastQuery === "grass+") {
            if (Alt) {
                card.style.display = isParaGrassAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaGrassAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaGrass ? "block" : "none";
            }
        } 
        else if (lastQuery === "electric+") {
            if (Alt) {
                card.style.display = isParaElectricAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaElectricAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaElectric ? "block" : "none";
            }
        } 
        else if (lastQuery === "ice+") {
            if (Alt) {
                card.style.display = isParaIceAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaIceAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaIce ? "block" : "none";
            }
        } 
        else if (lastQuery === "fighting+") {
            if (Alt) {
                card.style.display = isParaFightingAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaFightingAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaFighting ? "block" : "none";
            }
        } 
        else if (lastQuery === "poison+") {
            if (Alt) {
                card.style.display = isParaPoisonAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaPoisonAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaPoison ? "block" : "none";
            }
        } 
        else if (lastQuery === "ground+") {
            if (Alt) {
                card.style.display = isParaGroundAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaGroundAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaGround ? "block" : "none";
            }
        } 
        else if (lastQuery === "flying+") {
            if (Alt) {
                card.style.display = isParaFlyingAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaFlyingAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaFlying ? "block" : "none";
            }
        } 
        else if (lastQuery === "psychic+") {
            if (Alt) {
                card.style.display = isParaPsychicAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaPsychicAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaPsychic ? "block" : "none";
            }
        } 
        else if (lastQuery === "bug+") {
            if (Alt) {
                card.style.display = isParaBugAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaBugAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaBug ? "block" : "none";
            }
        } 
        else if (lastQuery === "rock+") {
            if (Alt) {
                card.style.display = isParaRockAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaRockAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaRock ? "block" : "none";
            }
        } 
        else if (lastQuery === "ghost+") {
            if (Alt) {
                card.style.display = isParaGhostAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaGhostAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaGhost ? "block" : "none";
            }
        } 
        else if (lastQuery === "dragon+") {
            if (Alt) {
                card.style.display = isParaDragonAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaDragonAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaDragon ? "block" : "none";
            }
        } 
        else if (lastQuery === "dark+") {
            if (Alt) {
                card.style.display = isParaDarkAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaDarkAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaDark ? "block" : "none";
            }
        } 
        else if (lastQuery === "steel+") {
            if (Alt) {
                card.style.display = isParaSteelAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaSteelAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaSteel ? "block" : "none";
            }
        } 
        else if (lastQuery === "fairy+") {
            if (Alt) {
                card.style.display = isParaFairyAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaFairyAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaFairy ? "block" : "none";
            }
        } 
        else if (lastQuery === "normal+") {
            if (Alt) {
                card.style.display = isParaNormalAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaNormalAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaNormal ? "block" : "none";
            }
        }
        else if (lastQuery === "light+") {
            if (Alt) {
                card.style.display = isParaLightAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaLightAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaLight ? "block" : "none";
            }
        }

        if (lastQuery === "plains") {
            if (Alt) {
                card.style.display = isPlainsAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isPlainsAce ? "block" : "none";
            } 
            else {
                card.style.display = isPlains ? "block" : "none";
            }
        } 
        else if (lastQuery === "ocean") {
            if (Alt) {
                card.style.display = isOceanAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isOceanAce ? "block" : "none";
            } 
            else {
                card.style.display = isOcean ? "block" : "none";
            }
        } 
        else if (lastQuery === "cruise") {
            if (Alt) {
                card.style.display = isCruiseAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isCruiseAce ? "block" : "none";
            } 
            else {
                card.style.display = isCruise ? "block" : "none";
            }
        } 
        else if (lastQuery === "lake") {
            if (Alt) {
                card.style.display = isLakeAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isLakeAce ? "block" : "none";
            } 
            else {
                card.style.display = isLake ? "block" : "none";
            }
        } 
        else if (lastQuery === "forest") {
            if (Alt) {
                card.style.display = isForestAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isForestAce ? "block" : "none";
            } 
            else {
                card.style.display = isForest ? "block" : "none";
            }
        } 
        else if (lastQuery === "desert") {
            if (Alt) {
                card.style.display = isDesertAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isDesertAce ? "block" : "none";
            } 
            else {
                card.style.display = isDesert ? "block" : "none";
            }
        } 
        else if (lastQuery === "volcano") {
            if (Alt) {
                card.style.display = isVolcanoAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isVolcanoAce ? "block" : "none";
            } 
            else {
                card.style.display = isVolcano ? "block" : "none";
            }
        } 
        else if (lastQuery === "river") {
            if (Alt) {
                card.style.display = isRiverAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isRiverAce ? "block" : "none";
            } 
            else {
                card.style.display = isRiver ? "block" : "none";
            }
        } 
        else if (lastQuery === "swamp") {
            if (Alt) {
                card.style.display = isSwampAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isSwampAce ? "block" : "none";
            } 
            else {
                card.style.display = isSwamp ? "block" : "none";
            }
        } 
        else if (lastQuery === "icecaps") {
            if (Alt) {
                card.style.display = isIceCapsAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isIceCapsAce ? "block" : "none";
            } 
            else {
                card.style.display = isIceCaps ? "block" : "none";
            }
        }
        else if (lastQuery === "mountainrange") {
            if (Alt) {
                card.style.display = isMountainRangeAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isMountainRangeAce ? "block" : "none";
            } 
            else {
                card.style.display = isMountainRange ? "block" : "none";
            }
        }
        else if (lastQuery === "shiverco") {
            if (Alt) {
                card.style.display = isShiverCoAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isShiverCoAce ? "block" : "none";
            } 
            else {
                card.style.display = isShiverCo ? "block" : "none";
            }
        } 
        else if (lastQuery === "cave") {
            if (Alt) {
                card.style.display = isCaveAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isCaveAce ? "block" : "none";
            } 
            else {
                card.style.display = isCave ? "block" : "none";
            }
        } 
        else if (lastQuery === "secretarea") {
            if (Alt) {
                card.style.display = isSecretAreaAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isSecretAreaAce ? "block" : "none";
            } 
            else {
                card.style.display = isSecretArea ? "block" : "none";
            }
        } 
        else if (lastQuery === "cafe") {
            if (Alt) {
                card.style.display = isCafeAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isCafeAce ? "block" : "none";
            } 
            else {
                card.style.display = isCafe ? "block" : "none";
            }
        } 
        else if (lastQuery === "spookyfactory") {
            if (Alt) {
                card.style.display = isSpookyFactoryAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isSpookyFactoryAce ? "block" : "none";
            } 
            else {
                card.style.display = isSpookyFactory ? "block" : "none";
            }
        }
        else if (lastQuery === "spookyjungle") {
            if (Alt) {
                card.style.display = isSpookyJungleAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isSpookyJungleAce ? "block" : "none";
            } 
            else {
                card.style.display = isSpookyJungle ? "block" : "none";
            }
        }
        else if (lastQuery === "frozenwasteland") {
            if (Alt) {
                card.style.display = isFrozenWastelandAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isFrozenWastelandAce ? "block" : "none";
            } 
            else {
                card.style.display = isFrozenWasteland ? "block" : "none";
            }
        }
        else if (lastQuery === "unobtainable") {
            if (Alt) {
                card.style.display = isUnobtainableAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isUnobtainableAce ? "block" : "none";
            } 
            else {
                card.style.display = isUnobtainable ? "block" : "none";
            }
        }
        else if (lastQuery === "modernized") {
            if (Alt) {
                card.style.display = isModernizedAltMatch ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isModernizedAceMatch ? "block" : "none";
            } 
            else {
                card.style.display = isModernizedMatch ? "block" : "none";
            }
            return;
        } 
        else if (lastQuery === "legendary") {
            if (Alt) {
                card.style.display = isLegendaryAltMatch ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isLegendaryAceMatch ? "block" : "none";
            } 
            else {
                card.style.display = isLegendaryMatch ? "block" : "none";
            }
            return;
        } 
        else{
            document.body.style.backgroundColor = "rgb(123, 63, 0)";
            card.style.backgroundColor = "";
            card.style.border = "";
            if (lostimages) {
                card.style.border = "black";
            }
        }
        if (Made) {
            card.style.display = normimages ? "block" : "none";
        }
        else if (UnMade) {
            card.style.display = lostimages ? "block" : "none";
        }
        let glitchInterval;
        if (lastQuery === "glitch") {
            if (!glitchInterval) { // Only start if not already glitching
                glitchInterval = setInterval(() => {
                    document.body.style.backgroundColor = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
                    document.body.style.transform = `translate(${Math.random()*10-5}px, ${Math.random()*10-5}px) rotate(${Math.random()*10-5}deg)`;
                }, 100);
            }
        } 
        else {
            if (glitchInterval) {
                clearInterval(glitchInterval);
                glitchInterval = null;
            }
            document.body.style.backgroundColor = "rgb(123, 63, 0)";
            document.body.style.transform = "none"; // Reset position
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
    let altButton = document.querySelector("button");
    searchBar.style.display = "block";
    searchBar.style.margin = "0 auto";
    searchBar.style.textAlign = "center";
    altButton.style.display = "block";
    altButton.style.margin = "0 auto";
    altButton.style.textAlign = "center";
    let glitchInterval;
    document.body.style.backgroundColor = "rgb(123, 63, 0)";
}
    displayShivrian();