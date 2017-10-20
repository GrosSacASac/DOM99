//yesNoDialog.js
/*jslint
    es6, maxerr: 15, browser, devel, fudge, maxlen: 100
*/
/*global
    Promise, require
*/
import d from "../../built/dom99Module.js";
export {yesNoDialog};

const thisNameSpace = "yesNoDialog";
const yesButton = d.contextFromArray([thisNameSpace, `yesButton`]);
const yesNoDialogQueue = [];

let currentResolve;
let waiting = false;
let lastXPosition = 0;
let lastYPosition = 0;

const prepareQuestion = function (resolve, question, yesText, noText) {
    currentResolve = resolve;
    d.feed({
        question,
        yesText,
        noText
    }, thisNameSpace);
};

d.functions.yesNoDialogAnswer = function (event) {
    currentResolve(event.target === d.elements[yesButton]);
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
        if (!waiting) {
            prepareQuestion(resolve, question, yesText, noText);
            lastXPosition = window.pageXOffset;
            lastYPosition = window.pageYOffset;
            document.body.classList.toggle("dialogactive", true);
            waiting = true;
        } else /*if (waiting)*/ {
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
