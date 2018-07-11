export {createElement2};

/**
Creates an element with elementDescription 

@param {object} elementDescription tagName key is required

@return {Element}
*/
const createElement2 = function (elementDescription) {
	/*element.setAttribute(attr, value) is good to set
	initial attribute like when html is first loaded
	setAttribute won't change some live things like .value for input,
	for instance, setAttribute is the correct choice for creation
	element.attr = value is good to change the live values
	always follow these words to avoid rare bugs*/
	const element = document.createElement(elementDescription.tagName);
	Object.entries(elementDescription).forEach(function ([key, value]) {
		if (key !== `tagName`) {
			element.setAttribute(key, value);
		}
	});
	return element;
};
