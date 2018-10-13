'use strict';

(function () {
	'use strict';

	/**
 Creates an element with elementDescription
 
 @param {object} elementDescription tagName key is required
 
 @return {Element}
 */

	var _valueElseMissDecorat, _valueElseMissDecorat2, _valueElseMissDecorat3, _valueElseMissDecorat4;

	var createElement2 = function createElement2(elementDescription) {
		/*element.setAttribute(attr, value) is good to set
  initial attribute like when html is first loaded
  setAttribute won't change some live things like .value for input,
  for instance, setAttribute is the correct choice for creation
  element.attr = value is good to change the live values
  always follow these words to avoid rare bugs*/
		var element = document.createElement(elementDescription.tagName);
		Object.entries(elementDescription).forEach(function (_ref) {
			var key = _ref[0],
			    value = _ref[1];

			if (key !== 'tagName') {
				element.setAttribute(key, value);
			}
		});
		return element;
	};

	/**
 @private
 
 @param {any} x
 @return {boolean}
 */
	var isObjectOrArray = function isObjectOrArray(x) {
		/*array or object*/
		return typeof x === 'object' && x !== null;
	};

	var copyArrayShallow = function copyArrayShallow(array) {
		return array.slice();
	};

	/**
 	freezes HTMLCollection or Node.childNodes
 	by returning an array that does not change
 
 
 	@param {arrayLike} liveCollection
 	@return {array}
 */
	var freezeLiveCollection = function freezeLiveCollection(liveCollection) {
		return Array.prototype.slice.call(liveCollection);
	};

	var firstAncestorValue = function firstAncestorValue(node, accessor) {
		var potentialValue = accessor(node);
		if (potentialValue) {
			return potentialValue;
		}
		var parent = node.parentNode;
		if (parent) {
			return firstAncestorValue(parent, accessor);
		}
	};

	var pushOrCreateArrayAt = function pushOrCreateArrayAt(object, key, valueToPush) {
		// don't need to use hasOwnProp as there is no array in the prototype
		// but still use it to avoid a warning
		// const potentialArray = object[key]
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			// eventually the if is always true
			object[key].push(valueToPush);
		} else {
			// only for the first time
			object[key] = [valueToPush];
		}
	};

	var next = Number.MAX_SAFE_INTEGER;

	/*
 generates a predictable new id each time
 perfect for DOM id requirements
 */
	var idGenerator = function idGenerator() {
		var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		var id = '' + prefix + next;
		next -= 1;
		return id;
	};

	var ELEMENT_NODE = 1; // document.body.ELEMENT_NODE === 1
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	var NAME = 'DOM99';
	var CONTEXT = NAME + '_C';
	var ELEMENT_LIST_ITEM = NAME + '_I';
	var CUSTOM_ELEMENT = NAME + '_X';
	var LIST_CHILDREN = NAME + '_R';
	var INSIDE_SYMBOL = '>';

	var MISS = 'MISS';
	var valueElseMissDecorator = function valueElseMissDecorator(object) {
		/*Decorator function around an Object to provide a default value
  Decorated object must have a MISS key with the default value associated
  Arrays are also objects
  */
		return function (key) {
			if (hasOwnProperty.call(object, key)) {
				return object[key];
			}
			return object[MISS];
		};
	};

	var removeNode = function removeNode(node) {
		node.remove();
	};

	var propertyFromTag = valueElseMissDecorator((_valueElseMissDecorat = {}, _valueElseMissDecorat['INPUT'] = 'value', _valueElseMissDecorat['TEXTAREA'] = 'value', _valueElseMissDecorat['PROGRESS'] = 'value', _valueElseMissDecorat['SELECT'] = 'value', _valueElseMissDecorat['IMG'] = 'src', _valueElseMissDecorat['SOURCE'] = 'src', _valueElseMissDecorat['AUDIO'] = 'src', _valueElseMissDecorat['VIDEO'] = 'src', _valueElseMissDecorat['TRACK'] = 'src', _valueElseMissDecorat['SCRIPT'] = 'src', _valueElseMissDecorat['OPTION'] = 'value', _valueElseMissDecorat['LINK'] = 'href', _valueElseMissDecorat['DETAILS'] = 'open', _valueElseMissDecorat[MISS] = 'textContent', _valueElseMissDecorat));

	var propertyFromInputType = valueElseMissDecorator((_valueElseMissDecorat2 = {}, _valueElseMissDecorat2['checkbox'] = 'checked', _valueElseMissDecorat2['radio'] = 'checked', _valueElseMissDecorat2[MISS] = 'value', _valueElseMissDecorat2));

	var inputEventFromType = valueElseMissDecorator((_valueElseMissDecorat3 = {}, _valueElseMissDecorat3['checkbox'] = 'change', _valueElseMissDecorat3['radio'] = 'change', _valueElseMissDecorat3['range'] = 'change', _valueElseMissDecorat3['file'] = 'change', _valueElseMissDecorat3[MISS] = 'input', _valueElseMissDecorat3));

	var eventFromTag = valueElseMissDecorator((_valueElseMissDecorat4 = {}, _valueElseMissDecorat4['SELECT'] = 'change', _valueElseMissDecorat4['TEXTAREA'] = 'input', _valueElseMissDecorat4['BUTTON'] = 'click', _valueElseMissDecorat4[MISS] = 'click', _valueElseMissDecorat4));

	var defaultDirectives = {
		function: 'data-function',
		variable: 'data-variable',
		element: 'data-element',
		list: 'data-list',
		inside: 'data-inside',
		template: 'data-template'
	};

	var propertyFromElement = function propertyFromElement(element) {
		// defines what is changing when data-variable is changing
		// for <p> it is textContent
		var tagName = void 0;
		if (element.tagName !== undefined) {
			tagName = element.tagName;
		} else {
			tagName = element;
		}
		if (tagName === 'INPUT') {
			return propertyFromInputType(element.type);
		}
		return propertyFromTag(tagName);
	};

	var eventNameFromElement = function eventNameFromElement(element) {
		// defines the default event for an element
		// i.e. when data-function is omitting the event
		var tagName = element.tagName;
		if (tagName === 'INPUT') {
			return inputEventFromType(element.type);
		}
		return eventFromTag(tagName);
	};

	var elementsDeepForEach = function elementsDeepForEach(startElement, callBack) {
		callBack(startElement);
		// https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/firstElementChild
		// is not supported in Edge/Safari on DocumentFragments
		// let element = startElement.firstElementChild;
		// this does not produce an error, but simply returns undefined
		var node = startElement.firstChild;
		while (node) {
			if (node.nodeType === ELEMENT_NODE) {
				elementsDeepForEach(node, callBack);
				node = node.nextElementSibling;
			} else {
				node = node.nextSibling;
			}
		}
	};

	var customElementNameFromElement = function customElementNameFromElement(element) {
		var isAttributeValue = element.getAttribute('is');
		if (isAttributeValue) {
			return isAttributeValue;
		}
		return element.tagName.toLowerCase();
	};

	var addEventListener = function addEventListener(element, eventName, callBack) {
		var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

		element.addEventListener(eventName, callBack, useCapture);
	};

	var cloneTemplate = function cloneTemplate(template) {
		if (!template) {
			console.error('Template missing <template data-template="d-name">\n\t\t\t\tTemplate Content\n\t\t\t</template>');
		}
		if (!template.content) {
			console.error('template.content is undefined, this can happen if a template is inside another template. Use only top level templates, also use recommended polyfills');
		}
		return document.importNode(template.content, true);
	};

	/**
 @param {Element}
 
 @return {string | undefined} context
 */
	var contextFromElement = function contextFromElement(element) {
		return element[CONTEXT];
	};

	/**
 contextFromEvent gets the starting path for an event issued inside a component
 
 in combination with contextFromArray it allows to access sibling elements and variables
 
 d.functions.clickedButton = (event) => {
 	d.elements[d.contextFromArray([contextFromEvent(event), `other`])]
 		.classList.add(`active`);
 };
 
 @param {Event} event
 
 @return {string} path
 */
	var contextFromEvent = function contextFromEvent(event) {
		return firstAncestorValue(event.target, contextFromElement) || '';
	};

	/**
 contextFromArray joins paths to create a valid path to use with
 
 d.variables[path]
 d.elements[path]
 
 @param {array} Array
 
 @return {string} path
 */
	var contextFromArray = function contextFromArray(pathIn) {
		return pathIn.join(INSIDE_SYMBOL);
	};

	/**
 getParentContext
 
 @param {string} context
 
 @return {string} parentContext
 */
	var getParentContext = function getParentContext(context) {
		var split = context.split(INSIDE_SYMBOL);
		split.pop();
		return split.join(INSIDE_SYMBOL);
	};

	var contextFromArrayWith = function contextFromArrayWith(pathIn, withWhat) {
		if (pathIn.length === 0) {
			return withWhat;
		}
		return '' + contextFromArray(pathIn) + INSIDE_SYMBOL + withWhat;
	};

	var normalizeStartPath = function normalizeStartPath(startPath) {
		// this is because `a>b>c` is irregular
		// `a>b>c>` or `>a>b>c` would not need such normalization
		if (startPath) {
			return '' + startPath + INSIDE_SYMBOL;
		}
		return startPath;
	};

	var deleteAllStartsWith = function deleteAllStartsWith(object, prefix) {
		Object.keys(object).forEach(function (key) {
			if (key.startsWith(prefix)) {
				delete object[key];
			}
		});
	};

	// good candiates for firstVariableValueStrategy :
	var FIRST_VARIABLE_FROM_HTML = function FIRST_VARIABLE_FROM_HTML(element) {
		if ('defaultValue' in element) {
			return element.defaultValue;
		}
		if ('open' in element) {
			// <details>
			return element.open;
		}
		return element.textContent;
	};

	var FIRST_VARIABLE_FROM_USER_AGENT = function FIRST_VARIABLE_FROM_USER_AGENT(element) {
		return element.value || FIRST_VARIABLE_FROM_HTML(element);
	};

	var prepareGet = function prepareGet(input, tojoin) {
		var stringPath = void 0;
		if (Array.isArray(input)) {
			stringPath = contextFromArray(input);
		} else {
			stringPath = input;
		}
		if (tojoin) {
			stringPath = '' + stringPath + INSIDE_SYMBOL + tojoin;
		}
		return stringPath;
	};

	var create = function create() {
		var variableSubscribers = {};
		var listSubscribers = {};

		/**
  Retrieve variable values that have been modified by d.feed or
  2 way data binded element with data-variable attribute (Read only)
  		@param {string} path
  		@return {any}
  */
		var variables = {};

		/**
  Retrieve elements that have data-element attribute (Read only)
  		@param {string} path
  		@return {Element}
  */
		var elements = {};
		var templateFromName = {};

		/**
  Set event listener that are going to be attached to elements
  with data-function
  		@param {string} name
  		@return {function}
  */
		var functions = {};

		var pathIn = [];

		var functionPlugins = [];
		var alreadyHooked = false;
		var feedPlugins = [];
		var clonePlugins = [];

		var directivePairs = void 0;

		/**
  internal dom99 options, look at dom99ConfigurationExample.js
  to learn how to configure it
  */
		var options = {
			doneSymbol: '*',
			tokenSeparator: '-',
			listSeparator: ' ',
			firstVariableValueStrategy: undefined,
			directives: defaultDirectives,
			propertyFromElement: propertyFromElement,
			eventNameFromElement: eventNameFromElement,
			tagNamesForUserInput: ['INPUT', 'TEXTAREA', 'SELECT', 'DETAILS']
		};

		/**
  contextFromArray joins paths to create a valid path to use with
  		d.variables[path]
  d.elements[path]
  		@param {array} Array
  		@return {string} path
  */
		var contextFromArray = function contextFromArray(pathIn) {
			return pathIn.join(INSIDE_SYMBOL);
		};

		var enterObject = function enterObject(key) {
			pathIn.push(key);
		};

		var leaveObject = function leaveObject() {
			pathIn.pop();
		};

		/**
  removes a path and all its child from the dom99 singleton memory
  		Removing a DOM element with .remove() or .innerHTML = `` will NOT delete
  	all the element references if you used the underlying nodes in dom99
  	A removed element will continue receive invisible automatic updates
  	it also takes space in the memory.
  			And all of this doesn't matter for 1-100 elements, but it does matter,
  	for an infinitely growing list
  		@param {string} path
  */
		var forgetContext = function forgetContext(path) {
			deleteAllStartsWith(variableSubscribers, path);
			deleteAllStartsWith(listSubscribers, path);
			deleteAllStartsWith(variables, path);
			deleteAllStartsWith(elements, path);
		};

		var notifyOneVariableSubscriber = function notifyOneVariableSubscriber(variableSubscriber, value) {
			variableSubscriber[options.propertyFromElement(variableSubscriber)] = value;
		};

		var notifyVariableSubscribers = function notifyVariableSubscribers(subscribers, value) {
			if (value === undefined) {
				// undefined can be used to use the default value
				// without explicit if else
				return;
			}
			subscribers.forEach(function (variableSubscriber) {
				notifyOneVariableSubscriber(variableSubscriber, value);
			});
		};

		var notifyOneListSubscriber = function notifyOneListSubscriber(listContainer, startPath, data) {
			var fragment = document.createDocumentFragment();
			if (hasOwnProperty.call(listContainer, CUSTOM_ELEMENT) && hasOwnProperty.call(templateFromName, listContainer[CUSTOM_ELEMENT])) {
				// composing with custom element
				var template = templateFromName[listContainer[CUSTOM_ELEMENT]];
				var previous = copyArrayShallow(pathIn);
				pathIn = startPath.split(INSIDE_SYMBOL);
				var normalizedPath = normalizeStartPath(startPath);
				var newLength = data.length;
				var oldLength = void 0;
				var pathInside = void 0;
				if (hasOwnProperty.call(listContainer, LIST_CHILDREN)) {
					// remove nodes and variable subscribers that are not used
					oldLength = listContainer[LIST_CHILDREN].length;
					if (oldLength > newLength) {
						var i = void 0;
						for (i = newLength; i < oldLength; i += 1) {
							pathInside = '' + normalizedPath + i;
							listContainer[LIST_CHILDREN][i].forEach(removeNode);
							forgetContext(pathInside);
						}
						listContainer[LIST_CHILDREN].length = newLength;
					}
				} else {
					listContainer[LIST_CHILDREN] = [];
					oldLength = 0;
				}

				data.forEach(function (dataInside, i) {
					pathInside = '' + normalizedPath + i;
					feed(pathInside, dataInside);
					if (i >= oldLength) {
						// cannot remove document fragment after insert because they empty themselves
						// have to freeze the children to still have a reference
						var activatedClone = activateCloneTemplate(template, String(i));
						listContainer[LIST_CHILDREN].push(freezeLiveCollection(activatedClone.childNodes));
						fragment.appendChild(activatedClone);
					}
					// else reusing, feed updated with new data the old nodes
				});
				pathIn = previous;
			} else {
				listContainer.innerHTML = '';
				var listItemTagName = listContainer[ELEMENT_LIST_ITEM];
				var listItemProperty = options.propertyFromElement(listItemTagName.toUpperCase());
				data.forEach(function (value) {
					var listItem = document.createElement(listItemTagName);
					if (isObjectOrArray(value)) {
						Object.assign(listItem, value);
					} else {
						listItem[listItemProperty] = value;
					}
					fragment.appendChild(listItem);
				});
			}
			listContainer.appendChild(fragment);
		};

		var notifyListSubscribers = function notifyListSubscribers(subscribers, startPath, data) {
			subscribers.forEach(function (listContainer) {
				notifyOneListSubscriber(listContainer, startPath, data);
			});
		};

		/**
  Feed data, for element with corresponding data-variable and data-list
  		@param {string} startPath
  @param {any} data
  		@or
  		@param {any} data
  		@return {Element} startElement
  */
		var feed = function feed(startPath, data) {
			if (data === undefined) {
				data = startPath;
				startPath = '';
			}
			if (isObjectOrArray(startPath)) {
				console.error('Incorrect types passed to d.feed,\n\t\t\t\td.feed(string, object) or d.feed(object)');
			}
			if (!alreadyHooked) {
				feedHook(startPath, data);
			}
			if (!isObjectOrArray(data)) {
				variables[startPath] = data;
				if (hasOwnProperty.call(variableSubscribers, startPath)) {
					notifyVariableSubscribers(variableSubscribers[startPath], data);
				}
			} else if (Array.isArray(data)) {
				variables[startPath] = data;
				if (hasOwnProperty.call(listSubscribers, startPath)) {
					notifyListSubscribers(listSubscribers[startPath], startPath, data);
				}
			} else {
				var normalizedPath = normalizeStartPath(startPath);
				alreadyHooked = true;
				Object.entries(data).forEach(function (_ref2) {
					var key = _ref2[0],
					    value = _ref2[1];

					var path = '' + normalizedPath + key;
					feed(path, value);
				});
				alreadyHooked = false;
			}
		};

		var get = function get(input, tojoin) {
			return variables[prepareGet(input, tojoin)];
		};

		var getElement = function getElement(input, tojoin) {
			return elements[prepareGet(input, tojoin)];
		};

		var applyFunctionOriginal = function applyFunctionOriginal(element, eventName, functionName) {
			if (!functions[functionName]) {
				console.error('Event listener ' + functionName + ' not found.');
			}
			addEventListener(element, eventName, functions[functionName]);
			// todo only add context when not top level ? (inside sommething)
			element[CONTEXT] = contextFromArray(pathIn);
		};

		var applyFunction = applyFunctionOriginal;

		var applyFunctions = function applyFunctions(element, attributeValue) {
			attributeValue.split(options.listSeparator).forEach(function (attributeValueSplit) {
				var tokens = attributeValueSplit.split(options.tokenSeparator);
				var functionName = void 0;
				var eventName = void 0;
				if (tokens.length === 1) {
					functionName = tokens[0];
					eventName = options.eventNameFromElement(element);
				} else {
					eventName = tokens[0];
					functionName = tokens[1];
				}
				applyFunction(element, eventName, functionName);
			});
		};

		var applylist = function applylist(element, attributeValue) {
			var _attributeValue$split = attributeValue.split(options.tokenSeparator),
			    variableName = _attributeValue$split[0],
			    listItemTagName = _attributeValue$split[1],
			    optional = _attributeValue$split[2];

			var fullName = '-';

			if (!variableName) {
				console.error(element, 'Use ' + options.directives.list + '="variableName-tagName" format!');
			}

			if (optional) {
				// for custom elements
				fullName = listItemTagName + '-' + optional;
				element[CUSTOM_ELEMENT] = fullName;
			} else {
				element[ELEMENT_LIST_ITEM] = listItemTagName;
			}

			// could send path as array directly
			// but have to change notifyOneListSubscriber to take in path as Array or String
			// before
			var path = contextFromArrayWith(pathIn, variableName);

			pushOrCreateArrayAt(listSubscribers, path, element);

			if (hasOwnProperty.call(variables, path)) {
				notifyOneListSubscriber(element, path, variables[path]);
			}
		};

		var applyVariable = function applyVariable(element, variableName) {
			/* two-way bind
   example : called for <input data-variable="a">
   in this example the variableName = `a`
   we push the <input data-variable="a" > element in the array
   that holds all elements which share this same `a` variable
   undefined assignment are ignored, instead use empty string*/

			if (!variableName) {
				console.error(element, 'Use ' + options.directives.variable + '="variableName" format!');
			}

			var path = contextFromArrayWith(pathIn, variableName);
			pushOrCreateArrayAt(variableSubscribers, path, element);

			if (variables[path] !== undefined) {
				notifyOneVariableSubscriber(element, variables[path]);
			}

			if (!options.tagNamesForUserInput.includes(element.tagName)) {
				return;
			}
			var broadcastValue = function broadcastValue(event) {
				//wil call setter to broadcast the value
				var value = element[options.propertyFromElement(element)];
				variables[path] = value;
				feedHook(path, value);
				// would notify everything including itself
				// notifyVariableSubscribers(variableSubscribers[path], value);
				variableSubscribers[path].forEach(function (variableSubscriber) {
					if (variableSubscriber !== element) {
						notifyOneVariableSubscriber(variableSubscriber, value);
					}
				});
			};
			addEventListener(element, options.eventNameFromElement(element), broadcastValue);
		};

		var applyDirectiveElement = function applyDirectiveElement(element, attributeValue) {
			/* stores element for direct access !*/
			var elementName = attributeValue;

			if (!elementName) {
				console.error(element, 'Use ' + options.directives.element + '="elementName" format!');
			}
			var path = contextFromArrayWith(pathIn, elementName);
			elements[path] = element;
		};

		var applyTemplate = function applyTemplate(element, attributeValue) {
			/* stores a template element for later reuse !*/
			if (!attributeValue) {
				console.error(element, 'Use ' + options.directives.template + '="d-name" format!');
			}

			templateFromName[attributeValue] = element;
		};

		var activateCloneTemplate = function activateCloneTemplate(template, key) {
			/* clones a template and activates it
   */
			enterObject(key);
			var activatedClone = cloneTemplate(template);
			activate(activatedClone);
			cloneHook();
			leaveObject();
			return activatedClone;
		};

		var applyInside = function applyInside(element, key) {
			/* looks for an html template to render
   also calls applyDirectiveElement with key!*/
			if (!key) {
				console.error(element, 'Use ' + options.directives.inside + '="insidewhat" format!');
			}

			var template = templateFromName[customElementNameFromElement(element)];

			if (template) {
				var activatedClone = activateCloneTemplate(template, key);
				element.appendChild(activatedClone);
			} else {
				// avoid infinite loop
				element.setAttribute(options.directives.inside, options.doneSymbol + key);
				// parse children under name space (encapsulation of variable names)
				enterObject(key);
				activate(element);
				leaveObject();
			}
		};

		/**
  Removes a template from the DOM and from dom99 memory
  @param {string} name
  		*/
		var deleteTemplate = function deleteTemplate(name) {
			if (!hasOwnProperty.call(templateFromName, name)) {
				console.error('<template ' + options.directives.template + '=' + name + '>\n\t\t\t\t</template> not found or already deleted and removed.');
			}
			templateFromName[name].remove();
			delete templateFromName[name];
		};

		var tryApplyDirectives = function tryApplyDirectives(element) {
			/* looks if the element has dom99 specific attributes and tries to handle it*/
			// todo make sure no impact-full read write
			if (!element.hasAttribute) {
				// can this if be removed eventually ? --> no
				return;
			}

			// spellcheck atributes
			// const directives = Object.values(options.directives);
			// Array.prototype.slice.call(element.attributes).forEach((attribute) => {
			// 	if (attribute.nodeName.startsWith(`data`)) {
			// 		if (!directives.includes(attribute.nodeName)) {
			// 			console.warn(`dom99 does not recognize ${attribute.nodeName}`);
			// 		}
			// 	}
			// });

			directivePairs.forEach(function (_ref3) {
				var directiveName = _ref3[0],
				    applyDirective = _ref3[1];

				if (!element.hasAttribute(directiveName)) {
					return;
				}
				var attributeValue = element.getAttribute(directiveName);
				if (attributeValue[0] === options.doneSymbol) {
					return;
				}
				applyDirective(element, attributeValue);
				// ensure the directive is only applied once
				element.setAttribute(directiveName, '' + options.doneSymbol + attributeValue);
			});
			if (element.hasAttribute(options.directives.inside) || element.hasAttribute(options.directives.list)) {
				return;
			}
			/*using a custom element without data-inside*/
			var customName = customElementNameFromElement(element);
			if (hasOwnProperty.call(templateFromName, customName)) {
				element.appendChild(cloneTemplate(templateFromName[customName]));
			}
		};

		/**
  Activates the DOM by reading data- attributes, starting from startElement
  and walking inside its tree
  		@param {Element} startElement
  		@return {Element} startElement
  */
		var activate = function activate() {
			var startElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;

			//build array only once and use up to date options, they should not reset twice
			if (!directivePairs) {
				directivePairs = [
				/*order is relevant applyVariable being before applyFunction,
    we can use the just changed live variable in the bind function*/
				[options.directives.element, applyDirectiveElement], [options.directives.variable, applyVariable], [options.directives.function, applyFunctions], [options.directives.list, applylist], [options.directives.inside, applyInside], [options.directives.template, applyTemplate]];
			}
			elementsDeepForEach(startElement, tryApplyDirectives);
			return startElement;
		};

		/**
  Convenience function for activate, feed and assigning functions from
  an object
  		@param {object} dataFunctions
  @param {object} initialFeed
  @param {Element} startElement
  @param {function} callBack
  		@return {any} callBack return value
  */
		var start = function start() {
			var dataFunctions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var initialFeed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var startElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;
			var callBack = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;


			Object.assign(functions, dataFunctions);
			feed(initialFeed);
			activate(startElement);
			if (!callBack) {
				return;
			}
			return callBack();
		};

		var cloneHook = function cloneHook() {
			var context = contextFromArray(pathIn);
			clonePlugins.forEach(function (clonePlugin) {
				clonePlugin(context);
			});
		};

		var feedHook = function feedHook(startPath, data) {
			feedPlugins.forEach(function (feedPlugin) {
				feedPlugin(startPath, data);
			});
		};

		/**
  Plug in a plugin (hook) into the core functionality
  		@param {object} featureToPlugIn
  		*/
		var plugin = function plugin(featureToPlugIn) {
			if (!isObjectOrArray(featureToPlugIn)) {
				console.error('plugin({\n\t\t\t\ttype,\n\t\t\t\tplugin\n\t\t\t});');
			}
			if (featureToPlugIn.type === 'function') {
				functionPlugins.push(featureToPlugIn.plugin);
				applyFunction = function applyFunction(element, eventName, functionName) {
					var defaultPrevented = false;
					var preventDefault = function preventDefault() {
						defaultPrevented = true;
					};
					functionPlugins.forEach(function (pluginFunction) {
						pluginFunction(element, eventName, functionName, functions, preventDefault);
					});
					if (defaultPrevented) {
						return;
					}
					applyFunctionOriginal(element, eventName, functionName);
				};
			} else if (featureToPlugIn.type === 'variable') {
				feedPlugins.push(featureToPlugIn.plugin);
			} else if (featureToPlugIn.type === 'cloned') {
				clonePlugins.push(featureToPlugIn.plugin);
			} else {
				console.warn('plugin type ' + featureToPlugIn.type + ' not yet implemented');
			}
		};

		return {
			start: start,
			activate: activate,
			elements: elements,
			functions: functions,
			variables: variables,
			get: get,
			element: getElement,
			feed: feed,
			forgetContext: forgetContext,
			deleteTemplate: deleteTemplate,
			plugin: plugin,
			options: options
		};
	};

	// singleton from dom99create


	var _create = create(),
	    start = _create.start,
	    activate = _create.activate,
	    elements = _create.elements,
	    functions = _create.functions,
	    variables = _create.variables,
	    get = _create.get,
	    element = _create.element,
	    feed = _create.feed,
	    forgetContext = _create.forgetContext,
	    deleteTemplate = _create.deleteTemplate,
	    plugin = _create.plugin,
	    options = _create.options;

	var d = /*#__PURE__*/Object.freeze({
		start: start,
		activate: activate,
		elements: elements,
		functions: functions,
		variables: variables,
		get: get,
		element: element,
		feed: feed,
		forgetContext: forgetContext,
		deleteTemplate: deleteTemplate,
		plugin: plugin,
		options: options,
		contextFromArray: contextFromArray,
		contextFromEvent: contextFromEvent,
		getParentContext: getParentContext,
		createElement2: createElement2,
		idGenerator: idGenerator,
		FIRST_VARIABLE_FROM_HTML: FIRST_VARIABLE_FROM_HTML,
		FIRST_VARIABLE_FROM_USER_AGENT: FIRST_VARIABLE_FROM_USER_AGENT
	});

	//yesNoDialog.js

	var d$1 = void 0;
	var thisNameSpace = 'yesNoDialog';
	var cssPrefix = 'yes-no-dialog';
	var cssDialogActiveClass = cssPrefix + '-active';
	var yesNoSymbol = 0;
	var promptSymbol = 1;

	var yesButton = void 0;
	var yesNoContainer = void 0;
	var promptContainer = void 0;
	var promptInput = void 0;

	var yesNoDialogQueue = [];
	var currentResolve = void 0;
	var waiting = false;
	var lastXPosition = 0;
	var lastYPosition = 0;

	var useYesNoDialog = function useYesNoDialog(dom99) {
		d$1 = dom99;

		yesButton = d$1.contextFromArray([thisNameSpace, 'yesButton']);
		yesNoContainer = d$1.contextFromArray([thisNameSpace, 'confirm']);
		promptContainer = d$1.contextFromArray([thisNameSpace, 'prompt']);
		promptInput = d$1.contextFromArray([thisNameSpace, 'input']);
		d$1.functions.yesNoDialogAnswer = function (event) {
			d$1.elements[yesNoContainer].hidden = true;
			prepareNext();
			currentResolve(event.target === d$1.elements[yesButton]);
		};

		d$1.functions.yesNoDialogSubmit = function (event) {
			var input = d$1.variables[promptInput];
			// prepareNext can overwrite d.variables[promptInput]
			d$1.elements[promptContainer].hidden = true;
			prepareNext();
			currentResolve(input);
		};

		d$1.functions.yesNoDialogSubmitViaEnter = function (event) {
			if (event.keyCode === 13) {
				//Enter
				d$1.functions.yesNoDialogSubmit();
			}
		};
	};

	var cleanUp = function cleanUp() {
		waiting = false;
		document.body.classList.remove(cssDialogActiveClass);
		d$1.feed(thisNameSpace, {
			question: '',
			label: '',
			input: '',
			submitText: '',
			yesText: '',
			noText: ''
		});
		window.scrollTo(lastXPosition, lastYPosition);
	};

	var start$1 = function start$1() {
		lastXPosition = window.pageXOffset;
		lastYPosition = window.pageYOffset;
		document.body.classList.add(cssDialogActiveClass);
		waiting = true;
	};

	var prepareNext = function prepareNext() {
		if (yesNoDialogQueue.length === 0) {
			cleanUp();
		} else {
			var _next = yesNoDialogQueue.shift();
			if (_next.intent !== promptSymbol) {
				d$1.elements[promptInput].blur();
			}
			if (_next.intent === yesNoSymbol) {
				prepareYesNo(_next);
			} else if (_next.intent === promptSymbol) {
				preparePrompt(_next);
			}
		}
	};

	var prepareYesNo = function prepareYesNo(_ref4) {
		var resolve = _ref4.resolve,
		    question = _ref4.question,
		    yesText = _ref4.yesText,
		    noText = _ref4.noText;

		d$1.elements[yesNoContainer].hidden = false;
		currentResolve = resolve;
		d$1.feed(thisNameSpace, {
			question: question,
			yesText: yesText,
			noText: noText
		});
	};

	var preparePrompt = function preparePrompt(_ref5) {
		var resolve = _ref5.resolve,
		    question = _ref5.question,
		    label = _ref5.label,
		    input = _ref5.input,
		    submitText = _ref5.submitText;

		d$1.elements[promptContainer].hidden = false;
		currentResolve = resolve;
		d$1.feed(thisNameSpace, {
			question: question,
			label: label,
			input: input,
			submitText: submitText
		});
		d$1.elements[promptInput].focus();
	};

	var yesNoDialog = function yesNoDialog(question, yesText, noText) {
		return new Promise(function (resolve) {
			if (!waiting) {
				start$1();
				prepareYesNo({ resolve: resolve, question: question, yesText: yesText, noText: noText });
			} else /*if (waiting)*/{
					yesNoDialogQueue.push({
						intent: yesNoSymbol,
						question: question,
						yesText: yesText,
						noText: noText,
						resolve: resolve
					});
				}
		});
	};

	var textDialog = function textDialog(question, label, input, submitText) {
		return new Promise(function (resolve) {
			if (!waiting) {
				start$1();
				preparePrompt({ resolve: resolve, question: question, label: label, input: input, submitText: submitText });
			} else /*if (waiting)*/{
					yesNoDialogQueue.push({
						intent: promptSymbol,
						question: question,
						label: label,
						input: input,
						submitText: submitText,
						resolve: resolve
					});
				}
		});
	};

	// Import

	useYesNoDialog(d);
	start({
		askSomething: function askSomething(event) {
			var questionText = "Do you think your scroll position will be remembered ?";
			var yesText = "Yes";
			var noText = "No";
			yesNoDialog(questionText, yesText, noText).then(function (answer) {
				feed({
					result: String(answer)
				});
			});
		},
		tryTextDialog: function tryTextDialog(event) {
			var question = "What is your favorite colour ?";
			var label = "Your colour: ";
			var text = "";
			var submitText = "send";
			textDialog(question, label, text, submitText).then(function (answer) {
				feed({
					result2: String(answer),
					warning: "Never give input back to the user in a real world app without validating, sanitizing input first."
				});
			});
		}
	}, {
		result: ""
	});
})();

