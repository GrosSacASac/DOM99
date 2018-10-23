"use strict";

const {
    textFileContent,
    writeTextInFile,
    copyFile
} = require("utilsac");

const minify = require("html-minifier").minify;

const skipMinification = false;

var handlebar = require("handlebars")

var pyjson = require("../package.json")

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
    [`documentation/documentation-original.html`]: {
        to: `documentation/documentation.html`,
        options: {
            removeAttributeQuotes: false,
            caseSensitive: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: false,
            collapseWhitespace: false,
            decodeEntities: true,
            html5: true,
            removeComments: false,
            removeEmptyAttributes: true,
            removeRedundantAttributes: false
        }
    },
    [`documentation/index-original.html`]: {
        to: `documentation/index.html`,
        options: OPTIONS
    }
};

Promise.all(
    Object.entries(HTMLFiles).map(function ([from, {to, options}]) {
        return textFileContent(from).then(function (HTMLString) {
            let minifiedHtml;
            if (skipMinification) {
                minifiedHtml = HTMLString;
            } else {
                minifiedHtml = minify(HTMLString, options);
            }
            var handler = new htmlparser.DefaultHandler(function (error, dom) {

            });
            var source = { "description": pyjson.description, "keywords": pyjson.keywords }
            return writeTextInFile(to, handlebar.compile(minifiedHtml)(source));
        });
    })
).then(function () {
    //console.log(thisName + " finished with success !");

}).catch(function (reason) {
    const errorText = thisName + " failed: " + String(reason);
    console.log(errorText);
    throw new Error(errorText);
});


function modifyDescriptionTags (handler) {
   var descriptionMetaTag =  handler.dom[1].children
                                           .filter(x => x.name == 'head')[0]
                                           .children
                                           .filter(x => x.name == 'meta')
   console.log(descriptionMetaTag)
}