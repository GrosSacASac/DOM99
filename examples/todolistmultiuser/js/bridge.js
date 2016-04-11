/* io 

role communication with outside*/
var bridge = (function () {
    "use strict";
    var socket,
            
        startLinkWithServer = function () {
            socket = io();
            socket.on("update", viewAndControls.remakeToDoList);
        },
        
        updateServerState = function(toDos) {
            socket.emit("update", toDos);
        };
        
        
    return {
        startLinkWithServer: startLinkWithServer,
        updateServerState: updateServerState
    };
}());
 