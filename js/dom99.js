//dom99.js
/*uses es2015, es2016
globals: window, document, console*/
/*todo  improve system 
more examples, readme 
use proxies instead of Object.defineProperty ?
*/
"use strict";
const dom99 = (function (
        /*you can change the syntax in dom99Configuration*/
        directiveNameFx="data-fx", directiveNameVr="data-vr", directiveNameEl="data-el",
        directiveNameCustomElement="data-scope", attributeValueDoneSign="☀", 
        tokenSeparator="-", 
        listSeparator=","
        ) {
    //"use strict";
    
    let variables = {},
        variablesSubscribers = {},/*contains arrays of elements , each array 
        contains all elements that listen to the same variable. */
        elements = {},
        customElements = {},
        templateElementNameFromCustomElementName = {},
        functions = {},
        currentInnerScope = "",
        variablesScope = variables,
        variablesSubscribersScope = variablesSubscribers,
        elementsScope = elements,
        templateSupported = ('content' in document.createElement('template'));
        
    const 
        miss = "miss",
        value = "value",
        textContent = "textContent",
        source = "src",
        checked = "checked",
        
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
                } // else
                return object1[miss];
            });
        },
        
        EventForTagAndType = getValueElseDefaultDecorator({
            //tag.type: eventType
            "input.text": "input",
            "input.checkbox": "change",
            "input.radio": "change",
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
        
        walkTheDomElements = function (element, function1) {
            function1(element);
            element = element.firstElementChild;
            while (element) {
                walkTheDomElements(element, function1);
                element = element.nextElementSibling;
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
    
        applyFx = function (element, directiveTokens) {
            /*directiveTokens example : ["keyup,click", "calculate"] */
            const [eventNames,
                  functionNames] = directiveTokens,
                  scope = currentInnerScope,
                /*functionLookUp allows us to store functions in D.fx after 
                D.linkJsAndDom() and use the functions that are in D.fx at that moment.
                we also return what the last function returns*/
                functionLookUp = function(event) {
                    let last;
                    event.scope = scope;

                    const functionLookUp = function(functionName) {
                        last = functions[functionName](event);
                    };
                    functionNames.split(listSeparator).forEach(functionLookUp);
                    return last;
                };
                
            if (!eventNames || !functionNames) {
                console.warn(element, 'Use data-fx="event1,event2-functionName1,functionName2" format!');
                return;
            }
            
            eventNames.split(listSeparator).forEach(function (eventName) {
                addEventListener(element, eventName, functionLookUp);
            });
            
        },
    
        applyVr = function (element, directiveTokens) {
            /* two-way bind
            example : called for <input data-vr="a" >
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
                variablesSubscribersScopeReference = variablesSubscribersScope;
            
            if (!variableName) {
                console.warn(element, 'Use data-vr="variableName" format!');
                return;
            }
            
            //for template cloning, we use a grouped scope
            
            
            /*we check if the user already saved data in variablesScope[variableName]
            before using linkJsAndDom , if that is the case we
            initialize variablesScope[variableName] with that same data once we defined
            our custom property*/
            if (variablesScope.hasOwnProperty(variableName)) {
                temp = variablesScope[variableName];
            }
            
            if (variablesSubscribersScope[variableName]) {
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
                        let visibleTextPropertyName;
                        variablesSubscribersScopeReference[variableName].forEach(function (currentElement) {
                            /*here we change the value of the currentElement in the dom
                            */
                            visibleTextPropertyName = getVisibleProperty(
                                getTagName(currentElement), 
                                currentElement.type
                            );
                            //don't overwrite the same
                            if (String(currentElement[visibleTextPropertyName]) !== x) {
                        // if you want to add more, use 
                        // if (PropertyBooleanList.indexOf(visibleTextPropertyName) > -1)
                                if (visibleTextPropertyName === checked) {
                                    //"false" is truthy ...
                                    currentElement[visibleTextPropertyName] = newValue; 
                                } else {
                                    currentElement[visibleTextPropertyName] = x;
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
                EventForTagAndType(`${getTagName(element)}.${element.type}`),
                function (event) {
                    let visibleTextPropertyName = getVisibleProperty(getTagName(event.target), event.target.type);
                    variablesScopeReference[variableName] = event.target[visibleTextPropertyName];
            });
        },
    
        applyEl = function (element, directiveTokens) {
            /* stores element for direct access !*/
            let [elementName, 
                customElementTargetNamePrefix,
                customElementTargetNameAppendix] = directiveTokens,//Destructuring
                customElementTargetName;
                
            if (!elementName) {
                console.warn(element, 'Use data-el="elementName" format!');
                return;
            }    
            
            //for template cloning, we use a grouped scope
            
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
        
        templateRender = function (templateName, scope) {
        /*takes a template element name as argument, usually linking to a <template>
        clones the content and returns that clone
        the content elements with "data-vr" will share a variable at
        D.vr[scope][variableName]
        the content elements with "data-el" will have a reference at
        D.el[scope][elementName]
        that way you can render a template multiple times, populate clone data
        and have it not shared between all clones.
        
        returns clone
        
        suggestion: maybe generate automatic scope names internally
        */
            let clone;

            //create the scope
            if (!elements.hasOwnProperty(scope)){
                elements[scope] = {};
            }
            if (!variables.hasOwnProperty(scope)){
                variables[scope] = {};
            } 
            if (!variablesSubscribers.hasOwnProperty(scope)){
                variablesSubscribers[scope] = {};
            } 
            
            currentInnerScope = scope;
            variablesScope = variables[scope];
            variablesSubscribersScope = variablesSubscribers[scope];
            elementsScope = elements[scope];
            

            if (templateSupported) { 
            //make a clone ,clone is a DocumentFragment object
                clone = document.importNode(elements[templateName].content, true);
            } else {
                clone = document.createElement("div");
                clone.innerHTML = elements[templateName].innerHTML;
            }
            /* could also use let clone = elements[templateName].content.cloneNode(true);
            from the doc: ...[the] difference between these two APIs is when the node document is updated: with cloneNode() it is updated when the nodes are appended with appendChild(), with document.importNode() it is updated when the nodes are cloned.*/
           
            // apply dom99 directives with the scope
            linkJsAndDom(clone);
            
            currentInnerScope = "";
            variablesScope = variables;
            variablesSubscribersScope = variablesSubscribers;
            elementsScope = elements;
            
            return clone;
        },
    
        forgetScope = function (scope) {
            /*Removing a DOM element with .remove() or .innerHTML = "" will NOT delete
            all the element references if you used the underlying nodes in dom99
            A removed element will continue receive invisible automatic updates 
            it also takes space in the memory.
            
            And all of this doesn't matter for 1-100 elements
            
            It can matter in single page application where you CONSISTENTLY use 
            
                1. D.templateRender 
                2. populate the result with data
                3. somewhat later delete the result
                
            In that case I recommend using an additional step
            
                4. Use D.forgetScope to let the garbage collector free space in memory
                (can also improve performance but it doesn't matter here, read optimize optimization)
            
            Note: If you have yet another reference to the element in a variable in your program, the element will still exist and we cannot clean it up from here.
            
            Internally we just deleted the scope group for every relevant function
            (for instance binds are not scope grouped)
            */
            // todo: answer could we use Weak Maps here ?
            delete elements[scope];
            delete variables[scope];
            delete variablesSubscribers[scope];
            delete customElements[scope];
        },
        
        
        renderCustomElement = function (customElement, templateName, scope) {
        
            // does it make sense to populate the clone here ?
            customElement.appendChild(templateRender(templateName, scope));
            return customElement;
        },
        
        applyScope = function (element, directiveTokens) {
            /* looks for an html template to render
            also calls applyEl with scopeName!*/
            let [scopeName] = directiveTokens,
                customElementName = getTagName(element),
                templateName = templateElementNameFromCustomElementName[customElementName];
            
            if (!scopeName) {
                console.warn(element, 'Use data-scope="scopeName" format!');
                return;
            }
            if (element.hasAttribute(directiveNameEl)) {
                console.warn(element, 'Element has both data-scope and data-el. Use only data-scope and get element at D.xel[scopeName]');
            }
            //warn for duplicate scopes ?
            
            customElements[scopeName] = element;
            renderCustomElement(element, templateName, scopeName);
        },
        
        functionDirectiveNamePairs = [
        /*order is relevant applyVr being before applyFx,
        we can use the just changed live variable in the bind function*/
                [directiveNameEl, applyEl],
                [directiveNameVr, applyVr],
                [directiveNameFx, applyFx],
                [directiveNameCustomElement, applyScope]
        ],
        
        tryApplyDirectives = function (element) {
        /* looks if the element has dom99 specific attributes and tries to handle it*/
            if (element.hasAttribute) {
                let pairs, 
                    customAttributeValue,
                    directiveName,
                    directiveFunction,
                    tag;
                //or functionDirectiveNamePairs.forEach(function(pairs) { ?
                for (pairs of functionDirectiveNamePairs) {
                    directiveName = pairs[0];
                    directiveFunction = pairs[1];
                    
                    if (!element.hasAttribute(directiveName)) {
                        continue;
                    }
                    customAttributeValue = element.getAttribute(directiveName);
                    if ((customAttributeValue[0] === attributeValueDoneSign)) {
                        continue;
                    }
                    directiveFunction(element, customAttributeValue.split(tokenSeparator));
                    // ensure the directive is only applied once
                    element.setAttribute(directiveName, attributeValueDoneSign + customAttributeValue);
                }
                if (element.hasAttribute(directiveNameCustomElement)) {
                    return;
                }
                tag = getTagName(element);
                if (templateElementNameFromCustomElementName.hasOwnProperty(tag)) {
                    element.appendChild(document.importNode(elements[templateElementNameFromCustomElementName[tag]].content, true));
                }
            }
        },
        
        createElement2 = function (ElementDescription) {
            
            let element1 = document.createElement(ElementDescription.tagName);
            ElementDescription = Object.assign({}, ElementDescription);//avoid side effects
            delete ElementDescription.tagName; // read only
            /*elt.setAttribute(attr, value) is good to set initial attr like you do in html
            elt.attr = value is good to change the live values
            
            this is the setAttribute equivalent to Object.assign(element1, ElementDescription);*/
            Object.keys(ElementDescription).forEach(function(key) {
                element1.setAttribute(key, ElementDescription[key]);
            });
            return element1;
            
        },
    
        linkJsAndDom = function (startElement=document.body) {
            walkTheDomElements(startElement, tryApplyDirectives);
            return startElement;
        };
    
    let dom99PublicInterface = {
        //vr: variables,  /* variables shared between UI and program. var is a reserved keyword*/
        el: elements, // preselected elements, basically a short cut for getElementBy...()
        xel: customElements, // preselected custom elements
        fx: functions,  //object to be filled by user defined functions 
        // fx is where dom99 will look for , for data-fx,
        createElement2, // enhanced document.createElement
        forgetScope,  // forget scope
        linkJsAndDom // initialization function
    };
    // we can't use D.vr[scope] = object;
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
            let scopeName,
                newObjectValue;
                
            for (scopeName of Object.keys(newObject)){
                newObjectValue = newObject[scopeName];
                if (!(typeof newObjectValue === 'object')) {
                    variables[scopeName] = newObjectValue
                } else {
                    if (!variables[scopeName]) {
                        variables[scopeName] = {};
                    }
                    Object.assign(variables[scopeName], newObjectValue);
                }
            }
            return newObject;
        },
        enumerable: true,
        configurable: false
        //doesn't make sense to have a value property: __value__ because the get and set is a logical value in a way
    });

    // we return a public interface that can be used in the program
    return Object.freeze(dom99PublicInterface);
}());


/* 
}(...(window.dom99Configuration || [])));
in the future when import syntax is recognized use this syntax instead:
import dom99Configuration from "dom99Configuration"; // todo what happens when the file is not found ?
dom99Configuration = dom99Configuration || []; */
/* make it available for browserify style imports
future export default dom99*/
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = dom99;
}
/*Additional Explanations to understand dom99.js file :

custom attribute names must start with "data-" see
https://docs.webplatform.org/wiki/html/attributes/data-* 
https://w3c.github.io/webcomponents/spec/custom/
*/