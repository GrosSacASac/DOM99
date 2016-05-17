//dom99.js
/*uses es2015, es2016
globals: document, console*/
/*todo  improve system 
*/
"use strict";
const dom99 = (function () {
    let currentInnerKey = "",
        
        variables = {},
        variablesSubscribers = {},
        elements = {},
        customElements = {},
        
        variablesScope = variables,
        variablesSubscribersScope = variablesSubscribers,
        elementsScope = elements,
        customElementsScope = customElements,
        
        variablesScopeParent,
        variablesSubscribersScopeParent,
        elementsScopeParent,
        customElementsScopeParent;
        
    const
        functions = {},
        templateElementFromCustomElementName = {},
        doc = document,
        miss = "miss",
        value = "value",
        textContent = "textContent",
        source = "src",
        checked = "checked",
        
        isObject = function (x) {
            return (x !== null && typeof x === "object");
        },
        
        deepAssignX = function(objectTarget, objectSource) {
            Object.keys(objectSource).forEach(function(key) {
                if (!isObject(objectSource[key])) {
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
        },
        
        booleanFromBooleanString = function (booleanString) {
            return (booleanString === "true");
        },
        
        customElementNameFromElement = function (element) {
            return element.getAttribute("is") || getTagName(element);
        },
        
        
        valueElseMissDecorator = function (object1) {
            /*Decorator function around an Object to provide a default value
            Decorated object must have a miss key with the default value associated
            */
            return (function (key) {
                if (object1.hasOwnProperty(key)) {
                    return object1[key];
                }
                return object1[miss];
            });
        },
    
        propertyFromTag = valueElseMissDecorator({
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
        }),
    
        /*booleanProperties = [
            // add here all relevant boolean properties
            checked
        ],*/
        
        propertyFromInputType = valueElseMissDecorator({
            //Input Type : appropriate property name to retrieve and set the value
            "checkbox": checked,
            "radio": checked,
            miss: value
        }),
        
        inputEventFromType = valueElseMissDecorator({
            "checkbox": "change",
            "radio": "change",
            "range" : "change", 
            miss: "input"
        }),
        
        eventFromTag = valueElseMissDecorator({
            "select": "change",
            miss: "input"
        }),
        
        options = {
            attributeValueDoneSign: "☀", 
            tokenSeparator: "-", 
            listSeparator: ",",
            directives: {
                directiveFunction: "data-fx", 
                directiveVariable: "data-vr", 
                directiveElement: "data-el",
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
        },
        
        createElement2 = function (ElementDescription) {
            const element = doc.createElement(ElementDescription.tagName);
            ElementDescription = Object.assign({}, ElementDescription);//avoid side effects
            delete ElementDescription.tagName; // read only
            /*element.setAttribute(attr, value) is good to set initial attr like you do in html
            element.attr = value is good to change the live values    */
            Object.keys(ElementDescription).forEach(function(key) {
                element.setAttribute(key, ElementDescription[key]);
            });
            return element;
        },
        
        walkTheDomElements = function (element, function1) {
            function1(element);
            if (element.tagName !== "TEMPLATE") {//IE bug: templates are not inert
                element = element.firstElementChild;
                while (element) {
                    walkTheDomElements(element, function1);
                    element = element.nextElementSibling;
                }
            }
        },
        
        getTagName = function (element) {
            return element.tagName.toLowerCase();
        },
    
        addEventListener = function (element, eventName, function1, useCapture=false) {
            element.addEventListener(eventName, function1, useCapture);
        },
    
        /*not used, tested yet
        onceAddEventListener = function (element, eventName, function1, useCapture=false) {
            let tempFunction = function (event) {
                //called once only
                function1(event);
                element.removeEventListener(eventName, tempFunction, useCapture);
            };
            addEventListener(element, eventName, tempFunction, useCapture);
        },*/
    
        applyDirectiveFunction = function (element, directiveTokens) {
        /* This is not strictly compatible with multiple levels of deep html composition
        because the event.dKey only describes the current level of nesting, it is however sufficient if you use data-in with custom elements at the same level (normal case)*/
            /*directiveTokens example : ["keyup,click", "calculate"] */
            let eventNames,
                functionNames;
            const key = currentInnerKey;
            /*functionLookUp allows us to store functions in D.fx after 
            D.linkJsAndDom() and use the functions that are in D.fx at that moment.
            we also return what the last function returns*/
                
            if (!directiveTokens[0] || !directiveTokens[1]) {
                if (!directiveTokens[0] && !directiveTokens[1]) {
                    console.warn(element, `Use data-fx="event1,event2-functionName1,functionName2" format! or 
"functionName1"`);
                    return;
                }
                functionNames = directiveTokens[0].split(options.listSeparator);
                eventNames = [options.eventFromTagAndType(getTagName(element), element.type)];
            } else {
                eventNames = directiveTokens[0].split(options.listSeparator);
                functionNames = directiveTokens[1].split(options.listSeparator);
            }
            
            if ((eventNames.length === 1) && (functionNames.length === 1)) {
                /*we only have 1 event type and 1 function*/
                const functionName = functionNames[0];
                const functionLookUp = function(event) {
                    event.dKey = key;
                    return functions[functionName](event);
                };
                
                addEventListener(element, eventNames[0], functionLookUp);
                
            } else {
                const functionLookUp = function(event) {
                    let last;
                    event.dKey = key;
                    const functionLookUpChain = function(functionName) {
                        last = functions[functionName](event);
                    };
                    
                    functionNames.forEach(functionLookUpChain);
                    return last;
                };
                
                
                eventNames.forEach(function (eventName) {
                    addEventListener(element, eventName, functionLookUp);
                });
            }
            
        },
        
        applyDirectiveList = function (element, directiveTokens) {
            /* js array --> DOM list
            <ul data-vr="var-li"></ul>
            todo optimization*/
            const [variableName, elementListItem] = directiveTokens;
            let list,
                temp;
            
            if (!variableName) {
                console.warn(element, 'Use data-vr="variableName" format!');
                return;
            }
            
            /*we check if the user already saved data in variablesScope[variableName]
            before using linkJsAndDom , if that is the case we
            initialize variablesScope[variableName] with that same data once we defined
            our custom property*/
            if (variablesScope.hasOwnProperty(variableName)) {
                temp = variablesScope[variableName];
            }
            //Dom99 VaRiable Property for List items
            element.DVRPL = options.variablePropertyFromTagAndType(elementListItem);

            Object.defineProperty(variablesScope, variableName, {
                get: function () {
                    return list;
                },
                set: function (newList) {
                    const fragment = doc.createDocumentFragment();
                    list = newList;
                    element.innerHTML = "";
                    list.forEach(function (value) {
                        const listItem = doc.createElement(elementListItem);
                        if (isObject(value)) {
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
                variablesScope[variableName] = temp; //calls the set once
            }
        },
    
        applyDirectiveVariable = function (element, directiveTokens) {
            /* two-way bind
            example : called for <input data-vr="a">
            in this example the variableName = "a"
            we push the <input data-vr="a" > element in the array
            that holds all elements which share this same "a" variable
            everytime "a" is changed we change all those elements values
            and also 1 private js variable (named x below) 
            The public D.vr.a variable returns this private js variable
            
            undefined assignment are ignored, instead use empty string( more DOM friendly)*/
            const [variableName] = directiveTokens,
                tagName = getTagName(element),
                type = element.type;
            let temp;
            
            if (!variableName) {
                console.warn(element, 'Use data-vr="variableName" format!');
                return;
            }
            
            /*we check if the user already saved data in variablesScope[variableName]
            before using linkJsAndDom , if that is the case we
            initialize variablesScope[variableName] with that same data once we defined
            our custom property*/
            if (variablesScope.hasOwnProperty(variableName)) {
                temp = variablesScope[variableName];
            }
            
            //Dom99 VaRiable Property
            element.DVRP = options.variablePropertyFromTagAndType(tagName, type);
            
            if (variablesSubscribersScope.hasOwnProperty(variableName)) {
                variablesSubscribersScope[variableName].push(element);
            } else {
                const variablesSubscribersScopeReference = variablesSubscribersScope;
                let x = ""; // holds the value
                variablesSubscribersScope[variableName] = [element];
                Object.defineProperty(variablesScope, variableName, {
                    get: function () {
                        return x;
                    },
                    set: function (newValue) {
                        if (newValue === undefined) {
                            console.warn("D.vr.x= string || bool , not undefined!");
                            return;
                        }
                        x = String(newValue);
                        variablesSubscribersScopeReference[variableName].forEach(function (currentElement) {
                            /*here we change the value of the currentElement in the dom
                            */
                            
                            //don't overwrite the same
                            if (String(currentElement[currentElement.DVRP]) === x) {
                                return;
                            }
                        // add more than checked, use if (booleanProperties.includes(currentElement.DVRP))

                            if (currentElement.DVRP === checked) {
                                currentElement[currentElement.DVRP] = newValue; 
                            } else {
                                currentElement[currentElement.DVRP] = x;
                            }
                        });
                    },
                    enumerable: true,
                    configurable: false
                });
            }
        
            if (options.elementsForUserInputList.includes(tagName)) {
                const variablesScopeReference = variablesScope;
                addEventListener(element, 
                    options.eventFromTagAndType(tagName, type),
                    function (event) {
                        //wil call setter to broadcast the value
                        variablesScopeReference[variableName] = event.target[event.target.DVRP];
                });
            }
            
            
            
            
            if (temp !== undefined) {
                variablesScope[variableName] = temp; //calls the set once
            }
        },
        
        applyDirectiveElement = function (element, directiveTokens) {
            /* stores element for direct access !*/
            const [elementName, 
                customElementTargetNamePrefix,
                customElementTargetNameAppendix] = directiveTokens;
                
            if (!elementName) {
                console.warn(element, 'Use data-el="elementName" format!');
                return;
            }    
            
            elementsScope[elementName] = element;
            
            if (customElementTargetNamePrefix && customElementTargetNameAppendix) {
                templateElementFromCustomElementName[`${customElementTargetNamePrefix}-${customElementTargetNameAppendix}`] = element;
            }
        },
        
        cloneTemplate = (function() {
            if ("content" in doc.createElement("template")) { 
                return (function (templateElement) {
                    return doc.importNode(templateElement.content, true);
                });
            } else {
            
                return (function (templateElement) {
                    /*here we have a div too much (messes up css)*/
                    const clone = doc.createElement("div");
                    clone.innerHTML = templateElement.innerHTML;
                    return clone;
                });
            }
        }()),
        
        enterObject = function (key) {
            if (!elementsScope.hasOwnProperty(key)){
                elementsScope[key] = {};
            }
            if (!customElementsScope.hasOwnProperty(key)){
                customElementsScope[key] = {};
            }
            if (!variablesScope.hasOwnProperty(key)){
                variablesScope[key] = {};
            } 
            if (!variablesSubscribersScope.hasOwnProperty(key)){
                variablesSubscribersScope[key] = {};
            } 
            
            
            elementsScopeParent = elementsScope;
            customElementsScopeParent = customElementsScope;
            variablesScopeParent = variablesScope;
            variablesSubscribersScopeParent = variablesSubscribersScope;
            
            elementsScope = elementsScope[key];
            customElementsScope = customElementsScope[key];
            variablesScope = variablesScope[key];
            variablesSubscribersScope = variablesSubscribersScope[key];
            
            currentInnerKey = key;
        },
        
        leaveObject = function () {
            currentInnerKey = "";
            elementsScope = elementsScopeParent;
            customElementsScope = customElementsScopeParent;
            variablesScope = variablesScopeParent;
            variablesSubscribersScope = variablesSubscribersScopeParent;
        },
        
        templateRender = function (templateElement, key) {
        /*takes a template element as argument, usually linking to a <template>
        clones the content and returns that clone
        the content elements with "data-vr" will share a variable at
        D.vr[key][variableName]
        the content elements with "data-el" will have a reference at
        D.el[key][elementName]

        returns clone
        */
         
            enterObject(key);
            const clone = linkJsAndDom(cloneTemplate(templateElement));
            leaveObject();
            return clone;
        },
    
        forgetKey = (function () {
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
            
            Note: If you have yet another reference to the element in a variable in your program, the element will still exist and we cannot clean it up from here.
            
            Internally we just deleted the key group for every relevant function
            (for instance binds are not key grouped)
            */
            // we cannot use Weak Maps here because it needs an object as the key not a String
            // or we need to change the API a bit

            const followPathAndDelete = function(object1, keys) {
                let target = object1,
                    lastKey = keys.pop();
                keys.forEach(function(key) {
                    target = target[key];
                });
                delete target[lastKey];
            };
            return (function (...keys) {
                followPathAndDelete(elements, keys);
                followPathAndDelete(variables, keys);
                followPathAndDelete(variablesSubscribers, keys);
                followPathAndDelete(customElements, keys);
            });
        }()),
        
        
        renderCustomElement = function (customElement, templateElement, key) {
            customElement.appendChild(templateRender(templateElement, key));
            return customElement;
        },
        
        applyDirectiveIn = function (element, directiveTokens) {
            /* looks for an html template to render
            also calls applyDirectiveElement with key!*/
            const [key] = directiveTokens;
            if (!key) {
                console.warn(element, 'Use data-in="key" format!');
                return;
            }
            if (element.hasAttribute(options.directives.directiveElement)) {
                console.warn(element, 'Element has both data-in and data-el. Use only data-in and get element at D.xel[key]');
            }
            
            renderCustomElement(element, templateElementFromCustomElementName[customElementNameFromElement(element)], key);
            customElementsScope[key] = element;
        },
        
        
        
        tryApplyDirectives = function (element) {
        /* looks if the element has dom99 specific attributes and tries to handle it*/
            if (!element.hasAttribute) {
                return;
            }
            let customAttributeValue,
                directiveName,
                applyDirective;
            [
                /*order is relevant applyDirectiveVariable being before applyDirectiveFunction,
                we can use the just changed live variable in the bind function*/
                [options.directives.directiveElement, applyDirectiveElement],
                [options.directives.directiveVariable, applyDirectiveVariable],
                [options.directives.directiveFunction, applyDirectiveFunction],
                [options.directives.directiveList, applyDirectiveList],
                [options.directives.directiveIn, applyDirectiveIn]
            ].forEach(function(pair) {
                [directiveName, applyDirective] = pair;
                
                if (!element.hasAttribute(directiveName)) {
                    return;
                }
                customAttributeValue = element.getAttribute(directiveName);
                if ((customAttributeValue[0] === options.attributeValueDoneSign)) {
                    return;
                }
                applyDirective(element, customAttributeValue.split(options.tokenSeparator));
                // ensure the directive is only applied once
                element.setAttribute(directiveName, options.attributeValueDoneSign + customAttributeValue);
            });
            if (element.hasAttribute(options.directives.directiveIn)) {
                return;
            }
            /*using a custom element without data-in*/
            let customElementName = customElementNameFromElement(element);
            if (templateElementFromCustomElementName.hasOwnProperty(customElementName)) {
                element.appendChild(cloneTemplate(templateElementFromCustomElementName[customElementName]));
            }
        
        },
    
        linkJsAndDom = function (startElement=doc.body) {
            walkTheDomElements(startElement, tryApplyDirectives);
            return startElement;
        },
        
        dom99PublicInterface = {
            //vr: variables,
            el: elements,
            xel: customElements, 
            fx: functions,
            createElement2,
            forgetKey, 
            linkJsAndDom,
            options,
            bool: booleanFromBooleanString
        };


    Object.defineProperty(dom99PublicInterface, "vr", {
        get: function () {
            return variables;
        },
        set: function (newObject) {
            if (!((newObject) && isObject(newObject))) {
                console.warn("D.vr = must be truethy object");
                return;
            }
            deepAssignX(variables, newObject);
            return newObject; // ?
        },
        enumerable: true,
        configurable: false
    });

    return Object.freeze(dom99PublicInterface);
}());

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = dom99;
}
