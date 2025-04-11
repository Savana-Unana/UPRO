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
let Ace = false;
let NCanon = false;

function setAltTrue() {
    Alt = !Alt;
    Ace = false;
    NCanon = false;
    document.getElementById('altLabel').textContent = Alt ? "Deactivate Alt" : "Activate Alt";
    document.getElementById('aceLabel').textContent = Ace ? "Deactivate Ace" : "Activate Ace";
    document.getElementById('nCanonLabel').textContent = NCanon ? "Deactivate NCanon" : "Activate NCanon";
    autoTriggerSearch();
    console.log("Alt is now:", Alt);
}

function setAceTrue() {
    Ace = !Ace;
    Alt = false;
    NCanon = false;
    document.getElementById('altLabel').textContent = Alt ? "Deactivate Alt" : "Activate Alt";
    document.getElementById('aceLabel').textContent = Ace ? "Deactivate Ace" : "Activate Ace";
    document.getElementById('nCanonLabel').textContent = NCanon ? "Deactivate NCanon" : "Activate NCanon";
    autoTriggerSearch();
    console.log("Ace is now:", Ace);
}

function setNCanonTrue() {
    NCanon = !NCanon;
    Alt = false;
    Ace = false;
    document.getElementById('altLabel').textContent = Alt ? "Deactivate Alt" : "Activate Alt";
    document.getElementById('aceLabel').textContent = Ace ? "Deactivate Ace" : "Activate Ace";
    document.getElementById('nCanonLabel').textContent = NCanon ? "Deactivate NCanon" : "Activate NCanon";
    autoTriggerSearch();
    console.log("NCanon is now:", NCanon);
}
// Code from the third script section
const defaultImage = '../lostimages/MissingNo.png'; 
        const shivrianList = [
            {id: 0, name: "Capture Capsule", image: "../images/CaptureCapsule.gif", typings: "", paratypings: "", category: "", artist: "Jake", credits: "Idea-Shane+",
            description: "", region: "Plains/ShiverCo"},

            {id: 0, name: "Juvie Capture Capsule", image: "../images/J.CaptureCapsule.png", typings: "", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
            description: "", region: "Plains/ShiverCo"},

            {id: 0, name: "Ace Capture Capsule", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "Ace", artist: "", credits: "Idea-Shane+",
            description: "", region: "Plains/ShiverCo"},

            {id: 1, name: "Erbacub", image: "../images/Erbacub.png", typings: "Grass", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+",
            description: "", region: "Plains"},

            {id: 1, name: "Sacred Erbacub", image: "../lostimages/MissingNo.png", typings: "Grass", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
            description: "", region: "Plains"},

            {id: 2, name: "Bearosion", image: "../images/Bearosion.png", typings: "Grass, Fighting", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+",
            description: "", region: "Plains"},

            {id: 2, name: "Sacred Bearosion", image: "../lostimages/MissingNo.png", typings: "Grass, Fighting", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
            description: "", region: "Plains"},

            {id: 3, name: "Hileaph", image: "../images/Hileaph.png", typings: "Grass, Fighting", paratypings: "Ground", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+",
            description: "", region: "Plains"},

            {id: 3, name: "Sacred Hileaph", image: "../lostimages/MissingNo.png", typings: "Grass, Fighting", paratypings: "Ground", category: "Alt", artist: "", credits: "Idea-Shane+",
            description: "", region: "Plains"},

            {id: 3, name: "Ace Hileaph", image: "../lostimages/MissingNo.png", typings: "Grass, Fighting", paratypings: "Ground", category: "Ace", artist: "", credits: "Idea-Shane+",
            description: "", region: "Cruise"},

            {id: 4, name: "Axolitl", image: "../images/Axolitl.png", typings: "Water", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+",
            description: "", region: "Lake"},

            {id: 4, name: "Sacred Axolitl", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
            description: "", region: "Lake"},

            {id: 5, name: "Axolote", image: "../images/Axail.png", typings: "Water, Rock", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+Amo+",
            description: "", region: "Lake"},

            {id: 5, name: "Sacred Axolote", image: "../lostimages/MissingNo.png", typings: "Water, Rock", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Amo+",
            description: "", region: "Lake"},

            {id: 6, name: "Axolarg", image: "../images/Axolarg.png", typings: "Water, Rock", paratypings: "Poison", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+",
            description: "", region: "Lake"},

            {id: 6, name: "Sacred Axolarg", image: "../lostimages/MissingNo.png", typings: "Water, Rock", paratypings: "Poison", category: "Alt", artist: "", credits: "Idea-Shane+",
            description: "", region: "Lake"},

            {id: 6, name: "Ace Axolarg", image: "../lostimages/MissingNo.png", typings: "Water, Rock", paratypings: "Poison", category: "Ace", artist: "", credits: "Idea-Shane+",
            description: "", region: "Cruise"},

            {id: 7, name: "Charcoon", image: "../images/Charcoon.png", typings: "Fire", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+",
            description: "", region: "Forest"},

            {id: 7, name: "Sacred Charcoon", image: "../lostimages/MissingNo.png", typings: "Fire", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
            description: "", region: "Forest"},

            {id: 8, name: "Blazuki", image: "../images/Blazuki.png", typings: "Fire, Flying", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+",
            description: "", region: "Forest"},

            {id: 8, name: "Sacred Blazuki", image: "../lostimages/MissingNo.png", typings: "Fire, Flying", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
            description: "", region: "Forest"},

            {id: 9, name: "Furnacoon", image: "../lostimages/MissingNo.png", typings: "Fire, Flying", paratypings: "Steel", category: "", artist: "", credits: "Drawn-Jake+Idea-Shane+",
            description: "", region: "Forest"},

            {id: 9, name: "Sacred Furnacoon", image: "../lostimages/MissingNo.png", typings: "Fire, Flying", paratypings: "Steel", category: "Alt", artist: "", credits: "Idea-Shane+",
            description: "", region: "Forest"},

            {id: 9, name: "Ace Furnacoon", image: "../lostimages/MissingNo.png", typings: "Fire, Flying", paratypings: "Steel", category: "Ace", artist: "", credits: "Idea-Shane+",
            description: "", region: "Cruise"},
            
            {id: 10, name: "Dribsom", image: "../images/Dribsom.png", typings: "Normal, Flying", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Jake+Shane+",
            description: "", region: ""},

            {id: 10, name: "Sacred Dribsom", image: "../lostimages/MissingNo.png", typings: "Normal, Flying", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+Shane+",
            description: "", region: ""},

            {id: 10, name: "Dribtar", image: "../images/Dribtar.png", typings: "Normal, Flying", paratypings: "", category: "", artist: "Jake", credits: "Idea-Jake+Shane+",
            description: "", region: ""},

            {id: 10, name: "Sacred Dribtar", image: "../lostimages/MissingNo.png", typings: "Normal, Flying", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+Shane+",
            description: "", region: ""},

            {id: 1000, name: "Pretengerine", image: "../lostimages/Pretengerine.png", typings: "Bug", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+",
            description: "This worm hides among tangerines to get away from predators. It has a parasitic relationship with the tangerines until one day it gets too large and falls off the tree.", region: "Forest"},

            {id: 1000, name: "Sacred Pretengerine", image: "../lostimages/MissingNo.png", typings: "Bug", paratypings: "", category: "Alt", artist: "", credits: "",
            description: "", region: "Forest"},

            {id: 1000, name: "Espiorange", image: "../lostimages/Espiorange.png", typings: "Bug", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+",
            description: "A Pretengerine that grew alongside its tangerine seeds, Espiorange has upscaled the operation and is now in control of the entire tree. In order to reproduce, Espiorange leaves its larvae inside tangerines so they have something to eat as they grow.", region: "Forest"},

            {id: 1000, name: "Sacred Espiorange", image: "../lostimages/MissingNo.png", typings: "Bug", paratypings: "", category: "Alt", artist: "", credits: "",
            description: "", region: "Forest"},

            {id: 1000, name: "Tumblseed", image: "../lostimages/Tumblseed.png", typings: "Grass, Flying", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "Desert"},

            {id: 1000, name: "Sacred Tumblseed", image: "../lostimages/MissingNo.png", typings: "Grass, Flying", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
            description: "", region: "Desert"},

            {id: 1000, name: "Cacculent", image: "../lostimages/Cacculent.png", typings: "Grass, Flying", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "Desert"},

            {id: 1000, name: "Sacred Cacculent", image: "../lostimages/MissingNo.png", typings: "Grass, Flying", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
            description: "", region: "Desert"},

            {id: 1000, name: "Bakunbush", image: "../lostimages/MissingNo.png", typings: "Normal, Grass", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Sacred Bakunbush", image: "../lostimages/MissingNo.png", typings: "Normal, Grass", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Spongus", image: "../lostimages/Spongus.png", typings: "Normal, Psychic", paratypings: "Poison", category: "", artist: "Shane", credits: "Drawn, Idea-Shane+", 
            description: "", region: "Forest"},
    
            {id: 1000, name: "Sacred Spongus", image: "../lostimages/MissingNo.png", typings: "Normal, Psychic", paratypings: "Poison", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Pigturee", image: "../lostimages/MissingNo.png", typings: "Normal, Grass", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Sacred Pigturee", image: "../lostimages/MissingNo.png", typings: "Normal, Grass", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Charquid", image: "../images/Charquid.png", typings: "Fire", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, OGDesign-Ivri+Amo+, Idea-Shane+", 
            description: "", region: "Volcano"},

            {id: 1000, name: "Sacred Charquid", image: "../lostimages/MissingNo.png", typings: "Fire", paratypings: "", category: "Alt", artist: "", credits: "OGDesign-Amo+Ivri+, Idea-Shane+", 
            description: "", region: "Volcano"},

            {id: 1000, name: "Nonignite", image: "../images/Nonignite.png", typings: "Fire", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Volcano"},

            {id: 1000, name: "Sacred Nonignite", image: "../lostimages/MissingNo.png", typings: "Fire", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Volcano"},

            {id: 1000, name: "Ace Nonignite", image: "../lostimages/MissingNo.png", typings: "Fire", paratypings: "", category: "Ace", artist: "", credits: "Idea-Shane+", 
            description: "", region: "IceCaps"},

            {id: 1000, name: "Blarb", image: "../images/Blarb.png", typings: "Water, Bug", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Ivri+, OGDesign-Amo+", 
            description: "", region: "River"},

            {id: 1000, name: "Sacred Blarb", image: "../lostimages/MissingNo.png", typings: "Water, Bug", paratypings: "", category: "Alt", artist: "", credits: "OGDesign-Amo+Ivri+", 
            description: "", region: "River"},

            {id: 1000, name: "Buntot", image: "../images/Buntot.png", typings: "Fairy", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Buntot Toasted Forme", image: "../images/BuntotTF.png", typings: "Fairy, Fire", paratypings: "Poison", category: "Alt", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Challadin", image: "../images/Challadin.png", typings: "Fairy", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Challadin Toasted Forme", image: "../images/ChalladinTF.png", typings: "Fairy, Fire", paratypings: "Poison", category: "Alt", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Burking", image: "../images/Burking.png", typings: "Fairy", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Plains"},
    
            {id: 1000, name: "Burking Toasted Forme", image: "../images/BurkingTF.png", typings: "Fairy, Fire", paratypings: "Poison", category: "Alt", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Birthday Buntot", image: "../lostimages/BD.Buntot.png", typings: "Fairy, Light", paratypings: "", category: "NCanon", artist: "Shane", credits: "Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Hero Challadin", image: "../lostimages/H.Challadin.png", typings: "Fairy, Light", paratypings: "", category: "NCanon", artist: "Shane, Jake", credits: "Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Mashed Burking", image: "../lostimages/M.Burking.png", typings: "Fairy, Light", paratypings: "", category: "NCanon", artist: "Shane, Jake", credits: "Idea-Shane+", 
            description: "", region: "Plains"},
    
            {id: 1000, name: "LED Buntot", image: "../lostimages/L.Buntot.png", typings: "Fairy, Light", paratypings: "", category: "NCanon", artist: "Shane, Jake", credits: "Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "LED Challadin", image: "../lostimages/L.Challadin.png", typings: "Fairy, Light", paratypings: "", category: "NCanon", artist: "Shane, Jake", credits: "Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "LED Burking", image: "../lostimages/L.Burking.png", typings: "Fairy", paratypings: "", category: "NCanon", artist: "Shane, Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Frankyurt (Tal Concept)", image: "../lostimages/Frankyurt.png", typings: "Normal, Fairy", paratypings: "", category: "NCanon", artist: "Tal", credits: "Idea-Shane+Tal+Jake+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Frankfortress", image: "../lostimages/MissingNo.png", typings: "Normal, Fairy", paratypings: "", category: "", artist: "Tal", credits: "Idea-Shane+Tal+Jake+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Sacred Frankfortress", image: "../lostimages/MissingNo.png", typings: "Normal, Fairy", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Tal+Jake+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Ace Frankfortress", image: "../lostimages/AceFrankfortress.png", typings: "Normal, Fairy", paratypings: "", category: "Ace", artist: "Tal", credits: "Idea-Shane+Tal+Jake+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Wyvearn", image: "../lostimages/Wyvearn.png", typings: "Bug, Dragon", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Sacred Wyvearn", image: "../lostimages/MissingNo.png", typings: "Bug, Dragon", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Wyrachnos", image: "../lostimages/Wyrachnos.png", typings: "Bug, Dragon", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Sacred Wyrachnos", image: "../lostimages/MissingNo.png", typings: "Bug, Dragon", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Plasttack", image: "../lostimages/MissingNo.png", typings: "Ghost", paratypings: "Normal", category: "", artist: "", credits: "Drawn-Shane+", 
            description: "", region: "Swamp"},
    
            {id: 1000, name: "Sacred Plasttack", image: "../lostimages/MissingNo.png", typings: "Ghost", paratypings: "Normal", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Schuck", image: "../images/Shuck.png", typings: "Normal, Rock", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+Jake+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Sacred Schuck", image: "../lostimages/MissingNo.png", typings: "Normal, Rock", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Jake+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Thruck", image: "../images/Thruck.png", typings: "Normal, Rock", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+Jake+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Sacred Thruck", image: "../lostimages/MissingNo.png", typings: "Normal, Rock", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Jake+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Thrack", image: "../images/Thrack.png", typings: "Normal, Rock", paratypings: "Artillery", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+Jake+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Sacred Thrack", image: "../lostimages/MissingNo.png", typings: "Normal, Rock", paratypings: "Artillery", category: "Alt", artist: "", credits: "Idea-Shane+Jake+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Fumerey", image: "../lostimages/MissingNo.png", typings: "Poison", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Sacred Fumerey", image: "../lostimages/MissingNo.png", typings: "Poison", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Puppechyu", image: "../images/Puppechyu.png", typings: "Ghost, Fairy", paratypings: "Electric", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Puppechu", image: "../lostimages/OGPuppechu.png", typings: "Ghost, Fairy", paratypings: "Electric", category: "NCanon", artist: "Shane", credits: "Drawn, Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Sacred Puppechyu", image: "../lostimages/MissingNo.png", typings: "Ghost, Fairy", paratypings: "Electric", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Mockenyu", image: "../images/Mockenyu.png", typings: "Ghost, Fairy", paratypings: "Electric", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Sacred Mockenyu", image: "../lostimages/MissingNo.png", typings: "Ghost, Fairy", paratypings: "Electric", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Paranger", image: "../images/Paranger.png", typings: "Light, Fairy", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Fonceer", image: "../images/Fonceer.png", typings: "Light, Fairy", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Dressiani", image: "../images/Dressiani.gif", typings: "Light, Fairy", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Sacred Paranger", image: "../lostimages/MissingNo.png", typings: "Light, Fairy", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Sacred Fonceer", image: "../lostimages/MissingNo.png", typings: "Light, Fairy", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Sacred Dressiani", image: "../lostimages/MissingNo.png", typings: "Light, Fairy", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Strawngle", image: "../images/Strawngle.png", typings: "Normal", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Sacred Strawngle", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Stwacha", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "", artist: "", credits: "Idea-Shane+Jake+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Sacred Stwacha", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Jake+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Blizard", image: "../images/Blizard.png", typings: "Ice, Dragon", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+", 
            description: "", region: "IceCaps"},

            {id: 1000, name: "Cryodon", image: "../images/Cryodon.png", typings: "Ice, Dragon", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+", 
            description: "", region: "IceCaps"},

            {id: 1000, name: "Reptundra", image: "../images/Reptundra.png", typings: "Ice, Dragon", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+", 
            description: "", region: "IceCaps"},

            {id: 1000, name: "Sacred Blizard", image: "../lostimages/MissingNo.png", typings: "Ice, Dragon", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
            description: "", region: "IceCaps"},

            {id: 1000, name: "Sacred Cryodon", image: "../lostimages/MissingNo.png", typings: "Ice, Dragon", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
            description: "", region: "IceCaps"},

            {id: 1000, name: "Sacred Reptundra", image: "../lostimages/MissingNo.png", typings: "Ice, Dragon", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
            description: "", region: "IceCaps"},

            {id: 1000, name: "Ace Reptundra", image: "../lostimages/MissingNo.png", typings: "Ice, Dragon", paratypings: "Flying", category: "Ace", artist: "", credits: "Idea-Shane+", 
            description: "", region: "IceCaps"},

            {id: 1000, name: "Relion", image: "../lostimages/Relion.png", typings: "Light", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "MountainRange"},

            {id: 1000, name: "Sacred Relion", image: "../lostimages/MissingNo.png", typings: "Light", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
            description: "", region: "MountainRange"},

            {id: 1000, name: "Meepu", image: "../lostimages/MissingNo.png", typings: "Ice, Electric", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
            description: "", region: "IceCaps"},

            {id: 1000, name: "Sacred Meepu", image: "../lostimages/MissingNo.png", typings: "Ice, Electric", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "IceCaps"},

            {id: 1000, name: "Brroil", image: "../lostimages/MissingNo.png", typings: "Ice, Poison", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
            description: "", region: "IceCaps"},

            {id: 1000, name: "Sacred Brroil", image: "../lostimages/MissingNo.png", typings: "Ice, Poison", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "IceCaps"},

            {id: 1000, name: "Ampede", image: "../images/Ampede.png", typings: "Electric", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "MountainRange"},

            {id: 1000, name: "Sacred Ampede", image: "../lostimages/MissingNo.png", typings: "Electric", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+, Idea-Shane+", 
            description: "", region: "MountainRange"},

            {id: 1000, name: "Prismite", image: "../images/Prismite.png", typings: "Light, Bug", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Sacred Prismite", image: "../lostimages/MissingNo.png", typings: "Light, Bug", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Duochrom", image: "../images/Duochrom.png", typings: "Light, Bug", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Sacred Duochrom", image: "../lostimages/MissingNo.png", typings: "Light, Bug", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Jake+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Prismoth", image: "../images/Prismoth.png", typings: "Light, Bug", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Name-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Sacred Prismoth", image: "../lostimages/MissingNo.png", typings: "Light, Bug", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Jake+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Mos", image: "../lostimages/Mos.png", typings: "Ghost, Normal", paratypings: "", category: "NCanon", artist: "Jake", credits: "Draw-Jake+", 
            description: "", region: "Desert"},

            {id: 1000, name: "Thoot", image: "../images/Thoot.png", typings: "Water", paratypings: "", category: "NCanon", artist: "Ivri", credits: "Drawn-Ivri+", 
            description: "", region: "Desert"},

            {id: 1000, name: "Sacred Thoot", image: "../images/S.Thoot.png", typings: "Water", paratypings: "", category: "NCanon", artist: "Ivri", credits: "IDrawn-Ivri+", 
            description: "", region: "Desert"},

            {id: 1000, name: "Alliminiyum", image: "../lostimages/MissingNo.png", typings: "Steel", paratypings: "", category: "", artist: "", credits: "Idea-Ivri+", 
            description: "", region: "MountainRange"},

            {id: 1000, name: "Sacred Alliminiyum", image: "../lostimages/MissingNo.png", typings: "Steel", paratypings: "", category: "Alt", artist: "", credits: "Idea-Ivri+", 
            description: "", region: "MountainRange"},

            {id: 1000, name: "Vigilith", image: "../images/Vigilith.png", typings: "Rock, Ghost", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Desert/Temple"},

            {id: 77, name: "Chancey", image: "../lostimages/Chancey.png", description: "An ordinary clover that grows on the border of really hot and really cold places.", typings: "Grass", paratypings: "Ice, Fire", category: "", artist: "Tal", credits: "Drawn-Tal+, Idea-Ivri+, OGDesign-Amo+", 
            description: "", region: "Forest"},

            {id: 77, name: "Sacred Chancey", image: "../lostimages/S.Chancey.png", typings: "Grass", paratypings: "Fire, Ice", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "Forest"},

            {id: 77, name: "Chancey (Jake's Take)", image: "../lostimages/JT.Chancey.png", description: "", typings: "Grass", paratypings: "Ice, Fire", category: "NCanon", artist: "Jake", credits: "Drawn-Jake+, Idea-Ivri+, OGDesign-Amo+", 
            description: "", region: "Forest"},

            {id: 78, name: "Maychancey", image: "../lostimages/Maychancey.png", typings: "Grass", paratypings: "Ice, Fire", category: "", artist: "Tal", credits: "Drawn-Tal+", 
            description: "This creature is empty inside, and completely overtaken by the cold. It’s limbs have started to freeze, but it no longer cares.", region: "Forest"},

            {id: 78, name: "Sacred Maychancey", image: "../lostimages/S.Maychancey.png", typings: "Grass", paratypings: "Ice, Fire", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "Forest"},

            {id: 78, name: "MayChancey (Jake's Take)", image: "../lostimages/JT.Maychancey.png", description: "", typings: "Grass", paratypings: "Ice, Fire", category: "NCanon", artist: "Jake", credits: "Drawn-Jake+", 
            description: "", region: "Forest"},

            {id: 79, name: "Gamblanguin", image: "../lostimages/Gamblanguin.png", typings: "Ice", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
            description: "A severe gambling addict, this creature had all of it’s assets frozen by the IRS and is constantly on the run from the police. It creates loaded dice to try to alter it’s odds of winning.", region: "Forest"},

            {id: 79, name: "Sacred Gamblanguin", image: "../lostimages/S.Gamblanguin.png", typings: "Ice", paratypings: "", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "Forest"},

            {id: 80, name: "Predadventure", image: "../lostimages/Predadventure.png", typings: "Ice", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
            description: "An icy bird, Predadventure constantly sheds it’s icicle feathers, so watch out for falling ice spikes when you’re in icy terrain. This creature Lives in the frozen tundras of __ to maintain it’s low body temperature. The clover leaves on its body have slowly been freezing for generations.", region: "Forest"},

            {id: 80, name: "Sacred Predadventure", image: "../lostimages/S.Predadventure.png", typings: "Ice", paratypings: "", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "Forest"},

            {id: 81, name: "Perchancey", image: "../lostimages/Perchancey.png", typings: "Grass", paratypings: "Ice, Fire", category: "", artist: "Tal", credits: "Drawn-Tal+", 
            description: "After growing a twin, Perchancey’s twin is completely incinerated by the fire.", region: "Forest"},

            {id: 81, name: "Sacred Perchancey", image: "../lostimages/S.Perchancey.png", typings: "Grass", paratypings: "Ice, Fire", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "Forest"},

            {id: 81, name: "Perchancey (Jake's Take)", image: "../lostimages/JT.Perchancey.png", description: "", typings: "Grass", paratypings: "Ice, Fire", category: "NCanon", artist: "Jake", credits: "Drawn-Jake+", 
            description: "", region: "Forest"},

            {id: 82, name: "Perchancealot", image: "../lostimages/Perchancealot.png", typings: "Fire", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
            description: "A noble knight of the order of the Charmey, Perchancalot overcame the fire of its childhood by adopting a symbiotic relationship with the mighty Exosteel. Perchancalot was deemed worthy and now wields the power of fire. It carries it’s dead twin around as a shield to protect it from harm.", region: "Forest"},

            {id: 82, name: "Sacred Perchancealot", image: "../lostimages/S.Perchancealot.png", typings: "Fire", paratypings: "", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "Forest"},

            {id: 83, name: "Possibilitor", image: "../lostimages/Possibilitor.png", typings: "Fire", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
            description: "Possibilitor emerges when Perchancey is completely consumed by fire. It is a powerful evil mage made up of thorny dead shrubbery and hatred. Possibilitor spent years searching the lands for spells to help it feel again. It discovered the ability to alter outcomes.", region: "Forest"},

            {id: 83, name: "Sacred Possibilitor", image: "../lostimages/S.Possibilitor.png", typings: "Fire", paratypings: "", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Soothspheer", image: "../lostimages/Soothspheer.png", typings: "Psychic", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: ""},

            {id: 1000, name: "Sacred Soothspheer", image: "../lostimages/S.Soothspheer.png", typings: "Psychic", paratypings: "", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Pydromaglar", image: "../lostimages/MissingNo.png", typings: "Fire, Water", paratypings: "Electric, Light", category: "", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Volcano"},

            {id: 1000, name: "Sacred Pydromaglar", image: "../lostimages/MissingNo.png", typings: "Fire, Water", paratypings: "Electric, Light", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Volcano"},

            {id: 1000, name: "Elixion", image: "../lostimages/Elixion.png", typings: "Normal, Water", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Elixion Blip Forme", image: "../lostimages/BF.Elixion.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Elixion Skip Forme", image: "../lostimages/SF.Elixion.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Elixion Trip Forme", image: "../lostimages/TF.Elixion.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Elixion Lip Forme", image: "../lostimages/LF.Elixion.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Elixion Rip Forme", image: "../lostimages/RF.Elixion.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Shiver Jaws", image: "../images/Shiver Jaws.png", typings: "Electric, Ground", paratypings: "Water", category: "Modernized", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+, Help-Ariel+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Jaws V2.0", image: "../lostimages/MissingNo.png", typings: "Electric, Ground", paratypings: "Water", category: "Modernized-Alt", artist: "", credits: "Idea-Shane+, Help-Ariel+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Blades", image: "../lostimages/Shiver Blades.gif", typings: "Steel, Ice", paratypings: "Fire", category: "Modernized", artist: "Shane", credits: "Drawn-Shane+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Blades V2.0", image: "../lostimages/MissingNo.png", typings: "Steel, Ice", paratypings: "Fire", category: "Modernized-Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Lights", image: "../lostimages/MissingNo.png", typings: "Dark, Ghost", paratypings: "", category: "Modernized", artist: "", credits: "Idea-Shane+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Lights V2.0", image: "../lostimages/MissingNo.png", typings: "Dark, Ghost", paratypings: "", category: "Modernized-Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Gogs", image: "../images/Shiver Gogs.png", typings: "Electric, Light", paratypings: "", category: "Modernized", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Gogs V2.0", image: "../lostimages/MissingNo.png", typings: "Electric, Light", paratypings: "", category: "Modernized-Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Lemody", image: "../lostimages/MissingNo.png", typings: "Grass, Fairy", paratypings: "Psychic", category: "Legendary", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Harmanbloon/Lemodine", image: "../lostimages/MissingNo.png", typings: "Grass, Fairy", paratypings: "Psychic", category: "Legendary-Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Exosteel", image: "../lostimages/Exosteel.png", typings: "Steel", paratypings: "", category: "Legendary", artist: "Tal", credits: "Drawn-Tal+, Idea-Shane+Tal+", 
            description: "A sentient suit of armor that can only be worn by those who are worthy. This XXXXXX is often found in symbiosis with other XXXXX.", region: "Plains/Cave"},

            {id: 1000, name: "Proto-Exosteel", image: "../lostimages/S.Exosteel.png", typings: "Steel", paratypings: "", category: "Legendary-Alt", artist: "Tal", credits: "Drawn-Tal+, Idea-Shane+Tal+", 
            description: "", region: "Plains/Cave"},

            {id: 1000, name: "Cuddol", image: "../lostimages/Cuddol.png", typings: "Psychic, Dark", paratypings: "", category: "Legendary", artist: "", credits: "Idea-Shane+, Concept-Design-Shane+", 
            description: "", region: "Desert/SecretArea"},

            {id: 1000, name: "Doppe-Cuddol", image: "../lostimages/S.Cuddol.png", typings: "Psychic, Dark", paratypings: "", category: "Legendary-Alt", artist: "", credits: "Idea-Shane+, Concept-Design-Shane+", 
            description: "", region: "Desert/SecretArea"},

            {id: 1000, name: "Dopplergrail", image: "../lostimages/Dopplergrail.png", typings: "Psychic, Dark", paratypings: "Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Bug, Rock, Ghost, Dragon, Steel, Fairy, Artillery", category: "Legendary-Ace", artist: "", credits: "Idea-Shane+, Concept-Design-Shane+", 
            description: "The Mastermind Behind All. His Legs Were Disconnected, So He Uses A Machine To Hold Himself Up, Created By ShiverCo.", region: "Desert/SecretArea"},

            {id: 1000, name: "Torterritory", image: "../lostimages/Torterritory.png", typings: "Ground", paratypings: "", category: "Legendary", artist: "Tal", credits: "Idea-Tal+", 
            description: "Carrying entire regions on its back, Torterritory is a colossal force to be reckoned with. It can only be caught using a ___ and has seven regional variants. This region’s Torterritories carry the entirety of Shiveria on their back.", region: "MountainRange"},

            {id: 1000, name: "Sacred Torteraerthy", image: "../lostimages/MissingNo.png", typings: "Ground", paratypings: "", category: "Legendary-Alt", artist: "", credits: "Idea-Tal+", 
            description: "", region: "MountainRange"},

            {id: 1000, name: "Cosmicanine", image: "../lostimages/Cosmicanine.png", typings: "Dark, Light", paratypings: "Psychic", category: "Legendary", artist: "Tal", credits: "Artist+Idea-Tal+", 
            description: "", region: "MountainRange"},

            {id: 1000, name: "Eclipsicanine", image: "../lostimages/MissingNo.png", typings: "Dark, Light", paratypings: "Psychic", category: "Legendary-Alt", artist: "", credits: "Idea-Tal+", 
            description: "", region: "MountainRange"},

            {id: 1500, name: "TwoMew.png.jpeg.gif.webp.jif", image: "../images/TwoMew.jpeg.png.gif.webp.jif.png", typings: "", paratypings: "", category: "Legendary", artist: "Shane", credits: "Drawn-Shane+", 
            description: "WALK INTO MY MYSTERY", region: "Swamp/Cafe"},

            {id: 1500, name: "TwoMew.png.jpeg.gif.webp.cs.html.css.js.raw.mp4.mp3.piskel.zip.jif", image: "../lostimages/MissingNo.png", typings: "", paratypings: "", category: "Legendary-Alt", artist: "Shane", credits: "Drawn-Shane+", 
            description: "WALK INTO MY MYSTERY", region: "Swamp/Cafe"},

            {id: -0.5, name: "Ariel Salama", image: "../images/China.png", typings: "Normal, Fire", paratypings: "", category: "", artist: "Shane", credits: "Drawn-Shane+, Credits-Ariel+", 
            description: "I fainted so really real picture", region: "Unobtainable"},

            {id: -0.5, name: "Cheetalon", image: "../lostimages/Cheetalon.png", typings: "Normal", paratypings: "", category: "Alt", artist: "Shane", credits: "Drawn-Shane+", 
            description: "YOU'RE TOO SLOW!", region: "Unobtainable"},

            {id: -1, name: "Vigilith Revealed Forme", image: "../images/VigilithRF.png", typings: "Rock, Ghost", paratypings: "", category: "HalloweenForme", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "Spooky Factory"},

            {id: -1, name: "Toumern", image: "../lostimages/MissingNo.png", typings: "Ground, Dark", paratypings: "Ghost", category: "Halloween", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Spooky Jungle"},

            {id: -1, name: "Sacred Toumern", image: "../lostimages/MissingNo.png", typings: "Ground, Dark", paratypings: "Ghost", category: "HalloweenForme", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Spooky Jungle"},

            {id: -1, name: "Shiver Slimes", image: "../lostimages/MissingNo.png", typings: "Poison, Normal", paratypings: "", category: "Halloween", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Spooky Factory"},

            {id: -1, name: "Shiver Slimes V2.0", image: "../lostimages/MissingNo.png", typings: "Poison, Normal", paratypings: "", category: "HalloweenForme", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Spooky Factory"},

            {id: -1, name: "Pythog", image: "../lostimages/MissingNo.png", typings: "Electric", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
            description: "", region: "FrozenWasteland"},

            {id: -1, name: "Stimpale", image: "../lostimages/MissingNo.png", typings: "Ice, Ghost", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
            description: "", region: "FrozenWasteland"},

            {id: -1, name: "Jjinngore", image: "../lostimages/MissingNo.png", typings: "Fire, Ice", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
            description: "", region: "FrozenWasteland"},

            {id: -1, name: "Grimloin", image: "../lostimages/MissingNo.png", typings: "Fairy, Ice", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
            description: "", region: "FrozenWasteland"},

            {id: -1, name: "Londalot", image: "../lostimages/MissingNo.png", typings: "Steel, Ice", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
            description: "", region: "FrozenWasteland"},

            {id: -1, name: "Glutacious", image: "../lostimages/MissingNo.png", typings: "Normal, Ice", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
            description: "", region: "FrozenWasteland"},

            {id: -1, name: "Smellmer", image: "../lostimages/MissingNo.png", typings: "Fairy, Ghost", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
            description: "", region: "FrozenWasteland"},

            {id: -1, name: "Shiver Craze", image: "../lostimages/MissingNo.png", typings: "Psychic", paratypings: "", category: "ModernizedSolstice", artist: "", credits: "Idea-Shane+", 
            description: "", region: "FrozenWasteland"},

            {id: -1, name: "Shiver Craze V2.0", image: "../lostimages/MissingNo.png", typings: "Psychic", paratypings: "", category: "Modernized-SolsticeOther", artist: "", credits: "Idea-Shane+", 
            description: "", region: "FrozenWasteland"},

            {id: 1, name: "MC", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "NPC", artist: "", credits: "Idea-Shane+", 
            description: "The Main Character of the Game. Is a 17 year old that wants to be a very good capsuler.", region: "Plains"},
                
            {id: 2, name: "Randal Shivers", image: "../lostimages/MissingNo.png", typings: "Normal, Poison", paratypings: "Fighting", category: "NPC", artist: "", credits: "Idea-Shane+", 
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
        const id = shivrian.id.toString().toLowerCase();
        const image = shivrian.image ? shivrian.image.toLowerCase() : "";
        const category = shivrian.category ? shivrian.category.toLowerCase() : "";
        const credits = shivrian.credits ? shivrian.credits.toLowerCase() : "";
        const artist = shivrian.artist ? shivrian.artist.toLowerCase() : "";
        const typings = shivrian.typings ? shivrian.typings.toLowerCase() : "";
        const paratypings = shivrian.paratypings ? shivrian.paratypings.toLowerCase() : "";
        const region = shivrian.region ? shivrian.region.toLowerCase() : "";
        const isMatch = (name.includes(lastQuery) || lastQuery === id) && (!category.includes("ace") || Ace) && (!category.includes("ncanon") || Ace) && !category.includes("halloween") && !category.includes("frostbite") && (!category.includes("alt") || Alt) && !category.includes("npc") && !category.includes("npcalt") && !category.includes("solstice");
        const isAltMatch = (name.includes(lastQuery) || lastQuery === id) && (category.includes("alt"));
        const isAceMatch = (name.includes(lastQuery) || lastQuery === id) && (category.includes("ace"));
        const isNCanonMatch = (name.includes(lastQuery) || lastQuery === id) && (category.includes("ncanon"));

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

        const isNPC = category.includes("npc");
        const isNPCAlt = category.includes("npca");

        const lostimages = image.includes("lostimage");

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

        if (Alt) {
            card.style.display = isAltMatch ? "block" : "none";
        } 
        if (Ace && !Alt){
            card.style.display = isAceMatch ? "block" : "none";
        }
        if (NCanon){
            card.style.display = isNCanonMatch ? "block" : "none";
        }
        if (!Alt && !Ace && !NCanon) {
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

        else if (lastQuery === "halloween") {
            document.body.style.backgroundColor = "#ED6942";
            card.style.backgroundColor = "#8B5CF6";
            card.style.border = "black";
            if (Alt) {
                card.style.display = isHalloweenAltMatch ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isHalloweenAceMatch ? "block" : "none";
            } 
            else {
                card.style.display = isHalloweenMatch ? "block" : "none";
            }        
        } 
        else if (lastQuery === "frostbite") {
            document.body.style.backgroundColor = "Aqua";
            card.style.backgroundColor = "Gray";
            card.style.border = "Gray";
            if (Alt) {
                card.style.display = isFrostbiteAltMatch ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isFrostbiteAceMatch ? "block" : "none";
            } 
            else {
                card.style.display = isFrostbiteMatch ? "block" : "none";
            }        
        } 
        else if (lastQuery === "solstice") {
            document.body.style.backgroundColor = "Aqua";
            card.style.backgroundColor = "#8B5CF6";
            card.style.border = "White";
            if (Alt) {
                card.style.display = isSolsticeAltMatch ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isSolsticeAceMatch ? "block" : "none";
            } 
            else {
                card.style.display = isSolsticeMatch ? "block" : "none";
            }        
        } 
        else {
            document.body.style.backgroundColor = "";
            card.style.backgroundColor = "";
            card.style.border = "";
            if (lostimages && !NCanon) {
                card.style.backgroundColor = "lightgray";
                card.style.border = "black";
            }
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
    let aceButton = document.querySelector("button");
    searchBar.style.display = "block";
    searchBar.style.margin = "0 auto";
    searchBar.style.textAlign = "center";
    altButton.style.display = "block";
    altButton.style.margin = "0 auto";
    altButton.style.textAlign = "center";
    aceButton.style.display = "block";
    aceButton.style.margin = "0 auto";
    aceButton.style.textAlign = "center";
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

