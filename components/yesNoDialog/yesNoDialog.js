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

D.fx.answerYesNo = function (event) {
    answerYesNoResolve(event.target === D.el.answerYesNoYesElement);
    document.body.classList.toggle("dialogactive", false);
};


let answerYesNoResolve;
const yesNoDialog = function (question, yesText, noText) {
    return new Promise(function (resolve, reject) {
        answerYesNoResolve = resolve;
        D.vr.answerYesNoQuestionText = question;
        D.vr.answerYesNoYesText = yesText;
        D.vr.answerYesNoNoText = noText;
        
        document.body.classList.toggle("dialogactive", true);
    });
};

module.exports = {
    yesNoDialog
};