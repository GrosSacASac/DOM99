export {idGenerator};

let next = Number.MAX_SAFE_INTEGER;

/*
generates a predictable new id each time
perfect for DOM id requirements
*/
const idGenerator = (prefix = ``) => {
	const id = `${prefix}${next}`;
	next -= 1;
	return id;
};
