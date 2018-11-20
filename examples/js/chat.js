// Does not use the new features of dom99 ...
import * as d  from "../../source/dom99.js";
import {fakeBossSpeak, fakeSisterSpeak} from "./chat_simulation.js";

let messageKeys = [];
let element = "element";
const MAX = 100;


const renderNewMessageElement = function(data, key) {
    // 1 create HTML ELement
    let customElement = d.createElement2({
        "tagName": "d-message",
        "data-inside": key,
        "data-element": element + key
    });

    // 2 link it
    d.start(customElement);

    // 3 insert the Element that has a clone as a child in the dOM
    d.elements["messagesContainer"].appendChild(customElement);
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

        //do the same rotation in the dOM
        d.elements["messagesContainer"].appendChild(d.elements[element + key]);
    }
    // Update

    d.feed(key, data); // loops over
};

d.functions.trySendMessage = function(event) {
    // the data uses the same keys declared in the html
    let data = {
        authorName: "You",
        authorFoto: "../documentation/images/you.jpg",
        messageText: d.variables.currentMessage
    };
    // could send data to server here
    displayNewMessage(data);
    d.feed(`currentMessage`, ``); //reset the inputs
    d.elements.textarea.focus(); //reset focus
};

// initialize

d.feed(`currentMessage`, ``); //reset the inputs
d.start(); //now we listen to all events

window.setInterval(function () {
    displayNewMessage(fakeSisterSpeak());
}, 7500);
window.setInterval(function () {
    displayNewMessage(fakeBossSpeak());
}, 12500);
