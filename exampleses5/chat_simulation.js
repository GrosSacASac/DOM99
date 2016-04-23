"use strict";
//Use a shorter name

var fakeMessagesFromSister = ["Hey brother, what is up ?", "Long time not seen", "you should visit my new home", "remember the skateboard races we had when we were kids ?", "Hey answer please :)"],
    fakeMessagesFromBoss = ["Nice work kids", "I am going on a trip next week to meet new buisness partners", "Can you finish the project ?"];

var fakeMessagesFromSisterCurrentIndex = 0,
    fakeMessagesFromBossCurrentIndex = 0;

// fake messages can be replaced by listening to sockets or equivalent

var fakeSisterSpeak = function fakeSisterSpeak(displayNewMessage) {
    displayNewMessage({
        authorName: "Sister",
        authorFoto: "../images/sister.jpg",
        messageText: fakeMessagesFromSister[fakeMessagesFromSisterCurrentIndex % fakeMessagesFromSister.length]
    });
    fakeMessagesFromSisterCurrentIndex += 1;
};

var fakeBossSpeak = function fakeBossSpeak(displayNewMessage) {
    displayNewMessage({
        authorName: "boss",
        authorFoto: "../images/boss.jpg",
        messageText: fakeMessagesFromBoss[fakeMessagesFromBossCurrentIndex % fakeMessagesFromBoss.length]
    });
    fakeMessagesFromBossCurrentIndex += 1;
};