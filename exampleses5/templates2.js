"use strict";

var D = dom99,
    commentPrefix = "comment";

var currentCommentNumber = 2;

var update = function update(commentKey, commentObject) {
    Object.assign(D.vr[commentKey], commentObject);
};

var getDataFromFakeServer = function getDataFromFakeServer(commentKey) {
    var fakeData = {
        text: "This is a comment that could come from the server about bla bla hard coded but could come from the server",
        date: "just now"
    };
    window.setTimeout(function () {
        update(commentKey, fakeData);
    }, 2000);
};

D.fx.showNextComment = function (event) {
    var key = void 0,
        customElementDescription = void 0,
        customElement = void 0;
    currentCommentNumber += 1;
    key = commentPrefix + String(currentCommentNumber);
    getDataFromFakeServer(key); //get data
    customElementDescription = {
        "tagName": "d-comment",
        "data-in": key
    };
    customElement = D.createElement2(customElementDescription);
    D.linkJsAndDom(customElement);
    D.el.commentSection.appendChild(customElement);
};

var commentsData = { //intial
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