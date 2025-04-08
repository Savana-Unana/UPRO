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
        autoTriggerSearch();
        console.log("Alt is now:", Alt);
    }
    function setAceTrue() {
        Ace = !Ace;
        autoTriggerSearch();
        console.log("Ace is now:", Ace);
    }
    function setNCanonTrue() {
        NCanon = !NCanon;
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

            {id: 3, name: "Sacred Hileaph", image: "../lostimages/MissingNo.png", typings: "Grass, Ground", paratypings: "Normal", category: "Alt", artist: "", credits: "Idea-Shane+",
            description: "", region: "Plains"},

            {id: 3, name: "Ace Hileaph", image: "../lostimages/MissingNo.png", typings: "Grass, Ground", paratypings: "Normal", category: "Ace", artist: "", credits: "Idea-Shane+",
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

            {id: 9, name: "Ace Furnacoon", image: "../lostimages/MissingNo.png", typings: "Fire, Steel", paratypings: "Psychic", category: "Ace", artist: "", credits: "Idea-Shane+",
            description: "", region: "Cruise"},

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

            {id: 1000, name: "Frankfortress", image: "../lostimages/Frankfortress.png", typings: "Normal, Fairy", paratypings: "", category: "", artist: "", credits: "Idea-Shane+Tal+Jake+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Sacred Frankfortress", image: "../lostimages/MissingNo.png", typings: "Normal, Fairy", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Tal+Jake+", 
            description: "", region: "Plains"},

            {id: 1000, name: "Ace Frankfortress", image: "../lostimages/AceFrankfortress.png", typings: "Normal, Fairy", paratypings: "", category: "Ace", artist: "", credits: "Idea-Shane+Tal+Jake+", 
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

            {id: 1000, name: "Thrack", image: "../images/Thrack.png", typings: "Normal, Rock", paratypings: "Fire", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+Jake+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Sacred Thrack", image: "../lostimages/MissingNo.png", typings: "Normal, Rock", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Jake+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Fumerey", image: "../lostimages/MissingNo.png", typings: "Poison", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Sacred Fumerey", image: "../lostimages/MissingNo.png", typings: "Poison", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Forest"},

            {id: 1000, name: "Puppechyu", image: "../images/Puppechyu.png", typings: "Ghost, Fairy", paratypings: "Electric", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
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

            {id: 77, name: "Sacred Chancey", image: "../lostimages/S.Chancey.png", typings: "Fire, Ice", paratypings: "", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
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

            {id: 1000, name: "Elixion", image: "../lostimages/MissingNo.png", typings: "Normal, Water", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Elixion Blip Forme", image: "../lostimages/MissingNo.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Elixion Skip Forme", image: "../lostimages/MissingNo.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Elixion Trip Forme", image: "../lostimages/MissingNo.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Elixion Lip Forme", image: "../lostimages/MissingNo.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Elixion Rip Forme", image: "../lostimages/MissingNo.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "Swamp"},

            {id: 1000, name: "Shiver Jaws", image: "../images/Shiver Jaws.png", typings: "Electric, Ground", paratypings: "Water", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+, Help-Ariel+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Jaws V2.0", image: "../lostimages/MissingNo.png", typings: "Electric, Ground", paratypings: "Water", category: "Alt", artist: "", credits: "Idea-Shane+, Help-Ariel+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Blades", image: "../images/Shiver Blades.gif", typings: "Steel, Ice", paratypings: "Fire", category: "", artist: "Shane", credits: "Drawn-Shane+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Blades V2.0", image: "../lostimages/MissingNo.png", typings: "Steel, Ice", paratypings: "Fire", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Lights", image: "../lostimages/MissingNo.png", typings: "Dark, Ghost", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Lights V2.0", image: "../lostimages/MissingNo.png", typings: "Dark, Ghost", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Gogs", image: "../images/Shiver Gogs.png", typings: "Electric, Light", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Shiver Gogs V2.0", image: "../lostimages/MissingNo.png", typings: "Electric, Light", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
            description: "", region: "ShiverCo"},

            {id: 1000, name: "Exosteel", image: "../lostimages/Exosteel.png", typings: "Steel", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+, Idea-Shane+Tal+", 
            description: "A sentient suit of armor that can only be worn by those who are worthy. This XXXXXX is often found in symbiosis with other XXXXX.", region: "Plains/Cave"},

            {id: 1000, name: "Sacred Exosteel", image: "../lostimages/S.Exosteel.png", typings: "Steel", paratypings: "", category: "Alt", artist: "Tal", credits: "Drawn-Tal+, Idea-Shane+Tal+", 
            description: "", region: "Plains/Cave"},

            {id: 1000, name: "Cuddol", image: "../lostimages/Cuddol.png", typings: "Psychic, Dark", paratypings: "", category: "", artist: "", credits: "Idea-Shane+, Concept-Design-Shane+", 
            description: "", region: "Desert/SecretArea"},

            {id: 1000, name: "Sacred Cuddol", image: "../lostimages/S.Cuddol.png", typings: "Psychic, Dark", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+, Concept-Design-Shane+", 
            description: "", region: "Desert/SecretArea"},

            {id: 1000, name: "Dopplergrail", image: "../lostimages/Dopplergrail.png", typings: "Psychic, Dark", paratypings: "Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Bug, Rock, Ghost, Dragon, Steel, Fairy", category: "Ace", artist: "", credits: "Idea-Shane+, Concept-Design-Shane+", 
            description: "The Mastermind Behind All. His Legs Were Disconnected, So He Uses A Machine To Hold Himself Up, Created By ShiverCo.", region: "Desert/SecretArea"},

            {id: 1000, name: "Torterritory", image: "../lostimages/MissingNo.png", typings: "Ground", paratypings: "", category: "", artist: "", credits: "Idea-Tal+", 
            description: "Carrying entire regions on its back, Torterritory is a colossal force to be reckoned with. It can only be caught using a ___ and has seven regional variants. This region’s Torterritories carry the entirety of Shiveria on their back.", region: "MountainRange"},

            {id: 1000, name: "Sacred Torterritory", image: "../lostimages/MissingNo.png", typings: "Ground", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
            description: "", region: "MountainRange"},

            {id: 1000, name: "Cosmicanine", image: "../lostimages/Cosmicanine.png", typings: "Dark, Light", paratypings: "Psychic", category: "", artist: "", credits: "Idea-Tal+", 
            description: "", region: "MountainRange"},

            {id: 150, name: "TwoMew.jpeg.png.gif.webp.jif", image: "../images/TwoMew.jpeg.png.gif.webp.jif.png", typings: "", paratypings: "", category: "", artist: "Shane", credits: "Drawn-Shane+", 
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

            {id: -1, name: "Shiver Craze", image: "../lostimages/MissingNo.png", typings: "Psychic", paratypings: "", category: "Solstice", artist: "", credits: "Idea-Shane+", 
            description: "", region: "FrozenWasteland"},

            {id: -1, name: "Shiver Craze V2.0", image: "../lostimages/MissingNo.png", typings: "Psychic", paratypings: "", category: "SolsticeOther", artist: "", credits: "Idea-Shane+", 
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

        const lostimages = image.includes("lostimage");

        const isHalloweenMatch = category.includes("halloween") && !category.includes("halloweenforme");
        const isHalloweenAltMatch = category.includes("halloweenforme");
        const isFrostbiteMatch = category.includes("frostbite") && !category.includes("frozen");
        const isFrostbiteAltMatch = category.includes("frozen");
        const isSolsticeMatch = category.includes("solstice") && !category.includes("solsticeother");
        const isSolsticeAltMatch = category.includes("solsticeother");


        if (Alt) {
            card.style.display = isAltMatch ? "block" : "none";
        } 
        if (Ace){
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
        else if (lastQuery === "solstice") {
            document.body.style.backgroundColor = "Aqua";
            card.style.backgroundColor = "#8B5CF6";
            card.style.border = "White";
            card.style.display = Alt ? (isSolsticeAltMatch ? "block" : "none") : (isSolsticeMatch ? "block" : "none");
        } 
        else {
            document.body.style.backgroundColor = "";
            card.style.backgroundColor = "";
            card.style.border = "";
            if (lostimages) {
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

