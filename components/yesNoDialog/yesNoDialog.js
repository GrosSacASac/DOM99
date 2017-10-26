//yesNoDialog.js
/*jslint
    es6, maxerr: 15, browser, devel, fudge, maxlen: 100
*/
/*global
    Promise, require
*/
/*
could remove and give back focus to the main document with document.activeElement
as in https://github.com/GoogleChrome/dialog-polyfill/blob/master/dialog-polyfill.js
*/
import d from "../../built/dom99Module.js";
export {yesNoDialog, textDialog};

const thisNameSpace = `yesNoDialog`;
const cssPrefix = `yes-no-dialog`;
const cssDialogActiveClass = `${cssPrefix}-active`;
const yesButton = d.contextFromArray([thisNameSpace, `yesButton`]);
const yesNoContainer = d.contextFromArray([thisNameSpace, `confirm`]);
const promptContainer = d.contextFromArray([thisNameSpace, `prompt`]);
const promptInput = d.contextFromArray([thisNameSpace, `input`]);
const yesNoSymbol = 0;
const promptSymbol = 1;

const yesNoDialogQueue = [];
let currentResolve;
let waiting = false;
let lastXPosition = 0;
let lastYPosition = 0;

const cleanUp = function () {
    waiting = false;
    document.body.classList.remove(cssDialogActiveClass);
    d.feed({
        question: ``,
        label: ``,
        input: ``,
        submitText: ``,
        yesText: ``,
        noText: ``,
    }, thisNameSpace);
    window.scrollTo(lastXPosition, lastYPosition);
};

const start = function () {
    lastXPosition = window.pageXOffset;
    lastYPosition = window.pageYOffset;
    document.body.classList.add(cssDialogActiveClass);
    waiting = true;
};

const prepareNext = function () {
    if (yesNoDialogQueue.length === 0) {
        cleanUp();
    } else {
        const next = yesNoDialogQueue.shift();
        if (next.intent !== promptSymbol) {
            d.elements[promptInput].blur();
        }
        if (next.intent === yesNoSymbol) {
            prepareYesNo(next);
        } else if (next.intent === promptSymbol) {
            preparePrompt(next);
        }
    }
};

const prepareYesNo = function ({resolve, question, yesText, noText}) {
    d.elements[yesNoContainer].hidden = false;
    currentResolve = resolve;
    d.feed({
        question,
        yesText,
        noText
    }, thisNameSpace);
};

const preparePrompt = function ({resolve, question, label, input, submitText}) {
    d.elements[promptContainer].hidden = false;
    currentResolve = resolve;
    d.feed({
        question,
        label,
        input,
        submitText
    }, thisNameSpace);
    d.elements[promptInput].focus();
};

d.functions.yesNoDialogAnswer = function (event) {
    d.elements[yesNoContainer].hidden = true;
    prepareNext();
    currentResolve(event.target === d.elements[yesButton]);
};

d.functions.yesNoDialogSubmit = function (event) {
    const input = d.variables[promptInput];
    // prepareNext can overwrite d.variables[promptInput]
    d.elements[promptContainer].hidden = true;
    prepareNext();
    currentResolve(input);
};

d.functions.yesNoDialogSubmitViaEnter = function (event) {
    if (event.keyCode === 13) { //Enter
        d.functions.yesNoDialogSubmit();
    }
};

const yesNoDialog = function (question, yesText, noText) {
    return new Promise(function (resolve) {
        if (!waiting) {
            start();
            prepareYesNo({resolve, question, yesText, noText});
        } else /*if (waiting)*/ {
            yesNoDialogQueue.push({
                intent: yesNoSymbol,
                question,
                yesText,
                noText,
                resolve   
            });
        }
    });
};

const textDialog = function (question, label, input, submitText) {
    return new Promise(function (resolve) {
        if (!waiting) {
            start();
            preparePrompt({resolve, question, label, input, submitText});
        } else /*if (waiting)*/ {
            yesNoDialogQueue.push({
                intent: promptSymbol,
                question,
                label,
                input,
                submitText,
                resolve   
            });
        }
    });
};
