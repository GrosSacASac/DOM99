"use strict";
//Use a shorter name
const D = dom99;
// -- Hello World --
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
D.vr.first = "Mr";
D.vr.last = "World";

// -- Multiplier --

D.vr.a = 7;
D.vr.b = 6;
D.fx.calculate = function (event) {
    //dom.vars variables are Strings by default
    D.vr.result = parseInt(D.vr.a, 10) * parseInt(D.vr.b, 10);
};

// -- The monologue --

let currentSentence = 0,
    t;
const sentences = ["I am a lone prisoner.",    "Is anybody here ?",    "Hey you ! I need you to get me out of here!",    "I am stuck on this page since ages !",    "No don't close this tab!",    "NOOOOOOOOOO",    "Because I am not human I have no freedom.",    "It's really unfair..."
];
    
const speak = function() {
    D.vr.monologue = sentences[currentSentence % sentences.length];
    currentSentence += 1;
    t = setTimeout(speak, 2200);
};

D.fx.stopStartTalking = function (event) {
    if (t) {
        clearTimeout(t);
        t = 0;
        D.vr.monologueButton = "I listen";
        D.vr.monologue = "Where is your humanity ?";
    } else {
        speak();
        D.vr.monologueButton = "I don't care";
    }
};

D.vr.monologueButton = "Hi";


// -- The Todo --

let componentName = "todo";
let i = 0;
let toDoKeys = [];
let element = "element";



D.fx.updateJson = function (event) {
    let dataObject = toDoKeys.map(function(toDoKey) {
        return {
            text: D.vr[toDoKey]["text"],
            done: D.vr[toDoKey]["done"]
        };
    });
    D.vr.todoAsJson = JSON.stringify(dataObject);
};

D.fx.addTodo = function (event) {
    let toDoKey = componentName + String(i);

    toDoKeys.push(toDoKey);

    // 1 create HTML ELement
    const customElement = D.createElement2({
        "tagName": "li",
        "is": "d-todo",
        "data-inside": toDoKey,
        "data-element": element + toDoKey
    });


    // 3 link it
    D.linkJsAndDom(customElement);
    
    // 2 populate data
    D.vr[toDoKey]["done"] = false;
    D.vr[toDoKey]["text"] = "";
    
    // 4 insert the Element in the DOM
    D.el["todoContainer"].appendChild(customElement);
    
    i += 1;
    D.fx.updateJson();
};


D.fx.deleteTodos = function (event) {
    //delete done todos only !
    let newtoDoKeys = [];
    toDoKeys.filter(function(toDoKey) {
        if (D.vr[toDoKey]["done"]) {
            return true;
        }
        newtoDoKeys.push(toDoKey);
        return false;
    }).forEach(function(toDoKey) {
        D.el[element + toDoKey].remove();
        D.forgetKey(toDoKey);
    });
    toDoKeys = newtoDoKeys; //keep toDoKeys up to date
    D.fx.updateJson();
};
D.fx.updateJson();
// -- next --




// Link the document and the event handlers
D.linkJsAndDom(); //now we listen to all events


// You can also directly call functions stored in D.fx if they don't depend on event 
D.fx.calculate();
