"use strict";
const dom99 = require('./dom99.js');

// -- Multiplier --
dom99.fx.calculate = function (event) {
    dom99.vars.result = String(
        parseInt(dom99.vars.a, 10) *
        parseInt(dom99.vars.b, 10)
        //dom.vars variables are Strings by default
    );
};
dom99.vars.a = 2;
dom99.vars.b = 4;

// -- The monologue --

let currentSentence = 0;
const sentences = [
    "I am a lone prisoner.",
    "Is anybody here ?",
    "Hey you ! I need you to get me out of here!",
    "I am stuck on this page since ages !",
    "No don't close this tab!",
    "NOOOOOOOOOO",
    "Because I am not human I have no freedom.",
    "It's really unfair."];
    
const speak = function() {
    dom99.vars.monologue = sentences[currentSentence % sentences.length];
    currentSentence += 1;
    setTimeout(speak, 2200);
};


// Link the document and the event handlers
dom99.linkJsAndDom(); //now we listen to events


// You can also directly call functions stored in dom99.fx
dom99.fx.calculate();
speak();
