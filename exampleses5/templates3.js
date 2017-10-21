"use strict";

var _dom99Module = require("../built/dom99Module.js");

var _dom99Module2 = _interopRequireDefault(_dom99Module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var update = function update(commentObject, position) {
    // updates the dataStore for comments commentsData
    commentsData[position] = commentObject;
    // could sort the comments with .sort(customFunction) too
    // pushes the update to the UI
    _dom99Module2.default.feed(commentsData, "comments");
};

var fetchData = function fetchData(urlOrWhat) {
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

    // in the meantime already display an empty comment for instant feedback

    // remember the position to be updated later
    var position = commentsData.length;
    commentsData.push(undefined);
    // undefined will simly have no effecton all data-variable
    // so that will effectively uses the default textContent in the HTML
    _dom99Module2.default.feed(commentsData, "comments");
    // force ui update
    fetchData("comment?id=42").then(function (data) {
        update(data, position);
    });
};

// comments are now stored inside an array
// you can try to convert an Object to an Array using
// Object.values(my_object);

var commentsData = [{
    text: "I am the first to comment, well written! Bravo!",
    date: "In the year 2016"
}, {
    text: "I really appreciate your work",
    date: "yesterday"
}];

_dom99Module2.default.feed(commentsData, "comments");
_dom99Module2.default.linkJsAndDom();