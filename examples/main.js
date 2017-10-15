// Import
import d from "../built/dom99Module.js";

// -- Hello World --

d.feed({
  first: "Hello",
  last: "World"
});

d.linkJsAndDom();
// -- Multiplier --

d.vr.a = 7;
d.vr.b = 6;
d.fx.calculate = function (event) {
    //dom.vars variables are Strings by default
    d.vr.result = parseInt(d.vr.a, 10) * parseInt(d.vr.b, 10);
};

// -- The monologue --

let currentSentence = 0,
    t;
const sentences = ["I am a lone prisoner.",    "Is anybody here ?",    "Hey you ! I need you to get me out of here!",    "I am stuck on this page since ages !",    "No don't close this tab!",    "NOOOOOOOOOO",    "Because I am not human I have no freedom.",    "It's really unfair..."
];
    
const speak = function() {
    d.vr.monologue = sentences[currentSentence % sentences.length];
    currentSentence += 1;
    t = setTimeout(speak, 2200);
};

d.fx.stopStartTalking = function (event) {
    if (t) {
        clearTimeout(t);
        t = 0;
        d.vr.monologueButton = "I listen";
        d.vr.monologue = "Where is your humanity ?";
    } else {
        speak();
        d.vr.monologueButton = "I don't care";
    }
};

d.vr.monologueButton = "Hi";


// -- The Todo --

let componentName = "todo";
let i = 0;
let toDoKeys = [];
let element = "element";



d.fx.updateJson = function (event) {
    let dataObject = toDoKeys.map(function(toDoKey) {
        return {
            text: d.vr[toDoKey]["text"],
            done: d.vr[toDoKey]["done"]
        };
    });
    d.vr.todoAsJson = JSON.stringify(dataObject);
};

d.fx.addTodo = function (event) {
    let toDoKey = componentName + String(i);

    toDoKeys.push(toDoKey);

    // 1 create HTML ELement
    const customElement = d.createElement2({
        "tagName": "li",
        "is": "d-todo",
        "data-inside": toDoKey,
        "data-element": element + toDoKey
    });


    // 3 link it
    d.linkJsAndDom(customElement);
    
    // 2 populate data
    d.vr[toDoKey]["done"] = false;
    d.vr[toDoKey]["text"] = "";
    
    // 4 insert the Element in the DOM
    d.el["todoContainer"].appendChild(customElement);
    
    i += 1;
    d.fx.updateJson();
};


d.fx.deleteTodos = function (event) {
    //delete done todos only !
    let newtoDoKeys = [];
    toDoKeys.filter(function(toDoKey) {
        if (d.vr[toDoKey]["done"]) {
            return true;
        }
        newtoDoKeys.push(toDoKey);
        return false;
    }).forEach(function(toDoKey) {
        d.el[element + toDoKey].remove();
        d.forgetKey(toDoKey);
    });
    toDoKeys = newtoDoKeys; //keep toDoKeys up to date
    d.fx.updateJson();
};
d.fx.updateJson();
// -- next --




// Link the document and the event handlers
 //now we listen to all events


// You can also directly call functions stored in d.fx if they don't depend on event 
d.fx.calculate();
