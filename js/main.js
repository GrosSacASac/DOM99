"use strict";
// -- Hello World --

dom99.fx.sayHi = function (event) {
    dom99.vr.completeName = `${dom99.vr.firstName} ${dom99.vr.lastName}`;
};

dom99.vr.firstName = "Mr";
dom99.vr.lastName = "World";

// -- Multiplier --

dom99.fx.calculate = function (event) {
    //dom.vars variables are Strings by default
    dom99.vr.result = parseInt(dom99.vr.a, 10) * parseInt(dom99.vr.b, 10);
};
dom99.vr.a = 2;
dom99.vr.b = 4;

// -- The monologue --

let currentSentence = 0,
    t;
const sentences = ["I am a lone prisoner.",    "Is anybody here ?",    "Hey you ! I need you to get me out of here!",    "I am stuck on this page since ages !",    "No don't close this tab!",    "NOOOOOOOOOO",    "Because I am not human I have no freedom.",    "It's really unfair..."
];
    
const speak = function() {
    dom99.vr.monologue = sentences[currentSentence % sentences.length];
    currentSentence += 1;
    t = setTimeout(speak, 2200);
};

dom99.fx.stopStartTalking = function (event) {
    if (t) {
        clearTimeout(t);
        t = 0;
        dom99.vr.monologueButton = "I listen";
        dom99.vr.monologue = "Where is your humanity ?";
    } else {
        speak();
        dom99.vr.monologueButton = "I don't care";
    }
};

dom99.vr.monologueButton = "Hi";


// -- The Todo --

let path = "todo",
    i = 0,
    todoScopeNames = [];

const boolz = {"false": false, "true": true};
/* we use boolz to convert string boolean into real boolean
values returned from dom99.vr are strings*/
dom99.fx.addTodo = function (event) {
    let todoScopeName = path + String(i),
        clone;
    todoScopeNames.push(todoScopeName);
    clone = dom99.templateRender(
        "todoTemplate",
        todoScopeName
    );
    dom99.vr[todoScopeName]["done"] = false;
    dom99.vr[todoScopeName]["text"] = "";
    dom99.el["todoContainer"].appendChild(clone);
    i += 1;
};

dom99.fx.updateJson = function (event) {
    
    let x = todoScopeNames.map(function(todoScopeName) {
        return {text: dom99.vr[todoScopeName]["text"],
                done: boolz[dom99.vr[todoScopeName]["done"]]};
    });
    dom99.vr.todoAsJson = JSON.stringify(x);
};

dom99.fx.deleteTodos = function (event) {
    //delete done todos only !
    let newTodoScopeNames = [];
    todoScopeNames.filter(function(todoScopeName) {
        if (boolz[dom99.vr[todoScopeName]["done"]]) {
            return true;
        }
        newTodoScopeNames.push(todoScopeName);
        return false;
    }).forEach(function(todoScopeName) {
        dom99.el[todoScopeName].todo.remove();
        dom99.forgetScope(todoScopeName);
    });
    todoScopeNames = newTodoScopeNames; //keep todoScopeNames up to date
};

// -- next --




// Link the document and the event handlers
dom99.linkJsAndDom(); //now we listen to all events


// You can also directly call functions stored in dom99.fx
dom99.fx.calculate();
dom99.fx.sayHi();
