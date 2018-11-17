//readTextFile.js
/*jslint
    es6, maxerr: 15, browser, devel, fudge, maxlen: 100
*/
/*global
    FileReader, Promise
*/
export {readTextFile, useReadTextFile};

let d;
const useReadTextFile = function (dom99) {
    d = dom99;
	d.functions.xReadFileStart = function (event) {
		const fileObject = event.target.files[0]; // FileList object
		const reader = new FileReader();
		reader.onload = readerOnLoadPrepare(event.target);
		reader.readAsText(fileObject);
	};
};

const readerOnLoadPrepare = function (inputElement) {
    return function (event) {
        inputElement.remove();
        inputElement.readFileResolve(event.target.result);
    };
};

const fileInputDescription = {
    tagName: `input`,
    type: `file`,
    [`data-function`]: `xReadFileStart`
};

const readTextFile = function () {
    return new Promise(function (resolve, reject) {
		const fileInput = d.createElement2(fileInputDescription);
		fileInput.readFileResolve = resolve;
		fileInput.readFileReject = reject;
		d.start(fileInput);
		d.elements.readTextFileContainer.appendChild(fileInput);
		fileInput.click();
	});
};
