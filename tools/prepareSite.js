import { copyFile } from "filesac";




console.log(`Current directory: ${process.cwd()}`);
const docdeps = `./documentation/deps/`;
const modules = `./node_modules/`;


const inputsOutputs = {
    [`${modules}bootstrap/dist/css/bootstrap.min.css`]: `${docdeps}bootstrap.min.css`,
    [`${modules}highlight.js/styles/solarized-dark.css`]: `${docdeps}solarized-dark.css`,
};

Object.entries(inputsOutputs).map(function ([from, to]) {
    copyFile(from, to);
});
