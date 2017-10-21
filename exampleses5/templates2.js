"use strict";

var _dom99Module = require("../built/dom99Module.js");

var _dom99Module2 = _interopRequireDefault(_dom99Module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commentPrefix = "comment";

var currentCommentNumber = 2;

var update = function update(commentKey, commentObject) {
    _dom99Module2.default.feed(commentObject, commentKey);
};

var getDataFromFakeServer = function getDataFromFakeServer(urlOrWhat) {
    // fetch like simulation
    return new Promise(function (resolve, reject) {
        var fakeData = {
            text: "This is a comment that could come from the server about bla bla hard coded but could come from the server",
            date: "just now"
        };

        window.setTimeout(function () {
            resolve(fakeData);
        }, 2000);
    });
};

_dom99Module2.default.functions.showNextComment = function (event) {
    currentCommentNumber += 1;
    var key = "" + commentPrefix + currentCommentNumber;

    var customElementDescription = {
        tagName: "d-comment",
        "data-inside": key
    };
    var customElement = _dom99Module2.default.createElement2(customElementDescription);

    _dom99Module2.default.linkJsAndDom(customElement);
    _dom99Module2.default.elements.commentSection.appendChild(customElement);
    getDataFromFakeServer("comment?id=42").then( //get data
    function (data) {
        update(key, data);
    });
};

var commentsData = { //initial
    comment1: {
        text: "I am the first to comment, well written! Bravo!",
        date: "In the year 2016"
    },
    comment2: {
        text: "I really appreciate your work",
        date: "yesterday"
    }
};

_dom99Module2.default.feed(commentsData);
_dom99Module2.default.linkJsAndDom();