"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* dom99.js */
/*        Copyright Cyril Walle 2017.
Distributed under the Boost Software License, Version 1.0.
   (See accompanying file LICENSE.txt or copy at
        http://www.boost.org/LICENSE_1_0.txt) */
/*
    document ELEMENT_PROPERTY, LIST_ITEM_PROPERTY, CONTEXT element extension,
    use WeakMap instead where supported

    decide when to use event
        .target
        .orignialTarget
        .currentTarget

    when to use is="" syntax and when to use <x-element></x-element> ?
    think about overlying framework

    add data-list-strategy to allow opt in declarative optimization
        same length, different content
        same content, different length
        key based identification
    data-function-context to allow context less
    add data-x spelling checker

    transform recursive into sequential flow

    add data-scoped for data-function to allow them to be
    scoped inside an element with data-inside ?
*/
/*jslint
    es6, maxerr: 200, browser, devel, fudge, maxlen: 100, node, for
*/
var d = function () {
    "use strict";

    var NAME = "DOM99";
    var ELEMENT_NODE = 1; // document.body.ELEMENT_NODE === 1
    var CONTEXT = NAME + "_C";
    var LIST_ITEM_PROPERTY = NAME + "_L";
    var ELEMENT_PROPERTY = NAME + "_E";
    var ELEMENT_LIST_ITEM = NAME + "_I";
    var CUSTOM_ELEMENT = NAME + "_X";
    var LIST_CHILDREN = NAME + "_R";
    var INSIDE_SYMBOL = ">";

    //root collections
    var variableSubscribers = {};
    var listSubscribers = {};
    var variables = {};
    var elements = {};
    var templateFromName = {};
    var functions = {};

    var pathIn = [];

    var directivePairs = void 0;

    // recursive or have tri+-dependent graph
    var _feed = void 0;
    var _elementsDeepForEach = void 0;
    var activate = void 0;
    var activateCloneTemplate = void 0;

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

    var pushOrCreateArrayAt = function pushOrCreateArrayAt(object, key, valueToPush) {
        // don't need to use hasOwnProp as there is no array in the prototype
        // but still use it to avoid a warning
        // const potentialArray = object[key]
        if (hasOwnProperty.call(object, key)) {
            // eventually the if is always true
            object[key].push(valueToPush);
        } else {
            // only for the first time
            object[key] = [valueToPush];
        }
    };

    var MISS = "MISS";
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
        doneSymbol: "*",
        tokenSeparator: "-",
        listSeparator: " ",
        directives: {
            function: "data-function",
            variable: "data-variable",
            element: "data-element",
            list: "data-list",
            inside: "data-inside",
            template: "data-template"
        },

        propertyFromElement: function propertyFromElement(element) {
            // defines what is changing when data-variable is changing
            // for <p> it is textContent
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
            // defines the default event for an element
            // i.e. when data-function is omitting the event
            var tagName = element.tagName;
            if (tagName === "INPUT") {
                return inputEventFromType(element.type);
            }
            return eventFromTag(tagName);
        },

        tagNamesForUserInput: ["INPUT", "TEXTAREA", "SELECT", "DETAILS"]
    };

    var createElement2 = function createElement2(elementDescription) {
        /*element.setAttribute(attr, value) is good to set
        initial attribute like when html is first loaded
        setAttribute won't change some "live" things like .value for input,
        for instance, setAttribute is the correct choice for creation
        element.attr = value is good to change the live values
        always follow these words to avoid rare bugs*/
        var element = document.createElement(elementDescription.tagName);
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

    // alternative not used yet
    // const createElement2 = function ({tagName, ...elementDescription}) {
    // const element = document.createElement(tagName);
    // Object.entries(elementDescription).forEach(function ([key, value]) {
    // element.setAttribute(key, value);
    // });
    // return element;
    // };

    _elementsDeepForEach = function elementsDeepForEach(startElement, callBack) {
        callBack(startElement);
        if (startElement.tagName === undefined || startElement.tagName !== "TEMPLATE") {
            // IE bug: templates are not inert
            // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/firstElementChild
            // is not supported in Edge/Safari on DocumentFragments
            // let element = startElement.firstElementChild;
            // this does not produce an error, but simply returns undefined
            var node = startElement.firstChild;
            while (node) {
                if (node.nodeType === ELEMENT_NODE) {
                    _elementsDeepForEach(node, callBack);
                    node = node.nextElementSibling;
                } else {
                    node = node.nextSibling;
                }
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
        if (document.createElement("template").content !== undefined) {
            return function (template) {
                if (!template) {
                    console.error("Template missing <template " + options.directives.template + "=\"d-name\">\n                            Template Content\n                        </template>");
                }
                return document.importNode(template.content, true);
            };
        }

        return function (template) {
            /* todo here we have a div too much (messes up css)*/
            var clone = document.createElement("div");
            clone.innerHTML = template.innerHTML;
            return clone;
        };
    }();

    var contextFromEvent = function contextFromEvent(event, parent) {
        if (event || parent) {
            var element = void 0;
            if (event && event.target) {
                element = event.target;
            } else {
                element = parent;
            }

            if (hasOwnProperty.call(element, CONTEXT)) {
                return element[CONTEXT];
            } else {
                if (element.parentNode) {
                    return contextFromEvent(undefined, element.parentNode);
                } else {
                    ;
                }
            }
        }
        console.warn(event, "has no context. contextFromEvent for top level elements is not needed.");
        return "";
    };

    var contextFromArray = function contextFromArray(pathIn) {
        return pathIn.join(INSIDE_SYMBOL);
    };

    var enterObject = function enterObject(key) {
        pathIn.push(key);
    };

    var leaveObject = function leaveObject() {
        pathIn.pop();
    };

    var getParentContext = function getParentContext(context) {
        var split = context.split(INSIDE_SYMBOL);
        split.pop();
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

    var notifyOneVariableSubscriber = function notifyOneVariableSubscriber(variableSubscriber, value) {
        variableSubscriber[variableSubscriber[ELEMENT_PROPERTY]] = value;
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

    var removeNode = function removeNode(node) {
        node.remove();
    };

    var notifyOneListSubscriber = function notifyOneListSubscriber(listContainer, startPath, data) {
        var fragment = document.createDocumentFragment();
        if (hasOwnProperty.call(listContainer, CUSTOM_ELEMENT) && hasOwnProperty.call(templateFromName, listContainer[CUSTOM_ELEMENT])) {
            // composing with custom element
            var template = templateFromName[listContainer[CUSTOM_ELEMENT]];
            var previous = copyArrayFlat(pathIn);
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
                        pathInside = "" + normalizedPath + i;
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
                pathInside = "" + normalizedPath + i;
                _feed(dataInside, pathInside);
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

    _feed = function feed(data) {
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
                _feed(value, path);
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

    var applyFunction = function applyFunction(element, eventName, functionName) {
        if (!functions[functionName]) {
            console.error("Event listener " + functionName + " not found.");
        }
        addEventListener(element, eventName, functions[functionName]);
        // todo only add context when not top level ? (inside sommething)
        element[CONTEXT] = contextFromArray(pathIn);
    };

    var applyFunctions = function applyFunctions(element, attributeValue) {
        attributeValue.split(options.listSeparator).forEach(function (attributeValueSplit) {
            var tokens = attributeValueSplit.split(options.tokenSeparator);
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
            applyFunction(element, eventName, functionName);
        });
    };

    var applylist = function applylist(element, attributeValue) {
        /* js array --> DOM list
        <ul data-list="var-li"></ul>
              */
        var _attributeValue$split = attributeValue.split(options.tokenSeparator),
            _attributeValue$split2 = _slicedToArray(_attributeValue$split, 3),
            variableName = _attributeValue$split2[0],
            listItemTagName = _attributeValue$split2[1],
            optional = _attributeValue$split2[2];

        var fullName = "-";

        if (!variableName) {
            console.error(element, "Use " + options.directives.list + "=\"variableName-tagName\" format!");
        }

        if (optional) {
            // for custom elements
            fullName = listItemTagName + "-" + optional;
            element[CUSTOM_ELEMENT] = fullName;
        } else {
            element[LIST_ITEM_PROPERTY] = options.propertyFromElement(listItemTagName.toUpperCase());
            element[ELEMENT_LIST_ITEM] = listItemTagName;
        }

        var path = contextFromArrayWith(pathIn, variableName);

        pushOrCreateArrayAt(listSubscribers, path, element);

        if (hasOwnProperty.call(variables, path)) {
            notifyOneListSubscriber(element, path, variables[path]);
        }
    };

    var applyVariable = function applyVariable(element, variableName) {
        /* two-way bind
        example : called for <input data-variable="a">
        in this example the variableName = "a"
        we push the <input data-variable="a" > element in the array
        that holds all elements which share this same "a" variable
        undefined assignment are ignored, instead use empty string*/

        if (!variableName) {
            console.error(element, "Use " + options.directives.variable + "=\"variableName\" format!");
        }

        element[ELEMENT_PROPERTY] = options.propertyFromElement(element);
        var path = contextFromArrayWith(pathIn, variableName);
        pushOrCreateArrayAt(variableSubscribers, path, element);
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

    var applyDirectiveElement = function applyDirectiveElement(element, attributeValue) {
        /* stores element for direct access !*/
        var elementName = attributeValue;

        if (!elementName) {
            console.error(element, "Use " + options.directives.element + "=\"elementName\" format!");
        }
        var path = contextFromArrayWith(pathIn, elementName);
        elements[path] = element;
    };

    var applytemplate = function applytemplate(element, attributeValue) {
        /* stores a template element for later reuse !*/
        if (!attributeValue) {
            console.error(element, "Use " + options.directives.template + "=\"d-name\" format!");
        }

        templateFromName[attributeValue] = element;
    };

    activateCloneTemplate = function activateCloneTemplate(template, key) {
        /* clones a template and activates it
        */
        enterObject(key);
        var activatedClone = cloneTemplate(template);
        activate(activatedClone);
        leaveObject();
        return activatedClone;
    };

    var applyinside = function applyinside(element, key) {
        /* looks for an html template to render
        also calls applyDirectiveElement with key!*/
        if (!key) {
            console.error(element, "Use " + options.directives.inside + "=\"insidewhat\" format!");
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

    var deleteTemplate = function deleteTemplate(name) {
        /* Removes a template */
        if (!hasOwnProperty.call(templateFromName, name)) {
            console.error("<template " + options.directives.template + "=" + name + ">\n                </template> not found or already deleted and removed.");
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

        // spellsheck atributes
        var directives = Object.values(options.directives);
        var asArray = Array.prototype.slice.call(element.attributes);
        asArray.forEach(function (attribute) {
            if (attribute.nodeName.startsWith("data")) {
                if (directives.includes(attribute.nodeName)) {
                    ;
                } else {
                    console.warn("dom99 does not recognize, " + attribute.nodeName);
                }
            }
        });

        directivePairs.forEach(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 2),
                directiveName = _ref6[0],
                applyDirective = _ref6[1];

            if (!element.hasAttribute(directiveName)) {
                return;
            }
            var attributeValue = element.getAttribute(directiveName);
            if (attributeValue[0] === options.doneSymbol) {
                return;
            }
            applyDirective(element, attributeValue);
            // ensure the directive is only applied once
            element.setAttribute(directiveName, options.doneSymbol + attributeValue);
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

    activate = function activate() {
        var startElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;

        //build array only once and use up to date options, they should not reset twice
        if (!directivePairs) {
            directivePairs = [
            /*order is relevant applyVariable being before applyFunction,
            we can use the just changed live variable in the bind function*/
            [options.directives.element, applyDirectiveElement], [options.directives.variable, applyVariable], [options.directives.function, applyFunctions], [options.directives.list, applylist], [options.directives.inside, applyinside], [options.directives.template, applytemplate]];
        }
        _elementsDeepForEach(startElement, tryApplyDirectives);
        return startElement;
    };

    var start = function start() {
        var userFunctions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var initialFeed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var startElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;
        var callBack = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;


        Object.assign(functions, userFunctions);
        _feed(initialFeed);
        activate(startElement);
        if (!callBack) {
            return;
        }
        return callBack();
    };

    // https://github.com/piecioshka/test-freeze-vs-seal-vs-preventExtensions
    return Object.freeze({
        start: start,
        activate: activate,
        elements: elements,
        functions: functions,
        variables: variables,
        feed: _feed,
        createElement2: createElement2,
        forgetContext: forgetContext,
        deleteTemplate: deleteTemplate,
        contextFromArray: contextFromArray,
        contextFromEvent: contextFromEvent,
        getParentContext: getParentContext,
        options: options
    });
}();

export default d;
