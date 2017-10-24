// Import
import d from "../../../../built/dom99Module.js";
import {yesNoDialog, textDialog} from "../../yesNoDialog.js";

d.start({
    askSomething: function (event) {
        const questionText = "Do you think your scroll position will be remembered ?";
        const yesText = "Yes";
        const noText = "No";
        yesNoDialog(questionText, yesText, noText).then(function (answer) {
            d.feed({
                result: String(answer)
           });
        });
    },
    tryTextDialog: function (event) {
        const question = "What is your favorite colour ?";
        const label = "Your colour: ";
        const text = "";
        const submitText = "send";
        textDialog(question, label, text, submitText).then(function (answer) {
            d.feed({
                result2: String(answer),
                warning: "Never give input back to the user in a real world app without validating, sanitizing input first."
           });
        });
    }
},
    {
    result: ""
});

window.d = d; // for debugging