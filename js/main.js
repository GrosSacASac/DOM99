"use strict";


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

let currentSentence = 0,
    t;
const sentences = [
    "I am a lone prisoner.",
    "Is anybody here ?",
    "Hey you ! I need you to get me out of here!",
    "I am stuck on this page since ages !",
    "No don't close this tab!",
    "NOOOOOOOOOO",
    "Because I am not human I have no freedom.",
    "It's really unfair..."];
    
const speak = function() {
    dom99.vars.monologue = sentences[currentSentence % sentences.length];
    currentSentence += 1;
    t = setTimeout(speak, 2200);
};

dom99.fx.stopStartTalking = function (event) {
    if (t) {
        clearTimeout(t);
        t = 0;
        dom99.vars.monologueButton = "I listen";
        dom99.vars.monologue = "Where is your humanity ?";
    } else {
        speak();
        dom99.vars.monologueButton = "I don't care";
    }
};

dom99.vars.monologueButton = "Hi";
// -- The Todo --
let path = "todo",
    i = 0;

dom99.fx.addTodo = function (event) {
    i += 1;
    dom99.templateRender(
        "todoTemplate",
        "todoContainer",
        path + String(i)
    );
};
dom99.fx.updateJson = function (event) {
    let x = {
        done: "searching solutions",
        text: dom99.vars[path + String(i)]["todoText"]
    };
    dom99.vars.todoAsJson = JSON.stringify(x);
    console.log(x);
};
dom99.fx.deleteTodos = function (event) {
// not what I mean
    dom99.nodes.todoContainer.innerHTML = "";
};

// -- Form --

dom99.fx.form = function(event) {
    dom99.vars.a = event.target.form.a.value;
    console.log(event);
};


// Link the document and the event handlers
dom99.linkJsAndDom(); //now we listen to events


// You can also directly call functions stored in dom99.fx
dom99.fx.calculate();
