import {
    textFileContent,
    writeTextInFile,
} from "filesac";

import htmlMinifier from "html-minifier";
const { minify } = htmlMinifier;

const skipMinification = false;
const documentation = `documentation`;


const OPTIONS = {
    removeAttributeQuotes: true,
    caseSensitive: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: false,
    decodeEntities: true,
    html5: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
};


const thisName = `html minify`;

const HTMLFiles = {
    [`${documentation}/documentation-original.html`]: {
        to: `${documentation}/documentation.html`,
        options: {
            ...OPTIONS,
            // override because we display html code from the page itself
            removeAttributeQuotes: false,
            collapseInlineTagWhitespace: false,
            collapseWhitespace: false,
            removeComments: false,
            removeRedundantAttributes: false,
        },
    },
    [`${documentation}/index-original.html`]: {
        to: `${documentation}/index.html`,
        options: OPTIONS,
    },
    [`${documentation}/changelog-original.html`]: {
        to: `${documentation}/changelog.html`,
        options: OPTIONS,
    },
};

(async function () {

    const packageText = await textFileContent(`./package.json`);
    Promise.all(
        Object.entries(HTMLFiles).map(function ([from, { to, options }]) {
            return textFileContent(from).then(function (HTMLString) {
                let minifiedHtml;
                if (skipMinification) {
                    minifiedHtml = HTMLString;
                } else {
                    minifiedHtml = minify(HTMLString, options);
                }
                return writeTextInFile(to, minifiedHtml);
            });
        }),
    ).then(function () {
        console.log(thisName + ` finished with success !`);
    }).catch(function (reason) {
        console.log(`Current directory: ${process.cwd()}`);// eslint-disable-line
        const errorText = thisName + ` failed: ` + String(reason);
        throw new Error(errorText);
    });

})();
