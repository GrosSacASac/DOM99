"use strict";

var _dom99Module = require("../built/dom99Module.js");

var _dom99Module2 = _interopRequireDefault(_dom99Module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dom99Module2.default.functions.showNextComment = function (event) {
    ; //todo
};

var commentsData = {
    comment1: {
        text: "I am the first to comment, well written! Bravo!",
        date: "In the year 2016"
    },
    comment2: {
        text: "I really appreciate your work",
        date: "just now"
    }
};

// we could also manually assign every property in a complicated for loop
_dom99Module2.default.feed(commentsData);

_dom99Module2.default.linkJsAndDom();