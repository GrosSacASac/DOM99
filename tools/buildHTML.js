/*

*/

"use strict";

const {
    textFileContentPromiseFromPath,
    writeTextInFilePromiseFromPathAndString,
    copyFile
} = require("utilsac");

const minify = require("html-minifier").minify;

const skipMinification = false;

const OPTIONS = {
    removeAttributeQuotes: false,
    caseSensitive: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: false,
    collapseWhitespace: true,
    decodeEntities: true,
    html5: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: false
};


const thisName = "html minify";

const HTMLFiles = {
    [`documentation/documentation-original.html`]: `documentation/documentation.html`,
    [`documentation/index-original.html`]: `documentation/index.html`,
    [``]: ``,
};

Promise.all(
    Object.entries(HTMLFiles).map(function ([from, to]) {
        return textFileContentPromiseFromPath(from).then(function (HTMLString) {
            let minifiedHtml;
            if (skipMinification) {
                minifiedHtml = HTMLString;
            } else {
                minifiedHtml = minify(HTMLString, OPTIONS);
            }
            return writeTextInFilePromiseFromPathAndString(to, minifiedHtml);
        }));
    })
).then(function () {
    //console.log(thisName + " finished with success !");

}).catch(function (reason) {
    const errorText = thisName + " failed: " + String(reason);
    console.log(errorText);
    throw new Error(errorText);
});
