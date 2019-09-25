import * as d  from "../../source/dom99.js";


const files = [`beach.jpg`,`letter_for_johan.txt`,`letter_for_sintia.txt`,`recipe.md`,`readme.md`];
const files2 = [`za.jpg`,`zu.txt`,`zo.txt`,`zooo.md`,`evil.md`];

d.functions.filter = function (event) {
    const context = d.scopeFromEvent(event);
    const filterText = d.variables[d.scopeFromArray([context, `filterText`])];
    const filterElement = event.target;
    /* or
    const filterElement = d.elements[d.scopeFromArray([context, `filter`])];
    */

    const messagePath = d.scopeFromArray([context, `message`]);

    if (filterText) {
        d.feed(messagePath, `filtering ${filterText}`);
        filterElement.classList.add(`grey`);
    } else {
        d.feed(messagePath, `Displaying all files`);
        filterElement.classList.remove(`grey`);
    }

    const parentContext = d.parentScope(context);

    const originalFiles = d.variables[d.scopeFromArray([parentContext, `originalFiles`])];
    const filteredFiles = originalFiles.filter(function (file) {
        return file.match(filterText);
    });

    d.feed(parentContext, {
      files: filteredFiles,
    });

};

d.feed(`explorer1`, {
  files,
  originalFiles: files,
});

d.feed(`explorer2`, {
  files: files2,
  originalFiles: files2,
});



d.start(); // for performance put this at the end
// here at the beginning for testing purposes


const list1 = [`a`,`b`,`c`,`d`];
d.feed(`list1`, list1);
list1.push(`gg`);
d.feed(`list1`, list1); // force update
