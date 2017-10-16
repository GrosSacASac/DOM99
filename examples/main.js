// Import
import d from "../built/dom99Module.js";

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

let componentName = "todo";
let i = 0;
let toDoKeys = [];
let element = "element";
const data = [
  {done: true, text: "Make DOM99 demo"},
  {done: false, text: "Drink Water"}
];
d.feed(data, "allToDos");

d.functions.updateJson = function (event) {
    let dataObject = d.variables.allToDos;
            console.log(dataObject);
            console.log( d.variables);
            console.log(event);
            console.log(d.contextFromEvent(event)); // could get index from that
            console.log(event.target.value); // value 
            // integrate 2 way binding in dom99 ? for list
    //toDoKeys.map(function(toDoKey) {
        //return {
            //text: d.vr[toDoKey]["text"],
            //done: d.vr[toDoKey]["done"]
        //};
    //});
    //d.vr.todoAsJson = JSON.stringify(dataObject);
};

d.functions.addTodo = function (event) {

};
d.functions.addTodoX = function (event) {
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
    d.functions.updateJson();
};


d.functions.deleteTodos = function (event) {
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
    d.functions.updateJson();
};
//d.functions.updateJson();
d.linkJsAndDom();
// -- next --

