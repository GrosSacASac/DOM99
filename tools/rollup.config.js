
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import __package from "../package.json";

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
    namespaceToStringTag: false
};

export default [{
    input: `source/dom99.js`,
    treeshake: {
        propertyReadSideEffects: false // assume reading properties has no side effect
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
                id: GLOBAL_NAME
            }
        }, commonOutputOptions),
        Object.assign({
            format: `es`,
            file: `built/dom99.es.js`
        }, commonOutputOptions),
    ],

    watch: {
        clearScreen: true
    }
},{
    input: `source/dom99.js`,
    treeshake: {
        propertyReadSideEffects: false // assume reading properties has no side effect
    },
    output: [
        Object.assign({
            format: `iife`,
            file: `built/dom99.iife.es5.min.js`,
        }, commonOutputOptions),
    ],

    watch: {
        clearScreen: true
    },
    plugins: [terser({
        ie8: true,
        // drop_console: true,
    })]
},{
    input: `source/dom99.js`,
    treeshake: {
        propertyReadSideEffects: false // assume reading properties has no side effect
    },
    output: [
        Object.assign({
            format: `es`,
            file: `built/dom99.es.min.js`,
        }, commonOutputOptions),
    ],

    watch: {
        clearScreen: true
    },
    plugins: [terser({
        // drop_console: true,
    })]
}, {
    input: `documentation/js/documentation.js`,
    output: [{
        format: `es`,
        file: `documentation/deps/documentation.min.js`
    }],
    plugins: [nodeResolve(), commonjs(), terser({})]
    
}];
