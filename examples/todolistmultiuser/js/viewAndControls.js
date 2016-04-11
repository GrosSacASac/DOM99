/*dom99, bridge

define event handlers*/
var viewAndControls = (function () {
    "use strict";
    var D = dom99,
    
        newToDoUiElement = function (toDoScopeName) {
            let customElement = D.createElement2({
                "tagName": "d-todo",
                "data-scope": toDoScopeName,
            });
            
            D.linkJsAndDom(customElement);
            
            D.el.toDoList.appendChild(customElement);
        },
        
        remakeToDoList = function (newToDos) {
            var toDoKey;
            
            // remove from UI and memory all toDos that are not in newToDos
            for (toDoKey of Object.keys(D.vr)) {
                if (!newToDos[toDoKey]) {
                    D.xel[toDoKey].remove();
                    D.forgetScope(toDoKey);
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
        var scopeName = Date.now().toString();
        while (D.vr[scopeName]) { //don' take same name twice
            scopeName = Date.now().toString()
        };
        newToDoUiElement(scopeName);
        bridge.updateServerState(D.vr);
    };
    
    D.fx.change = function (event) {
        bridge.updateServerState(D.vr);
    };
    
    D.fx.destroy = function (event) {
        var scope = event.scope;
        D.xel[scope].remove();
        D.forgetScope(scope);
        bridge.updateServerState(D.vr);
    };
    
    return {
        //called from outside the UI only:
        remakeToDoList: remakeToDoList, 
    };
}());