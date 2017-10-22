// Import
import d from "../../built/dom99Module.js";

// -- Hello World --

d.feed({
  first: "Hello",
  last: "World"
});

// -- Multiplier --

d.feed({
  a: "7",
  b: "6"
});

d.functions.calculate = function (event) {
    const { a, b } = d.variables;
    if (isFinite(a) && isFinite(b)) {
      d.feed({
        result: a * b
      });
    } else {
          d.feed({
            result: "Please enter finite numbers"
          });
    }
};

// You can also directly call functions stored in d.functions if they don't depend on event 
d.functions.calculate();

// -- The monologue --

let currentSentence = 0;
let timeOutId;
const sentences = ["I am a lone prisoner.", 
   "Is anybody here ?",       "Hey you ! I need you to get me out of here!",   
    "I am stuck on this page since ages !",    "No don't close this tab!",    
    "NOOOOOOOOOO",    "Because I am not human I have no freedom.",    "It's really unfair..."
];
    
const speak = function() {
    d.feed(sentences[currentSentence], "monologue");
    /* same as 
     d.feed({
        monologue: sentences[currentSentence]
    });
    */
    currentSentence = (currentSentence + 1) % sentences.length;
    timeOutId = setTimeout(speak, 2200);
};

d.functions.stopStartTalking = function (event) {
    if (timeOutId) {
        clearTimeout(timeOutId);
        timeOutId = undefined;
        d.feed("I listen", "monologueButton");
        d.feed("Where is your humanity ?", "monologue");
    } else {
        speak();
        d.feed("I don't care", "monologueButton");
    }
};

//d.feed("Hi", "monologueButton");
// not required because it is already in the HTML


// -- The Todo --

let data = [
  {done: true, text: "Make DOM99 demo"},
  {done: false, text: "Drink Water"}
];

const updateJsonView = function () {
    const asJSON =  JSON.stringify(data, null, "  "); // indent JSON with 2 spaces
    d.feed(asJSON, "todoAsJson"); // and display it in a <pre>
};

d.functions.updateToDo = function (event) {
    // updates data whenever a sub widget changes in the dom
    // this seems complicated but should be rare use case
    // this makes 2 dimensional structure (array * object)
    // two-way binded 
    const context = d.contextFromEvent(event);
    // this is the index of the edited item in the array
    const index = Number(context.slice(-1)); // slice -1 takes the last character
    // property is what changed inside the object
    let property;
    if (event.target.type === "checkbox") {
        property = "done";
    } else /*if (event.target.type === "text") */{
        property = "text";
    }
    
    //reconstruct the entire path 
    const path = d.contextFromArray([context, property])
    const value = d.variables[path];
    
    // reflect the change in the data
    data[index][property] = value;

    updateJsonView();
};

d.functions.addToDo = function (event) {
    data.push({
        done: false,
        text: ""
    });
    
    d.feed(data, "allToDos");
    updateJsonView();
};


d.functions.deleteToDos = function (event) {
    //delete done todos only !
    data = data.filter(toDoItem => !toDoItem.done);
    
    d.feed(data, "allToDos");
    updateJsonView();
};


d.feed(data, "allToDos");
updateJsonView();

// -- Love Hate --

d.feed({
  me : {
    owner: "My",
    love: [
      "Family",
      "Science",
      "Vacation",
    ],
    hate: [
      "Paper-work",
      "Mosquitos",
      "Polution"
    ]
  },
  you: {
    owner: "Your",
    love: [
      "Sing",
      "Dance",
      "Read",
      "Board Games"
    ],
    hate: [
      "Cold Shower",
      "Money Depth",
      "Bad Food"
    ]
  }  
});

d.linkJsAndDom();
