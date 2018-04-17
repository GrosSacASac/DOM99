
"use strict";
const {
    copyFile,
    writeTextInFilePromiseFromPathAndString,
    concatenateFiles
} = require("utilsac");

const thisName = "buildDemoDependencies";

const inputsOutputs = {
    [`./node_modules/template-mb/template.js`]: `./polyfills/built/template.js`,
    //[`todo`]: `./polyfills/built/polyfill.min.js`,
};

Object.entries(inputsOutputs).map(function ([from, to]) {
    copyFile(from, to);
});
