//dom99next.js  experimental, in progress DO NOT USE !!!
/*jslint
    es6, maxerr: 200, browser, devel, fudge, maxlen: 100, node
*/
/*updates more explicit APIs,
simplified data-fx
todo rename and redefine workflow, add data-x spelling checker
i18n
use es2015+ for proxies, weak maps*/
const dom99 = (function () {
    "use strict";

    //root collections
    const variables = {};
    const variablesSubscribers = {};
    const elements = {};

    let pathIn = [];

    let variablesPointer = variables;
    let variablesSubscribersPointer = variablesSubscribers;
    let elementsPointer = elements;

    let directiveSyntaxFunctionPairs;

    const functions = {};
    const templateElementFromCustomElementName = {};
    const doc = document;
    const miss = "miss";
    const value = "value";
    const textContent = "textContent";
    const source = "src";
    const checked = "checked";

    const isNotNullObject = function (x) {
        return (x !== null && typeof x === "object");
    };

    const copyArrayFlat = function (array1) {
        return array1.map((x) => x);
    };

    const deepAssignX = function (objectTarget, objectSource) {
        Object.keys(objectSource).forEach(function (key) {
            if (!isNotNullObject(objectSource[key])) {
                objectTarget[key] = objectSource[key];
            } else {
                if (!objectTarget.hasOwnProperty(key)) {
                    if (Array.isArray(objectSource[key])) {
                        objectTarget[key] = [];
                    } else { // strict object
                        objectTarget[key] = {};
                    }
                }
                deepAssignX(objectTarget[key], objectSource[key]);
            }
        });
    };

    const defineSetterGetter = function (targetObject, propertyString, getter, setter) {
        Object.defineProperty(targetObject, propertyString, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: false
        });
    };

    const booleanFromBooleanString = function (booleanString) {
        return (booleanString === "true");
    };

    const valueElseMissDecorator = function (object1) {
        /*Decorator function around an Object to provide a default value
        Decorated object must have a miss key with the default value associated
        Arrays are also objects
        */
        return function (key) {
            if (object1.hasOwnProperty(key)) {
                return object1[key];
            }
            return object1[miss];
        };
    };

    const propertyFromTag = valueElseMissDecorator({
        //Input Type : appropriate property name to retrieve and set the value
        "input": value,
        "textarea": value,
        "progress": value,
        "select": value,
        "img": source,
        "source": source,
        "audio": source,
        "video": source,
        "track": source,
        "script": source,
        "option": value,
        "link": "href",
        miss: textContent
    });

    /*booleanProperties = [
        // add here all relevant boolean properties
        checked
    ],*/

    const propertyFromInputType = valueElseMissDecorator({
        //Input Type : appropriate property name to retrieve and set the value
        "checkbox": checked,
        "radio": checked,
        miss: value
    });

    const inputEventFromType = valueElseMissDecorator({
        "checkbox": "change",
        "radio": "change",
        "range": "change",
        miss: "input"
    });

    const eventFromTag = valueElseMissDecorator({
        "select": "change",
        miss: "input"
    });

    const options = {
        attributeValueDoneSign: "☀",
        tokenSeparator: "-",
        listSeparator: ",",
        directives: {
            directiveFunction: "data-function",
            directiveFunctionWithContext: "data-function-context",
            directiveVariable: "data-variable",
            directiveElement: "data-element",
            directiveList: "data-list",
            directiveIn: "data-in"
        },

        variablePropertyFromTagAndType: function (tagName, type) {
            if (tagName === "input") {
                return propertyFromInputType(type);
            }
            return propertyFromTag(tagName);
        },

        eventFromTagAndType: function (tagName, type) {
            if (tagName === "input") {
                return inputEventFromType(type);
            }
            return eventFromTag(tagName);
        },

        elementsForUserInputList: [
            "input",
            "textarea",
            "select"
        ]
    };

    const createElement2 = function (ElementDescription) {
        const element = doc.createElement(ElementDescription.tagName);
        ElementDescription = Object.assign({}, ElementDescription);//avoid side effects
        delete ElementDescription.tagName; // read only
        /*element.setAttribute(attr, value) is good to set initial attr like you do in html
        element.attr = value is good to change the live values    */
        Object.keys(ElementDescription).forEach(function (key) {
            element.setAttribute(key, ElementDescription[key]);
        });
        return element;
    };

    const walkTheDomElements = function (element, function1) {
        function1(element);
        if (element.tagName !== "TEMPLATE") {//IE bug: templates are not inert
            element = element.firstElementChild;
            while (element) {
                walkTheDomElements(element, function1);
                element = element.nextElementSibling;
            }
        }
    };

    const tagFromElement = function (element) {
        return element.tagName.toLowerCase();
    };

    const customElementNameFromElement = function (element) {
        return element.getAttribute("is") || tagFromElement(element);
    };

    const addEventListener = function (element, eventName, function1, useCapture = false) {
        element.addEventListener(eventName, function1, useCapture);
    };

    /*not used, tested yet
    const onceAddEventListener = function (element, eventName, function1, useCapture=false) {
        let tempFunction = function (event) {
            //called once only
            function1(event);
            element.removeEventListener(eventName, tempFunction, useCapture);
        };
        addEventListener(element, eventName, tempFunction, useCapture);
    };*/

    const commonFunctionDirectiveDecorator = function (variableFunction) {
        /*applyDirectiveFunction and applyDirectiveFunctionWithContext are almost the same*/
        return function (element, hostElement, eventName, functionName) {
            console.log(element, hostElement, eventName, functionName);
            if (!eventName || !functionName) {
                if (!eventName) {
                    console.warn(element,
    'Use data-function="event-functionName" or "functionName"');//todo update warning
                    return;
                }
                // used short hand syntax
                functionName = eventName;
                eventName = options.eventFromTagAndType(tagFromElement(element), element.type);
            }
            let temp;
            if (functions.hasOwnProperty(functionName)) {
                temp = functions[functionName];
            }
            const pathJoined = pathIn.join("");
            if (functionSubscribersFromKey.hasOwnProperty(pathJoined)) {
                if (functionSubscribersFromKey[pathJoined].hasOwnProperty(functionName)) {
                    functionSubscribersFromKey[pathJoined][functionName].push([element, eventName]);
                } else {
                    functionSubscribersFromKey[pathJoined][functionName] = [[element, eventName]]
                }
                
            } else {
                //[] for the computed functionName
                functionSubscribersFromKey[pathJoined] = {[functionName]: [[element, eventName]]};
            }
            let setterExists;
            if (!isfunctionSetterFromFunctionName[functionName]) {
                //console.log(element, hostElement, eventName, functionName);
                isfunctionSetterFromFunctionName[functionName] = true;
                setterExists = false;
            } else {
                setterExists = true;
            }
            variableFunction(element, hostElement, eventName, functionName, setterExists);
            if (temp !== undefined) {
                functions[functionName] = temp; //calls the set once
            }
        };
    };

    const functionSubscribersFromKey = {};//todo find better name
    const isfunctionSetterFromFunctionName = {};
    
    const applyDirectiveFunction = commonFunctionDirectiveDecorator(function (element, hostElement, eventName, functionName, setterExists) {
        if (setterExists) {
            return;
        }
        let callBackFunction;
        defineSetterGetter(functions, functionName,
            function () {
                return callBackFunction;
            },
            function (newFunction) {
                /* this optimization is a logic error,
                after the first, elements with data-function will not receive the event listeners, we should check element.has eventlistener but how ?
                if (newFunction === callBackFunction) {
                    return;
                }*/
                Object.keys(functionSubscribersFromKey).forEach(function (key) {
                    const functionSubscribers = functionSubscribersFromKey[key];
                    Object.keys(functionSubscribers).forEach(function (currentFunctionName) {
                        if (currentFunctionName !== functionName) {
                            return;
                        }
                        functionSubscribers[currentFunctionName].forEach(function (elementEventNamePair) {
                            const currentElement = elementEventNamePair[0];
                            const currentEvent = elementEventNamePair[1];
                            currentElement.removeEventListener(currentEvent, callBackFunction, false); // no try catch needed
                            if (newFunction) {
                                addEventListener(currentElement, currentEvent, newFunction);
                            }
                        });
                    });
                });
                callBackFunction = newFunction;
        });
        
    });

    const contextParametersFromElement = new WeakMap();
    const previousCallBackWithContextCallerFromElement = new WeakMap();
    const callBackWithContextCallerFactory = function(eventHandler, key, hostElement) {
        return function (event) {
            return eventHandler(event,
                copyArrayFlat(key),
                hostElement);
        };
    };
    const applyDirectiveFunctionWithContext = commonFunctionDirectiveDecorator(function (element, hostElement, eventName, functionName, setterExists) {
    
        contextParametersFromElement.set(element, [copyArrayFlat(pathIn), hostElement]);
        if (setterExists) {
            return;
        }        

        let callBackFunction;
        let callBackWithContextCaller;
        

        //todo make single (optimization)
        defineSetterGetter(functions, functionName,
            function () {
                return callBackFunction;
            },
            function (newFunction) {
                
                            
                Object.keys(functionSubscribersFromKey).forEach(function (key) {
                    const functionSubscribers = functionSubscribersFromKey[key];
                    Object.keys(functionSubscribers).forEach(function (currentFunctionName) {
                        if (currentFunctionName !== functionName) {
                            return;
                        }
                        functionSubscribers[currentFunctionName].forEach(function (elementEventNamePair) {
                            const currentElement = elementEventNamePair[0];
                            const currentEvent = elementEventNamePair[1];
                            currentElement.removeEventListener(currentEvent, previousCallBackWithContextCallerFromElement.get(currentElement), false); // no try catch needed
                            if (newFunction) {
                                callBackWithContextCaller = callBackWithContextCallerFactory(newFunction, ...contextParametersFromElement.get(currentElement));
                                addEventListener(currentElement, currentEvent, callBackWithContextCaller);
                                previousCallBackWithContextCallerFromElement.set(currentElement, callBackWithContextCaller);
                            }
                        });
                    });
                });
                callBackFunction = newFunction;
            }
        );
    });

    const applyDirectiveList = function (element, variableName, elementListItem) {
        /* js array --> DOM list
        <ul data-list="var-li"></ul>
        todo optimization*/
        let list;
        let temp;

        if (!variableName) {
            console.warn(element, 'Use data-variable="variableName" format!');
            return;
        }

        /*we check if the user already saved data in variablesPointer[variableName]
        before using linkJsAndDom , if that is the case we
        initialize variablesPointer[variableName] with that same data once we defined
        our custom property*/
        if (variablesPointer.hasOwnProperty(variableName)) {
            temp = variablesPointer[variableName];
        }
        //Dom99 VaRiable Property for List items
        element.DVRPL = options.variablePropertyFromTagAndType(elementListItem);
        defineSetterGetter(variablesPointer, variableName,
            function () {
                return list;
            },
            function (newList) {
                const fragment = doc.createDocumentFragment();
                list = newList;
                element.innerHTML = "";
                list.forEach(function (value) {
                    const listItem = doc.createElement(elementListItem);
                    if (isNotNullObject(value)) {
                        Object.keys(value).forEach(function (key) {
                            listItem[key] = value[key];
                        });
                    } else {
                        listItem[element.DVRPL] = value;
                    }
                    fragment.appendChild(listItem);
                });

                element.appendChild(fragment);
            });

        if (temp !== undefined) {
            variablesPointer[variableName] = temp; //calls the set once
        }
    };

    const applyDirectiveVariable = function (element, variableName) {
        /* two-way bind
        example : called for <input data-variable="a">
        in this example the variableName = "a"
        we push the <input data-variable="a" > element in the array
        that holds all elements which share this same "a" variable
        everytime "a" is changed we change all those elements values
        and also 1 private js variable (named x below)
        The public D.variables.a variable returns this private js variable

        undefined assignment are ignored, instead use empty string( more DOM friendly)*/
        const tagName = tagFromElement(element);
        const type = element.type;
        let temp;

        if (!variableName) {
            console.warn(element, 'Use data-variable="variableName" format!');
            return;
        }

        if (variablesPointer.hasOwnProperty(variableName)) {
            temp = variablesPointer[variableName];
        }

        //Dom99 VaRiable Property
        element.DVRP = options.variablePropertyFromTagAndType(tagName, type);

        if (variablesSubscribersPointer.hasOwnProperty(variableName)) {
            variablesSubscribersPointer[variableName].push(element);
        } else {
            const variablesSubscribersPointerReference = variablesSubscribersPointer;
            let x = ""; // holds the value
            variablesSubscribersPointer[variableName] = [element];
            defineSetterGetter(variablesPointer, variableName,
                function () {
                    return x;
                },
                function (newValue) {
                    if (newValue === undefined) {
                        console.warn("D.variables.x= string || bool , not undefined!");
                        return;
                    }
                    x = String(newValue);
                    variablesSubscribersPointerReference[variableName].forEach(
                        function (currentElement) {
                        /*here we change the value of the currentElement in the dom
                        */

                        //don't overwrite the same
                            if (String(currentElement[currentElement.DVRP]) === x) {
                                return;
                            }
                        // add more than checked, use if
                        //(booleanProperties.includes(currentElement.DVRP))

                            if (currentElement.DVRP === checked) {
                                currentElement[currentElement.DVRP] = newValue;
                            } else {
                                currentElement[currentElement.DVRP] = x;
                            }
                        }
                    );
                });
        }

        if (options.elementsForUserInputList.includes(tagName)) {
            const variablesPointerReference = variablesPointer;
            const broadcastValue = function (event) {
                //wil call setter to broadcast the value
                variablesPointerReference[variableName] = event.target[event.target.DVRP];
            };
            addEventListener(element,
                    options.eventFromTagAndType(tagName, type),
                    broadcastValue);
        }

        if (temp !== undefined) {
            variablesPointer[variableName] = temp; //calls the set once
        }
    };

    const applyDirectiveElement = function (element,
            elementName, customElementTargetNamePrefix,
            customElementTargetNameAppendix) {
        /* stores element for direct access !*/

        if (!elementName) {
            console.warn(element, 'Use data-element="elementName" format!');
            return;
        }

        elementsPointer[elementName] = element;

        if (customElementTargetNamePrefix && customElementTargetNameAppendix) {
            templateElementFromCustomElementName[
                `${customElementTargetNamePrefix}-${customElementTargetNameAppendix}`
            ] = element;
        }
    };

    const cloneTemplate = (function () {
        if ("content" in doc.createElement("template")) {
            return function (templateElement) {
                return doc.importNode(templateElement.content, true);
            };
        }

        return function (templateElement) {
            /*here we have a div too much (messes up css)*/
            const clone = doc.createElement("div");
            clone.innerHTML = templateElement.innerHTML;
            return clone;
        };
    }());

    const enterObject = function (key) {
        pathIn.push(key);

        if (!elementsPointer.hasOwnProperty(key)) {
            elementsPointer[key] = {};
        }
        if (!variablesPointer.hasOwnProperty(key)) {
            variablesPointer[key] = {};
        }
        if (!variablesSubscribersPointer.hasOwnProperty(key)) {
            variablesSubscribersPointer[key] = {};
        }

        elementsPointer = elementsPointer[key];
        variablesPointer = variablesPointer[key];
        variablesSubscribersPointer = variablesSubscribersPointer[key];
    };

    const followPath = function (root, keys) {
        let innerObject = root;
        keys.forEach(function (key) {
            innerObject = innerObject[key];
        });
        return innerObject;
    };

    const leaveObject = function () {
        pathIn.pop();

        elementsPointer = followPath(elements, pathIn);
        variablesPointer = followPath(variables, pathIn);
        variablesSubscribersPointer = followPath(variablesSubscribers, pathIn);
    };

    const templateRender = function (templateElement, key, hostElement) {
    /*takes a template element as argument, usually linking to a <template>
    clones the content and returns that clone
    the content elements with "data-variable" will share a variable at
    D.variables[key][variableName]
    the content elements with "data-element" will have a reference at
    D.elements[key][elementName]

    returns clone
    */
        enterObject(key);
        const clone = linkJsAndDom(cloneTemplate(templateElement), hostElement);
        leaveObject();
        return clone;
    };

    const forgetKey = (function () {
        /*Removing a DOM element with .remove() or .innerHTML = "" will NOT delete
        all the element references if you used the underlying nodes in dom99
        A removed element will continue receive invisible automatic updates
        it also takes space in the memory.

        And all of this doesn't matter for 1-100 elements

        It can matter in single page application where you CONSISTENTLY use

            0. x = D.createElement2(...)
            1. D.linkJsAndDom(x)
            2. populate the result with data
            3. somewhat later delete the result

        In that case I recommend using an additional step

            4. Use D.forgetKey to let the garbage collector free space in memory
            (can also improve performance but it doesn't matter here, read optimize optimization)

        Note: If you have yet another reference to the element in a variable in your program,
        the element will still exist and we cannot clean it up from here.

        Internally we just deleted the key group for every relevant function
        (for instance binds are not key grouped)
        */
        // we cannot use Weak Maps here because it needs an object as the key not a String
        // or we need to change the API a bit

        const followPathAndDelete = function (object1, keys) {
            let target = object1;
            let lastKey = keys.pop();
            keys.forEach(function (key) {
                target = target[key];
            });
            delete target[lastKey];
        };
        return function (keys) {
            if (!Array.isArray(keys)) {
                keys = [keys];
            }
            delete functionSubscribersFromKey[keys.join("")];
            
            followPathAndDelete(elements, copyArrayFlat(keys));
            followPathAndDelete(variables, copyArrayFlat(keys));
            followPathAndDelete(variablesSubscribers, copyArrayFlat(keys));
        };
    }());

    const renderCustomElement = function (customElement, templateElement, key) {
        customElement.appendChild(templateRender(templateElement, key, customElement));
        return customElement;
    };

    const applyDirectiveIn = function (element, key) {
        /* looks for an html template to render
        also calls applyDirectiveElement with key!*/
        if (!key) {
            console.warn(element, 'Use data-in="key" format!');
            return;
        }

        renderCustomElement(element,
                templateElementFromCustomElementName[customElementNameFromElement(element)],
                key);
    };

    const tryApplyDirectivesCreator = function (hostElement) {
        return function (element) {
        /* looks if the element has dom99 specific attributes and tries to handle it*/
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
                if ((applyDirective === applyDirectiveFunction) || (applyDirective === applyDirectiveFunctionWithContext)) {
                    applyDirective(element, hostElement,
                            ...(customAttributeValue.split(options.tokenSeparator)));
                } else {
                    applyDirective(element,
                            ...(customAttributeValue.split(options.tokenSeparator)));
                }
                // ensure the directive is only applied once
                element.setAttribute(directiveName,
                        options.attributeValueDoneSign + customAttributeValue);
            });
            if (element.hasAttribute(options.directives.directiveIn)) {
                return;
            }
            /*using a custom element without data-in*/
            let customElementName = customElementNameFromElement(element);
            if (templateElementFromCustomElementName.hasOwnProperty(customElementName)) {
                element.appendChild(
                    cloneTemplate(templateElementFromCustomElementName[customElementName])
                );
            }
        };
    };

    const linkJsAndDom = function (startElement = doc.body, hostElement = startElement) {
        //build array only once and use up to date options, they should not reset twice
        if (!directiveSyntaxFunctionPairs) {
            directiveSyntaxFunctionPairs = [
                /*order is relevant applyDirectiveVariable being before applyDirectiveFunction,
                we can use the just changed live variable in the bind function*/
                [options.directives.directiveElement, applyDirectiveElement],
                [options.directives.directiveVariable, applyDirectiveVariable],
                [options.directives.directiveFunction, applyDirectiveFunction],
                [options.directives.directiveFunctionWithContext, applyDirectiveFunctionWithContext],
                [options.directives.directiveList, applyDirectiveList],
                [options.directives.directiveIn, applyDirectiveIn]
            ];
        }
        walkTheDomElements(startElement, tryApplyDirectivesCreator(hostElement));
        return startElement;
    };

    const restart = function () {
        //todo
    };
    
    const publicInterface = {
        //variables,
        elements,
        functions,
        createElement2,
        forgetKey,
        linkJsAndDom,
        options,
        followPath,
        restart,
        bool: booleanFromBooleanString
    };
    defineSetterGetter(publicInterface, "variables",
       function () {
            return variables;
        },
        function (newObject) {
            if (!((newObject) && isNotNullObject(newObject))) {
                console.warn("D.variables = must be truethy object");
                return;
            }
            deepAssignX(variables, newObject);
            return newObject;
        });

    return Object.freeze(publicInterface);
}());

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = dom99;
}
