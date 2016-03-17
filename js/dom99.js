//dom99.js
/*uses es6
globals: window, document, console*/
/*todo  improve system
more examples, readme */

const dom99Config = (function () {
    "use strict";
    /*this configuration will be split in another file when it is ready.
    it is ready when it is open to extension and closed to changes*/
    const 
        miss = Symbol(),
        
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
                    return object1.miss; // correct syntax ?
                    // return object[miss]; always undefined
            });
        },
        
        
        EventForTagAndType = getValueElseDefaultDecorator({
            //tag.type: eventType
            "input.text": "input",
            "input.checkbox": "click",
            "input.radio": "click",
            miss: "input"
        }),
    
        PropertyForTag = getValueElseDefaultDecorator({
            //Input Type : appropriate property name to retrieve and set the value
            "input": "value",
            miss: "textContent"
        }),
    
        PropertyForInputType = getValueElseDefaultDecorator({
            //Input Type : appropriate property name to retrieve and set the value
            "checkbox": "checked",
            "radio": "checked",
            miss: "value"
        }),
    
        PropertyBooleanList = [
            /* add here all relevant boolean properties*/
            "checked"
        ],
        
        getVisibleProperty = function (tagName, type) {
        /*if the element is an <input> its VisibleProperty is "value"
        for other elements like <p> it is "textContent*/
            if (tagName === "input") {
                return PropertyForInputType(type); 
            } // else
            return PropertyForTag(tagName);
        };
    
    return Object.freeze({
        EventForTagAndType,
        getVisibleProperty,
        PropertyBooleanList
    });
}());

const dom99 = (function () {
    "use strict";
    let vars = {},
        nodesWhichShareVars = {},
        nodes = {},
        fx = {},
        renderingTemplate = false,
        renderingTemplatevariablesPathStart;
        
    const 
        customAttribueNameBind = "data-99-bind",
        customAttribueNameVar = "data-99-var",
        customAttribueNameNode = "data-99-node",
        attributeValueDoneSign = "☀",
        
 
        walkTheDom = function (node, aFunction) {
            aFunction(node);
            // we could use .firstElementChild instead if we want to ignore text nodes
            node = node.firstChild;
            while (node) {
                walkTheDom(node, aFunction);
                node = node.nextSibling;
            }
        },
        
        getTagName = function (element) {
            return element.tagName.toLowerCase();
        },
    
        addEventListener = function (node, eventName, aFunction, useCapture=false) {
            //add here attachEvent for old IE if you want
            node.addEventListener(eventName, aFunction, useCapture);
        },
    
        //not used, tested yet
        onceAddEventListener = function (node, eventName, aFunction, useCapture=false) {
            let tempFunction = function (event) {
                //called once only
                aFunction(event);
                node.removeEventListener(eventName, tempFunction, useCapture);
            };
            addEventListener(node, eventName, tempFunction, useCapture);
        },
    
        applyBind = function (node, directiveTokens) {
            /*directiveTokens example : ["keyup,click", "calculate"] */
            let eventNames = directiveTokens[0],
                functionName = directiveTokens[1],
                /*functionLookUp allows us to store function in dom99.fx after 
                dom99.linkJsAndDom() */
                functionLookUp = function(event) {
                    fx[functionName](event);
                };
            
            eventNames.split(",").forEach(function (eventName) {
                addEventListener(node, eventName, functionLookUp);
            });
            
        },
    
        applyVar = function (node, directiveTokens) {
            /* two-way bind
            example : called for <input data-99-var="a" >
            in this example the variableName = "a"
            we push the <input data-99-var="a" > node in the array
            that holds all nodes which share this same "a" variable
            everytime "a" is changed we change all those nodes values
            and also 1 private js variable (named x below) 
            The public dom99.vars.a variable returns this private js variable
            
            undefined assignment are ignored, instead use empty string( more DOM friendly)*/
            let variableName = directiveTokens[0],
                temp,
                variablesPath = vars,
                nodesWhichShareVarsPath = nodesWhichShareVars,
                visibleTextPropertyName,
                tagName = getTagName(node);
            
            
            //for template cloning, we use a grouped scope
            if (renderingTemplate) {
                variablesPath = vars[renderingTemplatevariablesPathStart];
                nodesWhichShareVarsPath = nodesWhichShareVars[renderingTemplatevariablesPathStart];
                // 
            }
            
            /*we check if the user already saved data in variablesPath[variableName]
            before using linkJsAndDom , if that is the case we
            initialize variablesPath[variableName] with that same data once we defined
            our custom property*/
            if (variablesPath.hasOwnProperty(variableName)) {
                temp = variablesPath[variableName];
            }
            
            if (!nodesWhichShareVarsPath[variableName]) {
                let x; // holds the value
                nodesWhichShareVarsPath[variableName] = [node];
                Object.defineProperty(variablesPath, variableName, {
                    get: function () {
                        return x;
                    },
                    set: function (newValue) {
                        if (newValue === undefined) {
                            return;
                        }
                        x = String(newValue);
                        nodesWhichShareVarsPath[variableName].forEach(function (currentNode) {
                            /*here we change the value of the currentNode in the dom
                            */
                            visibleTextPropertyName = dom99Config.getVisibleProperty(
                                getTagName(currentNode), 
                                currentNode.type
                            );
                            if (String(currentNode[visibleTextPropertyName]) !== x) {
                                if (visibleTextPropertyName in dom99Config.PropertyBooleanList) {
                                    //"false" is truthy ...
                                    currentNode[visibleTextPropertyName] = newValue; 
                                } else {
                                    //don't overwrite the same
                                    currentNode[visibleTextPropertyName] = x;
                                }
                            }
                        });
                    },
                    enumerable: true,
                    configurable: false
                    //doesn't make sense to have a value property: __value__ because the get and set is a logical value in a way
                });
            } else {
                nodesWhichShareVarsPath[variableName].push(node);
            }
            
            if (temp !== undefined) {
                variablesPath[variableName] = temp; //calls the set once
            }
            visibleTextPropertyName = dom99Config.getVisibleProperty(tagName, node.type);
            

            addEventListener(node, 
                dom99Config.EventForTagAndType(`${getTagName(node)}.${node.type}`),
                function (event) {
                    variablesPath[variableName] = event.target[visibleTextPropertyName];
            });
        },
    
        applyNode = function (node, directiveTokens) {
            /* stores node for direct access !*/
            let nodeName = directiveTokens[0],
                nodesPath = nodes;
                
            //for template cloning, we use a grouped scope
            if (renderingTemplate) {
                nodesPath = nodes[renderingTemplatevariablesPathStart];
            }
            if (nodesPath[nodeName]) {
                console.warn(`cannot have 2 nodes with the same name, overwriting dom99.nodes.${nodeName}`);
            }
            nodesPath[nodeName] = node;
        },
        
        templateRender = function (templateNodeName, targetNodeName, variablesPathStart) {
        //NOT FINISHED DO NOT USE, yet
            /*takes a template node as argument, usually a <template>
            clones the content and inserts it at the end of the target nodes list of childnodes
            the content nodes with var "data-99-var" will share a variable at
            dom99.vars[variablesPathStart][variableName]
            that way you can render a template multiple times, populate clone data
            and have it not shared between all clones.
            
            dom99.nodes[variablesPathStart].firstElementChild will be the first element child of the clone
            for convenience
            maybe handle generate variablesPathStart internally
            */
            //console.log(nodes[templateNodeName]);
            if (!vars.hasOwnProperty(variablesPathStart)){
                nodes[variablesPathStart] = {};
                vars[variablesPathStart] = {};
                nodesWhichShareVars[variablesPathStart] = {};
            }
            let clone = document.importNode(nodes[templateNodeName].content, true);
            // clone is a DocumentFragment
            renderingTemplate = true;
            //renderingTemplatevariablesPathStart is used for the grouped scope
            renderingTemplatevariablesPathStart = variablesPathStart;
            //clone.querySelector("input").value = content;
            
            nodes[variablesPathStart].firstElementChild = clone.firstElementChild;
            linkJsAndDom(clone);
            nodes[targetNodeName].insertBefore(clone, null);
            renderingTemplate = false;
        },
    
        forgetNode = function (variablesPathStart) {
            /*Removing a DOM node with .remove() or .innerHTML = "" will NOT delete
            all the node references.
            A removed node will continue receive invisible automatic updates 
            it also takes space in the memory.
            
            And all of this doesn't matter for 1-100 nodes
            
            It does matter in single page application where you CONSISTENTLY use 
            
                1. dom99.templateRender 
                2. populate the result with data
                3. somewhat later delete the result
                
            In that case I recommend using an additional step
            
                4. Use dom99.forgetNode to free space in memory
                (can also improve performance but it doesn't matter here, read optimize optimization)
            
            Note: If you have yet another reference to the node in a variable in your program, the node will still exist and we cannot clean it up from here.
            
            Internally we just deleted the scope group for every relevant function
            (for instance binds are not scope grouped)
            */
            delete nodes[variablesPathStart];
            delete vars[variablesPathStart];
            delete nodesWhichShareVars[variablesPathStart];
        },
        
        tryApplyDirective = function (node, customAttribueName, ApplyADirective) {
            let customAttributeValue;
            if (node.hasAttribute(customAttribueName)) {
                customAttributeValue = node.getAttribute(customAttribueName);
                if (!customAttributeValue.startsWith(attributeValueDoneSign)) {
                    // for data-99-bind="keyup,click-calculate"
                    // ["keyup,click", "calculate"] is sent to ApplyADirective
                    ApplyADirective(node, customAttributeValue.split("-"));
                    // ensure the directive is only applied once
                    node.setAttribute(customAttribueName, attributeValueDoneSign + customAttributeValue);
                }
            }
        },
    
        tryApplyDirectives = function (node) {
        /* looks if the node has dom99 specific attributes and tries to handle it*/
            if (node.hasAttribute) {
                /*the order matters here, applyVar being first,
                we can use the just changed live variable in the bind function*/
                tryApplyDirective(node, customAttribueNameVar, applyVar);
                tryApplyDirective(node, customAttribueNameBind, applyBind);
                tryApplyDirective(node, customAttribueNameNode, applyNode);
            }
        },
    
        linkJsAndDom = function (startNode=document.body) {
            walkTheDom(startNode, tryApplyDirectives);
        };
    
    // we return a public interface that can be used in the program
    return Object.freeze({
        vars,  // variables shared between UI and program
        nodes, // preselected nodes
        fx,  //object to be filled by user defined functions 
        // fx is where dom99 will look for , for data-99-bind,
        templateRender,
        forgetNode,
        linkJsAndDom // initialization function
    });
}());
// make it available for browserify style imports
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = dom99;
}
/*Additional Explanations to understand dom99.js file

varListeners contains arrays of nodes , each array contains all nodes
that listen to the same variable. 

If you have this in your document <input data-99-var="a">

--> you can then use vars.a or vars["a"] in dom99.js

--> you can then use dom99.vars.a

or dom99.vars.["a"] in your js
    
    
all assignments will be reflected in the document


If you have this in your document <div data-99-node="box1"></div>


--> you can then use nodes.box1 or nodes["box1"]


it is basically a short cut for getElementBy...()
  



custom attribute names must start with "data-" see
https://docs.webplatform.org/wiki/html/attributes/data-* */