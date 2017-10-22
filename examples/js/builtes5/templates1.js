"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    'use strict';

    /*        Copyright Cyril Walle 2017.
    Distributed under the Boost Software License, Version 1.0.
        (See accompanying file LICENSE.txt or copy at
             http://www.boost.org/LICENSE_1_0.txt) */
    //dom99.js
    /*jslint
        es6, maxerr: 200, browser, devel, fudge, maxlen: 100, node
    */
    /*
        need to update all examples and docs
    
        update readme, make a link to the new docs
    
        remake intro play ground
        [Try the intro playground](http://jsbin.com/kepohibavo/1/edit?html,js,output)
    
        document ELEMENT_PROPERTY, LIST_ITEM_PROPERTY, CONTEXT element extension,
        use WeakMap instead where supported
    
    
        decide when to use event
            .target
            .orignialTarget
            .currentTarget
    
    
        when to use is="" syntax
        think about overlying framework
    
        add data-list-strategy to allow opt in declarative optimization
        data-function-context to allow context less 
        add data-x spelling checker
        or is that outside the scope ?
        
        transform recurcive into seq flow
        
        find ways to feed changes to a list without sending an entire list
        and rendering an entire list from scratch each time
        
        integrate 2 way binding in dom99 for lists with inputs inide ? I think it is not used much 
        see d.functions.updateJson in main.js in examples
        
        add support for IE10 again(remove for of loop and transpile)
        
        add data-scoped for data-function to allow them to be scoped inside an element with data-inside ?
    */

    var d = function () {
        "use strict";

        //root collections

        var variableSubscribers = {};
        var listSubscribers = {};
        var variables = {};
        var elements = {};
        var templateElementFromCustomElementName = {};
        var functions = {};

        var pathIn = [];

        var directiveSyntaxFunctionPairs = void 0;

        var MISS = "MISS";
        var CONTEXT = "DOM99_CTX";
        var LIST_ITEM_PROPERTY = "DOM99_LIP";
        var ELEMENT_PROPERTY = "DOM99_EP";
        var ELEMENT_LIST_ITEM = "DOM99_ELEMENT_LIST_ITEM";
        var CUSTOM_ELEMENT = "DOM99_CE";
        var LIST_CHILDREN = "DOM99_LIST_CHILDREN";
        var INSIDE_SYMBOL = ">";

        var hasOwnProperty = Object.prototype.hasOwnProperty;

        var freezeLiveCollection = function freezeLiveCollection(liveCollection) {
            /* freezes HTMLCollection or Node.childNodes*/
            var length = liveCollection.length;
            var frozenArray = [];
            var i = void 0;
            var node = void 0;
            for (i = 0; i < length; i += 1) {
                node = liveCollection[i];
                frozenArray.push(node);
            }
            return frozenArray;
        };

        var isObjectOrArray = function isObjectOrArray(x) {
            /*array or object*/
            return (typeof x === "undefined" ? "undefined" : _typeof(x)) === "object" && x !== null;
        };

        var copyArrayFlat = function copyArrayFlat(array) {
            return array.slice();
        };

        var pushOrCreateArray = function pushOrCreateArray(potentialArray, valueToPush) {
            // don't need to use hasOwnProp as there is no array in the prototype
            if (!Array.isArray(potentialArray)) {
                return [valueToPush];
            }
            potentialArray.push(valueToPush);
            return potentialArray;
        };

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

        var propertyFromTag = valueElseMissDecorator({
            //Input Type : appropriate property name to retrieve and set the value
            "INPUT": "value",
            "TEXTAREA": "value",
            "PROGRESS": "value",
            "SELECT": "value",
            "IMG": "src",
            "SOURCE": "src",
            "AUDIO": "src",
            "VIDEO": "src",
            "TRACK": "src",
            "SCRIPT": "src",
            "OPTION": "value",
            "LINK": "href",
            "DETAILS": "open",
            MISS: "textContent"
        });

        var propertyFromInputType = valueElseMissDecorator({
            //Input Type : appropriate property name to retrieve and set the value
            "checkbox": "checked",
            "radio": "checked",
            MISS: "value"
        });

        var inputEventFromType = valueElseMissDecorator({
            "checkbox": "change",
            "radio": "change",
            "range": "change",
            "file": "change",
            MISS: "input"
        });

        var eventFromTag = valueElseMissDecorator({
            "SELECT": "change",
            "INPUT": "input",
            "BUTTON": "click",
            MISS: "click"
        });

        var options = {
            attributeValueDoneSign: "*",
            tokenSeparator: "-",
            listSeparator: " ",
            directives: {
                directiveFunction: "data-function",
                directiveVariable: "data-variable",
                directiveElement: "data-element",
                directiveList: "data-list",
                directiveInside: "data-inside",
                directiveTemplate: "data-template"
            },

            variablePropertyFromElement: function variablePropertyFromElement(element) {
                var tagName = void 0;
                if (element.tagName !== undefined) {
                    tagName = element.tagName;
                } else {
                    tagName = element;
                }
                if (tagName === "INPUT") {
                    return propertyFromInputType(element.type);
                }
                return propertyFromTag(tagName);
            },

            eventNameFromElement: function eventNameFromElement(element) {
                var tagName = element.tagName;
                if (tagName === "INPUT") {
                    return inputEventFromType(element.type);
                }
                return eventFromTag(tagName);
            },

            tagNamesForUserInput: ["INPUT", "TEXTAREA", "SELECT", "DETAILS"]
        };

        var createElement2 = function createElement2(elementDescription) {
            var element = document.createElement(elementDescription.tagName);
            /*element.setAttribute(attr, value) is good to set initial attr like you do in html
            setAttribute won t change the current .value,
            for instance, setAttribute is the correct choice for creation
            element.attr = value is good to change the live values*/
            Object.entries(elementDescription).forEach(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    key = _ref2[0],
                    value = _ref2[1];

                if (key !== "tagName") {
                    element.setAttribute(key, value);
                }
            });
            return element;
        };

        var walkTheDomElements = function walkTheDomElements(startElement, callBack) {
            callBack(startElement);
            if (startElement.tagName !== "TEMPLATE") {
                // IE bug: templates are not inert
                var element = startElement.firstElementChild;
                while (element) {
                    walkTheDomElements(element, callBack);
                    element = element.nextElementSibling;
                }
            }
        };

        var customElementNameFromElement = function customElementNameFromElement(element) {
            return element.getAttribute("is") || element.tagName.toLowerCase();
        };

        var addEventListener = function addEventListener(element, eventName, callBack) {
            var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            element.addEventListener(eventName, callBack, useCapture);
        };

        var cloneTemplate = function () {
            var errorMessage = "Template  <template " + options.directives.directiveTemplate + "=\"d-name\">\n    Template Content\n</template>";
            if ("content" in document.createElement("template")) {
                return function (templateElement) {
                    if (!templateElement) {
                        console.error(errorMessage);
                    }
                    return document.importNode(templateElement.content, true);
                };
            }

            return function (templateElement) {
                /*here we have a div too much (messes up css)*/
                if (!templateElement) {
                    console.error(errorMessage);
                }
                var clone = document.createElement("div");
                clone.innerHTML = templateElement.innerHTML;
                return clone;
            };
        }();

        var contextFromEvent = function contextFromEvent(event) {
            if (event.target) {
                var element = event.target;
                if (hasOwnProperty.call(element, CONTEXT)) {
                    return element[CONTEXT];
                }
            }
            console.warn(event, "has no context. contextFromEvent for top level elements is not needed.");
            return "";
        };

        var contextFromArray = function contextFromArray(pathIn) {
            return pathIn.join(INSIDE_SYMBOL);
        };

        var getParentContext = function getParentContext(context) {
            var split = context.split(INSIDE_SYMBOL);
            /*const removedPart = */split.splice(-1);
            return split.join(INSIDE_SYMBOL);
        };

        var contextFromArrayWith = function contextFromArrayWith(pathIn, withWhat) {
            if (pathIn.length === 0) {
                return withWhat;
            }
            return "" + contextFromArray(pathIn) + INSIDE_SYMBOL + withWhat;
        };

        var normalizeStartPath = function normalizeStartPath(startPath) {
            // this is because "a>b>c" is irregular
            // "a>b>c>" or ">a>b>c" would not need such normalization
            if (startPath) {
                return "" + startPath + INSIDE_SYMBOL;
            } else {
                return startPath;
            }
        };

        var notifyOneVariableSubscriber = function notifyOneVariableSubscriber(variableSubscriber, value) {
            variableSubscriber[variableSubscriber[ELEMENT_PROPERTY]] = value;
        };

        var notifyVariableSubscribers = function notifyVariableSubscribers(subscribers, value) {
            // could also only take path and get subscribers + value with path
            if (value === undefined) {
                // console.warn(`Do not use undefined values for feed`);
                // should this happen ?
                return;
            }
            subscribers.forEach(function (variableSubscriber) {
                notifyOneVariableSubscriber(variableSubscriber, value);
            });
        };

        var notifyOneListSubscriber = function notifyOneListSubscriber(listContainer, startPath, data) {
            var fragment = document.createDocumentFragment();
            if (hasOwnProperty.call(templateElementFromCustomElementName, listContainer[CUSTOM_ELEMENT])) {
                // composing with custom element
                var templateElement = templateElementFromCustomElementName[listContainer[CUSTOM_ELEMENT]];
                var previous = copyArrayFlat(pathIn);
                pathIn = startPath.split(INSIDE_SYMBOL);
                var normalizedPath = normalizeStartPath(startPath);
                var newLength = data.length;
                var oldLength = void 0;
                if (hasOwnProperty.call(listContainer, LIST_CHILDREN)) {
                    // remove nodes and variable subribers that are not used
                    oldLength = listContainer[LIST_CHILDREN].length;
                    if (oldLength > newLength) {
                        for (var i = newLength; i < oldLength; i += 1) {
                            var pathInside = "" + normalizedPath + i;
                            listContainer[LIST_CHILDREN][i].forEach(function (node) {
                                node.remove();
                            });
                            forgetContext(pathInside);
                        }
                        listContainer[LIST_CHILDREN].length = newLength;
                    }
                } else {
                    listContainer[LIST_CHILDREN] = [];
                    oldLength = 0;
                }

                data.forEach(function (dataInside, i) {
                    var pathInside = "" + normalizedPath + i;
                    feed(dataInside, pathInside);
                    if (i >= oldLength) {
                        // cannot remove document fragment after insert because they empty themselves
                        // have to freeze the childs to still have a reference
                        var activatedTemplateClone = activateCloneTemplate(templateElement, String(i));
                        listContainer[LIST_CHILDREN].push(freezeLiveCollection(activatedTemplateClone.childNodes));
                        fragment.appendChild(activatedTemplateClone);
                    } else {
                        // reusing, feed updated with new data the old nodes 
                    }
                });
                pathIn = previous;
            } else {
                listContainer.innerHTML = "";
                data.forEach(function (value) {
                    var listItem = document.createElement(listContainer[ELEMENT_LIST_ITEM]);
                    if (isObjectOrArray(value)) {
                        Object.assign(listItem, value);
                    } else {
                        listItem[listContainer[LIST_ITEM_PROPERTY]] = value;
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

        var feed = function feed(data) {
            var startPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

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
                Object.entries(data).forEach(function (_ref3) {
                    var _ref4 = _slicedToArray(_ref3, 2),
                        key = _ref4[0],
                        value = _ref4[1];

                    var path = "" + normalizedPath + key;
                    feed(value, path);
                });
            }
        };

        /*not used
        alternative use the new third argument options, once
        const onceAddEventListener = function (element, eventName, callBack, useCapture=false) {
            let tempFunction = function (event) {
                //called once only
                callBack(event);
                element.removeEventListener(eventName, tempFunction, useCapture);
            };
            addEventListener(element, eventName, tempFunction, useCapture);
        };*/

        var applyDirectiveFunction = function applyDirectiveFunction(element, eventName, functionName) {
            if (!functions[functionName]) {
                console.error("Event listener " + functionName + " not found.");
            }
            addEventListener(element, eventName, functions[functionName]);
            // todo only add context when not top level ? (inside sommething)
            element[CONTEXT] = contextFromArray(pathIn);
        };

        var tryApplyDirectiveFunction = function tryApplyDirectiveFunction(element, customAttributeValue) {
            /* todo add warnings for syntax*/
            customAttributeValue.split(options.listSeparator).forEach(function (customAttributeValueSplit) {
                var tokens = customAttributeValueSplit.split(options.tokenSeparator);
                var functionName = void 0;
                var eventName = void 0;
                if (tokens.length === 1) {
                    functionName = tokens[0];
                    eventName = options.eventNameFromElement(element);
                } else {
                    var _tokens = _slicedToArray(tokens, 2);

                    eventName = _tokens[0];
                    functionName = _tokens[1];
                }
                applyDirectiveFunction(element, eventName, functionName);
            });
        };

        var applyDirectiveList = function applyDirectiveList(element, customAttributeValue) {
            /* js array --> DOM list
            <ul data-list="var-li"></ul>
              always throws away the entire dom list,
            let user of dom99 opt in in updates strategies such as
                same length, different content
                same content, different length
                key based identification
                */
            var _customAttributeValue = customAttributeValue.split(options.tokenSeparator),
                _customAttributeValue2 = _slicedToArray(_customAttributeValue, 3),
                variableName = _customAttributeValue2[0],
                elementListItem = _customAttributeValue2[1],
                optional = _customAttributeValue2[2];

            var fullName = "-";

            if (!variableName) {
                console.error(element, "Use " + options.directives.directiveList + "=\"variableName-tagName\" format!");
            }

            if (optional) {
                // for custom elements
                fullName = elementListItem + "-" + optional;
                element[CUSTOM_ELEMENT] = fullName;
            } else {
                element[LIST_ITEM_PROPERTY] = options.variablePropertyFromElement(elementListItem.toUpperCase());
                element[ELEMENT_LIST_ITEM] = elementListItem;
            }

            var path = contextFromArrayWith(pathIn, variableName);

            listSubscribers[path] = pushOrCreateArray(listSubscribers[path], element);

            if (hasOwnProperty.call(variables, path)) {
                notifyOneListSubscriber(element, path, variables[path]);
            }
        };

        var applyDirectiveVariable = function applyDirectiveVariable(element, variableName) {
            /* two-way bind
            example : called for <input data-variable="a">
            in this example the variableName = "a"
            we push the <input data-variable="a" > element in the array
            that holds all elements which share this same "a" variable
            undefined assignment are ignored, instead use empty string*/

            if (!variableName) {
                console.error(element, "Use " + options.directives.directiveVariable + "=\"variableName\" format!");
            }

            element[ELEMENT_PROPERTY] = options.variablePropertyFromElement(element);
            var path = contextFromArrayWith(pathIn, variableName);
            variableSubscribers[path] = pushOrCreateArray(variableSubscribers[path], element);
            var lastValue = variables[path]; // has latest
            if (lastValue !== undefined) {
                notifyOneVariableSubscriber(element, lastValue);
            }

            if (options.tagNamesForUserInput.includes(element.tagName)) {
                var broadcastValue = function broadcastValue(event) {
                    //wil call setter to broadcast the value
                    var value = event.target[event.target[ELEMENT_PROPERTY]];
                    variables[path] = value;
                    // would notify everything including itself
                    // notifyVariableSubscribers(variableSubscribers[path], value);
                    variableSubscribers[path].forEach(function (variableSubscriber) {
                        if (variableSubscriber !== element) {
                            notifyOneVariableSubscriber(variableSubscriber, value);
                        }
                    });
                };
                addEventListener(element, options.eventNameFromElement(element), broadcastValue);
            }
        };

        var applyDirectiveElement = function applyDirectiveElement(element, customAttributeValue) {
            /* stores element for direct access !*/
            var elementName = customAttributeValue;

            if (!elementName) {
                console.error(element, "Use " + options.directives.directiveElement + "=\"elementName\" format!");
            }
            var path = contextFromArrayWith(pathIn, elementName);
            elements[path] = element;
        };

        var applyDirectiveTemplate = function applyDirectiveTemplate(element, customAttributeValue) {
            /* stores a template element for later reuse !*/
            if (!customAttributeValue) {
                console.error(element, "Use " + options.directives.directiveTemplate + "=\"d-name\" format!");
            }

            templateElementFromCustomElementName[customAttributeValue] = element;
        };

        var activateCloneTemplate = function activateCloneTemplate(templateElement, key) {
            enterObject(key);
            var activatedTemplateClone = cloneTemplate(templateElement);
            linkJsAndDom(activatedTemplateClone);
            leaveObject();
            return activatedTemplateClone;
        };

        var applyDirectiveInside = function applyDirectiveInside(element, key) {
            /* looks for an html template to render
            also calls applyDirectiveElement with key!*/
            if (!key) {
                console.error(element, "Use " + options.directives.directiveInside + "=\"insidewhat\" format!");
            }

            var templateElement = templateElementFromCustomElementName[customElementNameFromElement(element)];

            if (templateElement) {
                var activatedTemplateClone = activateCloneTemplate(templateElement, key);
                element.appendChild(activatedTemplateClone);
            } else {
                // avoid infinite loop
                element.setAttribute(options.directives.directiveInside, options.attributeValueDoneSign + key);
                // parse children under name space (encapsulation of variable names)
                enterObject(key);
                linkJsAndDom(element);
                leaveObject();
            }
        };

        var enterObject = function enterObject(key) {
            pathIn.push(key);
        };

        var leaveObject = function leaveObject() {
            pathIn.pop();
        };

        var deleteAllStartsWith = function deleteAllStartsWith(object, prefix) {
            Object.keys(object).forEach(function (key) {
                if (key.startsWith(prefix)) {
                    delete object[key];
                }
            });
        };

        var forgetContext = function forgetContext(path) {
            /*Removing a DOM element with .remove() or .innerHTML = "" will NOT delete
            all the element references if you used the underlying nodes in dom99
            A removed element will continue receive invisible automatic updates
            it also takes space in the memory.
              And all of this doesn't matter for 1-100 elements
              */
            deleteAllStartsWith(variableSubscribers, path);
            deleteAllStartsWith(listSubscribers, path);
            deleteAllStartsWith(variables, path);
            deleteAllStartsWith(elements, path);
        };

        var forgetRemoveTemplate = function forgetRemoveTemplate(name) {
            /* Removes a template */
            if (!hasOwnProperty.call(templateElementFromCustomElementName, name)) {
                console.error("<template " + options.directives.directiveTemplate + "=" + path + "></template> not found or already deleted and removed.");
            }
            templateElementFromCustomElementName[name].remove();
            delete templateElementFromCustomElementName[name];
        };

        var tryApplyDirectives = function tryApplyDirectives(element) {
            /* looks if the element has dom99 specific attributes and tries to handle it*/
            // todo make sure no impactfull read write
            if (!element.hasAttribute) {
                return;
            }

            directiveSyntaxFunctionPairs.forEach(function (_ref5) {
                var _ref6 = _slicedToArray(_ref5, 2),
                    directiveName = _ref6[0],
                    applyDirective = _ref6[1];

                if (!element.hasAttribute(directiveName)) {
                    return;
                }
                var customAttributeValue = element.getAttribute(directiveName);
                if (customAttributeValue[0] === options.attributeValueDoneSign) {
                    return;
                }
                applyDirective(element, customAttributeValue);
                // ensure the directive is only applied once
                element.setAttribute(directiveName, options.attributeValueDoneSign + customAttributeValue);
            });
            if (element.hasAttribute(options.directives.directiveInside) || element.hasAttribute(options.directives.directiveList)) {
                return;
            }
            /*using a custom element without data-inside*/
            var customElementName = customElementNameFromElement(element);
            if (hasOwnProperty.call(templateElementFromCustomElementName, customElementName)) {
                element.appendChild(cloneTemplate(templateElementFromCustomElementName[customElementName]));
            }
        };

        var linkJsAndDom = function linkJsAndDom() {
            var startElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;

            //build array only once and use up to date options, they should not reset twice
            if (!directiveSyntaxFunctionPairs) {
                directiveSyntaxFunctionPairs = [
                /*order is relevant applyDirectiveVariable being before applyDirectiveFunction,
                we can use the just changed live variable in the bind function*/
                [options.directives.directiveElement, applyDirectiveElement], [options.directives.directiveVariable, applyDirectiveVariable], [options.directives.directiveFunction, tryApplyDirectiveFunction], [options.directives.directiveList, applyDirectiveList], [options.directives.directiveInside, applyDirectiveInside], [options.directives.directiveTemplate, applyDirectiveTemplate]];
            }
            walkTheDomElements(startElement, tryApplyDirectives);
            return startElement;
        };

        var start = function start() {
            var userFunctions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var initialFeed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var startElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;
            var callBack = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

            Object.assign(functions, userFunctions);
            feed(initialFeed);
            linkJsAndDom(startElement);
            if (!callBack) {
                return;
            }
            return callBack();
        };

        // https://github.com/piecioshka/test-freeze-vs-seal-vs-preventExtensions
        return Object.freeze({
            start: start,
            linkJsAndDom: linkJsAndDom,
            elements: elements,
            functions: functions,
            variables: variables,
            feed: feed,
            createElement2: createElement2,
            forgetContext: forgetContext,
            forgetRemoveTemplate: forgetRemoveTemplate,
            // also add clear template too free dom nodes,
            // can be usefull if sure that template not going to be used again
            contextFromArray: contextFromArray,
            contextFromEvent: contextFromEvent,
            getParentContext: getParentContext,
            options: options
        });
    }();

    d.functions.showNextComment = function (event) {
        //todo
    };

    var commentsData = {
        comment1: {
            text: "I am the first to comment, well written! Bravo!",
            date: "In the year 2016"
        },
        comment2: {
            text: "I really appreciate your work",
            date: "just now"
        }
    };

    // we could also manually assign every property in a complicated for loop
    d.feed(commentsData);

    d.linkJsAndDom();
})();