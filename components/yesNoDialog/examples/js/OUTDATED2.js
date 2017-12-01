/*this example uses browserify*/
"use strict";
const D = require("dom99");
const yesNoDialog = require("yesNoDialog").yesNoDialog;
/*
in your project do
const D = require("dom99");
const yesNoDialog = require("dom99/components/yesNoDialog/yesNoDialog.js").yesNoDialog;
*/ 
D.activate();

const questionTexts = [
    "Do you sleep at least 6 hours everyday ?",
    "Do you listen to music ?",
    "Do you drink at least 1 Kg of water everyday ?"
];

const yesText = "Yes";
const noText = "No";
const EnglishBooleanFromBooleanString = {
    "true": yesText,
    "false": noText,
};

Promise.all([
    yesNoDialog(questionTexts[0], yesText, noText),
    yesNoDialog(questionTexts[1], yesText, noText),
    yesNoDialog(questionTexts[2], yesText, noText),
]).then(function (answers) {
    console.log(answers);
    D.vr.result = answers.map(function (answer, index) {
        return `Question: ${questionTexts[index]} Answer: ${
        EnglishBooleanFromBooleanString[String(answer)]}`;
    }).join("\n");
});

