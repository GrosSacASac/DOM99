// Does not use the new features of dom99 ...
import * as d from "../../deps/dom99.es.js";
import { fakeBossSpeak, fakeSisterSpeak } from "./chat_simulation.js";

let messageKeys = [];
const element = `element`;
const MAX = 100;
const chatInterval1 = 7500;
const chatInterval2 = 12500;


const renderNewMessageElement = function (data, key) {
    // 1 create HTML ELement
    const customElement = d.createElement2({
        "tagName": `d-message`,
        "data-scope": key,
        "data-element": element + key,
    });

    // 2 link it
    d.start({
        startElement: customElement,
    });

    // 3 insert the Element that has a clone as a child in the dOM
    d.elements[`messagesContainer`].appendChild(customElement);
};

const displayNewMessage = function (data) {
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
        messageKeys = messageKeys.slice(1);
        messageKeys.push(key);

        //do the same rotation in the dOM
        d.elements[`messagesContainer`].appendChild(d.elements[element + key]);
    }
    // Update

    d.feed(key, data); // loops over
};

d.functions.trySendMessage = function () {
    // the data uses the same keys declared in the html
    const data = {
        authorName: `You`,
        authorFoto: `../images/you.jpg`,
        messageText: d.variables.currentMessage,
    };
    // could send data to server here
    displayNewMessage(data);
    d.feed(`currentMessage`, ``); //reset the inputs
    d.elements.textarea.focus(); //reset focus
};

// initialize

d.feed(`currentMessage`, ``); //reset the inputs
d.start(); //now we listen to all events

setInterval(function () {
    displayNewMessage(fakeSisterSpeak());
}, chatInterval1);
setInterval(function () {
    displayNewMessage(fakeBossSpeak());
}, chatInterval2);
