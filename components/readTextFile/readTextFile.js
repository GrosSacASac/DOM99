//readTextFile.js
/*jslint
    es6, maxerr: 15, browser, devel, fudge, maxlen: 100
*/
/*global
    FileReader, Promise
*/
import d from "../../built/dom99Module.js";
export {readTextFile};

const fileInputDescription = {
    tagName: `input`,
    type: `file`,
    [`data-function`]: `xReadFileStart`
};

const readerOnLoadPrepare = function (inputElement) {
    return function (event) {
        inputElement.remove();
        inputElement.readFileResolve(event.target.result);
    };
};

d.functions.xReadFileStart = function (event) {
    const fileObject = event.target.files[0]; // FileList object
    const reader = new FileReader();
    reader.onload = readerOnLoadPrepare(event.target);
    reader.readAsText(fileObject);
};

const readFileSetup = function (resolve, reject) {
    const fileInput = d.createElement2(fileInputDescription);
    fileInput.readFileResolve = resolve;
    fileInput.readFileReject = reject;
    d.activate(fileInput);
    d.elements.readTextFileContainer.appendChild(fileInput);
    fileInput.click();
};

const readTextFile = function () {
    return new Promise(readFileSetup);
};
