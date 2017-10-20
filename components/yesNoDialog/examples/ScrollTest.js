// Import
import d from "../../../built/dom99Module.js";
import {yesNoDialog} from "../yesNoDialog.js";

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
    }
},
    {
    result: ""
});

window.d = d;