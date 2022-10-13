import __package from "../package.json" assert {type: "json"};

const VERSION = __package.version;
const GLOBAL_NAME = `d`;

const commonOutputOptions = {
    name: GLOBAL_NAME,
    banner: `/* dom99 v${VERSION} */
	/*        Copyright Cyril Walle
Distributed under the Boost Software License, Version 1.0.
    See accompanying file LICENSE.txt or copy at
         https://www.boost.org/LICENSE_1_0.txt */
`,
    // footer: ``,
    // intro: ``,
    // outro: ``,
    interop: false,
    extend: false,
    strict: true,
};

export default [{// eslint-disable-line
    input: `source/dom99.js`,
    treeshake: {
        propertyReadSideEffects: false, // assume reading properties has no side effect
    },
    output: [
        Object.assign({
            format: `iife`,
            file: `built/dom99.iife.js`,
        }, commonOutputOptions),
        Object.assign({
            format: `cjs`,
            file: `built/dom99.cjs.js`,
        }, commonOutputOptions),
        Object.assign({
            format: `amd`,
            file: `built/dom99.amd.js`,
            amd: {
                id: GLOBAL_NAME,
            },
        }, commonOutputOptions),
        Object.assign({
            format: `es`,
            file: `built/dom99.es.js`,
        }, commonOutputOptions),
    ],

    watch: {
        clearScreen: true,
    },
}];
