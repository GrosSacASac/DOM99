//yesNoDialog.js
//browserify version
/*jslint
    es6, maxerr: 15, browser, devel, fudge, maxlen: 100
*/
/*global
    Promise
*/
"use strict";
const D = require("dom99");

let currentResolve;
let waiting = false;
let lastXPosition = 0;
let lastYPosition = 0;
const yesNoDialogQueue = [];

const prepareQuestion = function (resolve, question, yesText, noText) {
    currentResolve = resolve;
    D.vr.answerYesNoQuestionText = question;
    D.vr.answerYesNoYesText = yesText;
    D.vr.answerYesNoNoText = noText;
};

D.fx.answerYesNo = function (event) {
    currentResolve(event.target === D.el.answerYesNoYesElement);
    if (yesNoDialogQueue.length === 0) {
        waiting = false;
        document.body.classList.toggle("dialogactive", false);
        window.scrollTo(lastXPosition, lastYPosition);
    } else {
        const {
            question,
            yesText,
            noText,
            resolve,
            reject            
        } = yesNoDialogQueue.shift();
        prepareQuestion(resolve, question, yesText, noText);
    }
};



const yesNoDialog = function (question, yesText, noText) {
    return new Promise(function (resolve, reject) {
        if (waiting === false) {
            prepareQuestion(resolve, question, yesText, noText);
            lastXPosition = window.pageXOffset;
            lastYPosition = window.pageYOffset;
            document.body.classList.toggle("dialogactive", true);
            waiting = true;
        } else /*if (waiting === true)*/ {
            yesNoDialogQueue.push({
                question,
                yesText,
                noText,
                resolve,
                reject            
            });
        }
    });
};

module.exports = {
    yesNoDialog
};