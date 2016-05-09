//dom99.js
/*uses es2015, es2016
globals: window, document, console*/
/*todo  improve system 
enable deep html composition
to make it possible we have to rethink forgetKey
*/
"use strict";
const dom99 = (function () {
    let variables = {},
        variablesSubscribers = {},
        elements = {},
        customElements = {},
        templateElementFromCustomElementName = {},
        functions = {},
        
        currentInnerKey = "",
        
        variablesScope = variables,
        variablesSubscribersScope = variablesSubscribers,
        elementsScope = elements,
        
        variablesScopeParent,
        variablesSubscribersScopeParent,
        elementsScopeParent;
        
    const
        doc = document,
        miss = "miss",
        value = "value",
        textContent = "textContent",
        source = "src",
        checked = "checked",
        
        isObject = function (x) {
            return (typeof x === "object");
        },
        
        booleanFromBooleanString = function (booleanString) {
            return (booleanString === "true");
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
            let element = doc.createElement(ElementDescription.tagName);
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
            /*directiveTokens example : ["keyup,click", "calculate"] */
            const 
                eventNames = directiveTokens[0].split(options.listSeparator),
                functionNames = directiveTokens[1].split(options.listSeparator),
                key = currentInnerKey;
            /*functionLookUp allows us to store functions in D.fx after 
            D.linkJsAndDom() and use the functions that are in D.fx at that moment.
            we also return what the last function returns*/
            let functionLookUp;
                
            if (!eventNames || !functionNames) {
                console.warn(element, 'Use data-fx="event1,event2-functionName1,functionName2" format!');
                return;
            }
            
            if ((eventNames.length === 1) && (functionNames.length === 1)) {
                /*we only have 1 event type and 1 function*/
                let functionName = functionNames[0];
                functionLookUp = function(event) {
                    event.dKey = key;
                    return functions[functionName](event);
                };
                
                addEventListener(element, eventNames[0], functionLookUp);
                
            } else {
                functionLookUp = function(event) {
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
            let [variableName, elementListItem] = directiveTokens,
                list,
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
            element.DVRPL = options.variablePropertyFromTagAndType(elementListItem, "");

            Object.defineProperty(variablesScope, variableName, {
                get: function () {
                    return list;
                },
                set: function (newList) {
                    list = newList;
                    element.innerHTML = "";
                    let fragment = doc.createDocumentFragment();
                    list.forEach(function (value) {
                        let listItem = doc.createElement(elementListItem);
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
            let [variableName] = directiveTokens,
                temp,
                variablesScopeReference = variablesScope,
                variablesSubscribersScopeReference = variablesSubscribersScope,
                tagName = getTagName(element),
                type = element.type;
            
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
                            if (String(currentElement[currentElement.DVRP]) !== x) {
                        // add more than checked, use if (booleanProperties.includes(currentElement.DVRP))

                                if (currentElement.DVRP === checked) {
                                    currentElement[currentElement.DVRP] = newValue; 
                                } else {
                                    currentElement[currentElement.DVRP] = x;
                                }
                            }
                        });
                    },
                    enumerable: true,
                    configurable: false
                });
            }
        
            if (options.elementsForUserInputList.includes(tagName)) {
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
            let [elementName, 
                customElementTargetNamePrefix,
                customElementTargetNameAppendix] = directiveTokens,
                customElementTargetName;
                
            if (!elementName) {
                console.warn(element, 'Use data-el="elementName" format!');
                return;
            }    
            
            if (elementsScope[elementName]) {
                console.warn(element, "and", elementsScope[elementName], `2 elements with the same name, overwriting D.el.${elementName}`);
            }
            elementsScope[elementName] = element;
            
            if (customElementTargetNamePrefix && customElementTargetNameAppendix) {
                customElementTargetName = `${customElementTargetNamePrefix}-${customElementTargetNameAppendix}`;
                templateElementFromCustomElementName[customElementTargetName] = element;
            }
        },
        
        cloneTemplate = (function() {
            if ("content" in doc.createElement("template")) { 
                return (function (templateElement) {
                    return doc.importNode(templateElement.content, true);
                });
            } else {
                return (function (templateElement) {
                    let clone = doc.createElement("div");
                    clone.innerHTML = templateElement.innerHTML;
                    return clone;
                });
            }
        }()),
        
        enterObject = function (key) {
            if (!elementsScope.hasOwnProperty(key)){
                elementsScope[key] = {};
            }
            if (!variablesScope.hasOwnProperty(key)){
                variablesScope[key] = {};
            } 
            if (!variablesSubscribersScope.hasOwnProperty(key)){
                variablesSubscribersScope[key] = {};
            } 
            
            
            elementsScopeParent = elementsScope;
            variablesScopeParent = variablesScope;
            variablesSubscribersScopeParent = variablesSubscribersScope;
            elementsScope = elementsScope[key];
            variablesScope = variablesScope[key];
            variablesSubscribersScope = variablesSubscribersScope[key];
            
            currentInnerKey = key;
        },
        
        leaveObject = function () {
            currentInnerKey = "";
            elementsScope = elementsScopeParent;
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
            let clone;            
            enterObject(key);
            clone = linkJsAndDom(cloneTemplate(templateElement));
            leaveObject();
            return clone;
        },
    
        forgetKey = function (key) {
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
            delete elements[key];
            delete variables[key];
            delete variablesSubscribers[key];
            delete customElements[key];
        },
        
        
        renderCustomElement = function (customElement, templateElement, key) {
            customElement.appendChild(templateRender(templateElement, key));
            return customElement;
        },
        
        applyDirectiveIn = function (element, directiveTokens) {
            /* looks for an html template to render
            also calls applyDirectiveElement with key!*/
            let [key] = directiveTokens;
            
            if (!key) {
                console.warn(element, 'Use data-in="key" format!');
                return;
            }
            if (element.hasAttribute(options.directives.directiveElement)) {
                console.warn(element, 'Element has both data-in and data-el. Use only data-in and get element at D.xel[key]');
            }
            
            customElements[key] = element;
            renderCustomElement(element, templateElementFromCustomElementName[getTagName(element)], key);
        },
        
        
        
        tryApplyDirectives = function (element) {
        /* looks if the element has dom99 specific attributes and tries to handle it*/
            if (!element.hasAttribute) {
                return;
            }
            let customAttributeValue,
                directiveName,
                applyDirective,
                tag;
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
            tag = getTagName(element);
            if (templateElementFromCustomElementName.hasOwnProperty(tag)) {
                element.appendChild(cloneTemplate(templateElementFromCustomElementName[tag]));
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
            Object.keys(newObject).forEach(function(key) {
                let newObjectValue = newObject[key];
                if (!isObject(newObjectValue)) {
                    variables[key] = newObjectValue
                } else {
                    if (!variables[key]) {
                        variables[key] = {};
                    }
                    Object.assign(variables[key], newObjectValue);
                }
            });
            return newObject;
        },
        enumerable: true,
        configurable: false
    });

    return Object.freeze(dom99PublicInterface);
}());

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = dom99;
}
