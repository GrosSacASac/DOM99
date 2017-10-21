"use strict";

var _dom99Module = require("../built/dom99Module.js");

var _dom99Module2 = _interopRequireDefault(_dom99Module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

///////////////

var files = ["beach.jpg", "letter_for_johan.txt", "letter_for_sintia.txt", "recipe.md", "readme.md"]; // Import

var files2 = ["za.jpg", "letter_for_johan.txt", "letter_for_sintia.txt", "recipe.md", "readme.md"];

_dom99Module2.default.functions.filter = function (event) {
    var context = _dom99Module2.default.contextFromEvent(event);
    var filterText = _dom99Module2.default.variables[_dom99Module2.default.contextFromArray([context, "filterText"])];
    var filterElement = event.target;
    /* or
    const filterElement = d.elements[d.contextFromArray([context, "filter"])];
    */

    var messagePath = _dom99Module2.default.contextFromArray([context, "message"]);

    if (filterText) {
        _dom99Module2.default.feed("filtering " + filterText, messagePath);
        filterElement.classList.add("grey");
    } else {
        _dom99Module2.default.feed("Displaying all files", messagePath);
        filterElement.classList.remove("grey");
    }

    var parentContext = _dom99Module2.default.getParentContext(context);

    var originalFiles = _dom99Module2.default.variables[_dom99Module2.default.contextFromArray([parentContext, "originalFiles"])];
    var filteredFiles = originalFiles.filter(function (file) {
        return file.match(filterText);
    });

    _dom99Module2.default.feed({
        files: filteredFiles
    }, parentContext);
};

_dom99Module2.default.feed({
    files: files,
    originalFiles: files
}, "explorer1");

_dom99Module2.default.feed({
    files: files2,
    originalFiles: files
}, "explorer2");

_dom99Module2.default.linkJsAndDom(); // for performance put this at the end
// here at the beginning for testing purposes


var list1 = ["a", "b", "c", "d"];
_dom99Module2.default.feed(list1, "list1");
list1.push("gg");
_dom99Module2.default.feed(list1, "list1"); // force update