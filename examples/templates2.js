"use strict";
const D = dom99,
    commentPrefix = "comment";

let currentCommentNumber = 2;

const update = function(commentKey,commentObject) {
    Object.assign(D.vr[commentKey], commentObject);
};

const getDataFromFakeServer = function(commentKey) {
    const fakeData = {
        text: "This is a comment that could come from the server about bla bla hard coded but could come from the server",
        date: "just now"
    };
    window.setTimeout(function () {
        update(commentKey, fakeData);
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
D.vr = commentsData;
D.linkJsAndDom();
