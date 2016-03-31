"use strict";
//Use a shorter name
const MAX = 10,
    D = dom99,
    fakeMessagesFromSister = 
    ["Hey brother, what is up ?",
    "Long time not seen",
    "you should visit my new home",
    "remember the skateboard races we had when we were kids ?",
    "Hey answer please :)"],
    fakeMessagesFromBoss = 
    ["Nice work kids",
    "I am going on a trip next week to meet new buisness partners",
    "Can you finish the project ?"];
    
let messageNumber = 0,
    messageScopes = [],
    fakeMessagesFromSisterCurrentIndex = 0,
    fakeMessagesFromBossCurrentIndex = 0;

const updateMessageElement = function(data, scopeName) {
    D.vr[scopeName]["authorName"] = data.authorName;
    D.el[scopeName]["authorFoto"].src = data.authorFoto;
    D.vr[scopeName]["messageText"] = data.messageText;
};

const renderNewMessageElement = function(data, scopeName) {
    // 1 create clone and execute directives
    let clone = D.templateRender( "messageTemplate", scopeName );
    
    // 2 populate the clone with any data and more
    updateMessageElement(data, scopeName)
    
    // 3 insert the clone in the DOM
    D.el["messagesContainer"].appendChild(clone);
};

const displayNewMessage = function(data) {
    let scope;
    if (messageScopes.length >= MAX) {
        //rotate the first element to end
        scope = messageScopes[0];
        messageScopes = messageScopes.slice(1)
        messageScopes.push(scope);
        
        //do the same rotation in the DOM
        D.el["messagesContainer"].appendChild(D.el[scope]["message"]);
        
        //update
        updateMessageElement(data, scope);
        
    } else {
        //create a new scope string
        scope = String(messageNumber);
        messageScopes.push(scope);
        
        //render a new Element retrievable via the scope string
        renderNewMessageElement(data, scope);
        messageNumber += 1;
    }
};

D.fx.trySendMessage = function(event) {
    
    let data = {
        authorName: "You",
        authorFoto: "../images/you.jpg",
        messageText: D.vr.currentMessage
    };
    // could send data to server here
    displayNewMessage(data);
    D.vr.currentMessage = ""; //reset the inputs
    D.el.textarea.focus();//reset focus
};

// fake messages can be replaced by something like
// socket.on( ...displayNewMessage(data); ...)

const fakeSisterSpeak = function() {
    let data = {
        authorName: "Sister",
        authorFoto: "../images/sister.jpg",
        messageText: fakeMessagesFromSister[fakeMessagesFromSisterCurrentIndex %
        fakeMessagesFromSister.length    ]
    };
    
    displayNewMessage(data);
    fakeMessagesFromSisterCurrentIndex += 1;
    setTimeout(fakeSisterSpeak, 7000);
};
const fakeBossSpeak = function() {
    let data = {
        authorName: "boss",
        authorFoto: "../images/boss.jpg",
        messageText: fakeMessagesFromBoss[fakeMessagesFromBossCurrentIndex %
        fakeMessagesFromBoss.length    ]
    };
    
    displayNewMessage(data);
    fakeMessagesFromBossCurrentIndex += 1;
    setTimeout(fakeBossSpeak, 12120);
};
// Link the document and the event handlers

//initialize
D.vr.currentMessage = "";
D.linkJsAndDom(); //now we listen to all events
fakeSisterSpeak();
fakeBossSpeak();


