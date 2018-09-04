// singleton from dom99create
import {
	create,
	contextFromArray,
	contextFromEvent,
	getParentContext,
	createElement2,
	idGenerator
} from "./dom99create.js";


const {
	start,
	activate,
	elements,
	functions,
	variables,
	get,
	feed,
	forgetContext,
	deleteTemplate,
	plugin,
	options,
} = create();


export {
	start,
	activate,
	elements,
	functions,
	variables,
	get,
	feed,
	forgetContext,
	deleteTemplate,
	plugin,
	options,
	
	contextFromArray,
	contextFromEvent,
	getParentContext,
	
	createElement2,
	idGenerator
};

