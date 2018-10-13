
"use strict";
const {
    copyFile,
    writeTextInFile,
    concatenateFiles
} = require("utilsac");

const thisName = "buildDemoDependencies";

const inputsOutputs = {
    [`./node_modules/template-mb/template.js`]: `./documentation/deps/template.js`,
    //[`todo`]: `./polyfills/built/polyfill.min.js`,
};

Object.entries(inputsOutputs).map(function ([from, to]) {
    copyFile(from, to);
});
