export {isObjectOrArray};

/**
@private

@param {any} x
@return {boolean}
*/
const isObjectOrArray = (x) => {
	/* array or object */
	return typeof x === `object` && x !== null;
};
