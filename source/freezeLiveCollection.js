export {freezeLiveCollection};

/**
	freezes HTMLCollection or Node.childNodes
	by returning an array that does not change


	@param {arrayLike} liveCollection
	@return {array}
*/
const freezeLiveCollection = (liveCollection) => {
	return Array.prototype.slice.call(liveCollection);
};
