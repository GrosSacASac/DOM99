"use strict";
const 
    MAX = 10,
    D = dom99;
    
let messageScopes = [];


const renderNewMessageElement = function(data, scopeName) {
    // 1 create HTML ELement
    let customElement = D.createElement2({
        "tagName": "d-message",
        "data-scope": scopeName,
    });
    
    // 2 link it
    D.linkJsAndDom(customElement);
    
    // 3 insert the Element that has a clone as a child in the DOM
    D.el["messagesContainer"].appendChild(customElement);
};

const displayNewMessage = function(data) {
    let scope;
    if (messageScopes.length < MAX) {
        //create a new scope
        scope = String(messageScopes.length);
        messageScopes.push(scope); // length += 1
        
        //render a new Element retrievable via the scope
        renderNewMessageElement(data, scope);
    } else {
        //rotate the first element to end
        scope = messageScopes[0];
        messageScopes = messageScopes.slice(1)
        messageScopes.push(scope);
        
        //do the same rotation in the DOM
        D.el["messagesContainer"].appendChild(D.xel[scope]);
    }
    // Update 
    Object.assign(D.vr[scopeName], data); // loops over
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


