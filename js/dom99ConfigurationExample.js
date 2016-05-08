/*dom99ConfigurationExample.js

 1. Make a copy of this file
 2. Rename the copy dom99Configuration.js for convenience
 3. Make sure dom99Configuration.js runs AFTER dom99.js
 4. Change this file according to your needs
 
 Custom configuration examples:*/
 
/*
// Example for more explicit syntax:
Object.assign(dom99.options.directives, {
    directiveFunction: "data-function", 
    directiveVariable: "data-variable", 
    directiveElement: "data-function",
    directiveIn: "data-in",
});


// Example for more compact syntax:
// Note omiting data-* is at your own risks (can collide with existing or future attribute names)

custom attribute names must start with "data-" see
https://docs.webplatform.org/wiki/html/attributes/data-* 

Object.assign(dom99.options.directives, {
    directiveFunction: "fx", 
    directiveVariable: "vr", 
    directiveElement: "el",
    directiveIn: "in",
});

you can also change dom99.options.variablePropertyFromTagAndType with a new function
that takes (tagName, type) as parameters. type is only present for inputs*/