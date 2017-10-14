
"use strict";
const {
    textFileContentPromiseFromPath,
    writeTextInFilePromiseFromPathAndString,
    concatenateFiles
} = require("utilsac");

const thisName = "build module and require";

const dom99file = "js/dom99.js";
const templateModule = "js/moduleExport.js";
const moduleDestination = "built/dom99Module.js";
const templateRequire = "js/requireExport.js";
const requireDestination = "built/dom99Require.js";
const separator = "";



const dom99SourcePromise = textFileContentPromiseFromPath(dom99file);
const templateModulePromise = textFileContentPromiseFromPath(templateModule);
const templateRequirePromise = textFileContentPromiseFromPath(templateRequire);
;
Promise.all([
    concatenateFiles([dom99file, templateModule], moduleDestination, separator),
    concatenateFiles([dom99file, templateRequire], requireDestination, separator)
]).then(function () {
    ;
 }).catch(function (reason) {
  const errorText = thisName + " failed: " + String(reason);
  console.log(errorText);
  throw new Error(errorText);
});
