"use strict";
const {
    copyFile,
    writeTextInFile,
    concatenateFiles
} = require("utilsac");

const docdeps = `./documentation/deps/`;
const modules = `./node_modules/`;
const inputsOutputs = {
    [`${modules}template-mb/template.js`]: `${docdeps}template.js`,
    [`${modules}@babel/polyfill/dist/polyfill.min.js`]: `${docdeps}polyfill.min.js`,
    [`./polyfills/built/remove.js`]: `${docdeps}remove.js`,
    [`./built/dom99Script.es5.min.js`]: `${docdeps}dom99Script.es5.min.js`,
    [`./built/dom99ES.min.js`]: `${docdeps}dom99ES.min.js`,
    // [`./polyfills/built/remove.js`]: `${docdeps}remove.js`,

};

Object.entries(inputsOutputs).map(function ([from, to]) {
    copyFile(from, to);
});
