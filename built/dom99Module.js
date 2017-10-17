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
    
    integrate 2 way binding in dom99 ? for list
    see d.functions.updateJson in main.js in examples
    
    add support for IE10 again(remove for of loop and transpile)
*/
const d = (function () {
    "use strict";

    //root collections
    const variableSubscribers = {};
    const listSubscribers = {};
    const variables = {};
    const elements = {};
    const templateElementFromCustomElementName = {};
    const functions = {};

    let pathIn = [];

    let directiveSyntaxFunctionPairs;

    const MISS = "MISS";
    const CONTEXT = "DOM99_CTX";
    const LIST_ITEM_PROPERTY = "DOM99_LIP";
    const ELEMENT_PROPERTY = "DOM99_EP";
    const ELEMENT_LIST_ITEM = "DOM99_ELEMENT_LIST_ITEM";
    const CUSTOM_ELEMENT = "DOM99_CE";
    const LIST_CHILDREN = "DOM99_LIST_CHILDREN";
    const INSIDE_SYMBOL = ">";

    const hasOwnProperty = Object.prototype.hasOwnProperty;

    const freezeLiveCollection = function (liveCollection) {
      /* freezes HTMLCollection or Node.childNodes*/
        /* IE 10 use normal for loop const length = ... */
        const frozenArray = [];
        let node;
        for (node of liveCollection) {
          frozenArray.push(node);
        }
        return frozenArray;
    };
    
    const isObjectOrArray = function (x) {
        /*array or object*/
        return (typeof x === "object" && x !== null);
    };

    const copyArrayFlat = function (array) {
        return array.slice();
    };
    
    const pushOrCreateArray = function (potentialArray, valueToPush) {
      // don't need to use hasOwnProp as there is no array in the prototype
        if (!Array.isArray(potentialArray)) {
            return [valueToPush];
        }
        potentialArray.push(valueToPush);
        return potentialArray;
    };

    const valueElseMissDecorator = function (object) {
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

    const propertyFromTag = valueElseMissDecorator({
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

    const propertyFromInputType = valueElseMissDecorator({
        //Input Type : appropriate property name to retrieve and set the value
        "checkbox": "checked",
        "radio": "checked",
        MISS: "value"
    });

    const inputEventFromType = valueElseMissDecorator({
        "checkbox": "change",
        "radio": "change",
        "range": "change",
        "file": "change",
        MISS: "input"
    });

    const eventFromTag = valueElseMissDecorator({
        "SELECT": "change",
        "INPUT": "input",
        "BUTTON": "click",
        MISS: "click"
    });

    const options = {
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

        variablePropertyFromElement: function (element) {
            let tagName;
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

        eventNameFromElement: function (element) {
            const tagName = element.tagName;
            if (tagName === "INPUT") {
                return inputEventFromType(element.type);
            }
            return eventFromTag(tagName);
        },

        tagNamesForUserInput: [
            "INPUT",
            "TEXTAREA",
            "SELECT",
            "DETAILS"
        ]
    };

    const createElement2 = function (elementDescription) {
        const element = document.createElement(elementDescription.tagName);
        /*element.setAttribute(attr, value) is good to set initial attr like you do in html
        setAttribute won t change the current .value,
        for instance, setAttribute is the correct choice for creation
        element.attr = value is good to change the live values*/
        Object.entries(elementDescription).forEach(function ([key, value]) {
            if (key !== "tagName") {
                element.setAttribute(key, value);
            }
        });
        return element;
    };

    const walkTheDomElements = function (startElement, callBack) {
        callBack(startElement);
        if (startElement.tagName !== "TEMPLATE") {// IE bug: templates are not inert
            let element = startElement.firstElementChild;
            while (element) {
                walkTheDomElements(element, callBack);
                element = element.nextElementSibling;
            }
        }
    };

    const customElementNameFromElement = function (element) {
        return element.getAttribute("is") || element.tagName.toLowerCase();
    };

    const addEventListener = function (element, eventName, callBack, useCapture = false) {
        element.addEventListener(eventName, callBack, useCapture);
    };

    const cloneTemplate = (function () {
        const errorMessage = `Template  <template ${options.directives.directiveTemplate}="d-name">
    Template Content
</template>`;
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
            const clone = document.createElement("div");
            clone.innerHTML = templateElement.innerHTML;
            return clone;
        };
    }());

    const contextFromEvent = function (event) {
        if (event.target) {
            const element = event.target;
            if (hasOwnProperty.call(element, CONTEXT)) {
                return element[CONTEXT];
            }
        }
        console.warn(event,
        `has no context. contextFromEvent for top level elements is not needed.`);
        return "";
    };

    const contextFromArray = function (pathIn) {
        return pathIn.join(INSIDE_SYMBOL);
    };
    
    const getParentContext = function (context) {
        const split = context.split(INSIDE_SYMBOL);
        const removedPart = split.splice(-1);
        return split.join(INSIDE_SYMBOL);
    };

    const contextFromArrayWith = function (pathIn, withWhat) {
        if (pathIn.length === 0) {
            return withWhat;
        }
        return `${contextFromArray(pathIn)}${INSIDE_SYMBOL}${withWhat}`;
    };
    
    const normalizeStartPath = function (startPath) {
            // this is because "a>b>c" is irregular
            // "a>b>c>" or ">a>b>c" would not need such normalization
        if (startPath) {
            return `${startPath}${INSIDE_SYMBOL}`;
        } else {
          return startPath;
        }
    };

    const notifyOneVariableSubscriber = function (variableSubscriber, value) {
        variableSubscriber[variableSubscriber[ELEMENT_PROPERTY]] = value;
    };

    const notifyVariableSubscribers = function (subscribers, value) {
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

    const notifyOneListSubscriber = function (listContainer, startPath, data) {
        const fragment = document.createDocumentFragment();
        if (hasOwnProperty.call(
        templateElementFromCustomElementName, listContainer[CUSTOM_ELEMENT]
        )) {
            // composing with custom element
            const templateElement = templateElementFromCustomElementName[listContainer[CUSTOM_ELEMENT]];
            const previous = copyArrayFlat(pathIn);
            pathIn = startPath.split(INSIDE_SYMBOL);
            const normalizedPath = normalizeStartPath(startPath);
            const newLength = data.length;
            let oldLength;
            if (hasOwnProperty.call(listContainer, LIST_CHILDREN)) {
                // remove nodes and variable subribers that are not used
                oldLength = listContainer[LIST_CHILDREN].length;
                if (oldLength > newLength) {
                    for (let i = newLength; i < oldLength; i += 1) {
                        const pathInside = `${normalizedPath}${i}`;
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
                const pathInside = `${normalizedPath}${i}`;
                feed(dataInside, pathInside);
                if (i >= oldLength) {
                    // cannot remove document fragment after insert because they empty themselves
                    // have to freeze the childs to still have a reference
                    const activatedTemplateClone = activateCloneTemplate(templateElement, String(i));
                    listContainer[LIST_CHILDREN].push(freezeLiveCollection(activatedTemplateClone.childNodes));
                    fragment.appendChild(activatedTemplateClone);
                } else {
                    ;// reusing, feed updated with new data the old nodes 
                }
            });
            pathIn = previous;
        } else {
            listContainer.innerHTML = "";
            data.forEach(function (value) {
                const listItem = document.createElement(listContainer[ELEMENT_LIST_ITEM]);
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

    const notifyListSubscribers = function (subscribers, startPath, data) {
        subscribers.forEach(function (listContainer) {
            notifyOneListSubscriber(listContainer, startPath, data);
        });
    };

    const feed = function (data, startPath = "") {
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
            const normalizedPath = normalizeStartPath(startPath);
            Object.entries(data).forEach(function ([key, value]) {
                const path = `${normalizedPath}${key}`;
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

    const applyDirectiveFunction = function (element, eventName, functionName) {
        if (!functions[functionName]) {
            console.error(`Event listener ${functionName} not found.`);
        }
        addEventListener(element, eventName, functions[functionName]);
        // todo only add context when not top level ? (inside sommething)
        element[CONTEXT] = contextFromArray(pathIn);
    };

    const tryApplyDirectiveFunction = function (element, customAttributeValue) {
        /* todo add warnings for syntax*/
        customAttributeValue.split(options.listSeparator).forEach(
            function (customAttributeValueSplit) {
                const tokens = customAttributeValueSplit.split(options.tokenSeparator);
                let functionName;
                let eventName;
                if (tokens.length === 1) {
                    functionName = tokens[0];
                    eventName = options.eventNameFromElement(element);
                } else {
                    [eventName, functionName] = tokens;
                }
                applyDirectiveFunction(element, eventName, functionName);
            }
        );
    };

    const applyDirectiveList = function (element, customAttributeValue) {
        /* js array --> DOM list
        <ul data-list="var-li"></ul>

        always throws away the entire dom list,
        let user of dom99 opt in in updates strategies such as
            same length, different content
            same content, different length
            key based identification
            */
        const [variableName, elementListItem, optional] = customAttributeValue
            .split(options.tokenSeparator);
        let fullName = "-";

        if (!variableName) {
            console.error(element,
            `Use ${options.directives.directiveList}="variableName-tagName" format!`);
        }

        if (optional) {
            // for custom elements
            fullName = `${elementListItem}-${optional}`;
            element[CUSTOM_ELEMENT] = fullName;
        } else {
            element[LIST_ITEM_PROPERTY] = options.variablePropertyFromElement(elementListItem.toUpperCase());
            element[ELEMENT_LIST_ITEM] = elementListItem;
        }

        const path = contextFromArrayWith(pathIn, variableName);

        listSubscribers[path] = pushOrCreateArray(listSubscribers[path], element);

        if (hasOwnProperty.call(variables, path)) {
          notifyOneListSubscriber(element, path, variables[path]);
        }
    };

    const applyDirectiveVariable = function (element, variableName) {
        /* two-way bind
        example : called for <input data-variable="a">
        in this example the variableName = "a"
        we push the <input data-variable="a" > element in the array
        that holds all elements which share this same "a" variable
        undefined assignment are ignored, instead use empty string*/

        if (!variableName) {
            console.error(element, `Use ${options.directives.directiveVariable}="variableName" format!`);
        }

        element[ELEMENT_PROPERTY] = options.variablePropertyFromElement(element);
        const path = contextFromArrayWith(pathIn, variableName);
        variableSubscribers[path]  = pushOrCreateArray(variableSubscribers[path], element);
        const lastValue = variables[path]; // has latest
        if (lastValue !== undefined) {
            notifyOneVariableSubscriber(element, lastValue);
        } 

        if (options.tagNamesForUserInput.includes(element.tagName)) {
            const broadcastValue = function (event) {
                //wil call setter to broadcast the value
                const value = event.target[event.target[ELEMENT_PROPERTY]];
                variables[path] = value;
                // would notify everything including itself
                // notifyVariableSubscribers(variableSubscribers[path], value);
                variableSubscribers[path].forEach(function (variableSubscriber) {
                    if (variableSubscriber !== element) {
                        notifyOneVariableSubscriber(variableSubscriber, value);
                    }
                });
            };
            addEventListener(
                element,
                options.eventNameFromElement(element),
                broadcastValue
            );
        }
    };

    const applyDirectiveElement = function (element, customAttributeValue) {
        /* stores element for direct access !*/
        const elementName = customAttributeValue;

        if (!elementName) {
            console.error(element, `Use ${options.directives.directiveElement}="elementName" format!`);
        }
        const path = contextFromArrayWith(pathIn, elementName);
        elements[path] = element;
    };

    const applyDirectiveTemplate = function (element, customAttributeValue) {
        /* stores a template element for later reuse !*/
        if (!customAttributeValue) {
            console.error(element, `Use ${options.directives.directiveTemplate}="d-name" format!`);
        }

        templateElementFromCustomElementName[customAttributeValue] = element;
    };

    const activateCloneTemplate = function (templateElement, key) {
        enterObject(key);
        const activatedTemplateClone = cloneTemplate(templateElement);
        linkJsAndDom(activatedTemplateClone);
        leaveObject();
        return activatedTemplateClone;
    };
    
    const applyDirectiveInside = function (element, key) {
        /* looks for an html template to render
        also calls applyDirectiveElement with key!*/
        if (!key) {
            console.error(element, `Use ${options.directives.directiveInside}="insidewhat" format!`);
        }

        const templateElement = templateElementFromCustomElementName[
            customElementNameFromElement(element)
        ];

        const activatedTemplateClone = activateCloneTemplate(templateElement, key);
        element.appendChild(activatedTemplateClone);
    };

    const enterObject = function (key) {
        pathIn.push(key);
    };

    const leaveObject = function () {
        pathIn.pop();
    };

    const deleteAllStartsWith = function (object, prefix) {
        Object.keys(object).forEach(function (key) {
            if (key.startsWith(prefix)) {
                delete object[key];
            }
        });
    };

    const forgetContext = function (path) {
        /*Removing a DOM element with .remove() or .innerHTML = "" will NOT delete
        all the element references if you used the underlying nodes in dom99
        A removed element will continue receive invisible automatic updates
        it also takes space in the memory.

        And all of this doesn't matter for 1-100 elements

        */
        deleteAllStartsWith(variableSubscribers, path);
        deleteAllStartsWith(listSubscribers, path);
        deleteAllStartsWith(variables, path);
    };

    const tryApplyDirectives = function (element) {
        /* looks if the element has dom99 specific attributes and tries to handle it*/
        // todo make sure no impactfull read write
        if (!element.hasAttribute) {
            return;
        }

        directiveSyntaxFunctionPairs.forEach(function (pair) {
            const [directiveName, applyDirective] = pair;
            if (!element.hasAttribute(directiveName)) {
                return;
            }
            const customAttributeValue = element.getAttribute(directiveName);
            if (customAttributeValue[0] === options.attributeValueDoneSign) {
                return;
            }
            applyDirective(element, customAttributeValue);
            // ensure the directive is only applied once
            element.setAttribute(directiveName,
                    options.attributeValueDoneSign + customAttributeValue);
        });
        if (element.hasAttribute(options.directives.directiveInside) ||
            element.hasAttribute(options.directives.directiveList)) {
            return;
        }
        /*using a custom element without data-inside*/
        let customElementName = customElementNameFromElement(element);
        if (hasOwnProperty.call(templateElementFromCustomElementName, customElementName)) {
            element.appendChild(
                cloneTemplate(templateElementFromCustomElementName[customElementName])
            );
        }
    };

    const linkJsAndDom = function (startElement = document.body) {
        //build array only once and use up to date options, they should not reset twice
        if (!directiveSyntaxFunctionPairs) {
            directiveSyntaxFunctionPairs = [
                /*order is relevant applyDirectiveVariable being before applyDirectiveFunction,
                we can use the just changed live variable in the bind function*/
                [options.directives.directiveElement, applyDirectiveElement],
                [options.directives.directiveVariable, applyDirectiveVariable],
                [options.directives.directiveFunction, tryApplyDirectiveFunction],
                [options.directives.directiveList, applyDirectiveList],
                [options.directives.directiveInside, applyDirectiveInside],
                [options.directives.directiveTemplate, applyDirectiveTemplate]
            ];
        }
        walkTheDomElements(startElement, tryApplyDirectives);
        return startElement;
    };

    const start = function (userFunctions = {}, initialFeed = {}, startElement) {
        Object.assign(functions, userFunctions);
        feed(initialFeed);
        linkJsAndDom(startElement);
    };

    // https://github.com/piecioshka/test-freeze-vs-seal-vs-preventExtensions
    return Object.freeze({
        start,
        linkJsAndDom,
        elements,
        functions,
        variables,
        feed,
        createElement2, // still need to expose ?
        forgetContext, // still need to expose ?
        // also add clear template too free dom nodes,
        // can be usefull if sure that template not going to be used again
        contextFromArray,
        contextFromEvent,
        getParentContext,
        options
    });
}());
export default d;
