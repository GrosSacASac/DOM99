//readTextFile.js
/*jslint
    es6, maxerr: 200, browser, devel, fudge, maxlen: 100, node, globals : dom99
*/
/*

*/
const readTextFile = (function (D) {
    "use strict";

    const readerOnLoadPrepare = function(fileObject, inputElement) {
        return function(event) {
            inputElement.remove();
            inputElement.readFileResolve(event.target.result);
        };
    };
    
    D.fx.xReadFileStart = function(event) {
        var fileObject = event.target.files[0]; // FileList object
        var reader = new FileReader();
        reader.onload = readerOnLoadPrepare(fileObject,event.target);
        reader.readAsText(fileObject);
    };
    
    const readFileSetup = function(resolve, reject) {
        var fileInput = D.createElement2({
            "tagName": "input",
            "type": "file",
            "data-fx": "xReadFileStart"
        });
        fileInput.readFileResolve = resolve;
        fileInput.readFileReject = reject;
        D.linkJsAndDom(fileInput);
        D.el.readTextFileContainer.appendChild(fileInput);
        fileInput.click();
    };
    
    return function () {
        return new Promise(readFileSetup);
    };
}(dom99));