"use strict";
const 
    MAX = 10,
    D = dom99;
    
let messageKeys = [];
let element = "element";


const renderNewMessageElement = function(data, key) {
    // 1 create HTML ELement
    let customElement = D.createElement2({
        "tagName": "d-message",
        "data-in": key,
        "data-el": element + key
    });
    
    // 2 link it
    D.linkJsAndDom(customElement);
    
    // 3 insert the Element that has a clone as a child in the DOM
    D.el["messagesContainer"].appendChild(customElement);
};

const displayNewMessage = function(data) {
    let key;
    if (messageKeys.length < MAX) {
        //create a new key
        key = String(messageKeys.length);
        messageKeys.push(key); // length += 1
        
        //render a new Element retrievable via the key
        renderNewMessageElement(data, key);
    } else {
        //rotate the first element to end
        key = messageKeys[0];
        messageKeys = messageKeys.slice(1)
        messageKeys.push(key);
        
        //do the same rotation in the DOM
        D.el["messagesContainer"].appendChild(D.el[element + key]);
    }
    // Update 
    Object.assign(D.vr[key], data); // loops over
};

D.fx.trySendMessage = function(event) {
    // the data uses the same keys declared in the html
    let data = {
        authorName: "You",
        authorFoto: "../images/you.jpg",
        messageText: D.vr.currentMessage
    };
    // could send data to server here
    displayNewMessage(data);
    D.vr.currentMessage = ""; //reset the inputs
    D.el.textarea.focus(); //reset focus
};

//initialize
D.vr.currentMessage = ""; //reset the inputs
D.linkJsAndDom(); //now we listen to all events

// import * from "chat_simulation.js"
window.setInterval(fakeSisterSpeak, 7500, displayNewMessage);
window.setInterval(fakeBossSpeak, 12600, displayNewMessage);


