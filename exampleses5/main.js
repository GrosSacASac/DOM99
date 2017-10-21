"use strict";

var _dom99Module = require("../built/dom99Module.js");

var _dom99Module2 = _interopRequireDefault(_dom99Module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -- Hello World --

_dom99Module2.default.feed({
    first: "Hello",
    last: "World"
});

// -- Multiplier --

// Import
_dom99Module2.default.feed({
    a: "7",
    b: "6"
});

_dom99Module2.default.functions.calculate = function (event) {
    var _d$variables = _dom99Module2.default.variables,
        a = _d$variables.a,
        b = _d$variables.b;

    if (isFinite(a) && isFinite(b)) {
        _dom99Module2.default.feed({
            result: a * b
        });
    } else {
        _dom99Module2.default.feed({
            result: "Please enter finite numbers"
        });
    }
};

// You can also directly call functions stored in d.functions if they don't depend on event 
_dom99Module2.default.functions.calculate();

// -- The monologue --

var currentSentence = 0;
var timeOutId = void 0;
var sentences = ["I am a lone prisoner.", "Is anybody here ?", "Hey you ! I need you to get me out of here!", "I am stuck on this page since ages !", "No don't close this tab!", "NOOOOOOOOOO", "Because I am not human I have no freedom.", "It's really unfair..."];

var speak = function speak() {
    _dom99Module2.default.feed(sentences[currentSentence], "monologue");
    /* same as 
     d.feed({
        monologue: sentences[currentSentence]
    });
    */
    currentSentence = (currentSentence + 1) % sentences.length;
    timeOutId = setTimeout(speak, 2200);
};

_dom99Module2.default.functions.stopStartTalking = function (event) {
    if (timeOutId) {
        clearTimeout(timeOutId);
        timeOutId = undefined;
        _dom99Module2.default.feed("I listen", "monologueButton");
        _dom99Module2.default.feed("Where is your humanity ?", "monologue");
    } else {
        speak();
        _dom99Module2.default.feed("I don't care", "monologueButton");
    }
};

//d.feed("Hi", "monologueButton");
// not required because it is already in the HTML


// -- The Todo --

var data = [{ done: true, text: "Make DOM99 demo" }, { done: false, text: "Drink Water" }];

var updateJsonView = function updateJsonView() {
    var asJSON = JSON.stringify(data, null, "  "); // indent JSON with 2 spaces
    _dom99Module2.default.feed(asJSON, "todoAsJson"); // and display it in a <pre>
};

_dom99Module2.default.functions.updateToDo = function (event) {
    // updates data whenever a sub widget changes in the dom
    // this seems complicated but should be rare use case
    // this makes 2 dimensional structure (array * object)
    // two-way binded 
    var context = _dom99Module2.default.contextFromEvent(event);
    // this is the index of the edited item in the array
    var index = Number(context.slice(-1)); // slice -1 takes the last character
    // property is what changed inside the object
    var property = void 0;
    if (event.target.type === "checkbox") {
        property = "done";
    } else /*if (event.target.type === "text") */{
            property = "text";
        }

    //reconstruct the entire path 
    var path = _dom99Module2.default.contextFromArray([context, property]);
    var value = _dom99Module2.default.variables[path];

    // reflect the change in the data
    data[index][property] = value;

    updateJsonView();
};

_dom99Module2.default.functions.addToDo = function (event) {
    data.push({
        done: false,
        text: ""
    });

    _dom99Module2.default.feed(data, "allToDos");
    updateJsonView();
};

_dom99Module2.default.functions.deleteToDos = function (event) {
    //delete done todos only !
    data = data.filter(function (toDoItem) {
        return !toDoItem.done;
    });

    _dom99Module2.default.feed(data, "allToDos");
    updateJsonView();
};

_dom99Module2.default.feed(data, "allToDos");
updateJsonView();

// -- Love Hate --

_dom99Module2.default.feed({
    me: {
        owner: "My",
        love: ["Family", "Science", "Vacation"],
        hate: ["Paper-work", "Mosquitos", "Polution"]
    },
    you: {
        owner: "Your",
        love: ["Sing", "Dance", "Read", "Board Games"],
        hate: ["Cold Shower", "Money Depth", "Bad Food"]
    }
});

// try to feed individual things
_dom99Module2.default.linkJsAndDom();