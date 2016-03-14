"use strict";
const
    dom99 = require('./dom99.js');

//Basic Multiplier
dom99.fx.calculate = function (event) {
    dom99.vars.result = String(
        parseInt(dom99.vars.a, 10) *
        parseInt(dom99.vars.b, 10)
    );
};
dom99.vars.a = String(2);
dom99.vars.b = String(4);

// 4 Link the document and the event handlers
dom99.linkJsAndDom(); //now we listen to events


// 5 initialize
dom99.fx.calculate();
