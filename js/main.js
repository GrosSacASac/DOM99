"use strict";
// -- Hello World --

dom99.fx.sayHi = function (event) {
    dom99.vars.completeName = `${dom99.vars.firstName} ${dom99.vars.lastName}`;
};

dom99.vars.firstName = "Mr";
dom99.vars.lastName = "World";

// -- Multiplier --

dom99.fx.calculate = function (event) {
    //dom.vars variables are Strings by default
    dom99.vars.result = parseInt(dom99.vars.a, 10) * parseInt(dom99.vars.b, 10);
};
dom99.vars.a = 2;
dom99.vars.b = 4;

// -- The monologue --

let currentSentence = 0,
    t;
const sentences = ["I am a lone prisoner.",    "Is anybody here ?",    "Hey you ! I need you to get me out of here!",    "I am stuck on this page since ages !",    "No don't close this tab!",    "NOOOOOOOOOO",    "Because I am not human I have no freedom.",    "It's really unfair..."
];
    
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
    i = 0,
    todoScopeNames = [];

const boolz = {"false": false, "true": true};

dom99.fx.addTodo = function (event) {
    let todoScopeName = path + String(i);
    todoScopeNames.push(todoScopeName);
    dom99.templateRender(
        "todoTemplate",
        "todoContainer",
        todoScopeName
    );
    i += 1;
    dom99.vars[todoScopeName]["done"] = false;
    dom99.vars[todoScopeName]["text"] = "";
};

dom99.fx.updateJson = function (event) {
    
    let x = todoScopeNames.map(function(todoScopeName) {
        return {text: dom99.vars[todoScopeName]["text"],
                done: dom99.vars[todoScopeName]["done"]};
    });
    dom99.vars.todoAsJson = JSON.stringify(x);
};

dom99.fx.deleteTodos = function (event) {
    //delete done todos only !
    let newTodoScopeNames = [];
    todoScopeNames.filter(function(todoScopeName) {
        if (boolz[dom99.vars[todoScopeName]["done"]]) {
            return true;
        }
        newTodoScopeNames.push(todoScopeName);
        return false;
    }).forEach(function(todoScopeName) {
        dom99.nodes[todoScopeName].firstElementChild.remove();
        dom99.forgetNode(todoScopeName);
    });
    todoScopeNames = newTodoScopeNames; //keep todoScopeNames up to date
};

// -- next --




// Link the document and the event handlers
dom99.linkJsAndDom(); //now we listen to events


// You can also directly call functions stored in dom99.fx
dom99.fx.calculate();
dom99.fx.sayHi();
