

// singleton from dom99create
export {
    start,
    elements,
    functions,
    variables,
    get,
    element,
    feed,
    plugin,
};
export * from "./dom99create.js";
import { create } from "./dom99create.js";
import { defaultOptions } from "./defaultOptions.js";

/* to overwrite some options: 
const options = Object.assign({}, defaultOptions, providedOptions); */

const {
    start,
    elements,
    functions,
    variables,
    get,
    element,
    feed,
    plugin,
} = create(defaultOptions);
