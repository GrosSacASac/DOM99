export {isObjectOrArray};

/**
@private

@param {any} x
@return {boolean}
*/
const isObjectOrArray = function (x) {
	/*array or object*/
	return typeof x === `object` && x !== null;
};
