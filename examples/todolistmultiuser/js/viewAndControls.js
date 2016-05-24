/*dom99, bridge

define event handlers*/
var viewAndControls = (function () {
    "use strict";
    var D = dom99;
    var elementPrefix = "element";

    var newToDoUiElement = function (toDoKey) {
        toDoKey = String(toDoKey);
        let toDoElementKey = elementPrefix + toDoKey;
        let customElement = D.createElement2({
            "tagName": "d-todo",
            "data-in": toDoKey,
            "data-el": toDoElementKey
        });

        D.linkJsAndDom(customElement);
        D.el.toDoList.appendChild(customElement);
    };

    var remakeToDoList = function (newToDos) {
        var toDoKey;

        // remove from UI and memory all toDos that are not in newToDos
        for (toDoKey of Object.keys(D.vr)) {
            if (!newToDos[toDoKey]) {
                D.xel[toDoKey].remove();
                D.forgetKey(toDoKey);
            }
        }
        // create all UI toDos that are not already existing
        for (toDoKey of Object.keys(newToDos)) {
            if (!D.vr[toDoKey]) {
                newToDoUiElement(toDoKey);
            }
        }
        D.vr = newToDos; // synchronization
        // not updateServerState to avoid infinite server-client loop 
    };

    D.fx.addItem = function (event) {
        var key = Date.now().toString();
        while (D.vr[key]) { //don' take same name twice
            key = Date.now().toString()
        };
        newToDoUiElement(key);
        bridge.updateServerState(D.vr);
    };

    D.fx.change = function (event) {
        bridge.updateServerState(D.vr);
    };

    D.fx.destroy = function (event) {
        //we have access to event.dKeys and event.dIn and event.dHost
        var keys = event.dKeys;
        // remove the custom element from the DOM
        console.log(event.dHost);
        event.dHost.remove();
        //var key = keys.pop();//parent
        // or D.followPath(D.el, keys)[elementPrefix + key].remove(); 
        D.forgetKey(keys);
        bridge.updateServerState(D.vr);
    };

    return {
        //called from outside the UI only:
        remakeToDoList: remakeToDoList, 
    };
}());
