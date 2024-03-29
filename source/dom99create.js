// @ts-check
export {
    create,
    scopeFromArray,
    scopeFromEvent,
    parentScope,
    leafName,
    leafIndex,
    createElement2,
    FIRST_VARIABLE_FROM_HTML,
    FIRST_VARIABLE_FROM_USER_AGENT,
};

import { createElement2 } from "./createElement2.js";
import { isObjectOrArray } from "./isObjectOrArray.js";
import { firstAncestorValue } from "./parentIdFromEvent.js";
import { pushOrCreateArrayAt } from "./pushOrCreateArrayAt.js";



const scopes = new WeakMap();
const listItems = new WeakMap();
const customElements = new WeakMap();
const listChildren = new WeakMap();
const INSIDE_SYMBOL = `>`;

const removeNode = (node) => {
    node.remove();
};

const elementsDeepForEach = (startElement, callBack) => {
    let currentNode = startElement;
    const treeWalker = document.createTreeWalker(startElement, NodeFilter.SHOW_ELEMENT)
    
    do {
        callBack(currentNode)
        currentNode = treeWalker.nextNode();
    } while( currentNode);
};

const customElementNameFromElement = (element) => {
    const isAttributeValue = element.getAttribute(`is`);
    if (isAttributeValue) {
        return isAttributeValue;
    }
    return element.tagName.toLowerCase();
};

const cloneTemplate = (template, options) => {
    if (!template) {
        console.error(
            `Template missing <template ${options.directives.template}="d-name">
                Template Content
            </template>`,
        );
    }
    if (!template.content) {
        console.error(
            `template.content is undefined, this can happen if a template is inside another template. Use only top level templates, also use recommended polyfills`,
        );
    }
    return document.importNode(template.content, true);
};


/**
 @param {Element} element

 @return {string | undefined} scope
 */
const scopeFromElement = (element) => {
    return scopes.get(element);
};

/**
 scopeFromEvent gets the starting path for an event issued inside a component

 in combination with scopeFromArray it allows to access sibling elements and variables

 d.functions.clickedButton = (event) => {
    d.elements[d.scopeFromArray([scopeFromEvent(event), `other`])]
        .classList.add(`active`);
};

 @param {Event} event

 @return {string | undefined} scope
 */
const scopeFromEvent = (event) => {
    if (event?.target) {
        return firstAncestorValue(event.target, scopeFromElement) || ``;
    }
    return;
};

/**
 scopeFromArray joins paths to create a valid path to use with

 d.variables[path]
 d.elements[path]

 @param {array} scopeIn

 @return {string} path
 */
const scopeFromArray = (scopeIn) => {
    return scopeIn.filter(function (v) {
        return v !== undefined && v !== ``;
    }).join(INSIDE_SYMBOL);
};

/**
 parentScope

 @param {string} scope

 @return {string} parentScope
 */
const parentScope = (scope) => {
    const split = scope.split(INSIDE_SYMBOL);
    split.pop();
    return split.join(INSIDE_SYMBOL);
};

/**

 @param {string} scope

 @return {string} leafName
 */
const leafName = (scope) => {
    const split = scope.split(INSIDE_SYMBOL);
    return split[split.length - 1];
};
/**

 @param {string} scope

 @return {number} leafIndex
 */
const leafIndex = (scope) => {
    return Number(leafName(scope));
};

const scopeFromArrayWith = (scopeIn, withWhat) => {
    if (scopeIn.length === 0) {
        return withWhat;
    }
    return `${scopeFromArray(scopeIn)}${INSIDE_SYMBOL}${withWhat}`;
};

const normalizeStartPath = (startScope) => {
    /* this is because `a>b>c` is irregular
    `a>b>c>` or `>a>b>c` would not need such normalization */
    if (startScope) {
        return `${startScope}${INSIDE_SYMBOL}`;
    }
    return startScope;
};

const deleteAllStartsWith = (object, prefix = ``) => {
    Object.keys(object).forEach((key) => {
        if (key.startsWith(prefix)) {
            delete object[key];
        }
    });
};

// good candidates for firstVariableValueStrategy :
const FIRST_VARIABLE_FROM_HTML = (element) => {
    if (element.defaultValue !== undefined) {
        return element.defaultValue;
    }
    if (element.open !== undefined) { // <details>
        return element.open;
    }
    return element.textContent;
};

const FIRST_VARIABLE_FROM_USER_AGENT = (element) => {
    return element.value || FIRST_VARIABLE_FROM_HTML(element);
};

const prepareGet = (input, ...toJoin) => {
    let array;
    if (Array.isArray(input)) {
        array = input.concat(toJoin);
    } else {
        array = [input, ...toJoin];
    }
    return scopeFromArray(array);
};

const enterObject = (scopeIn, key) => {
    scopeIn.push(key);
};

const leaveObject = (scopeIn) => {
    scopeIn.pop();
};

const notifyOneVariableSubscriber = (options, variableSubscriber, value) => {
    variableSubscriber[options.propertyFromElement(variableSubscriber)] = value;
};

const notifyVariableSubscribers = (options, subscribers, value) => {
    if (value === undefined) {
        /* undefined can be used to use the default value
        without explicit if else */
        return;
    }
    subscribers.forEach((variableSubscriber) => {
        notifyOneVariableSubscriber(options, variableSubscriber, value);
    });
};

const notifyOneListSubscriber = (listContainer, startScope, data, templateFromName, notifyCustomListSubscriber, options) => {
    if (customElements.has(listContainer)) {
        if (!Object.hasOwn(templateFromName, customElements.get(listContainer))) {
            console.error(`<${customElements.get(listContainer)}> not found, make sure its <template> is defined before`);
            return;
        }
        notifyCustomListSubscriber(listContainer, startScope, data);
        return;
    }
    notifyRawListSubscriber(listContainer, data, options);
};

const notifyListSubscribers = (subscribers, startScope, data, templateFromName, notifyCustomListSubscriber, options) => {
    subscribers.forEach((listContainer) => {
        notifyOneListSubscriber(listContainer, startScope, data, templateFromName, notifyCustomListSubscriber, options);
    });
};

const notifyRawListSubscriber = (listContainer, data, options) => {
    const fragment = document.createDocumentFragment();
    listContainer.innerHTML = ``;
    const listItemTagName = listItems.get(listContainer);
    const listItemProperty = options.propertyFromElement(
        listItemTagName.toUpperCase(),
    );
    data.forEach((value) => {
        const listItem = document.createElement(listItemTagName);
        if (isObjectOrArray(value)) {
            Object.assign(listItem, value);
        } else {
            listItem[listItemProperty] = value;
        }
        fragment.appendChild(listItem);
    });
    listContainer.appendChild(fragment);
};

const create = (options) => {
    const variableSubscribers = {};
    const listSubscribers = {};

    /**
     Retrieve variable values that have been modified by d.feed or
     2 way data bound element with data-variable attribute (Read only)
  
     @param {string} path
  
     @return {any}
     */
    const variables = {};

    /**
     Retrieve elements that have data-element attribute (Read only)
  
     @param {string} path
  
     @return {Element}
     */
    const elements = {};
    const templateFromName = {};

    /**
     Set event listener that are going to be attached to elements
     with data-function
  
     @param {string} name
  
     @return {function}
     */
    const functions = {};

    let scopeIn = [];

    const functionPlugins = [];
    let alreadyHooked = false;
    const feedPlugins = [];
    const clonePlugins = [];


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
    const forgetScope = (path) => {
        deleteAllStartsWith(variableSubscribers, path);
        deleteAllStartsWith(listSubscribers, path);
        deleteAllStartsWith(variables, path);
        deleteAllStartsWith(elements, path);
    };

    const notifyCustomListSubscriber = (listContainer, startScope, data) => {
        const fragment = document.createDocumentFragment();
        const template = templateFromName[customElements.get(listContainer)];
        const previous = Array.from(scopeIn);
        scopeIn = startScope.split(INSIDE_SYMBOL);
        // enterObject(scopeIn, key);
        // leaveObject(scopeIn);
        const normalizedScope = normalizeStartPath(startScope);
        const newLength = data.length;
        let oldLength;
        let scopeInside;
        if (listChildren.has(listContainer)) {
            // remove nodes and variable subscribers that are not used
            oldLength = listChildren.get(listContainer).length;
            if (oldLength > newLength) {
                for (let i = newLength; i < oldLength; i += 1) {
                    scopeInside = `${normalizedScope}${i}`;
                    listChildren.get(listContainer)[i].forEach(removeNode);
                    forgetScope(scopeInside);
                }
                listChildren.get(listContainer).length = newLength;
            }
        } else {
            listChildren.set(listContainer, []);
            oldLength = 0;
        }

        data.forEach((dataInside, i) => {
            scopeInside = `${normalizedScope}${i}`;
            feed(scopeInside, dataInside);
            if (i < oldLength) {
                // reusing, feed updated with new data the old nodes
                return;
            }
            /* cannot remove document fragment after insert because they empty themselves
            have to freeze the children to still have a reference */
            const activatedClone = activateCloneTemplate(
                template,
                String(i),
            );
            listChildren.get(listContainer).push(
                Array.from(activatedClone.childNodes),
            );
            fragment.appendChild(activatedClone);
        });
        scopeIn = previous;
        listContainer.appendChild(fragment);
    };


    /**
     Feed data, for element with corresponding data-variable and data-list
  
     @param {string} startScope
     @param {any} data
  
     @or
  
     @param {any} data
     */
    const feed = (startScope, data) => {
        if (data === undefined) {
            data = startScope;
            startScope = ``;
        }
        if (isObjectOrArray(startScope)) {
            console.error(
                `Incorrect types passed to d.feed,
                d.feed(string, object) or d.feed(object)`,
            );
        }
        if (!alreadyHooked) {
            feedHook(startScope, data);
            alreadyHooked = true;
        }
        if (!isObjectOrArray(data)) {
            variables[startScope] = data;
            if (Object.hasOwn(variableSubscribers, startScope)) {
                notifyVariableSubscribers(options, variableSubscribers[startScope], data);
            }
        } else if (Array.isArray(data)) {
            variables[startScope] = data;
            if (Object.hasOwn(listSubscribers, startScope)) {
                notifyListSubscribers(listSubscribers[startScope], startScope, data, templateFromName, notifyCustomListSubscriber, options);
            }
        } else {
            const normalizedScope = normalizeStartPath(startScope);
            /* sort arrays to be last fix 
            list first as otherwise setting the value of a select has no effect */
            const dataEntries = Object.entries(data);
            dataEntries.sort(([, value], [, valueb]) => {
                return Number(Array.isArray(valueb)) - Number(Array.isArray(value));
            });
            dataEntries.forEach(([key, value]) => {
                const scope = `${normalizedScope}${key}`;
                feed(scope, value);
            });
        }
        alreadyHooked = false;
    };

    const get = (input, ...toJoin) => {
        return variables[prepareGet(input, ...toJoin)];
    };

    const getElement = (input, ...toJoin) => {
        return elements[prepareGet(input, ...toJoin)];
    };

    const applyFunctionOriginal = (element, eventName, functionName) => {
        if (!functions[functionName]) {
            console.error(`Event listener ${functionName} not found.`);
        }
        element.addEventListener(eventName, functions[functionName], false);
    };

    let applyFunction = applyFunctionOriginal;

    const applyFunctions = (element, attributeValue) => {
        if (scopeIn.length) {
            scopes.set(element, scopeFromArray(scopeIn));
        }
        attributeValue.split(options.listSeparator).forEach(
            (attributeValueSplit) => {
                const tokens = attributeValueSplit.split(options.tokenSeparator);
                let functionName;
                let eventName;
                if (tokens.length === 1) {
                    functionName = tokens[0];
                    eventName = options.eventNameFromElement(element);
                } else {
                    [eventName, functionName] = tokens;
                }
                applyFunction(element, eventName, functionName);
            },
        );
    };

    const applyList = (element, variableName) => {
        if (!variableName) {
            console.error(
                element,
                `Use ${options.directives.list}="variableName-tagName" format!`,
            );
        }
        
        const use = element.getAttribute(options.directives.use);
        if (!use) {
            const tagName = element.tagName.toLowerCase();
            console.error(
                `<${tagName} ${options.directives.list}="${variableName}"></${tagName}> is missing ${options.directives.use}="name"`,
            );
            return;
        }
        if (use.includes(`-`)) {
            customElements.set(element, use);
        } else {
            listItems.set(element, use);
        }
        
        /* could send scope as array directly but have to change
        notifyOneListSubscriber to take in scope as Array or String before */
        const arrayScope = scopeFromArrayWith(scopeIn, variableName);

        pushOrCreateArrayAt(listSubscribers, arrayScope, element);

        if (element.childNodes.length > 0) {
            enterObject(scopeIn, variableName);
            const childElements = Array.from(element.childNodes).filter(childNode => {
                // document.body.ELEMENT_NODE === 1
                return childNode.nodeType === 1;
            });

            const scope = scopeFromArray(scopeIn);
            const currentValue = variables[scope];
            if (currentValue === undefined) {
                variables[scope] = Array.from({ length: childElements.length }, () => {
                    return {};
                });
            }

            listChildren.set(element, []);
            childElements.forEach((childElement, i) => {
                enterObject(scopeIn, String(i));
                activate(childElement);
                listChildren.get(element).push(
                    [childElement, ...childElement.childNodes],
                );
                leaveObject(scopeIn);
            });
            leaveObject(scopeIn);
        }

        if (Object.hasOwn(variables, arrayScope)) {
            notifyOneListSubscriber(element, arrayScope, variables[arrayScope], templateFromName, notifyCustomListSubscriber, options);
        }
    };

    const applyVariable = (element, variableName) => {
        /* two-way bind
        example : called for <input data-variable="a">
        in this example the variableName = `a`
        we push the <input data-variable="a" > element in the array
        that holds all elements which share this same `a` variable
        undefined assignment are ignored, instead use empty string*/

        if (!variableName) {
            console.error(
                element,
                `Use ${options.directives.variable}="variableName" format!`,
            );
        }

        const scope = scopeFromArrayWith(scopeIn, variableName);
        pushOrCreateArrayAt(variableSubscribers, scope, element);

        let currentValue = variables[scope];
        if (currentValue === undefined && options.firstVariableValueStrategy !== undefined) {
            currentValue = options.firstVariableValueStrategy(element);
            variables[scope] = currentValue;
        }
        if (currentValue !== undefined) {
            notifyOneVariableSubscriber(options, element, currentValue);
        }

        if (!options.tagNamesForUserInput.includes(element.tagName)) {
            return;
        }
        const broadcastValue = (/*event*/) => {
            //wil call setter to broadcast the value
            const value = element[options.propertyFromElement(element)];
            variables[scope] = value;
            feedHook(scope, value);
            /* would notify everything including itself
            notifyVariableSubscribers(options, variableSubscribers[scope], value); */
            variableSubscribers[scope].forEach((variableSubscriber) => {
                if (variableSubscriber !== element) {
                    notifyOneVariableSubscriber(options, variableSubscriber, value);
                }
            });
        };
        element.addEventListener(
            options.eventNameFromElement(element),
            broadcastValue,
            false,
        );

    };

    const applyElement = (element, attributeValue) => {
        /* stores element for direct access !*/
        const elementName = attributeValue;

        if (!elementName) {
            console.error(
                element,
                `Use ${options.directives.element}="elementName" format!`,
            );
        }
        const scope = scopeFromArrayWith(scopeIn, elementName);
        elements[scope] = element;
    };

    const applyTemplate = (element, attributeValue) => {
        /* stores a template element for later reuse !*/
        if (!attributeValue) {
            console.error(
                element,
                `Use ${options.directives.template}="d-name" format!`,
            );
        }

        if (element.tagName !== `TEMPLATE`) {
            /* allow use on non template elements
            useful for server side rendering */
            const { innerHTML } = element;
            element = document.createElement(`template`);
            element.innerHTML = innerHTML;
        }
        templateFromName[attributeValue] = element;
    };

    const activateCloneTemplate = (template, key) => {
        /* clones a template and activates it
        */
        enterObject(scopeIn, key);
        const activatedClone = cloneTemplate(template, options);
        activate(activatedClone);
        cloneHook();
        leaveObject(scopeIn);
        return activatedClone;
    };

    const applyScope = (element, key) => {
        /* looks for an html template to render
        also calls applyElement with key!*/
        if (!key) {
            return;
        }

        const template = templateFromName[
            customElementNameFromElement(element)
        ];

        if (template) {
            const activatedClone = activateCloneTemplate(template, key);
            element.appendChild(activatedClone);
        } else {
            // avoid infinite loop
            element.setAttribute(
                options.directives.scope,
                `${options.doneSymbol}${key}`,
            );
            // parse children under scope
            enterObject(scopeIn, key);
            activate(element);
            leaveObject(scopeIn);
        }
    };

    const directivePairs = [
        /*order is relevant applyVariable being before applyFunction,
        we can use the just changed live variable in the bind function*/
        [options.directives.element, applyElement],
        [options.directives.template, applyTemplate],
        [options.directives.list, applyList],
        [options.directives.variable, applyVariable],
        [options.directives.function, applyFunctions],
        [options.directives.scope, applyScope],
    ];

    const tryApplyDirectives = (element) => {
        /* looks if the element has dom99 specific attributes and tries to handle it*/
        if (!element.hasAttribute) {
            // can this if be removed eventually ? --> no
            return;
        }

        // spell check attributes
        // const directives = Object.values(options.directives);
        // Array.prototype.slice.call(element.attributes).forEach((attribute) => {
        //     if (attribute.nodeName.startsWith(`data`)) {
        //         if (!directives.includes(attribute.nodeName)) {
        //             console.warn(`dom99 does not recognize ${attribute.nodeName}`);
        //         }
        //     }
        // });

        directivePairs.forEach(([directiveName, applyDirective]) => {
            if (!element.hasAttribute(directiveName)) {
                return;
            }
            const attributeValue = element.getAttribute(directiveName);
            if (attributeValue[0] === options.doneSymbol) {
                return;
            }
            applyDirective(element, attributeValue);
            // ensure the directive is only applied once
            element.setAttribute(
                directiveName,
                `${options.doneSymbol}${attributeValue}`,
            );
        });
        if (
            element.hasAttribute(options.directives.scope) ||
            element.hasAttribute(options.directives.list)
        ) {
            return;
        }
        /* using a custom element without data-scope */
        const customName = customElementNameFromElement(element);
        if (Object.hasOwn(templateFromName, customName)) {
            element.appendChild(
                cloneTemplate(templateFromName[customName], options),
            );
        }
    };

    /**
     Activates the DOM by reading data- attributes, starting from startElement
     and walking inside its tree
  
     @param {Element} startElement
  
     @return {Element} startElement
     */
    const activate = (startElement = document.body) => {
        elementsDeepForEach(startElement, tryApplyDirectives);
        return startElement;
    };

    /**
     @param {object} options
        - {object} dataFunctions
        - {object} initialFeed
        - {Element} startElement
     */
    const start = ({
        startElement = document.body,
        initialFeed = {},
        dataFunctions = {},
    } = {}) => {
        if (startElement.nodeType !== 1) {
            console.error(`start takes undefined or a node as first argument`);
        }

        Object.assign(functions, dataFunctions);
        feed(``, initialFeed);
        activate(startElement);
    };

    const cloneHook = function () {
        const scope = scopeFromArray(scopeIn);
        clonePlugins.forEach((clonePlugin) => {
            clonePlugin(scope);
        });
    };

    const feedHook = (startScope, data) => {
        feedPlugins.forEach((feedPlugin) => {
            feedPlugin(startScope, data);
        });
    };

    /**
     Plug in a plugin (hook) into the core functionality
  
     @param {object} featureToPlugIn
  
     */
    const plugin = (featureToPlugIn) => {
        if (!isObjectOrArray(featureToPlugIn)) {
            console.error(`plugin({
                type,
                plugin
            });`);
        }
        if (featureToPlugIn.type === `function`) {
            functionPlugins.push(featureToPlugIn.plugin);
            applyFunction = (element, eventName, functionName) => {
                let defaultPrevented = false;
                const preventDefault = () => {
                    defaultPrevented = true;
                };
                

                functionPlugins.forEach((pluginFunction) => {
                    pluginFunction(element, eventName, functionName, functions, preventDefault);
                });
                if (defaultPrevented) {
                    return;
                }
                applyFunctionOriginal(element, eventName, functionName);
            };
        } else if (featureToPlugIn.type === `variable`) {
            feedPlugins.push(featureToPlugIn.plugin);
        } else if (featureToPlugIn.type === `cloned`) {
            clonePlugins.push(featureToPlugIn.plugin);
        } else {
            console.warn(`plugin type ${featureToPlugIn.type} not yet implemented`);
        }
    };

    return {
        start,
        elements,
        functions,
        variables,
        get,
        element: getElement,
        feed,
        plugin,
    };
};
