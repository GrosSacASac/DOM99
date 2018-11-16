// singleton from dom99create
import {
	create,
	contextFromArray,
	contextFromEvent,
	getParentContext,
	createElement2,
	idGenerator,
	FIRST_VARIABLE_FROM_HTML,
	FIRST_VARIABLE_FROM_USER_AGENT
} from "./dom99create.js";
import {defaultOptions} from "./defaultOptions.js";

const options = defaultOptions;
// to overwrite some options: 
// const options = Object.assign({}, defaultOptions, providedOptions);

const {
	start,
	elements,
	functions,
	variables,
	get,
	element,
	feed,
	plugin,
} = create(options);


export {
	start,
	elements,
	functions,
	variables,
	get,
	element,
	feed,
	plugin,
	options,

	contextFromArray,
	contextFromEvent,
	getParentContext,

	createElement2,
	idGenerator,

	FIRST_VARIABLE_FROM_HTML,
	FIRST_VARIABLE_FROM_USER_AGENT
};
