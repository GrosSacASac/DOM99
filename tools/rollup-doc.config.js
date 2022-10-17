import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";


export default [{// eslint-disable-line
    input: `documentation/js/documentation.js`,
    output: [{
        format: `es`,
        file: `documentation/deps/documentation.min.js`,
    }],
    plugins: [nodeResolve(), commonjs(),],
    
}];
