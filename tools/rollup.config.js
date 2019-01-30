// rollup.config.js
import __package from "../package.json";

const VERSION = __package.version;
const GLOBAL_NAME = `d`;

	const commonOutputOptions = {
	// core output options
	name : GLOBAL_NAME,
	// globals: [],

	// advanced output options
	// paths: {},
	banner : `/* dom99 v${VERSION} */
	/*        Copyright Cyril Walle
Distributed under the Boost Software License, Version 1.0.
    See accompanying file LICENSE.txt or copy at
         https://www.boost.org/LICENSE_1_0.txt */
`,
	// footer: ``,
	// intro: ``,
	// outro: ``,
	// sourcemap,
	// sourcemapFile,
	interop: false,
	extend: false,

	// danger zone
	// exports,
	// indent,
	strict: true,
	// freeze,
	namespaceToStringTag: false

	// experimental
	// entryFileNames,
	// chunkFileNames,
	// assetFileNames
};

export default { // can be an array (for multiple inputs)
  // core input options
  input: `source/dom99.js`,     // required
  // external: [],
  //plugins: [],

  // advanced input options
  // onwarn,
  // perf,

  // danger zone
  // acorn,
  // acornInjectPlugins,
  treeshake: {
	  pureExternalModules: false,
	  propertyReadSideEffects: false // assume reading properties has no side effect
  },
  // context,
  // moduleContext,


  output: [  // required (can be an array, for multiple outputs)
	Object.assign({
		format: `iife`,
		file : `built/dom99Script.js`,
	}, commonOutputOptions),
	Object.assign({
		format: `cjs`,
		file : `built/dom99Require.js`,
	}, commonOutputOptions),
	Object.assign({
		format: `amd`,
		file : `built/dom99Amd.js`,
		amd: {
			id: GLOBAL_NAME
		}
	}, commonOutputOptions),
	Object.assign({
		format: `es`,
		file : `built/dom99ES.js`
	}, commonOutputOptions),
  ],

  watch: {
    // chokidar,
    // include,
    // exclude,
    clearScreen: true
  }
};
