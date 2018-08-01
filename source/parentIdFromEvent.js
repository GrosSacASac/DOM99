export {firstAncestorValue, idFromEvent, idFromNode};


const firstAncestorValue = function (node, accessor) {
	const potentialValue = accessor(node);
	if (potentialValue) {
		return potentialValue;
	}
	const parent = node.parentNode;
	if (parent) {
		return firstAncestorValue(parent, accessor);
	}
	// return undefined;
};

const getDataId = function (node) {
	return node.getAttribute(`data-id`);
};

const idFromNode = function (node) {
	return firstAncestorValue(node, getDataId);
};

// alternative
// const idFromNode = function (node) {
	// if (node.hasAttribute(`data-id`)) {
		// return node.getAttribute(`data-id`);
	// }
	// const parent = node.parentNode;
	// if (parent) {
		// return idFromNode(parent);
	// }
// };


/**
@param {Event}

@return {string} dataId string
*/
const idFromEvent = function (event) {
	return idFromNode(event.target);
};