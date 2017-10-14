"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

    forget should work on templates

    update readme, make a link to the new docs

    remake intro play ground
    [Try the intro playground](http://jsbin.com/kepohibavo/1/edit?html,js,output)

    document DVRP, DVRPL, CONTEXT element extension,
    use WeakMap instead where supported


    decide when to use event
        .target
        .orignialTarget
        .currentTarget


    when to use is="" syntax
    think about overlying framework

    add data-list-strategy to allow opt in declarative optimization
    data-function-context to allow context less elements
    add data-x spelling checker
    
    transform recurcive into seq flow
*/
var d = function () {
    "use strict";

    //root collections

    var variablesSubscribers = {};
    var variables = {};
    var elements = {};
    var functions = {};

    var templateElementFromCustomElementName = {};
    var pathIn = [];

    var directiveSyntaxFunctionPairs = void 0;

    var MISS = "MISS";
    var CONTEXT = "CONTEXT";
    var DVRPL = "DVRPL";
    var DVRP = "DVRP";
    var ELEMENT_LIST_ITEM = "ELEMENT_LIST_ITEM";
    var CUSTOM = "CUSTOM";
    var INSIDE_SYMBOL = ">";
    var DEFAULT_INPUT_TYPE = "text";

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    var isObjectOrArray = function isObjectOrArray(x) {
        /*array or object*/
        return (typeof x === "undefined" ? "undefined" : _typeof(x)) === "object" && x !== null;
    };

    var copyArrayFlat = function copyArrayFlat(array1) {
        return array1.slice();
    };

    var valueElseMissDecorator = function valueElseMissDecorator(object1) {
        /*Decorator function around an Object to provide a default value
        Decorated object must have a MISS key with the default value associated
        Arrays are also objects
        */
        return function (key) {
            if (hasOwnProperty.call(object1, key)) {
                return object1[key];
            }
            return object1[MISS];
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
            var tagName = element.tagName || element;
            if (tagName === "INPUT") {
                return propertyFromInputType(element.type || DEFAULT_INPUT_TYPE);
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
            var _ref2 = _slicedToArray(_ref, 2);

            var key = _ref2[0];
            var value = _ref2[1];

            if (key !== "tagName") {
                element.setAttribute(key, value);
            }
        });
        return element;
    };

    var walkTheDomElements = function walkTheDomElements(element, function1) {
        function1(element);
        if (element.tagName !== "TEMPLATE") {
            // IE bug: templates are not inert
            element = element.firstElementChild;
            while (element) {
                walkTheDomElements(element, function1);
                element = element.nextElementSibling;
            }
        }
    };

    var customElementNameFromElement = function customElementNameFromElement(element) {
        return element.getAttribute("is") || element.tagName.toLowerCase();
    };

    var addEventListener = function addEventListener(element, eventName, function1) {
        var useCapture = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

        element.addEventListener(eventName, function1, useCapture);
    };

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

    var contextFromArrayWith = function contextFromArrayWith(pathIn, withWhat) {
        if (pathIn.length === 0) {
            return withWhat;
        }
        return "" + contextFromArray(pathIn) + INSIDE_SYMBOL + withWhat;
    };

    var notify = function notify(subscribers, value) {
        var path = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

        // could also only take path and get subscribers + value with path
        if (value === undefined) {
            // console.warn(`Do not use undefined values for feed`);
            // should this happen ?
            return;
        }
        if (Array.isArray(value)) {
            (function () {
                var list = value;
                subscribers.forEach(function (currentElement) {
                    var fragment = document.createDocumentFragment();
                    if (hasOwnProperty.call(templateElementFromCustomElementName, currentElement[CUSTOM])) {
                        (function () {
                            // composing with custom element
                            var templateElement = templateElementFromCustomElementName[currentElement[CUSTOM]];
                            var previous = copyArrayFlat(pathIn);
                            pathIn = path.split(INSIDE_SYMBOL);
                            list.forEach(function (unused, i) {
                                var key = String(i);
                                enterObject(key);
                                var templateClone = cloneTemplate(templateElement);
                                linkJsAndDom(templateClone);
                                leaveObject();
                                fragment.appendChild(templateClone);
                            });
                            pathIn = previous;
                        })();
                    } else {
                        list.forEach(function (value) {
                            var listItem = document.createElement(currentElement[ELEMENT_LIST_ITEM]);
                            if (isObjectOrArray(value)) {
                                Object.assign(value, listItem);
                            } else {
                                listItem[currentElement[DVRPL]] = value;
                            }
                            fragment.appendChild(listItem);
                        });
                    }
                    currentElement.innerHTML = "";
                    currentElement.appendChild(fragment);
                });
            })();
        } else {
            // console.log(subscribers, "subscribers");
            subscribers.forEach(function (currentElement) {
                currentElement[currentElement[DVRP]] = value;
            });
        }
    };

    var feed = function feed(data) {
        var startPath = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

        if (!isObjectOrArray(data)) {
            console.error("feed takes input, must be object");
        }
        var normalizedPath = startPath;
        if (startPath) {
            normalizedPath = "" + startPath + INSIDE_SYMBOL;
            // this is because "a>b>c" is irregular
            // "a>b>c>" or ">a>b>c" would not need such normalization
        }
        Object.entries(data).forEach(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2);

            var key = _ref4[0];
            var value = _ref4[1];

            var path = "" + normalizedPath + key;
            if (!isObjectOrArray(value)) {
                variables[path] = value;
                if (hasOwnProperty.call(variablesSubscribers, path)) {
                    notify(variablesSubscribers[path], value);
                }
            } else {
                var insidePath = "" + path + INSIDE_SYMBOL;

                if (Array.isArray(value)) {
                    forgetContext(insidePath);
                    feed(value, path /* could include boolean to not forgetContext inside,
                                     as it would do nothing*/);
                    variables[path] = value;
                    if (hasOwnProperty.call(variablesSubscribers, path)) {
                        notify(variablesSubscribers[path], value, path);
                    }
                } else {
                    feed(value, path);
                }
            }
        });
    };

    /*not used
    alternative use the new third argument options, once
    const onceAddEventListener = function (element, eventName, function1, useCapture=false) {
        let tempFunction = function (event) {
            //called once only
            function1(event);
            element.removeEventListener(eventName, tempFunction, useCapture);
        };
        addEventListener(element, eventName, tempFunction, useCapture);
    };*/

    var applyDirectiveFunction = function applyDirectiveFunction(element, eventName, functionName) {
        if (!functions[functionName]) {
            console.error("Event listener " + functionName + " not found.");
        }
        addEventListener(element, eventName, functions[functionName]);
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

        var _customAttributeValue = customAttributeValue.split(options.tokenSeparator);

        var _customAttributeValue2 = _slicedToArray(_customAttributeValue, 3);

        var variableName = _customAttributeValue2[0];
        var elementListItem = _customAttributeValue2[1];
        var optional = _customAttributeValue2[2];

        var fullName = "-";

        if (!variableName) {
            console.error(element, "Use " + options.directives.directiveList + "=\"variableName-tagName\" format!");
        }

        if (optional) {
            // for custom elements
            fullName = elementListItem + "-" + optional;
            element[CUSTOM] = fullName;
        } else {
            element[DVRPL] = options.variablePropertyFromElement(elementListItem.toUpperCase());
            element[ELEMENT_LIST_ITEM] = elementListItem;
        }

        var path = contextFromArrayWith(pathIn, variableName);

        if (hasOwnProperty.call(variablesSubscribers, path)) {
            variablesSubscribers[path].push(element);
        } else {
            variablesSubscribers[path] = [element];
        }

        // console.log("should notify once", path, variables[path]);
        // will also remake the previous if any, which is less than ideal todo
        // can have negative consequences for multiple elements that share the same list
        notify(variablesSubscribers[path], variables[path], path);
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

        element[DVRP] = options.variablePropertyFromElement(element);
        var path = contextFromArrayWith(pathIn, variableName);
        if (hasOwnProperty.call(variablesSubscribers, path)) {
            variablesSubscribers[path].push(element);
        } else {
            variablesSubscribers[path] = [element];
        }
        element[element[DVRP]] = variables[path]; // has latest

        if (options.tagNamesForUserInput.includes(element.tagName)) {
            var broadcastValue = function broadcastValue(event) {
                //wil call setter to broadcast the value
                var value = event.target[event.target[DVRP]];
                variables[path] = value;
                notify(variablesSubscribers[path], value);
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

    var applyDirectiveInside = function applyDirectiveInside(element, key) {
        /* looks for an html template to render
        also calls applyDirectiveElement with key!*/
        if (!key) {
            console.error(element, "Use " + options.directives.directiveInside + "=\"insidewhat\" format!");
        }

        var templateElement = templateElementFromCustomElementName[customElementNameFromElement(element)];

        enterObject(key);
        var templateClone = cloneTemplate(templateElement);
        linkJsAndDom(templateClone);
        leaveObject();
        element.appendChild(templateClone);
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
        deleteAllStartsWith(variablesSubscribers, path);
        deleteAllStartsWith(variables, path);
    };

    var tryApplyDirectives = function tryApplyDirectives(element) {
        /* looks if the element has dom99 specific attributes and tries to handle it*/
        // todo make sure no impactfull read write
        if (!element.hasAttribute) {
            return;
        }

        directiveSyntaxFunctionPairs.forEach(function (pair) {
            var _pair = _slicedToArray(pair, 2);

            var directiveName = _pair[0];
            var applyDirective = _pair[1];


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
        var startElement = arguments.length <= 0 || arguments[0] === undefined ? document.body : arguments[0];

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
        var userFunctions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var initialFeed = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var startElement = arguments[2];

        Object.assign(functions, userFunctions);
        feed(initialFeed);
        linkJsAndDom(startElement);
    };

    // https://github.com/piecioshka/test-freeze-vs-seal-vs-preventExtensions
    return Object.freeze({
        start: start,
        linkJsAndDom: linkJsAndDom,
        elements: elements,
        functions: functions,
        variables: variables,
        feed: feed,
        createElement2: createElement2, // still need to expose ?
        forgetContext: forgetContext, // still need to expose ?
        // also add clear template too free dom nodes,
        // can be usefull if sure that template not going to be used again
        contextFromArray: contextFromArray,
        contextFromEvent: contextFromEvent,
        options: options
    });
}();

