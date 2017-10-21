"use strict";

var _dom99Module = require("../built/dom99Module.js");

var _dom99Module2 = _interopRequireDefault(_dom99Module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globalNumber = 0;
// increment local does not update the list, how to make the data flow

var setAllGlobalCopyInside = function setAllGlobalCopyInside(value) {
    var changeDescriptor = {
        globalCopy: String(value)
    };

    _dom99Module2.default.feed(changeDescriptor, _dom99Module2.default.contextFromArray(["outerList", 0]));
    _dom99Module2.default.feed(changeDescriptor, _dom99Module2.default.contextFromArray(["outerList", 1]));
    _dom99Module2.default.feed(changeDescriptor, _dom99Module2.default.contextFromArray(["outerList", 2]));
};

var globalIncrement = function globalIncrement(event) {
    globalNumber += 1;
    setAllGlobalCopyInside(globalNumber);
};

var globalSet = function globalSet(event) {
    var context = _dom99Module2.default.contextFromEvent(event);
    var newGlobalNumber = Number(_dom99Module2.default.variables[_dom99Module2.default.contextFromArray([context, "globalCopy"])]);
    globalNumber = newGlobalNumber;

    setAllGlobalCopyInside(globalNumber);
};

var localIncrement = function localIncrement(event) {
    var context = _dom99Module2.default.contextFromEvent(event);
    var spanElement = _dom99Module2.default.elements[_dom99Module2.default.contextFromArray([context, "span"])];
    var localNumber = Number(_dom99Module2.default.variables[_dom99Module2.default.contextFromArray([context, "local"])]) + 1;
    var localColor = "rgb(" + localNumber * 25 % 255 + ",0,0)";

    _dom99Module2.default.feed({
        local: String(localNumber)
    }, context);

    spanElement.style.border = "1px " + localColor + " solid";
};

var listremake = function listremake(event) {
    /* display list size of global, with value local */
    var context = _dom99Module2.default.contextFromEvent(event);
    var localNumber = Number(_dom99Module2.default.variables[_dom99Module2.default.contextFromArray([context, "local"])]);
    var global = globalNumber;
    var newList = [];
    var i = void 0;
    for (i = 0; i < global; i += 1) {
        newList.push({
            "a": localNumber,
            "b": localNumber
        });
    }
    _dom99Module2.default.feed({
        innerlist: newList
    }, context);
};
var functions = {
    globalIncrement: globalIncrement,
    localIncrement: localIncrement,
    listremake: listremake,
    globalSet: globalSet
};

var initialData = {

    outerList: [{
        globalCopy: String(globalNumber),
        local: "-5",
        innerlist: [{
            a: "1 item a",
            b: "1 item b"
        }]
    }, {
        globalCopy: String(globalNumber),
        local: "-2",
        innerlist: [{
            a: "crazy nesting 0 a aaa",
            b: "crazy nesting 0 b"
        }, {
            a: "crazy nesting 1 a",
            b: "crazy nesting 1 b"
        }]
    }, {
        globalCopy: String(globalNumber),
        local: "3",
        innerlist: [{
            a: "1crazy nesting 0 a",
            b: "1crazy nesting 0 b"
        }, {
            a: "1crazy nesting 1 a",
            b: "1crazy nesting 1 b zzz"
        }, {
            a: "third item (b is unset)"
        }]
    }]
};

_dom99Module2.default.start(functions, initialData);