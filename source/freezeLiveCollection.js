export {freezeLiveCollection};

/**
	freezes HTMLCollection or Node.childNodes
	by returning an array that does not change
	
		
	@param {arrayLike} liveCollection
	@return {array}
*/
const freezeLiveCollection = function (liveCollection) {
	const length = liveCollection.length;
	const frozenArray = [];
	let i;
	for (i = 0; i < length; i += 1) {
		frozenArray.push(liveCollection[i]);
	}
	return frozenArray;
};

/*todo compare with different implementation:

const freezeLiveCollection = function (liveCollection) {
	return Array.prototype.slice.call(liveCollection);
};
*/
