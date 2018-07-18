export {parentIdFromEvent};

/**
@param {Event}

@return {string} dataId string
*/
const parentIdFromEvent = function (event) {
	const target = event.target;
	
	return idFromNode(target);
};


const idFromNode = function (node) {
	if (node.hasAttribute(`data-id`)) {
		return node.getAttribute(`data-id`);
	}
	const parent = node.parentNode;
	if (parent) {
		return idFromNode(parent);
	}
	return ``;
};
