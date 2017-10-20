/*dom99ConfigurationExample.js
warning, needs revisit,


 1. Make a copy of this file
 2. Rename the copy dom99Configuration.js for convenience
 3. put it in the same place as your main js file (starting point)
 4. Make sure dom99Configuration.js runs AFTER dom99.js in case you use <script> tags
 5. Change this file according to your needs
 6. import it (without variables) like so
    import "./dom99Configuration.js";
    this will simply execute the file once
 Custom configuration examples:*/


// Note omiting data-* is at your own risks (can collide with existing or future attribute names)

//custom attribute names should start with "data-" see
// https://docs.webplatform.org/wiki/html/attributes/data-* 

import d from "./node_modules/dom99/built/dom99Module.js"; // depends on where the file is

// Example for more compact syntax:
Object.assign(d.options.directives, {
    directiveFunction: "fx", 
    directiveVariable: "vr", 
    directiveElement: "el",
    directiveInside: "in",
    directiveList: "list",
    directiveTemplate: "data-template"
});

// Other changes possible 
Object.assign(d.options, {
    // cannot be empty,  default "*"
    attributeValueDoneSign: "#$", 
    // cannot be empty,  default "-"
    tokenSeparator: "+",
    // cannot be empty,  must be different than above,  default " "
    listSeparator: ","
});
 /*
  also
 
 * elementsForUserInputList: with a list like ["input", "textarea"]
 
 * variablePropertyFromTagAndType with a function
    parameters (tagName, type) . type can be empty
    
 * eventFromTagAndType: with a function
    parameters (tagName, type) . type can be empty
*/