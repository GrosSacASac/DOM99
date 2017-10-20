"use strict";

var _dom99Module = require("../../../built/dom99Module.js");

var _dom99Module2 = _interopRequireDefault(_dom99Module);

var _yesNoDialog = require("../yesNoDialog.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Import


_dom99Module2.default.start({
    askSomething: function askSomething(event) {
        var questionText = "Do you think your scroll position will be remembered ?";
        var yesText = "Yes";
        var noText = "No";
        (0, _yesNoDialog.yesNoDialog)(questionText, yesText, noText).then(function (answer) {
            _dom99Module2.default.feed({
                result: String(answer)
            });
        });
    }
}, {
    result: ""
});

