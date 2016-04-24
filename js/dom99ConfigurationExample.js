/*dom99ConfigurationExample.js

 1. Make a copy of this file
 2. Rename the copy dom99Configuration.js for convenience
 3. Make sure dom99Configuration.js runs AFTER dom99.js
 4. Change this file according to your needs
 
 Custom configuration examples:*/

 
// Example for more explicit syntax:
/*
Object.assign(dom99.directives, {
    directiveFunction: "data-function", 
    directiveVariable: "data-variable", 
    directiveElement: "data-function",
    directiveScope: "data-scope",
    attributeValueDoneSign: "☀", 
    tokenSeparator: "-", 
    listSeparator: ","
});
*/
// Example for more compact syntax:
Object.assign(dom99.directives, {
    directiveFunction: "fx", 
    directiveVariable: "vr", 
    directiveElement: "el",
    directiveScope: "scope",
    attributeValueDoneSign: "☀", 
    tokenSeparator: "-", 
    listSeparator: ","
});
