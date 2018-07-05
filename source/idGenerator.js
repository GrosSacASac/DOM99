/*idGenerator()

generates a predictable new id each time
perfect for DOM id requirements
*/

export {idGenerator};

const prefix = `id-`;

let next = Number.MAX_SAFE_INTEGER;

const idGenerator = function () {
	const id = `${prefix}${next}`;
	next -= 1;
	return id;
};
