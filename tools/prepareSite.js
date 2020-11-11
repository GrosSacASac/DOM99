import { copyFile } from "filesac";




const docdeps = `./documentation/deps/`;
const modules = `./node_modules/`;
const thisName = `prepare site`;

const inputsOutputs = {
    [`${modules}bootstrap-css-only/css/bootstrap.min.css`]: `${docdeps}bootstrap.min.css`,
    [`${modules}highlight.js/styles/solarized-dark.css`]: `${docdeps}solarized-dark.css`,
};

Promise.all(
Object.entries(inputsOutputs).map(function ([from, to]) {
    copyFile(from, to);
}),
).then(function () {
    console.log(thisName + ` finished with success !`);
}).catch(function (reason) {
    console.log(`Current directory: ${process.cwd()}`);// eslint-disable-line
    const errorText = thisName + ` failed: ` + String(reason);
    throw new Error(errorText);
});