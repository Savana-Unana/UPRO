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
});

// Code from the second script section
let Alt = false;
let Ace = false;
let NCanon = false;
let Made = false;
let UnMade = false;
let Concepted = false;
let Unconcepted = false;

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
function setMadeTrue() {
    if (Made) 
    {
        // Made → UnMade
        Made = false;
        UnMade = true;
        Concepted = false;
        Unconcepted = false;
        document.getElementById('madeLabel').textContent = "Switch to Unconcepted";
    } 
    else if (UnMade) 
    {
        // UnMade → Concepted
        Made = false;
        UnMade = false;
        Concepted = true;
        Unconcepted = false;
        document.getElementById('madeLabel').textContent = "Switch to Concepted";
    } 
    else if (Concepted) 
    {
        // Concepted → Unconcepted
        Made = false;
        UnMade = false;
        Concepted = false;
        Unconcepted = true;
        document.getElementById('madeLabel').textContent = "Switch to None";
    } 
    else if (Unconcepted) 
    {
        // Unconcepted → None
        Made = false;
        UnMade = false;
        Concepted = false;
        Unconcepted = false;
        document.getElementById('madeLabel').textContent = "Switch to Made";
    } 
    else 
    {
        // None → Made
        Made = true;
        UnMade = false;
        Concepted = false;
        Unconcepted = false;
        document.getElementById('madeLabel').textContent = "Switch to UnMade";
    }
    autoTriggerSearch();
    console.log("Made is now:", Made);
    console.log("UnMade is now:", UnMade);
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
// Single are normal
// .5s are Alts
// .9s are Aces
// .6s are NCanons
    const shivericanList = [
        {id: 0, name: "Capture Capsule", image: "../images/CaptureCapsule.gif", typings: "Steel", paratypings: "Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Bug, Rock, Ghost, Dragon, Psychic, Fairy, Dark, Light, Artillery", category: "Modernized", artist: "Jake", credits: "Idea-Shane+",
        description: "", region: "Plains/ShiverCo"},

        {id: 0.5, name: "Juvie Capture Capsule", image: "../lostimages/J.CaptureCapsule.png", typings: "Steel", paratypings: "Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Bug, Rock, Ghost, Dragon, Psychic, Fairy, Dark, Light, Artillery", category: "Modernized-Alt", artist: "", credits: "Idea-Shane+",
        description: "", region: "Plains/ShiverCo"},

        {id: 0.9, name: "Ace Capture Capsule", image: "../lostimages/MissingNo.png", typings: "Steel", paratypings: "Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Bug, Rock, Ghost, Dragon, Psychic, Fairy, Dark, Light, Artillery", category: "Modernized-Ace", artist: "", credits: "Idea-Shane+",
        description: "", region: "Plains/ShiverCo"},

        {id: 0.6, name: "Old Capture Capsule", image: "../lostimages/OldAnimated_Capsule.gif", typings: "Steel", paratypings: "Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Bug, Rock, Ghost, Dragon, Psychic, Fairy, Dark, Light, Artillery", category: "Modernized-NCanon", artist: "Jake", credits: "Idea-Shane+",
        description: "", region: "Plains/ShiverCo"},

        {id: 0.61, name: "Old Anti Capture Capsule", image: "../lostimages/Anti-CaptureCapsule.gif", typings: "Steel", paratypings: "Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Bug, Rock, Ghost, Dragon, Psychic, Fairy, Dark, Light, Artillery", category: "Modernized-NCanon", artist: "Jake", credits: "Idea-Shane+",
        description: "", region: "Plains/ShiverCo"},

        {id: 1, name: "Erbacub", image: "../images/Erbacub.png", typings: "Grass", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Jake+",
        description: "", region: "Plains"},

        {id: 1.5, name: "Sacred Erbacub", image: "../lostimages/MissingNo.png", typings: "Grass", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+",
        description: "", region: "Plains"},

        {id: 2, name: "Bearosion", image: "../images/Bearosion.png", typings: "Grass, Fighting", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Jake+",
        description: "", region: "Plains"},

        {id: 2.5, name: "Sacred Bearosion", image: "../lostimages/MissingNo.png", typings: "Grass, Fighting", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+",
        description: "", region: "Plains"},

        {id: 3, name: "Hileaph", image: "../images/Hileaph.png", typings: "Grass, Fighting", paratypings: "Ground", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Jake+",
        description: "", region: "Plains"},

        {id: 3.5, name: "Sacred Hileaph", image: "../lostimages/MissingNo.png", typings: "Grass, Fighting", paratypings: "Ground", category: "Alt", artist: "", credits: "Idea-Jake+",
        description: "", region: "Plains"},

        {id: 3.9, name: "Ace Hileaph", image: "../lostimages/MissingNo.png", typings: "Grass, Fighting", paratypings: "Ground", category: "Ace", artist: "", credits: "Idea-Jake+",
        description: "", region: "Cruise"},

        {id: 4, name: "Axolitl", image: "../images/Axolitl.png", typings: "Water", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+",
        description: "", region: "Lake"},

        {id: 4.5, name: "Sacred Axolitl", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
        description: "", region: "Lake"},

        {id: 5, name: "Axolote", image: "../images/Axolote.png", typings: "Water, Rock", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+Amo+",
        description: "", region: "Lake"},

        {id: 5.5, name: "Sacred Axolote", image: "../lostimages/MissingNo.png", typings: "Water, Rock", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Amo+",
        description: "", region: "Lake"},

        {id: 5.61, name: "Axail", image: "../lostimages/Axail.png", typings: "Water", paratypings: "", category: "NCanon", artist: "Amo", credits: "Drawn-Jake+Idea-Shane+Amo+",
        description: "", region: "Lake"},
    
        {id: 5.62, name: "Sacred Axail", image: "../lostimages/S.Axail.png", typings: "Water", paratypings: "", category: "NCanon", artist: "Amo", credits: "Idea-Shane+Amo+",
        description: "", region: "Lake"},

        {id: 6, name: "Axolarg", image: "../images/Axolarg.png", typings: "Water, Rock", paratypings: "Poison", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+",
        description: "", region: "Lake"},

        {id: 6.5, name: "Sacred Axolarg", image: "../lostimages/MissingNo.png", typings: "Water, Rock", paratypings: "Poison", category: "Alt", artist: "", credits: "Idea-Shane+",
        description: "", region: "Lake"},

        {id: 6.9, name: "Ace Axolarg", image: "../lostimages/MissingNo.png", typings: "Water, Rock", paratypings: "Poison", category: "Ace", artist: "", credits: "Idea-Shane+",
        description: "", region: "Cruise"},

        {id: 7, name: "Charcoon", image: "../images/Charcoon.png", typings: "Fire", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+",
        description: "", region: "Forest"},

        {id: 7.5, name: "Sacred Charcoon", image: "../lostimages/MissingNo.png", typings: "Fire", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+",
        description: "", region: "Forest"},

        {id: 8, name: "Blazuki", image: "../images/Blazuki.png", typings: "Fire, Flying", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+Jake+",
        description: "", region: "Forest"},

        {id: 8.5, name: "Sacred Blazuki", image: "../lostimages/MissingNo.png", typings: "Fire, Flying", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Jake+",
        description: "", region: "Forest"},

        {id: 9, name: "Furnacoon", image: "../images/Furnacoon.png", typings: "Fire, Flying", paratypings: "Steel", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+Jake+",
        description: "", region: "Forest"},

        {id: 9.5, name: "Sacred Furnacoon", image: "../lostimages/MissingNo.png", typings: "Fire, Flying", paratypings: "Steel", category: "Alt", artist: "", credits: "Idea-Shane+Jake+",
        description: "", region: "Forest"},

        {id: 9.9, name: "Ace Furnacoon", image: "../lostimages/MissingNo.png", typings: "Fire, Flying", paratypings: "Steel", category: "Ace", artist: "", credits: "Idea-Shane+Jake+",
        description: "", region: "Cruise"},

        {id: 10, name: "Pretengerine", image: "../lostimages/Pretengerine.png", typings: "Bug", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+",
        description: "This worm hides among tangerines to get away from predators. It has a parasitic relationship with the tangerines until one day it gets too large and falls off the tree.", region: "Forest"},

        {id: 10.5, name: "Sacred Pretengerine", image: "../lostimages/MissingNo.png", typings: "Bug", paratypings: "", category: "Alt", artist: "", credits: "",
        description: "", region: "Forest"},

        {id: 11, name: "Espiorange", image: "../lostimages/Espiorange.png", typings: "Bug", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+",
        description: "A Pretengerine that grew alongside its tangerine seeds, Espiorange has upscaled the operation and is now in control of the entire tree. In order to reproduce, Espiorange leaves its larvae inside tangerines so they have something to eat as they grow.", region: "Forest"},

        {id: 11.5, name: "Sacred Espiorange", image: "../lostimages/MissingNo.png", typings: "Bug", paratypings: "", category: "Alt", artist: "", credits: "",
        description: "", region: "Forest"},

        {id: 12, name: "Caneins", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "", artist: "", credits: "",
        description: "", region: "Forest"},
    
        {id: 12.5, name: "Sacred Caneins", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "Alt", artist: "", credits: "",
        description: "", region: "Forest"},

        {id: 13, name: "Duadog", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "", artist: "", credits: "",
        description: "", region: "Forest"},
    
        {id: 13.5, name: "Sacred Duadog", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "Alt", artist: "", credits: "",
        description: "", region: "Forest"},

        {id: 14, name: "Dodecadaog", image: "../lostimages/MissingNo.png", typings: "Normal, Psychic", paratypings: "", category: "", artist: "", credits: "",
        description: "", region: "Forest"},
    
        {id: 14.5, name: "Sacred Dodecadog", image: "../lostimages/MissingNo.png", typings: "Normal, Psychic", paratypings: "", category: "Alt", artist: "", credits: "",
        description: "", region: "Forest"},

        {id: 15, name: "Bakunbush", image: "../images/Bakunbush.png", typings: "Normal, Grass", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+Jake+", 
        description: "", region: "Forest"},

        {id: 15.5, name: "Sacred Bakunbush", image: "../lostimages/MissingNo.png", typings: "Normal, Grass", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Jake+", 
        description: "", region: "Forest"},

        {id: 16, name: "Pigturee", image: "../images/Pigturee.png", typings: "Normal, Grass", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+Jake+", 
        description: "", region: "Forest"},

        {id: 16.5, name: "Sacred Pigturee", image: "../lostimages/MissingNo.png", typings: "Normal, Grass", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Forest"},
        
        {id: 17, name: "Dribsom", image: "../images/Dribsom.png", typings: "Normal, Flying", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Jake+Shane+",
        description: "", region: ""},

        {id: 17.5, name: "Sacred Dribsom", image: "../lostimages/MissingNo.png", typings: "Normal, Flying", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+Shane+",
        description: "", region: ""},

        {id: 18, name: "Dribtar", image: "../images/Dribtar.png", typings: "Normal, Flying", paratypings: "", category: "", artist: "Jake", credits: "Idea-Jake+Shane+",
        description: "", region: ""},

        {id: 18.5, name: "Sacred Dribtar", image: "../lostimages/MissingNo.png", typings: "Normal, Flying", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+Shane+",
        description: "", region: ""},

        {id: 1000, name: "Starpod", image: "../lostimages/MissingNo.png", typings: "Water, Flying", paratypings: "", category: "", artist: "", credits: "Idea-Jake+Tal+",
        description: "", region: ""},
        
        {id: 1000, name: "Sacred Starpod", image: "../lostimages/MissingNo.png", typings: "Water, Flying", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+Tal+",
        description: "", region: ""},

        {id: 1000, name: "Twynami", image: "../lostimages/Twynami.png", typings: "Water", paratypings: "", category: "", artist: "", credits: "Idea-Tal+Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Twynami", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Confished", image: "../lostimages/Confished.png", typings: "Water, Light", paratypings: "", category: "", artist: "", credits: "Idea-Tal+Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Confished", image: "../lostimages/MissingNo.png", typings: "Water, Light", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Cartilicht", image: "../lostimages/Cartilicht.png", typings: "Water, Light", paratypings: "", category: "", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Cartilicht", image: "../lostimages/MissingNo.png", typings: "Water, Light", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Ballijawlent", image: "../lostimages/Ballijawlent.png", typings: "Water, Artillery", paratypings: "", category: "", artist: "", credits: "Idea-Tal+Shane+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Ballijawlent", image: "../lostimages/MissingNo.png", typings: "Water, Artillery", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+Shane+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Ghouliath", image: "../lostimages/MissingNo.png", typings: "Ghost, Water", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Lake"},
        
        {id: 1000, name: "Tumball", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Desert"},

        {id: 1000, name: "Sacred Tumball", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Desert"},

        {id: 1000, name: "Cacculent", image: "../lostimages/Cacculent.png", typings: "Grass, Flying", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
        description: "", region: "Desert"},

        {id: 1000, name: "Sacred Cacculent", image: "../lostimages/MissingNo.png", typings: "Grass, Flying", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Desert"},

        {id: 1000, name: "Polhand", image: "../lostimages/Polhand.png", typings: "Grass, Psychic", paratypings: "", category: "NCanon", artist: "Shane", credits: "Drawn, Idea-Shane+", 
        description: "", region: "Forest"},
        
        {id: 1000, name: "MayFly", image: "../lostimages/Mayfly.png", typings: "Flying, Artillery", paratypings: "", category: "", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Volcano"},

        {id: 1000, name: "Sacred Mayfly", image: "../lostimages/MissingNo.png", typings: "Flying, Artillery", paratypings: "", category: "Alt", artist: "", credits: ", Idea-Shane+", 
        description: "", region: "Volcano"},

        {id: 1000, name: "Volcannon", image: "../lostimages/Volcannon.png", typings: "Ground, Artillery", paratypings: "Fire", category: "", artist: "", credits: ", , Idea-Tal+", 
        description: "", region: "Volcano"},

        {id: 1000, name: "Sacred Volcannon", image: "../lostimages/MissingNo.png", typings: "Ground, Artillery", paratypings: "Fire", category: "Alt", artist: "", credits: ", Idea-Shane+", 
        description: "", region: "Volcano"},

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

        {id: 1000, name: "Blarb", image: "../images/Blarb.png", typings: "Water", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Ivri+, OGDesign-Amo+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Blarb", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "Alt", artist: "", credits: "OGDesign-Amo+Ivri+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Bowlfish", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "", artist: "Jake", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Bowlfish", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Tankfish", image: "../lostimages/MissingNo.png", typings: "Water, Artillery", paratypings: "", category: "", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Tankfish", image: "../lostimages/MissingNo.png", typings: "Water, Artillery", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Fizzlin", image: "../lostimages/MissingNo.png", typings: "Water, Steel", paratypings: "", category: "", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Fizzlin", image: "../lostimages/MissingNo.png", typings: "Water, Steel", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Fizzik", image: "../lostimages/MissingNo.png", typings: "Water, Steel", paratypings: "", category: "", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Fizzik", image: "../lostimages/MissingNo.png", typings: "Water, Steel", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Quubbly", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Quubbly", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Quontoon", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Quontoon", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Honckraft", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Honckraft", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},
        
        {id: 1000, name: "Cordal", image: "../lostimages/Cordal.png", typings: "Water, Fairy", paratypings: "", category: "", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Cordal", image: "../lostimages/MissingNo.png", typings: "Water, Fairy", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Gastrover", image: "../lostimages/MissingNo.png", typings: "Bug, Fire", paratypings: "", category: "", artist: "", credits: "Idea-Tal+Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Gastrover", image: "../lostimages/MissingNo.png", typings: "Bug, Fire", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Krat", image: "../lostimages/MissingNo.png", typings: "Normal, Fighting", paratypings: "", category: "", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Krat", image: "../lostimages/MissingNo.png", typings: "Normal, Fighting", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},
        
        {id: 1000, name: "Kroxer", image: "../lostimages/MissingNo.png", typings: "Normal, Fighting", paratypings: "", category: "", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Kroxer", image: "../lostimages/MissingNo.png", typings: "Normal, Fighting", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Buntot", image: "../lostimages/Buntot.png", typings: "Fairy", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Plains"},

        {id: 1000, name: "Buntot Toasted Forme", image: "../lostimages/BuntotTF.png", typings: "Fairy, Fire", paratypings: "Poison", category: "Alt", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Plains"},

        {id: 1000, name: "Challadin", image: "../images/Challadin.png", typings: "Fairy", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Plains"},

        {id: 1000, name: "Challadin Toasted Forme", image: "../images/ChalladinTF.png", typings: "Fairy, Fire", paratypings: "Poison", category: "Alt", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Plains"},

        {id: 1000, name: "OG Challadin", image: "../lostimages/OGChalladin.png", typings: "Fairy", paratypings: "", category: "NCanon", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Plains"},

        {id: 1000, name: "OG Challadin Toasted Forme", image: "../lostimages/OGChalladinTF.png", typings: "Fairy, Fire", paratypings: "Poison", category: "NCanon", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Plains"},

        {id: 1000, name: "Burking", image: "../lostimages/Burking.png", typings: "Fairy", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Plains"},

        {id: 1000, name: "Burking Toasted Forme", image: "../lostimages/BurkingTF.png", typings: "Fairy, Fire", paratypings: "Poison", category: "Alt", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
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

        {id: 1000, name: "Borgo Slor", image: "../lostimages/Salam.png", typings: "Psychic", paratypings: "", category: "", artist: "", credits: "Idea-Shane+Jake+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Sacred Borgo Slor", image: "../lostimages/Salam.png", typings: "Psychic", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Jake+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Krasbopper", image: "../lostimages/Krasbopper.png", typings: "Fighting, Bug", paratypings: "", category: "", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Sacred Krasbopper", image: "../lostimages/MissingNo.png", typings: "Fighting, Bug", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Lurkest", image: "../lostimages/Lurkest.png", typings: "Fighting, Bug", paratypings: "", category: "", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Sacred Lurkest", image: "../lostimages/MissingNo.png", typings: "Fighting, Bug", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Buzzibee", image: "../lostimages/MissingNo.png", typings: "Steel, Bug", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Sacred Buzzibee", image: "../lostimages/MissingNo.png", typings: "Steel, Bug", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Wasniach", image: "../lostimages/MissingNo.png", typings: "Steel, Bug", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Sacred Wasniach", image: "../lostimages/MissingNo.png", typings: "Steel, Bug", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Ircencaat", image: "../lostimages/Ircencaat.png", typings: "Steel, Bug", paratypings: "", category: "", artist: "", credits: "Idea-Tal+Jake+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Sacred Ircencaat", image: "../lostimages/MissingNo.png", typings: "Steel, Bug", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+Jake+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Frankyurt (Tal Concept)", image: "../lostimages/Frankyurt.png", typings: "Normal, Fairy", paratypings: "", category: "NCanon", artist: "Tal", credits: "Idea-Shane+Tal+Jake+", 
        description: "", region: "Plains"},

        {id: 1000, name: "Frankyurt", image: "../lostimages/Frankyurt.png", typings: "Normal, Fairy", paratypings: "", category: "", artist: "Tal", credits: "Idea-Shane+Tal+Jake+", 
        description: "", region: "Plains"},

        {id: 1000, name: "Sacred Frankyurt", image: "../lostimages/MissingNo.png", typings: "Normal, Fairy", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Tal+Jake+", 
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

        {id: 1000, name: "Beit", image: "../lostimages/MissingNo.png", typings: "Ghost, Psychic", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Sacred Beit", image: "../lostimages/MissingNo.png", typings: "Ghost, Psychic", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Pirotte", image: "../lostimages/MissingNo.png", typings: "Ghost, Psychic", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Sacred Pirotte", image: "../lostimages/MissingNo.png", typings: "Ghost, Psychic", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Aestereg", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "", region: "IceCaps"},

        {id: 1000, name: "Sacred Aestereg", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "IceCaps"},

        {id: 1000, name: "Moteeph", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "", region: "IceCaps"},

        {id: 1000, name: "Sacred Moteeph", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "IceCaps"},

        {id: 1000, name: "Reverense", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "", region: "IceCaps"},

        {id: 1000, name: "Sacred Reverense", image: "../lostimages/MissingNo.png", typings: "Normal", paratypings: "Flying", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "IceCaps"},

        {id: 1000, name: "Bombabeak", image: "../lostimages/MissingNo.png", typings: "Steel, Artillery", paratypings: "", category: "", artist: "", credits: "Idea-Amo+", 
        description: "", region: "SecretArea"},

        {id: 1000, name: "Sacred Bombabeak", image: "../lostimages/MissingNo.png", typings: "Steel, Artillery", paratypings: "", category: "Alt", artist: "", credits: "Idea-Amo+", 
        description: "", region: "SecretArea"},
        
        {id: 1000, name: "Lambabeem", image: "../lostimages/MissingNo.png", typings: "Light", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Plains"},

        {id: 1000, name: "Sacred Lambabeem", image: "../lostimages/MissingNo.png", typings: "Light", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Plains"},

        {id: 1000, name: "Lumilox", image: "../lostimages/MissingNo.png", typings: "Light", paratypings: "", category: "", artist: "", credits: "Idea-Tal+", 
        description: "", region: "SecretArea"},

        {id: 1000, name: "Sacred Lumilox", image: "../lostimages/MissingNo.png", typings: "Light", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+", 
        description: "", region: "SecretArea"},
        
        {id: 1000, name: "Plasttack", image: "../images/Plasttack.png", typings: "Ghost", paratypings: "Normal", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Jake+Shane+", 
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

        {id: 1000, name: "Fumerey", image: "../images/Fumerey.png", typings: "Poison", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+Jake+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Sacred Fumerey", image: "../lostimages/MissingNo.png", typings: "Poison", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Puppechyu", image: "../lostimages/Puppechyu.png", typings: "Ghost, Fairy", paratypings: "Electric", category: "Dop", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Puppechu", image: "../lostimages/OGPuppechu.png", typings: "Ghost, Fairy", paratypings: "Electric", category: "NCanon", artist: "Shane", credits: "Drawn, Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Sacred Puppechyu", image: "../lostimages/MissingNo.png", typings: "Ghost, Fairy", paratypings: "Electric", category: "Alt-Dop", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Mockenyu", image: "../images/Mockenyu.png", typings: "Ghost, Fairy", paratypings: "Electric", category: "Dop", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Sacred Mockenyu", image: "../lostimages/MissingNo.png", typings: "Ghost, Fairy", paratypings: "Electric", category: "Alt-Dop", artist: "", credits: "Idea-Shane+", 
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

        {id: 1000, name: "Blizard", image: "../lostimages/Blizard.png", typings: "Ice, Dragon", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+", 
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

        {id: 1000, name: "Shadasnow", image: "../lostimages/Shadasnow.png", typings: "Ice, Dark", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Shadasnow", image: "../lostimages/MissingNo.png", typings: "Ice, Dark", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Relion", image: "../lostimages/Relion.png", typings: "Light", paratypings: "", category: "NCanon", artist: "Tal", credits: "Drawn-Tal+", 
        description: "", region: "MountainRange"},

        {id: 1000, name: "Sacred Relion", image: "../lostimages/MissingNo.png", typings: "Light", paratypings: "NCanon", category: "Alt", artist: "", credits: "Idea-Tal+", 
        description: "", region: "MountainRange"},

        {id: 1000, name: "Meepu", image: "../lostimages/Meepu.png", typings: "Ice, Electric", paratypings: "", category: "", artist: "", credits: "Idea-Shane+Tal+", 
        description: "", region: "IceCaps"},

        {id: 1000, name: "Sacred Meepu", image: "../lostimages/MissingNo.png", typings: "Ice, Electric", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Tal+", 
        description: "", region: "IceCaps"},

        {id: 1000, name: "Ace Meepu", image: "../lostimages/A.Meepu.png", typings: "Ice, Electric", paratypings: "", category: "Ace", artist: "", credits: "Idea-Shane+Tal+", 
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

        {id: 1000, name: "OG Prismite", image: "../lostimages/OGPrismite.png", typings: "Light, Bug", paratypings: "", category: "NCanon", artist: "Jake", credits: "Drawn-Jake+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Duochrom", image: "../images/Duochrom.png", typings: "Light, Bug", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Sacred Duochrom", image: "../lostimages/MissingNo.png", typings: "Light, Bug", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Jake+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "OG Duochrom", image: "../lostimages/OGDuochrom.png", typings: "Light, Bug", paratypings: "", category: "NCanon", artist: "Jake", credits: "Drawn-Jake+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Prismoth", image: "../lostimages/Prismoth.png", typings: "Light, Bug", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Name-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Sacred Prismoth", image: "../lostimages/MissingNo.png", typings: "Light, Bug", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+Jake+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Mos", image: "../lostimages/Mos.png", typings: "Ghost, Normal", paratypings: "", category: "NCanon", artist: "Jake", credits: "Draw-Jake+", 
        description: "", region: "Desert"},

        {id: 1000, name: "Thoot", image: "../lostimages/Thoot.png", typings: "Water", paratypings: "", category: "NCanon", artist: "Ivri", credits: "Drawn-Ivri+", 
        description: "", region: "Desert"},

        {id: 1000, name: "Sacred Thoot", image: "../lostimages/S.Thoot.png", typings: "Water", paratypings: "", category: "NCanon", artist: "Ivri", credits: "IDrawn-Ivri+", 
        description: "", region: "Desert"},

        {id: 1000, name: "Alliminiyum", image: "../lostimages/Alliminiyum.png", typings: "Steel, Psychic", paratypings: "", category: "", artist: "", credits: "Idea-Tal+Shane+", 
        description: "", region: "MountainRange"},

        {id: 1000, name: "Sacred Alliminiyum", image: "../lostimages/MissingNo.png", typings: "Steel, Psychic", paratypings: "", category: "Alt", artist: "", credits: "Idea-Tal+Shane+", 
        description: "", region: "MountainRange"},

        {id: 1000, name: "Vigilith", image: "../images/Vigilith.png", typings: "Rock, Ghost", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Desert/Temple"},

        {id: 1000, name: "Empire Vigilith", image: "../lostimages/MissingNo.png", typings: "Rock, Ghost", paratypings: "", category: "Ace", artist: "ake", credits: "Idea-Shane+", 
        description: "", region: "IceCaps"},

        {id: 1000, name: "Fortilith", image: "../lostimages/Fortilth.png", typings: "Rock, Ghost", paratypings: "", category: "NCanon", artist: "", credits: "Idea-Shane+Tal+", 
        description: "", region: "Desert/Temple"},

        {id: 1000, name: "Agilith", image: "../lostimages/Agilith.png", typings: "Rock, Ghost", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Desert/Temple"},

        {id: 1000, name: "Signilith", image: "../lostimages/MissingNo.png", typings: "Rock, Ghost", paratypings: "", category: "", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Desert/Temple"},

        {id: 1000, name: "Enchrancess", image: "../lostimages/MissingNo.png", typings: "Psychic, Ghost", paratypings: "", category: "", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Enchrancess", image: "../lostimages/MissingNo.png", typings: "Psychic, Ghost", paratypings: "", category: "Alt", artist: "", credits: "Idea-Jake+", 
        description: "", region: "Lake"},

        {id: 77, name: "Chancix", image: "../lostimages/Chancey.png", description: "An ordinary clover that grows on the border of really hot and really cold places.", typings: "Grass", paratypings: "Ice, Fire", category: "", artist: "Tal", credits: "Drawn-Tal+, Idea-Ivri+, OGDesign-Amo+", 
        description: "", region: "Forest"},

        {id: 77.5, name: "Sacred Chancix", image: "../lostimages/S.Chancey.png", typings: "Grass", paratypings: "Fire, Ice", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
        description: "", region: "Forest"},

        {id: 77.6, name: "Chancix (Jake's Take)", image: "../lostimages/JT.Chancey.png", description: "", typings: "Grass", paratypings: "Ice, Fire", category: "NCanon", artist: "Jake", credits: "Drawn-Jake+, Idea-Ivri+, OGDesign-Amo+", 
        description: "", region: "Forest"},

        {id: 78, name: "Maychancix", image: "../lostimages/Maychancey.png", typings: "Grass", paratypings: "Ice, Fire", category: "", artist: "Tal", credits: "Drawn-Tal+", 
        description: "This creature is empty inside, and completely overtaken by the cold. It’s limbs have started to freeze, but it no longer cares.", region: "Forest"},

        {id: 78.5, name: "Sacred Maychancix", image: "../lostimages/S.Maychancey.png", typings: "Grass", paratypings: "Ice, Fire", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
        description: "", region: "Forest"},

        {id: 78.6, name: "Maychancix (Jake's Take)", image: "../lostimages/JT.Maychancey.png", description: "", typings: "Grass", paratypings: "Ice, Fire", category: "NCanon", artist: "Jake", credits: "Drawn-Jake+", 
        description: "", region: "Forest"},

        {id: 79, name: "Gamblanguin", image: "../lostimages/Gamblanguin.png", typings: "Ice", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
        description: "A severe gambling addict, this creature had all of it’s assets frozen by the IRS and is constantly on the run from the police. It creates loaded dice to try to alter it’s odds of winning.", region: "Forest"},

        {id: 79.5, name: "Sacred Gamblanguin", image: "../lostimages/S.Gamblanguin.png", typings: "Ice", paratypings: "", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
        description: "", region: "Forest"},

        {id: 80, name: "Predadventure", image: "../lostimages/Predadventure.png", typings: "Ice", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
        description: "An icy bird, Predadventure constantly sheds it’s icicle feathers, so watch out for falling ice spikes when you’re in icy terrain. This creature Lives in the frozen tundras of __ to maintain it’s low body temperature. The clover leaves on its body have slowly been freezing for generations.", region: "Forest"},

        {id: 80.5, name: "Sacred Predadventure", image: "../lostimages/S.Predadventure.png", typings: "Ice", paratypings: "", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
        description: "", region: "Forest"},

        {id: 81, name: "Perchancix", image: "../lostimages/Perchancey.png", typings: "Grass", paratypings: "Fire", category: "", artist: "Tal", credits: "Drawn-Tal+", 
        description: "After growing a twin, Perchancix's twin is completely incinerated by the fire.", region: "Forest"},

        {id: 81.5, name: "Sacred Perchancix", image: "../lostimages/S.Perchancey.png", typings: "Grass", paratypings: "Ice", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
        description: "", region: "Forest"},

        {id: 81.6, name: "Perchancix (Jake's Take)", image: "../lostimages/JT.Perchancey.png", description: "", typings: "Grass", paratypings: "Ice, Fire", category: "NCanon", artist: "Jake", credits: "Drawn-Jake+", 
        description: "", region: "Forest"},

        {id: 82, name: "Perchancealot", image: "../lostimages/Perchancealot.png", typings: "Fire", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
        description: "A noble knight of the order of the Charmey, Perchancalot overcame the fire of its childhood by adopting a symbiotic relationship with the mighty Exosteel. Perchancalot was deemed worthy and now wields the power of fire. It carries it’s dead twin around as a shield to protect it from harm.", region: "Forest"},

        {id: 82.5, name: "Sacred Perchancealot", image: "../lostimages/S.Perchancealot.png", typings: "Fire", paratypings: "", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
        description: "", region: "Forest"},

        {id: 83, name: "Possibilitor", image: "../lostimages/Possibilitor.png", typings: "Fire", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
        description: "Possibilitor emerges when Perchancix is completely consumed by fire. It is a powerful evil mage made up of thorny dead shrubbery and hatred. Possibilitor spent years searching the lands for spells to help it feel again. It discovered the ability to alter outcomes.", region: "Forest"},

        {id: 83.5, name: "Sacred Possibilitor", image: "../lostimages/S.Possibilitor.png", typings: "Fire", paratypings: "", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Soothspheer", image: "../lostimages/Soothspheer.png", typings: "Psychic", paratypings: "", category: "", artist: "Tal", credits: "Drawn-Tal+", 
        description: "", region: ""},

        {id: 1000, name: "Sacred Soothspheer", image: "../lostimages/S.Soothspheer.png", typings: "Psychic", paratypings: "", category: "Alt", artist: "Tal", credits: "Drawn-Tal+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Elixion", image: "../lostimages/Elixion.png", typings: "Normal, Water", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Elixion Taste Forme", image: "../lostimages/Taste.Elixion.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Elixion Touch Forme", image: "../lostimages/Touch.Elixion.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Elixion Smell Forme", image: "../lostimages/Smell.Elixion.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Elixion Sound Forme", image: "../lostimages/Sound.Elixion.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Elixion Sight Forme", image: "../lostimages/Sight.Elixion.png", typings: "Normal, Water", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Swamp"},

        {id: 1000, name: "Sapphae", image: "../lostimages/Sapphae.png", typings: "Steel, Fairy", paratypings: "", category: "", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Sacred Sapphae", image: "../lostimages/MissingNo.png", typings: "Steel, Fairy", paratypings: "", category: "Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Shiver Jaws", image: "../images/Shiver Jaws.png", typings: "Electric, Ground", paratypings: "Water", category: "Modernized", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+, Help-Ariel+", 
        description: "", region: "ShiverCo"},

        {id: 1000, name: "Shiver Jaws V2.0", image: "../lostimages/MissingNo.png", typings: "Electric, Ground", paratypings: "Water", category: "Modernized-Alt", artist: "", credits: "Idea-Shane+, Help-Ariel+", 
        description: "", region: "ShiverCo"},

        {id: 1000, name: "Shiver Vlogs", image: "../lostimages/MissingNo.png", typings: "Steel", paratypings: "Light", category: "", artist: "", credits: "Idea-Ariel+", 
        description: "", region: "Lake"},

        {id: 1000, name: "Shiver Vlogs V2.0", image: "../lostimages/MissingNo.png", typings: "Steel", paratypings: "Light", category: "Alt", artist: "", credits: "Idea-Ariel+", 
        description: "", region: "Lake"},

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

        {id: 1000, name: "Shiver Pests", image: "../lostimages/MissingNo.png", typings: "Steel", paratypings: "", category: "Modernized", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Desert"},

        {id: 1000, name: "Shiver Pests V2.0", image: "../lostimages/MissingNo.png", typings: "Steel", paratypings: "Psychic", category: "Modernized-HalloweenForme", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Spooky Factory"},
        
        {id: 1000, name: "Spongus", image: "../lostimages/Spongus.png", typings: "Grass, Poison", paratypings: "Psychic", category: "Modernized", artist: "Shane", credits: "Drawn, Idea-Shane+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Sacred Spongus", image: "../lostimages/MissingNo.png", typings: "Grass, Poison", paratypings: "Psychic", category: "Modernized-Alt", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Lemody", image: "../lostimages/MissingNo.png", typings: "Grass, Fairy", paratypings: "Psychic", category: "Paragon", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Forest"},

        {id: 1000, name: "Pydromaglar", image: "../images/Pydromaglar.png", typings: "Fire, Water", paratypings: "Electric, Light", category: "Paragon-Dop", artist: "Jake", credits: "Drawn-Jake+Idea-Shane+", 
        description: "", region: "Volcano"},

        {id: 1000, name: "Ace Pydromaglar (Fire)", image: "../lostimages/MissingNo.png", typings: "Fire", paratypings: "Water, Electric, Light", category: "Ace-Paragon-Dop", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Volcano"},

        {id: 1000, name: "Ace Pydromaglar (Electric)", image: "../lostimages/MissingNo.png", typings: "Electric", paratypings: "Fire, Water, Light", category: "Ace-Paragon-Dop", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Volcano"},

        {id: 1000, name: "Ace Pydromaglar (Light)", image: "../lostimages/MissingNo.png", typings: "Light", paratypings: "Fire, Water, Electric", category: "Ace-Paragon-Dop", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Volcano"},

        {id: 1000, name: "Ace Pydromaglar (Water)", image: "../lostimages/MissingNo.png", typings: "Water", paratypings: "Fire, Electric, Light", category: "Ace-Paragon-Dop", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Volcano"},
        
        {id: 1000, name: "Exosteel", image: "../lostimages/Exosteel.png", typings: "Steel", paratypings: "", category: "Paragon", artist: "Tal", credits: "Drawn-Tal+, Idea-Shane+Tal+", 
        description: "A sentient suit of armor that can only be worn by those who are worthy. This XXXXXX is often found in symbiosis with other XXXXX.", region: "Plains/Cave"},

        {id: 1000, name: "Cuddol", image: "../images/Cuddol.gif", typings: "Psychic, Dark", paratypings: "", category: "Paragon-Dop", artist: "", credits: "Idea-Shane+, Concept-Design-Shane+", 
        description: "", region: "Desert/SecretArea"},

        {id: 1000, name: "Dopplergrail", image: "../lostimages/Dopplergrail.png", typings: "Psychic, Dark", paratypings: "Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Bug, Rock, Ghost, Dragon, Steel, Fairy, Artillery", category: "Paragon-Ace-Dop", artist: "", credits: "Idea-Shane+, Concept-Design-Shane+", 
        description: "The Mastermind Behind All. His Legs Were Disconnected, So He Uses A Machine To Hold Himself Up, Created By ShiverCo.", region: "Desert/SecretArea"},

        {id: 1000, name: "Torterritory", image: "../lostimages/Torterritory.png", typings: "Ground", paratypings: "", category: "Paragon", artist: "Tal", credits: "Idea-Tal+", 
        description: "Torterritory is a colossal force to be reckoned with. It can only be caught using a very large Capture Capsule This Torterritories of Shivria carry an exact copy of Shivria on their back, only smaller. Legends say that the real Shivria is on a giant Torterritory, and that's why it moves.", region: "MountainRange"},

        {id: 1000, name: "Cosmicanine", image: "../lostimages/Cosmicanine.png", typings: "Dark, Light", paratypings: "Psychic", category: "Paragon", artist: "Tal", credits: "Artist+Idea-Tal+", 
        description: "", region: "MountainRange"},

        {id: 1500, name: "TwoMew.png.jpeg.gif.webp.jif", image: "../images/TwoMew.jpeg.png.gif.webp.jif.png", typings: "Lucid", paratypings: "", category: "Paragon", artist: "Shane", credits: "Drawn-Shane+", 
        description: "WALK INTO MY MYSTERY", region: "Swamp/Cafe"},

        {id: 1500.5, name: "TwoMew.png.jpeg.gif.webp.cs.html.css.js.raw.mp4.mp3.piskel.zip.jif", image: "../images/TwoMew.png.jpeg.gif.webp.cs.html.css.js.raw.mp4.mp3.piskel.zip.jif.png", typings: "Lucid", paratypings: "", category: "Paragon-Alt", artist: "Shane", credits: "Drawn-Shane+", 
        description: "WALK INTO MY MYSTERY", region: "Swamp/Cafe"},

        {id: -1.5, name: "Ariel Salama", image: "../images/China.png", typings: "Normal, Fire", paratypings: "", category: "", artist: "Shane", credits: "Drawn-Shane+, Credits-Ariel+", 
        description: "I fainted so really real picture", region: "Unobtainable"},

        {id: -1, name: "Cheetalon", image: "../lostimages/Cheetalon.png", typings: "Normal", paratypings: "", category: "Alt", artist: "Shane", credits: "Drawn-Shane+", 
        description: "YOU'RE TOO SLOW!", region: "Unobtainable"},

        {id: 1000, name: "Vigilith Revealed Forme", image: "../images/VigilithRF.png", typings: "Rock, Ghost", paratypings: "", category: "HalloweenForme", artist: "Jake", credits: "Drawn-Jake+, Idea-Shane+", 
        description: "", region: "Spooky Factory"},

        {id: 1000, name: "Agilith Revealed Forme", image: "../lostimages/MissingNo.png", typings: "Rock, Ghost", paratypings: "", category: "HalloweenForme", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Spooky Factory"},

        {id: 1000, name: "Signilith Revealed Forme", image: "../lostimages/MissingNo.png", typings: "Rock, Ghost", paratypings: "", category: "HalloweenForme", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Spooky Factory"},

        {id: -2.5, name: "Toumern", image: "../lostimages/MissingNo.png", typings: "Ground, Dark", paratypings: "Ghost", category: "Halloween", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Spooky Jungle"},

        {id: -2, name: "Sacred Toumern", image: "../lostimages/MissingNo.png", typings: "Ground, Dark", paratypings: "Ghost", category: "HalloweenForme", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Spooky Jungle"},

        {id: -3.5, name: "Shiver Slimes", image: "../lostimages/MissingNo.png", typings: "Poison, Normal", paratypings: "", category: "Halloween", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Spooky Factory"},

        {id: -3, name: "Shiver Slimes V2.0", image: "../lostimages/MissingNo.png", typings: "Poison, Normal", paratypings: "", category: "HalloweenForme", artist: "", credits: "Idea-Shane+", 
        description: "", region: "Spooky Factory"},

        {id: -4, name: "Pythog", image: "../lostimages/MissingNo.png", typings: "Electric", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
        description: "", region: "FrozenWasteland"},

        {id: -5, name: "Stimpale", image: "../lostimages/MissingNo.png", typings: "Ice, Ghost", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
        description: "", region: "FrozenWasteland"},

        {id: -6, name: "Jjinngore", image: "../lostimages/MissingNo.png", typings: "Fire, Ice", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
        description: "", region: "FrozenWasteland"},

        {id: -7, name: "Grimloin", image: "../lostimages/MissingNo.png", typings: "Fairy, Ice", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
        description: "", region: "FrozenWasteland"},

        {id: -8, name: "Londalot", image: "../lostimages/MissingNo.png", typings: "Steel, Ice", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
        description: "", region: "FrozenWasteland"},

        {id: -9, name: "Glutacious", image: "../lostimages/MissingNo.png", typings: "Normal, Ice", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
        description: "", region: "FrozenWasteland"},

        {id: -10, name: "Smellmer", image: "../lostimages/MissingNo.png", typings: "Fairy, Ghost", paratypings: "", category: "Frostbite", artist: "", credits: "Idea-Shane+", 
        description: "", region: "FrozenWasteland"},

        {id: -11.5, name: "Shiver Craze", image: "../lostimages/MissingNo.png", typings: "Psychic", paratypings: "", category: "ModernizedSolstice", artist: "", credits: "Idea-Shane+", 
        description: "", region: "FrozenWasteland"},

        {id: -11, name: "Shiver Craze V2.0", image: "../lostimages/MissingNo.png", typings: "Psychic", paratypings: "", category: "Modernized-SolsticeOther", artist: "", credits: "Idea-Shane+", 
        description: "", region: "FrozenWasteland"},
    ];
    function displayShiverican() {
        const catalog = document.getElementById("catalog");
        catalog.innerHTML = ""; 
        shivericanList.sort((a, b) => a.id - b.id);
        shivericanList.forEach(shiverican => {
            const card = document.createElement("div");
            card.className = "shiverican-card";
            card.setAttribute("data-id", shiverican.id);
            card.innerHTML = `
                <img src="${shiverican.image}" alt="${shiverican.name}">
                <h3>${shiverican.name}</h3>                `;
            card.onclick = () => {
                const index = shivericanList.findIndex(s => s.id === shiverican.id);
                showDetails(shiverican, index);
            };
            catalog.appendChild(card);
        });
    }

function isCardVisible(category, name, id, image, credits, artist, typings, paratypings, region) {
    const lowerImage = image ? image.toLowerCase() : "";
    const lostimages = lowerImage.includes("lostimage");
    const normimages = !lostimages;
    const conceptedimages = lowerImage.includes("missingno") && lostimages;
    const unconceptedimages = !lowerImage.includes("missingno") && lostimages;

    const isAlt = category.includes("alt");
    const isAce = category.includes("ace");
    const isNCanon = category.includes("ncanon");

    const isHalloween = category.includes("halloween");
    const isFrostbite = category.includes("frostbite");
    const isSolstice = category.includes("solstice");

    const noHalloween = !isHalloween;
    const noFrostbite = !isFrostbite;
    const noSolstice = !isSolstice;
    const noHoly = noHalloween && noFrostbite && noSolstice;

    const isMatch = name.includes(lastQuery) || id==(lastQuery) || credits==(lastQuery) ||
    artist==(lastQuery) || typings==(lastQuery) ||
    paratypings==(lastQuery) || region==(lastQuery);

    const filtersActive = Made || Concepted || Unconcepted || UnMade || Alt || Ace || NCanon;
    const searchActive = lastQuery && lastQuery.trim() !== "";

    let passesFilter = false;

    if (Made && normimages) passesFilter = true;
    if (Concepted && conceptedimages) passesFilter = true;
    if (Unconcepted && unconceptedimages) passesFilter = true;
    if (UnMade && lostimages) passesFilter = true;

    if (Alt && isAlt) passesFilter = true;
    if (Ace && isAce) passesFilter = true;
    if (NCanon && isNCanon) passesFilter = true;

    if (searchActive && filtersActive) {
        return isMatch && passesFilter;
    } else if (searchActive) {
        return isMatch;
    } else if (filtersActive) {
        return passesFilter;
    } else {
        return !filtersActive && noHoly && !isAlt && !isAce && !isNCanon;
    }
}



function addVisCard() {
    while (currentShiverianIndex < shivericanList.length - 1) {
        currentShiverianIndex++;
        const shiverican = shivericanList[currentShiverianIndex];
        const category = shiverican.category ? shiverican.category.toLowerCase() : "";
        const name = shiverican.name.toLowerCase();
        const id = Math.floor(shiverican.id).toString();
        const image = shiverican.image ? shiverican.image.toLowerCase() : "";
        const credits = shiverican.credits ? shiverican.credits.toLowerCase() : "";
        const artist = shiverican.artist ? shiverican.artist.toLowerCase() : "";
        const typings = shiverican.typings ? shiverican.typings.toLowerCase() : "";
        const paratypings = shiverican.paratypings ? shiverican.paratypings.toLowerCase() : "";
        const region = shiverican.region ? shiverican.region.toLowerCase() : "";
        if (isCardVisible(category, name, id, image, credits, artist, typings, paratypings, region)) {            
            showDetails(shiverican, currentShiverianIndex);
            console.log(currentShiverianIndex);
            break;
        }
    }
}

function minusVisCard() {
    while (currentShiverianIndex > 0) {
        currentShiverianIndex--;
        const shiverican = shivericanList[currentShiverianIndex];
        const category = shiverican.category ? shiverican.category.toLowerCase() : "";
        const name = shiverican.name.toLowerCase();
        const id = Math.floor(shiverican.id).toString();
        const image = shiverican.image ? shiverican.image.toLowerCase() : "";
        const credits = shiverican.credits ? shiverican.credits.toLowerCase() : "";
        const artist = shiverican.artist ? shiverican.artist.toLowerCase() : "";
        const typings = shiverican.typings ? shiverican.typings.toLowerCase() : "";
        const paratypings = shiverican.paratypings ? shiverican.paratypings.toLowerCase() : "";
        const region = shiverican.region ? shiverican.region.toLowerCase() : "";
        if (isCardVisible(category, name, id, image, credits, artist, typings, paratypings, region)) {            
            showDetails(shiverican, currentShiverianIndex);
            console.log(currentShiverianIndex);
            break;
        }
    }
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
        const id = Math.floor(shiverican.id).toString();
        const image = shiverican.image ? shiverican.image.toLowerCase() : "";
        const category = shiverican.category ? shiverican.category.toLowerCase() : "";
        const credits = shiverican.credits ? shiverican.credits.toLowerCase() : "";
        const artist = shiverican.artist ? shiverican.artist.toLowerCase() : "";
        const typings = shiverican.typings ? shiverican.typings.toLowerCase() : "";
        const paratypings = shiverican.paratypings ? shiverican.paratypings.toLowerCase() : "";
        const region = shiverican.region ? shiverican.region.toLowerCase() : "";
        const isMatch = (name.includes(lastQuery) || lastQuery === id) && (!category.includes("ace") || Ace) && (!category.includes("ncanon") || Ace) && !category.includes("halloween") && !category.includes("frostbite") && (!category.includes("alt") || Alt) && !category.includes("solstice");
        const isAltMatch = (name.includes(lastQuery) || lastQuery === id) && (category.includes("alt"));
        const isAceMatch = (name.includes(lastQuery) || lastQuery === id) && (category.includes("ace"));
        const isNCanonMatch = (name.includes(lastQuery) || lastQuery === id) && (category.includes("ncanon"));

        const isDoppler = category.includes("dop") && !(category.includes("alt") || category.includes("forme") || category.includes("solstice")) && !category.includes("ace");
        const isDopplerAlt = category.includes("dop") && (category.includes("alt") || category.includes("forme") || category.includes("solstice")); 
        const isDopplerAce = category.includes("dop") && category.includes("ace"); 

        const isTalHelp = credits.includes("tal+") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isTaltHelp = credits.includes("tal+") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isJakeHelp = credits.includes("jake+") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isJaltHelp = credits.includes("jake+") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isShaneHelp = credits.includes("shane+") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isShaltHelp = credits.includes("shane+") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isArielHelp = credits.includes("ariel+") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isArialtHelp = credits.includes("ariel+") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isIvriHelp = credits.includes("ivri+") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isIvraltHelp = credits.includes("ivri+") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isAmoHelp = credits.includes("amo+") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
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
        
        const isTals = artist.includes("tal") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isJakes = artist.includes("jake")& (category == ("")  || category == ("paragon") || category == ("modernized"));
        const isShanes =  artist.includes("shane")& (category == ("")  || category == ("paragon") || category == ("modernized"));
        const isAriels =  artist.includes("ariel")& (category == ("")  || category == ("paragon") || category == ("modernized"));
        const isIvris =  artist.includes("ivri")& (category == ("")  || category == ("paragon") || category == ("modernized"));
        const isAmos =  artist.includes("amo")& (category == ("")  || category == ("paragon") || category == ("modernized"));
        
        const isTalts = artist.includes("tal") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isJalts =  artist.includes("jake") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isShalts =  artist.includes("shane")  && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isArialts =  artist.includes("ariel")  && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isIvralts = artist.includes("ivri") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isAmalts =  artist.includes("amo") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));

        const isFire = typings.includes("fire") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isWater = typings.includes("water") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isGrass = typings.includes("grass") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isElectric = typings.includes("electric") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isIce = typings.includes("ice") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isFighting = typings.includes("fighting") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isPoison = typings.includes("poison") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isGround = typings.includes("ground") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isFlying = typings.includes("flying") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isPsychic = typings.includes("psychic") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isBug = typings.includes("bug") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isRock = typings.includes("rock") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isGhost = typings.includes("ghost") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isDragon = typings.includes("dragon") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isDark = typings.includes("dark") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isSteel = typings.includes("steel") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isFairy = typings.includes("fairy") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isNormal = typings.includes("normal") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isLight = typings.includes("light") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isArtillery = typings.includes("artillery") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isLucid = typings.includes("lucid") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));


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
        const isArtilleryAlt = typings.includes("artillery") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isLucidAlt = typings.includes("lucid") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));

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
        const isArtilleryAce = typings.includes("artillery") && category.includes("ace");
        const isLucidAce = typings.includes("lucid") && category.includes("ace");

        const isParaFire = paratypings.includes("fire") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaWater = paratypings.includes("water") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaGrass = paratypings.includes("grass") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaElectric = paratypings.includes("electric") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaIce = paratypings.includes("ice") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaFighting = paratypings.includes("fighting") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaPoison = paratypings.includes("poison") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaGround = paratypings.includes("ground") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaFlying = paratypings.includes("flying") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaPsychic = paratypings.includes("psychic") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaBug = paratypings.includes("bug") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaRock = paratypings.includes("rock") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaGhost = paratypings.includes("ghost") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaDragon = paratypings.includes("dragon") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaDark = paratypings.includes("dark") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaSteel = paratypings.includes("steel") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaFairy = paratypings.includes("fairy") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaNormal = paratypings.includes("normal") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaLight = paratypings.includes("light") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaArtillery = paratypings.includes("artillery") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isParaLucid = paratypings.includes("lucid") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));

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
        const isParaArtilleryAlt = paratypings.includes("artillery") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParaLucidAlt = paratypings.includes("lucid") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));

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
        const isParaArtilleryAce = paratypings.includes("artillery") && category.includes("ace");
        const isParaLucidAce = paratypings.includes("lucid") && category.includes("ace");

        const isPlains = region.includes("plains") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isOcean = region.includes("ocean") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isCruise = region.includes("cruise") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isLake = region.includes("lake") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isForest = region.includes("forest") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isDesert = region.includes("desert") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isVolcano = region.includes("volcano") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isSwamp = region.includes("swamp") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isIceCaps = region.includes("icecaps") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isMountainRange = region.includes("mountainrange") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isCave = region.includes("cave") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isSecretArea = region.includes("secretarea") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isCafe = region.includes("cafe") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isSpookyFactory = region.includes("spookyfactory") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isSpookyJungle = region.includes("spookyjungle") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isFrozenWasteland = region.includes("frozenwasteland") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));
        const isUnobtainable = region.includes("unobtainable") && (category == ("")  || category == ("paragon") || category == ("modernized") || category==("halloween") || category==("frostbite") || category==("solstice"));

        const isPlainsAlt = region.includes("plains") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isOceanAlt = region.includes("ocean") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isCruiseAlt = region.includes("cruise") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isLakeAlt = region.includes("lake") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isForestAlt = region.includes("forest") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isDesertAlt = region.includes("desert") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isVolcanoAlt = region.includes("volcano") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
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

        const lostimages = image.includes("lostimage");
        const normimages = !image.includes("lostimage");
        const conceptedimages = image.includes("missingno") && image.includes("lostimage");
        const unconceptedimages = !image.includes("missingno") && image.includes("lostimage");

        const isParagonMatch = category.includes("paragon") && !category.includes("-");
        const isParagonAltMatch = category.includes("paragon-") && (category.includes("alt") || category.includes("forme") || category.includes("solstice"));
        const isParagonAceMatch = category.includes("paragon-") && category.includes("ace");
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

        if (lastQuery == "doors") {
            window.location.href = "../DoorsCatalog/doorscatalog.html";
        }
        if (lastQuery == "characters") {
            window.location.href = "../Characters/characterscatalog.html";
        }
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
        else if (lastQuery.includes("dop")) {
            if (Alt) {
                card.style.display = isDopplerAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isDopplerAce ? "block" : "none";
            } 
            else {
                card.style.display = isDoppler ? "block" : "none";
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
        else if (lastQuery === "artillery") {
            if (Alt) {
                card.style.display = isArtilleryAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isArtilleryAce ? "block" : "none";
            } 
            else {
                card.style.display = isArtillery ? "block" : "none";
            }
        }
        else if (lastQuery === "lucid") {
            if (Alt) {
                card.style.display = isLucidAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isLucidAce ? "block" : "none";
            } 
            else {
                card.style.display = isLucid ? "block" : "none";
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
        else if (lastQuery === "lucid+") {
            if (Alt) {
                card.style.display = isParaLucidAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaLucidAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaLucid ? "block" : "none";
            }
        }
        else if (lastQuery === "artillery+") {
            if (Alt) {
                card.style.display = isParaArtilleryAlt ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParaArtilleryAce ? "block" : "none";
            } 
            else {
                card.style.display = isParaArtillery ? "block" : "none";
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
        else if (lastQuery === "Lake") {
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
        else if (lastQuery === "paragon") {
            if (Alt) {
                card.style.display = isParagonAltMatch ? "block" : "none";
            } 
            else if (Ace) {
                card.style.display = isParagonAceMatch ? "block" : "none";
            } 
            else {
                card.style.display = isParagonMatch ? "block" : "none";
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
        if (Made) {
            card.style.display = normimages ? "block" : "none";
        }
        else if (UnMade) {
            card.style.display = lostimages ? "block" : "none";
        }
        else if (Concepted){
            card.style.display = conceptedimages ? "block" : "none";
        }
        else if (Unconcepted){
            card.style.display = unconceptedimages ? "block" : "none";        
        }
    });
}
function showDetails(shiverican, index = null) {
    if (index !== null) {
        currentShiverianIndex = index;
    }
    currentShiverianIndex = shivericanList.findIndex(s => s.id === shiverican.id);
    console.log(currentShiverianIndex);
    document.getElementById("catalog").style.display = "none";
    document.getElementById("shiverican-details").style.display = "block";
    document.getElementById("search").style.display = "none"; 
    document.getElementById("search").style.display = "none"; 
    document.querySelector("button").style.display = "none";
    document.getElementById("nav-buttons").style.display = "none";
    document.getElementById("alt-buttons-container").style.display = "none";
    document.getElementById("shiverican-name").innerText = shiverican.name;
    let imageElement = document.getElementById("shiverican-image");
    
    imageElement.onload = () => {
        if (shiverican.name === "Ariel Salama") {
            imageElement.style.width = (imageElement.naturalWidth / 12) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 12) + "px";
        }  
        else if (shiverican.name === "Oriel Slimei") {
            imageElement.style.width = (imageElement.naturalWidth / 12) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 12) + "px";
        }  
        else if (shiverican.name === "TwoMew.jpeg.png.gif.webp.jif") {
            imageElement.style.width = (imageElement.naturalWidth / 2) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 2) + "px";
        }
        else if (shiverican.name === "Skip") {
            imageElement.style.width = (imageElement.naturalWidth / 1.1) + "px";
            imageElement.style.height = (imageElement.naturalWidth / 1.2) + "px";
        }
        else if (shiverican.name === "Capture Capsule") {
            imageElement.style.width = (imageElement.naturalWidth * 4) + "px";
            imageElement.style.height = (imageElement.naturalHeight * 4) + "px";
        }
        else if (shiverican.name === "Juvie Capture Capsule") {
            imageElement.style.width = (imageElement.naturalWidth / 0.9) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 0.9) + "px";
        }
        else if (shiverican.name === "Cheetalon") {
            imageElement.style.width = (imageElement.naturalWidth / 4) + "px";
            imageElement.style.height = (imageElement.naturalHeight / 4) + "px";
        }
        else {
            imageElement.style.width = (imageElement.naturalWidth * 3) + "px";
            imageElement.style.height = (imageElement.naturalHeight * 3) + "px";
        }
    };
    
    imageElement.src = shiverican.image;
    if (shiverican.name === "Ariel Salama") {
        imageElement.style.width = (imageElement.naturalWidth / 12) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 12) + "px";
    }  
    else if (shiverican.name === "TwoMew.jpeg.png.gif.webp.jif") {
        imageElement.style.width = (imageElement.naturalWidth / 2) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 2) + "px";
    }
    else if (shiverican.name === "Cartilicht" || "Sapphae" || "Mayfly" || "A.Meepu" || "Volcannon" || "Agilith" || "Shadasnow" || "Cordal" || "Alliminiyum" || "Krasbopper" || "Fortilith" || "Lurkest" || "Twynami" || "Confished" || "Smell.Elixion" || "Sound.Elixion" || "Taste.Elixion" || "Irecencaat" || "Ballijawlent" || "Meepu" || "Sight.Elixion") {
        imageElement.style.width = "600px";
        imageElement.style.height = "600px";
    }  
    else if (shiverican.name === "Capture Capsule") {
        imageElement.style.width = (imageElement.naturalWidth * 4) + "px";
        imageElement.style.height = (imageElement.naturalHeight * 4) + "px";
    }
    else if (shiverican.name === "Juvie Capture Capsule") {
        imageElement.style.width = (imageElement.naturalWidth / 0.9) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 0.9) + "px";
    }
    else if (shiverican.name === "Cheetalon") {
        imageElement.style.width = (imageElement.naturalWidth / 4) + "px";
        imageElement.style.height = (imageElement.naturalHeight / 4) + "px";
    }
    else {
        imageElement.style.width = (imageElement.naturalWidth * 4) + "px";
        imageElement.style.height = (imageElement.naturalHeight * 4) + "px";
    }
    document.getElementById("shiverican-description").innerText = shiverican.description;
    document.body.style.backgroundColor = "gray";
}

function closeDetails() {
    document.getElementById("catalog").style.display = "flex";
    document.getElementById("shiverican-details").style.display = "none";
    document.getElementById("nav-buttons").style.display = "block";
    document.getElementById("alt-buttons-container").style.display = "block";
    let searchBar = document.getElementById("search");
    let altButton = document.querySelector("button");
    searchBar.style.display = "block";
    searchBar.style.margin = "0 auto";
    searchBar.style.textAlign = "center";
    altButton.style.display = "block"; 
    altButton.style.margin = "0 auto";
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
    displayShiverican();
// Ariel Salama was also here
