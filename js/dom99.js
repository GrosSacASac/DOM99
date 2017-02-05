//dom99.js
/*jslint
    es6, maxerr: 200, browser, devel, fudge, maxlen: 100, node
*/
/*
    need to update all examples and docs
        

        
    document DVRP, DVRPL, CONTEXT element extension,
    use WeakMap instead where supported
    
    
    decide when to use event
        .target
        .orignialTarget
        .currentTarget
    
    
    when to use is="" syntax
    think about overlying framework
*/
const dom99 = (function () {
    "use strict";

    //root collections
    const variables = {};
    const variablesSubscribers = {};
    const elements = {};
    const functions = {};
    
    const templateElementFromCustomElementName = {};
    let pathIn = [];

    let variablesPointer = variables;
    let variablesSubscribersPointer = variablesSubscribers;
    let elementsPointer = elements;

    let directiveSyntaxFunctionPairs;

    const MISS = "MISS";

    const isNotNullObject = function (x) {
        /*array or object*/
        return (typeof x === "object" && x !== null);
    };

    const copyArrayFlat = function (array1) {
        // stop using this
        // its not GC friendly
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

    const valueElseMissDecorator = function (object1) {
        /*Decorator function around an Object to provide a default value
        Decorated object must have a MISS key with the default value associated
        Arrays are also objects
        */
        return function (key) {
            if (object1.hasOwnProperty(key)) {
                return object1[key];
            }
            return object1[MISS];
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
        MISS: "input"
    });

    const options = {
        attributeValueDoneSign: "☀",
        tokenSeparator: "-",
        listSeparator: ",",
        directives: {
            directiveFunction: "data-fx",
            directiveVariable: "data-vr",
            directiveElement: "data-el",
            directiveList: "data-list",
            directiveIn: "data-in",
            directiveTemplate: "data-template"
        },

        variablePropertyFromElement: function (element) {
            const tagName = element.tagName || element;
            if (tagName === "INPUT") {
                return propertyFromInputType(element.type || 'text');
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
        setAttribute won t change the current .value, for instance, setAttribute is the correct choice for creation
        element.attr = value is good to change the live values*/
        Object.keys(elementDescription).forEach(function (key) {
            if (key !== "tagName") {
                element.setAttribute(key, elementDescription[key]);
            }
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

    const customElementNameFromElement = function (element) {
        return element.getAttribute("is") || element.tagName.toLowerCase();
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

    const tryApplyDirectiveFunction = function (element, customAttributeValue) {
        /* todo add warnings for syntax*/
        customAttributeValue.split(options.listSeparator).forEach(
            function (customAttributeValueSplit) {
                const tokens = customAttributeValueSplit.split(options.tokenSeparator);
                if (tokens.length === 1) {
                    const functionName = tokens[0];
                    const eventName = options.eventNameFromElement(element);
                    applyDirectiveFunction(element, eventName, functionName);
                } else {
                    const [eventName, functionName] = tokens;
                    applyDirectiveFunction(element, eventName, functionName);
                }
            }
        );
    };
    
    const applyDirectiveFunction = function (element, eventName, functionName) {
        if (!functions[functionName]) {
            console.error(`Event listener ${functionName} not found.`);
            return;
        }
        addEventListener(element, eventName, functions[functionName]);
    };

    const applyDirectiveList = function (element, customAttributeValue) {
        /* js array --> DOM list
        <ul data-list="var-li"></ul>
        todo optimization
        always throws away the entire dom list, let user of dom99 opt in in updates strategies such as
            same length, different content
            same content, different length
            key based identification
            */
        const [variableName, elementListItem] = customAttributeValue
            .split(options.tokenSeparator);
        let list;
        let temp;

        if (!variableName) {
            console.warn(element, 'Use data-vr="variableName" format!');
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
        // expects an element not tagName !
        element.DVRPL = options.variablePropertyFromElement(elementListItem.toUpperCase());
        

        Object.defineProperty(variablesPointer, variableName, {
            get: function () {
                return list;
            },
            set: function (newList) {
                const fragment = document.createDocumentFragment();
                list = newList;
                element.innerHTML = "";
                list.forEach(function (value) {
                    const listItem = document.createElement(elementListItem);
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
            },
            enumerable: true,
            configurable: false
        });

        if (temp !== undefined) {
            variablesPointer[variableName] = temp; //calls the set once
        }
    };

    const applyDirectiveVariable = function (element, variableName) {
        /* two-way bind
        example : called for <input data-vr="a">
        in this example the variableName = "a"
        we push the <input data-vr="a" > element in the array
        that holds all elements which share this same "a" variable
        everytime "a" is changed we change all those elements values
        and also 1 private js variable (named x below)
        The public D.vr.a variable returns this private js variable

        undefined assignment are ignored, instead use empty string( more DOM friendly)*/

        if (!variableName) {
            console.warn(element, 'Use data-vr="variableName" format!');
            return;
        }



        //Dom99 VaRiable Property
        element.DVRP = options.variablePropertyFromElement(element);

        if (variablesSubscribersPointer.hasOwnProperty(variableName)) {
            variablesSubscribersPointer[variableName].push(element);
            element[element.DVRP] = variablesPointer[variableName]; //has latest
        } else {
            let initialValue;
            if (variablesPointer.hasOwnProperty(variableName)) {
                initialValue = variablesPointer[variableName];
            }
            const variablesSubscribersPointerReference = variablesSubscribersPointer;
            let x = ""; // holds the value
            variablesSubscribersPointer[variableName] = [element];
            Object.defineProperty(variablesPointer, variableName, {
                get: function () {
                    return x;
                },
                set: function (newValue) {
                    if (newValue === undefined) {
                        console.warn("D.vr.x = string || bool , not undefined!");
                    }
                    if (x === newValue) {
                        //don't overwrite the same
                        return;
                    }
                    x = newValue;
                    variablesSubscribersPointerReference[variableName].forEach(
                        function (currentElement) {
                        /*here we change the value of the currentElement in the dom
                        */
                        currentElement[currentElement.DVRP] = x;

                        }
                    );
                },
                enumerable: true,
                configurable: false
            });
            
            
            if (initialValue !== undefined) {
                variablesPointer[variableName] = initialValue; //calls the set once
            }
        }

        if (options.tagNamesForUserInput.includes(element.tagName)) {
            const variablesPointerReference = variablesPointer;
            const broadcastValue = function (event) {
                //wil call setter to broadcast the value
                variablesPointerReference[variableName] = event.target[event.target.DVRP];
            };
            addEventListener(element,
                    options.eventNameFromElement(element),
                    broadcastValue);
        }

    };

    const applyDirectiveElement = function (element, customAttributeValue) {
        /* stores element for direct access !*/
        const elementName = customAttributeValue;
        
        if (!elementName) {
            console.warn(element, 'Use data-el="elementName" format!');
            return;
        }

        elementsPointer[elementName] = element;

    };
    
    const applyDirectiveTemplate = function (element, customAttributeValue) {
        /* stores a template element for later reuse !*/

        
        if (!customAttributeValue) {
            console.warn(element, 'Use data-template="d-name" format!');
            return;
        }

        templateElementFromCustomElementName[customAttributeValue] = element;
        
    };

    const cloneTemplate = (function () {
        if ("content" in document.createElement("template")) {
            return function (templateElement) {
                if (!templateElement) {
                    console.error(`To use reusable template use <template data-template="d-name">Template Content</template>`);
                }
                return document.importNode(templateElement.content, true);
            };
        }

        return function (templateElement) {
            /*here we have a div too much (messes up css)*/
            const clone = document.createElement("div");
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

        // replace followPath with = previousPointer or ParentPointer
        elementsPointer = followPath(elements, pathIn);
        variablesPointer = followPath(variables, pathIn);
        variablesSubscribersPointer = followPath(variablesSubscribers, pathIn);
    };

    // const templateRender = function (templateElement, key) {
    /*takes a template element as argument, usually linking to a <template>
    clones the content and returns that clone
    the content elements with "data-vr" will share a variable at
    D.vr[key][variableName]
    the content elements with "data-el" will have a reference at
    D.el[key][elementName]

    returns clone
    */
        // enterObject(key);
        // const clone = linkJsAndDom(cloneTemplate(templateElement));
        // leaveObject();
        // return clone;
    // };

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
        
         we cannot use Weak Maps here because it needs an object as the key not a String
         or we need to change the API a bit
         
         todo optimize and make benchmarks
        */
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
            followPathAndDelete(elements, copyArrayFlat(keys));
            followPathAndDelete(variables, copyArrayFlat(keys));
            followPathAndDelete(variablesSubscribers, copyArrayFlat(keys));
        };
    }());

    const applyDirectiveIn = function (element, key) {
        /* looks for an html template to render
        also calls applyDirectiveElement with key!*/
        if (!key) {
            console.warn(element, 'Use data-in="key" format!');
            return;
        }
        
        const templateElement = templateElementFromCustomElementName[
            customElementNameFromElement(element)
        ];
        
        
        enterObject(key);
        const templateClone = linkJsAndDom(cloneTemplate(templateElement));
        element.CONTEXT = {
            el: elementsPointer,
            vr: variablesPointer,
            baseEl: element
        };
        leaveObject();
        element.appendChild(templateClone);
    };

    const tryApplyDirectives = function (element) {
        /* looks if the element has dom99 specific attributes and tries to handle it*/
        if (!element.hasAttribute) {
            return;
        }

        directiveSyntaxFunctionPairs.forEach(function (pair) {
            const [directiveName, applyDirective] = pair;

            if (!element.hasAttribute(directiveName)) {
                return;
            }
            /* todo see if it is worth using .dataVariable instead of 
            .getAttribute("data-variable")
            https://jsperf.com/dataset-vs-getattribute-and-setattribute/3*/
            const customAttributeValue = element.getAttribute(directiveName);
            if (customAttributeValue[0] === options.attributeValueDoneSign) {
                return;
            }

            applyDirective(element, customAttributeValue);
            
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
    
    const getParentContext = function (element) {
        const parentElement = element.parentNode;
        if (!parentElement) {
            throw new Error("element has no parent context");
        } else if (parentElement.hasOwnProperty("CONTEXT")) {
            return parentElement.CONTEXT;
        } else {
            return getParentContext(parentElement);
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
                [options.directives.directiveIn, applyDirectiveIn],
                [options.directives.directiveTemplate, applyDirectiveTemplate]
                
            ];
        }
        walkTheDomElements(startElement, tryApplyDirectives);
        return startElement;
    };

    const publicInterface = {
        //vr: variables,
        el: elements,
        fx: functions,
        createElement2,
        forgetKey,
        linkJsAndDom,
        options,
        getParentContext
    };

    Object.defineProperty(publicInterface, "vr", {
        get: function () {
            return variables;
        },
        set: function (newObject) {
            if (!((newObject) && isNotNullObject(newObject))) {
                console.warn("D.vr = must be truethy object");
                return;
            }
            deepAssignX(variables, newObject);
            return newObject;
        },
        enumerable: true,
        configurable: false
    });

    return Object.freeze(publicInterface);
}());

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = dom99;
}
