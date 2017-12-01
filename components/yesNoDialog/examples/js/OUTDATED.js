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

D.fx.try = function (event) {
    const questionText = "Do you like this question ?";
    const yesText = "Yes";
    const noText = "No";
    yesNoDialog(questionText, yesText, noText).then(function (answer) {
        D.vr.result = String(answer);
    });
};

