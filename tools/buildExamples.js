import rollup from "rollup";

const files = [
    "templates1",
    "templates2",
    "templates3",
    "templates4",
    "main",
    "dev",
    "limited",
    "test",
    "chat"
];


const everythingFinishPromise = Promise.all(files.map(function (fileName) {
    const inputOptions = {
        input: ""
    };
    const outputOptions = {
        format: "iife",
        file: ""
    };
    inputOptions.input = `examples/js/${fileName}.js`;
    outputOptions.file = `examples/js/built/${fileName}.js`;
    return build(inputOptions, outputOptions)
}));

async function build(inputOptions, outputOptions) {
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);
    const written = await bundle.write(outputOptions);
    return written;
}

// everythingFinishPromise.then(function () {
//     console.log("success");
// });
