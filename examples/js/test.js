// Import
import {d, plugin, options, createElement2} from "../../source/dom99.js";



///////////////

var files = ["beach.jpg","letter_for_johan.txt","letter_for_sintia.txt","recipe.md","readme.md"];
var files2 = ["za.jpg","zu.txt","zo.txt","zooo.md","evil.md"];

d.functions.filter = function (event) {
    const context = d.contextFromEvent(event);
    const filterText = d.variables[d.contextFromArray([context, "filterText"])];
    const filterElement = event.target;
    /* or
    const filterElement = d.elements[d.contextFromArray([context, "filter"])];
    */

    const messagePath = d.contextFromArray([context, "message"])

    if (filterText) {
        d.feed(messagePath, `filtering ${filterText}`);
        filterElement.classList.add("grey");
    } else {
        d.feed(messagePath, "Displaying all files");
        filterElement.classList.remove("grey");
    }

    const parentContext = d.getParentContext(context);

    const originalFiles = d.variables[d.contextFromArray([parentContext, "originalFiles"])];
    const filteredFiles = originalFiles.filter(function (file) {
        return file.match(filterText);
    });

    d.feed(parentContext, {
      files: filteredFiles
    });

};

d.feed("explorer1", {
  files: files,
  originalFiles: files,
});

d.feed("explorer2", {
  files: files2,
  originalFiles: files2,
});



d.activate(); // for performance put this at the end
// here at the beginning for testing purposes


const list1 = ["a","b","c","d"];
d.feed("list1", list1);
list1.push("gg");
d.feed("list1", list1); // force update
