//dom99.js
/*uses es2015, es2016
globals: window, document, console*/
/*todo  improve system 
*/
"use strict";
const dom99 = (function () {
    //"use strict";
    let variables = {},
        variablesSubscribers = {},/*contains arrays of elements , each array 
        contains all elements that listen to the same variable. */
        elements = {},
        customElements = {},
        templateElementNameFromCustomElementName = {},
        functions = {},
        currentInnerKey = "",
        variablesScope = variables,
        variablesSubscribersScope = variablesSubscribers,
        elementsScope = elements;
        
    const 
        directives = {/*you can change the syntax in dom99Configuration*/
            directiveFunction: "data-fx", 
            directiveVariable: "data-vr", 
            directiveElement: "data-el",
            directiveIn: "data-in",
            directiveList: "data-list",
            attributeValueDoneSign: "☀", 
            tokenSeparator: "-", 
            listSeparator: ","
        },
        doc = document,
        templateSupported = ("content" in doc.createElement("template")),
        miss = "miss",
        value = "value",
        textContent = "textContent",
        source = "src",
        checked = "checked",
        
        booleanFromBooleanString = function (booleanString) {
            return (booleanString === "true");
        },
        
        getValueElseDefaultDecorator = function (object1) {
            /*Decorator function around an Object to provide a default value
            Decorated object must have a miss key with the default value associated
            
            traditional use: 
                let a = objectName[c];
            getValueElseDefaultDecorator use
                let objectNameElseDefault = getValueElseDefaultDecorator(objectName);
                ...
                let a = objectNameElseDefault(c); 
                
            */
            return (function (key) {
                if (object1.hasOwnProperty(key)) {
                    return object1[key];
                }
                return object1[miss];
            });
        },
        
        EventTypeForTagAndType = getValueElseDefaultDecorator({
            //tag.type: eventType
            "input.checkbox": "change",
            "input.radio": "change",
            "input.range" : "change", 
            /* the <input type="range"> fires legit input events, but in practice it can fire hundreds of those in a second, the change events fires when only when the input value has finished been changed. todo: are there more edge cases ?*/ 
            miss: "input"
        }),
    
        PropertyForTag = getValueElseDefaultDecorator({
            //Input Type : appropriate property name to retrieve and set the value
            "input": value,
            "textarea": value,
            "progress": value,
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
    
        PropertyForInputType = getValueElseDefaultDecorator({
            //Input Type : appropriate property name to retrieve and set the value
            "checkbox": checked,
            "radio": checked,
            miss: value
        }),
    
        /*PropertyBooleanList = [
            // add here all relevant boolean properties
            checked
        ],*/
        
        getVisibleProperty = function (tagName, type) {
        /*if the element is an <input> its VisibleProperty is "value"
        for other elements like <p> it is "textContent*/
            if (tagName === "input" && type) {
                return PropertyForInputType(type); 
            } // else
            return PropertyForTag(tagName);
        },
        
        createElement2 = function (ElementDescription) {
            
            let element = doc.createElement(ElementDescription.tagName);
            ElementDescription = Object.assign({}, ElementDescription);//avoid side effects
            delete ElementDescription.tagName; // read only
            /*element.setAttribute(attr, value) is good to set initial attr like you do in html
            element.attr = value is good to change the live values
            
            this is the setAttribute equivalent to Object.assign(element, ElementDescription);*/
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
            //add here attachEvent for old IE if you want
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
                eventNames = directiveTokens[0].split(directives.listSeparator),
                functionNames = directiveTokens[1].split(directives.listSeparator),
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
                functionLookUp = function(event) {
                    event.dKey = key;
                    return functions[functionNames[0]](event);
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
            
            //for template cloning, we use a grouped key
            
            
            /*we check if the user already saved data in variablesScope[variableName]
            before using linkJsAndDom , if that is the case we
            initialize variablesScope[variableName] with that same data once we defined
            our custom property*/
            if (variablesScope.hasOwnProperty(variableName)) {
                temp = variablesScope[variableName];
            }
            //Dom99 VaRiable Property
            element.DVRP = getVisibleProperty(tagName, type);
            
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
                        // if you want to add more, use 
                        // if (PropertyBooleanList.indexOf(currentElement.DVRP) > -1) or .includes
                                if (currentElement.DVRP === checked) {
                                    //"false" is truthy ...
                                    currentElement[currentElement.DVRP] = newValue; 
                                } else {
                                    currentElement[currentElement.DVRP] = x;
                                }
                            }
                        });
                    },
                    enumerable: true,
                    configurable: false
                    //doesn't make sense to have a value property: __value__ because the get and set is a logical value in a way
                });
            }
            
            if (temp !== undefined) {
                variablesScope[variableName] = temp; //calls the set once
            }
            
            //suggestion: could check if the tagName is in a list with all element that can be changed by the user
            addEventListener(element, 
                EventTypeForTagAndType(`${tagName}.${type}`),
                function (event) {
                    //wil call setter above to broadcast the value
                    variablesScopeReference[variableName] = event.target[event.target.DVRP];
            });
        },
        
        applyDirectiveList = function (element, directiveTokens) {
            /* js array --> DOM list
            data-list="..." */
            let [variableName, elementListItem] = directiveTokens,
                temp,
                variablesSubscribersScopeReference = variablesSubscribersScope;
            
            if (!variableName || !elementListItem) {
                console.warn(element, 'Format: <ul data-list="list1-li">');
                return;
            }
            //Dom99 VaRiable Property for List items
            element.DVRPL = getVisibleProperty(elementListItem, "");
            //for template cloning, we use a grouped key
            
            
            /*we check if the user already saved data in variablesScope[variableName]
            before using linkJsAndDom , if that is the case we
            initialize variablesScope[variableName] with that same data once we defined
            our custom property*/
            if (variablesScope.hasOwnProperty(variableName)) {
                temp = variablesScope[variableName];
            }
            
            if (variablesSubscribersScope.hasOwnProperty(variableName)) {
                variablesSubscribersScope[variableName].push(element);
            } else {
                let list;
                variablesSubscribersScope[variableName] = [element];
                Object.defineProperty(variablesScope, variableName, {
                    get: function () {
                        return list;
                    },
                    set: function (newList) {
                        if (newList === undefined) {
                            //todo check isArray 
                            console.warn("undefined!");
                            return;
                        }
                        list = newList;
                        variablesSubscribersScopeReference[variableName].forEach(function (currentElement) {
                            //todo don't overwrite the same !!!
                            currentElement.innerHTML = "";
                            let fragment = doc.createDocumentFragment();
                            list.forEach(function (value) {
                                let listItem = doc.createElement(elementListItem);
                                listItem[element.DVRPL] = value;
                                fragment.appendChild(listItem);
                            });
                            currentElement.appendChild(fragment);
                        });
                    },
                    enumerable: true,
                    configurable: false
                    //doesn't make sense to have a value property: __value__ because the get and set is a logical value in a way
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
                customElementTargetNameAppendix] = directiveTokens,//Destructuring
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
                //it is a template for a custom element
                customElementTargetName = `${customElementTargetNamePrefix}-${customElementTargetNameAppendix}`;
                templateElementNameFromCustomElementName[customElementTargetName] = elementName;
            }
        },
        
        cloneTemplate = function(templateElement) {
            let clone;
            if (templateSupported) { 
            //make a clone ,clone is a DocumentFragment object
                clone = doc.importNode(templateElement.content, true);
            } else {
                clone = doc.createElement("div");
                clone.innerHTML = templateElement.innerHTML;
            }
            return clone
        },
        
        templateRender = function (templateName, key) {
        /*takes a template element name as argument, usually linking to a <template>
        clones the content and returns that clone
        the content elements with "data-vr" will share a variable at
        D.vr[key][variableName]
        the content elements with "data-el" will have a reference at
        D.el[key][elementName]
        that way you can render a template multiple times, populate clone data
        and have it not shared between all clones.
        
        returns clone
        
        suggestion: maybe generate automatic key names internally
        */
            let clone;

            //create the key
            if (!elements.hasOwnProperty(key)){
                elements[key] = {};
            }
            if (!variables.hasOwnProperty(key)){
                variables[key] = {};
            } 
            if (!variablesSubscribers.hasOwnProperty(key)){
                variablesSubscribers[key] = {};
            } 
            
            currentInnerKey = key;
            variablesScope = variables[key];
            variablesSubscribersScope = variablesSubscribers[key];
            elementsScope = elements[key];
            
            
            if (!elements.hasOwnProperty(templateName)) {
                console.warn(`the template ${templateName} must be defined, before it is used`);
                return doc.createElement("div");
            }
            
            
            clone = cloneTemplate(elements[templateName]);
            
            /* could also use let clone = elements[templateName].content.cloneNode(true);
            from the doc: ...[the] difference between these two APIs is when the node document is updated: with cloneNode() it is updated when the nodes are appended with appendChild(), with doc.importNode() it is updated when the nodes are cloned.*/
           
            // apply dom99 directives with the key
            linkJsAndDom(clone);
            
            currentInnerKey = "";
            variablesScope = variables;
            variablesSubscribersScope = variablesSubscribers;
            elementsScope = elements;
            
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
        
        
        renderCustomElement = function (customElement, templateName, key) {
        
            // does it make sense to populate the clone here ?
            customElement.appendChild(templateRender(templateName, key));
            return customElement;
        },
        
        applyDirectiveIn = function (element, directiveTokens) {
            /* looks for an html template to render
            also calls applyDirectiveElement with key!*/
            let [key] = directiveTokens,
                customElementName = getTagName(element),
                templateName = templateElementNameFromCustomElementName[customElementName];
            
            if (!key) {
                console.warn(element, 'Use data-in="key" format!');
                return;
            }
            if (element.hasAttribute(directives.directiveElement)) {
                console.warn(element, 'Element has both data-in and data-el. Use only data-in and get element at D.xel[key]');
            }
            //warn for duplicate keys ?
            
            customElements[key] = element;
            renderCustomElement(element, templateName, key);
        },
        
        
        
        tryApplyDirectives = function (element) {
        /* looks if the element has dom99 specific attributes and tries to handle it*/
            if (element.hasAttribute) {
                let customAttributeValue,
                    directiveName,
                    applyDirective,
                    tag;
                const functionDirectiveNamePairs = [
                    /*order is relevant applyDirectiveVariable being before applyDirectiveFunction,
                    we can use the just changed live variable in the bind function
                    [directiveName, applyDirectiveX]*/
                    [directives.directiveElement, applyDirectiveElement],
                    [directives.directiveVariable, applyDirectiveVariable],
                    [directives.directiveFunction, applyDirectiveFunction],
                    [directives.directiveIn, applyDirectiveIn],
                    [directives.directiveList, applyDirectiveList]
                ];
                functionDirectiveNamePairs.forEach(function(pair) {
                    [directiveName, applyDirective] = pair;
                    
                    if (!element.hasAttribute(directiveName)) {
                        return;
                    }
                    customAttributeValue = element.getAttribute(directiveName);
                    if ((customAttributeValue[0] === directives.attributeValueDoneSign)) {
                        return;
                    }
                    applyDirective(element, customAttributeValue.split(directives.tokenSeparator));
                    // ensure the directive is only applied once
                    element.setAttribute(directiveName, directives.attributeValueDoneSign + customAttributeValue);
                });
                if (element.hasAttribute(directives.directiveIn)) {
                    return;
                }
                /*keyless custom element insertion*/
                tag = getTagName(element);
                if (templateElementNameFromCustomElementName.hasOwnProperty(tag)) {
                    element.appendChild(cloneTemplate(elements[templateElementNameFromCustomElementName[tag]]));
                }
            }
        },
    
        linkJsAndDom = function (startElement=doc.body) {
            walkTheDomElements(startElement, tryApplyDirectives);
            return startElement;
        };
    
    let dom99PublicInterface = {
        //vr: variables,  /* variables shared between UI and program. var is a reserved keyword*/
        el: elements, // preselected elements, basically a short cut for getElementBy...()
        xel: customElements, // preselected custom elements
        fx: functions,  //object to be filled by user defined functions 
        // fx is where dom99 will look for , for data-fx,
        createElement2, // enhanced doc.createElement
        forgetKey,  // forget key
        linkJsAndDom,// initialization function
        directives,
        bool: booleanFromBooleanString
    };
    // we can't use D.vr[key] = object;
    // allows us to do D.vr = objectX
    Object.defineProperty(dom99PublicInterface, "vr", {
        get: function () {
            return variables;
        },
        set: function (newObject) {
            if (!((newObject) && (typeof newObject === 'object'))) {
                console.warn("D.vr = must be truethy object");
                return;
            }
            Object.keys(newObject).forEach(function(key) {
                let newObjectValue = newObject[key];
                if (!(typeof newObjectValue === 'object')) {
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
        //doesn't make sense to have a value property: __value__ because the get and set is a logical value in a way
    });

    // we return a public interface that can be used in the program
    return Object.freeze(dom99PublicInterface);
}());


/* make it available for browserify style imports
also in the future export default dom99*/
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = dom99;
}
/*Additional Explanations to understand dom99.js file :

custom attribute names must start with "data-" see
https://docs.webplatform.org/wiki/html/attributes/data-* 
https://w3c.github.io/webcomponents/spec/custom/
*/