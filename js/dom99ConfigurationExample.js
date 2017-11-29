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


// Note omitting data-* is at your own risks (can collide with existing or future attribute names)

//custom attribute names should start with "data-" see
// https://docs.webplatform.org/wiki/html/attributes/data-* 

import d from "./node_modules/dom99/built/dom99Module.js"; // depends on where the file is

// Example for more compact syntax:
Object.assign(d.options.directives, {
    function: "fx", 
    variable: "vr", 
    element: "el",
    list: "list",
    inside: "in",
    template: "templ"
});

// Other changes possible 
Object.assign(d.options, {
    // cannot be empty,  default "*"
    doneSymbol: "#", 
    // cannot be empty,  default "-"
    tokenSeparator: "+",
    // cannot be empty,  must be different than above,  default " "
    listSeparator: ","
});
 /*
  also
 
 * tagNamesForUserInput: with a list like ["input", "textarea"]
 
 * propertyFromElement with a function
    parameters (element)
    
 * eventNameFromElement: with a function
    parameters (element)
*/