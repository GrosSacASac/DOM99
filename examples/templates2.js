"use strict";
const D = dom99,
    commentPrefix = "comment";

let currentCommentNumber = 2;
let commentsData = { //intial
    comment1: {
        text: "I am the first to comment, well written! Bravo!",
        date: "In the year 2016"
    },
    comment2: {
        text: "I really appreciate your work",
        date: "yesterday" 
    }
};

const copyIn = function () {
    let scopeName,
        variableName;
    for (scopeName of Object.keys(commentsData)){
        if (!D.vr[scopeName]) {
            D.vr[scopeName] = {};
        }
        for (variableName of Object.keys(commentsData[scopeName])){
            D.vr[scopeName][variableName] = commentsData[scopeName][variableName];
        }
    }
};

const update = function(commentKey,commentObject) {
    commentsData[commentKey] = commentObject;
    copyIn();
};

const getDataFromFakeServer = function(commentKey) {
    const fakeData = {
        text: "What is your opinion about bla bla hard coded but could come from the server",
        date: "just now"
    };
    window.setTimeout(function () {
        update(commentKey,fakeData);
        }, 2000);
};

D.fx.showNextComment = function(event) {
    let scopeName,
        customElementDescription,
        customElement;
    currentCommentNumber += 1;
    scopeName = commentPrefix + String(currentCommentNumber);
    getDataFromFakeServer(scopeName);//get data
    customElementDescription = {
        "tagName": "d-comment",
        "data-scope": scopeName
    }
    customElement = D.createElement2(customElementDescription);
    D.linkJsAndDom(customElement);
    D.el.commentSection.appendChild(customElement);
};

copyIn();
//Object.assign(D.vr, commentsData);
D.linkJsAndDom();
