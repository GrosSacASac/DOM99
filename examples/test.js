// Import
import d from "../built/dom99Module.js";



///////////////

var files = ["beach.jpg","letter_for_johan.txt","letter_for_sintia.txt","recipe.md","readme.md"];
var files2 = ["za.jpg","letter_for_johan.txt","letter_for_sintia.txt","recipe.md","readme.md"];

d.functions.filter = function (event) {
    const context = d.contextFromEvent(event);    
    const filterText = d.variables[d.contextFromArray([context, "filterText"])];
    const filterElement = event.target;
    /* or
    const filterElement = d.elements[d.contextFromArray([context, "filter"])];
    */

    const messagePath = d.contextFromArray([context, "message"])

    if (filterText) {
        d.feed(`filtering ${filterText}`, messagePath);
        filterElement.classList.add("grey");
    } else {
        d.feed("Displaying all files", messagePath);
        filterElement.classList.remove("grey");
    }
    
    const parentContext = d.getParentContext(context);
    
    const originalFiles = d.variables[d.contextFromArray([parentContext, "originalFiles"])];
    const filteredFiles = originalFiles.filter(function (file) {
        return file.match(filterText);
    });
    
    d.feed({
      files: filteredFiles
    }, parentContext);
        
};

d.feed({
  files: files,
  originalFiles: files,
}, "explorer1");

d.feed({
  files: files2,
  originalFiles: files,
}, "explorer2");



d.linkJsAndDom(); // for performance put this at the end
// here at the beginning for testing purposes


const list1 = ["a","b","c","d"];
d.feed(list1, "list1");
list1.push("gg");
d.feed(list1, "list1"); // force update
