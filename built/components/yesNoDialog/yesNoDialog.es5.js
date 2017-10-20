"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.yesNoDialog = undefined;

var _dom99Module = require("../../built/dom99Module.js");

var _dom99Module2 = _interopRequireDefault(_dom99Module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.yesNoDialog = yesNoDialog; //yesNoDialog.js
/*jslint
    es6, maxerr: 15, browser, devel, fudge, maxlen: 100
*/
/*global
    Promise, require
*/

var thisNameSpace = "yesNoDialog";
var yesButton = _dom99Module2.default.contextFromArray([thisNameSpace, "yesButton"]);
var yesNoDialogQueue = [];

var currentResolve = void 0;
var waiting = false;
var lastXPosition = 0;
var lastYPosition = 0;

var prepareQuestion = function prepareQuestion(resolve, question, yesText, noText) {
    currentResolve = resolve;
    _dom99Module2.default.feed({
        question: question,
        yesText: yesText,
        noText: noText
    }, thisNameSpace);
};

_dom99Module2.default.functions.yesNoDialogAnswer = function (event) {
    currentResolve(event.target === _dom99Module2.default.elements[yesButton]);
    if (yesNoDialogQueue.length === 0) {
        waiting = false;
        document.body.classList.toggle("dialogactive", false);
        window.scrollTo(lastXPosition, lastYPosition);
    } else {
        var _yesNoDialogQueue$shi = yesNoDialogQueue.shift();

        var question = _yesNoDialogQueue$shi.question;
        var yesText = _yesNoDialogQueue$shi.yesText;
        var noText = _yesNoDialogQueue$shi.noText;
        var resolve = _yesNoDialogQueue$shi.resolve;
        var reject = _yesNoDialogQueue$shi.reject;

        prepareQuestion(resolve, question, yesText, noText);
    }
};

var yesNoDialog = function yesNoDialog(question, yesText, noText) {
    return new Promise(function (resolve, reject) {
        if (!waiting) {
            prepareQuestion(resolve, question, yesText, noText);
            lastXPosition = window.pageXOffset;
            lastYPosition = window.pageYOffset;
            document.body.classList.toggle("dialogactive", true);
            waiting = true;
        } else /*if (waiting)*/{
                yesNoDialogQueue.push({
                    question: question,
                    yesText: yesText,
                    noText: noText,
                    resolve: resolve,
                    reject: reject
                });
            }
    });
};

