
"use strict";
const {
    textFileContentPromiseFromPath,
    writeTextInFilePromiseFromPathAndString,
    concatenateFiles
} = require("utilsac");

const thisName = "build module and require";

const dom99file = "js/dom99.js";
const dom99es5file = "built/dom99.es5.js";

const templateModule = "js/moduleExport.js";
const templateRequire = "js/requireExport.js";

const moduleDestination = "built/dom99Module.js";
const modulees5Destination = "built/dom99Module.es5.js";
const requireDestination = "built/dom99Require.js";
const requirees5Destination = "built/dom99Require.es5.js";
const separator = "";



const dom99SourcePromise = textFileContentPromiseFromPath(dom99file);
const templateModulePromise = textFileContentPromiseFromPath(templateModule);
const templateRequirePromise = textFileContentPromiseFromPath(templateRequire);
;
Promise.all([
    concatenateFiles([templateModule, dom99file], moduleDestination, separator),
    concatenateFiles([dom99file, templateRequire], requireDestination, separator),
    concatenateFiles([templateModule, dom99es5file], modulees5Destination, separator),
    concatenateFiles([dom99es5file, templateRequire], requirees5Destination, separator)
]).then(function () {
    ;
 }).catch(function (reason) {
  const errorText = thisName + " failed: " + String(reason);
  console.log(errorText);
  throw new Error(errorText);
});
