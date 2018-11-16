export {
  create,
  contextFromArray,
  contextFromEvent,
  getParentContext,
  createElement2,
  FIRST_VARIABLE_FROM_HTML,
  FIRST_VARIABLE_FROM_USER_AGENT
};
export {idGenerator} from "./idGenerator.js";

import {createElement2} from "./createElement2.js";
import {isObjectOrArray} from "./isObjectOrArray.js";
import {firstAncestorValue} from "./parentIdFromEvent.js";
import {pushOrCreateArrayAt} from "./pushOrCreateArrayAt.js";

const hasOwnProperty = Object.prototype.hasOwnProperty;


const NAME = `DOM99`;
const CONTEXT = `${NAME}_C`;
const ELEMENT_LIST_ITEM = `${NAME}_I`;
const CUSTOM_ELEMENT = `${NAME}_X`;
const LIST_CHILDREN = `${NAME}_R`;
const INSIDE_SYMBOL = `>`;


const removeNode = (node) => {
  node.remove();
};

const elementsDeepForEach = (startElement, callBack) => {
  callBack(startElement);
  // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/firstElementChild
  // is not supported in Edge/Safari on DocumentFragments
  // let element = startElement.firstElementChild;
  // this does not produce an error, but simply returns undefined
  let node = startElement.firstChild;
  while (node) {
    // document.body.ELEMENT_NODE === 1
    if (node.nodeType === 1) {
      elementsDeepForEach(node, callBack);
      node = node.nextElementSibling;
    } else {
      node = node.nextSibling;
    }
  }
};

const customElementNameFromElement = (element) => {
  const isAttributeValue = element.getAttribute(`is`);
  if (isAttributeValue) {
    return isAttributeValue;
  }
  return element.tagName.toLowerCase();
};

const cloneTemplate = (template) => {
  if (!template) {
    console.error(
      `Template missing <template data-template="d-name">
                Template Content
            </template>`
    );
  }
  if (!template.content) {
    console.error(
      `template.content is undefined, this can happen if a template is inside another template. Use only top level templates, also use recommended polyfills`
    );
  }
  return document.importNode(template.content, true);
};


/**
 @param {Element} element

 @return {string | undefined} context
 */
const contextFromElement = (element) => {
  return element[CONTEXT];
};

/**
 contextFromEvent gets the starting path for an event issued inside a component

 in combination with contextFromArray it allows to access sibling elements and variables

 d.functions.clickedButton = (event) => {
    d.elements[d.contextFromArray([contextFromEvent(event), `other`])]
        .classList.add(`active`);
};

 @param {Event} event

 @return {string} path
 */
const contextFromEvent = (event) => {
  return firstAncestorValue(event.target, contextFromElement) || ``;
};

/**
 contextFromArray joins paths to create a valid path to use with

 d.variables[path]
 d.elements[path]

 @param {array} pathIn

 @return {string} path
 */
const contextFromArray = (pathIn) => {
  return pathIn.join(INSIDE_SYMBOL);
};

/**
 getParentContext

 @param {string} context

 @return {string} parentContext
 */
const getParentContext = (context) => {
  const split = context.split(INSIDE_SYMBOL);
  split.pop();
  return split.join(INSIDE_SYMBOL);
};

const contextFromArrayWith = (pathIn, withWhat) => {
  if (pathIn.length === 0) {
    return withWhat;
  }
  return `${contextFromArray(pathIn)}${INSIDE_SYMBOL}${withWhat}`;
};

const normalizeStartPath = (startPath) => {
  // this is because `a>b>c` is irregular
  // `a>b>c>` or `>a>b>c` would not need such normalization
  if (startPath) {
    return `${startPath}${INSIDE_SYMBOL}`;
  }
  return startPath;
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
  if ('defaultValue' in element) {
    return element.defaultValue;
  }
  if ('open' in element) { // <details>
    return element.open;
  }
  return element.textContent;
};

const FIRST_VARIABLE_FROM_USER_AGENT = (element) => {
  return element.value || FIRST_VARIABLE_FROM_HTML(element);
};

const prepareGet = (input, toJoin) => {
  let stringPath;
  if (Array.isArray(input)) {
    stringPath = contextFromArray(input);
  } else {
    stringPath = input;
  }
  if (toJoin) {
    stringPath = `${stringPath}${INSIDE_SYMBOL}${toJoin}`;
  }
  return stringPath;
};

const enterObject = (pathIn, key) => {
  pathIn.push(key);
};

const leaveObject = function (pathIn) {
  pathIn.pop();
};

const notifyOneVariableSubscriber = (options, variableSubscriber, value) => {
  variableSubscriber[options.propertyFromElement(variableSubscriber)] = value;
};

const notifyVariableSubscribers = (options, subscribers, value) => {
  if (value === undefined) {
    // undefined can be used to use the default value
    // without explicit if else
    return;
  }
  subscribers.forEach((variableSubscriber) => {
    notifyOneVariableSubscriber(options, variableSubscriber, value);
  });
};

const notifyOneListSubscriber = (listContainer, startPath, data, templateFromName, notifyCustomListSubscriber) => {
  if (
    hasOwnProperty.call(listContainer, CUSTOM_ELEMENT) &&
    hasOwnProperty.call(templateFromName, listContainer[CUSTOM_ELEMENT])
  ) {
    notifyCustomListSubscriber(listContainer, startPath, data);
    return;
  }
  notifyRawListSubscriber(listContainer, data, options);
};

const notifyListSubscribers = (subscribers, startPath, data, templateFromName, notifyCustomListSubscriber) => {
  subscribers.forEach((listContainer) => {
    notifyOneListSubscriber(listContainer, startPath, data, templateFromName, notifyCustomListSubscriber);
  });
};

const notifyRawListSubscriber = (listContainer, data, options) => {
  const fragment = document.createDocumentFragment();
  listContainer.innerHTML = ``;
  const listItemTagName = listContainer[ELEMENT_LIST_ITEM];
  const listItemProperty = options.propertyFromElement(
    listItemTagName.toUpperCase()
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

  let pathIn = [];

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
  const forgetContext = (path) => {
    deleteAllStartsWith(variableSubscribers, path);
    deleteAllStartsWith(listSubscribers, path);
    deleteAllStartsWith(variables, path);
    deleteAllStartsWith(elements, path);
  };

  const notifyCustomListSubscriber = (listContainer, startPath, data) => {
    const fragment = document.createDocumentFragment();
    const template = templateFromName[listContainer[CUSTOM_ELEMENT]];
    const previous = Array.from(pathIn);
    pathIn = startPath.split(INSIDE_SYMBOL);
    // enterObject(pathIn, key);
    // leaveObject(pathIn);
    const normalizedPath = normalizeStartPath(startPath);
    const newLength = data.length;
    let oldLength;
    let pathInside;
    if (hasOwnProperty.call(listContainer, LIST_CHILDREN)) {
      // remove nodes and variable subscribers that are not used
      oldLength = listContainer[LIST_CHILDREN].length;
      if (oldLength > newLength) {
        for (let i = newLength; i < oldLength; i += 1) {
          pathInside = `${normalizedPath}${i}`;
          listContainer[LIST_CHILDREN][i].forEach(removeNode);
          forgetContext(pathInside);
        }
        listContainer[LIST_CHILDREN].length = newLength;
      }
    } else {
      listContainer[LIST_CHILDREN] = [];
      oldLength = 0;
    }

    data.forEach((dataInside, i) => {
      pathInside = `${normalizedPath}${i}`;
      feed(pathInside, dataInside);
      if (i < oldLength) {
        // reusing, feed updated with new data the old nodes
        return;
      }
      // cannot remove document fragment after insert because they empty themselves
      // have to freeze the children to still have a reference
      const activatedClone = activateCloneTemplate(
        template,
        String(i)
      );
      listContainer[LIST_CHILDREN].push(
        Array.from(activatedClone.childNodes)
      );
      fragment.appendChild(activatedClone);
    });
    pathIn = previous;
    listContainer.appendChild(fragment);
  };


  /**
   Feed data, for element with corresponding data-variable and data-list

   @param {string} startPath
   @param {any} data

   @or

   @param {any} data

   @return {Element} startElement
   */
  const feed = (startPath, data) => {
    if (data === undefined) {
      data = startPath;
      startPath = ``;
    }
    if (isObjectOrArray(startPath)) {
      console.error(
        `Incorrect types passed to d.feed,
                d.feed(string, object) or d.feed(object)`
      );
    }
    if (!alreadyHooked) {
      feedHook(startPath, data);
      alreadyHooked = true;
    }
    if (!isObjectOrArray(data)) {
      variables[startPath] = data;
      if (hasOwnProperty.call(variableSubscribers, startPath)) {
        notifyVariableSubscribers(options, variableSubscribers[startPath], data);
      }
    } else if (Array.isArray(data)) {
      variables[startPath] = data;
      if (hasOwnProperty.call(listSubscribers, startPath)) {
        notifyListSubscribers(listSubscribers[startPath], startPath, data, templateFromName, notifyCustomListSubscriber);
      }
    } else {
      const normalizedPath = normalizeStartPath(startPath);
      Object.entries(data).forEach(([key, value]) => {
        const path = `${normalizedPath}${key}`;
        feed(path, value);
      });
    }
    alreadyHooked = false;
  };

  const get = (input, toJoin) => {
    return variables[prepareGet(input, toJoin)];
  };

  const getElement = (input, toJoin) => {
    return elements[prepareGet(input, toJoin)];
  };

  const applyFunctionOriginal = (element, eventName, functionName) => {
    if (!functions[functionName]) {
      console.error(`Event listener ${functionName} not found.`);
    }
    element.addEventListener(eventName, functions[functionName], false);
    // todo only add context when not top level ? (inside something)
    element[CONTEXT] = contextFromArray(pathIn);
  };

  let applyFunction = applyFunctionOriginal;

  const applyFunctions = (element, attributeValue) => {
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
      }
    );
  };

  const applyList = (element, attributeValue) => {
    const [
      variableName,
      listItemTagName,
      optional
    ] = attributeValue.split(options.tokenSeparator);

    let fullName = `-`;

    if (!variableName) {
      console.error(
        element,
        `Use ${options.directives.list}="variableName-tagName" format!`
      );
    }

    if (optional) {
      // for custom elements
      fullName = `${listItemTagName}-${optional}`;
      element[CUSTOM_ELEMENT] = fullName;
    } else {
      element[ELEMENT_LIST_ITEM] = listItemTagName;
    }

    // could send path as array directly
    // but have to change notifyOneListSubscriber to take in path as Array or String
    // before
    const path = contextFromArrayWith(pathIn, variableName);

    pushOrCreateArrayAt(listSubscribers, path, element);

    if (hasOwnProperty.call(variables, path)) {
      notifyOneListSubscriber(element, path, variables[path], templateFromName, notifyCustomListSubscriber);
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
        `Use ${options.directives.variable}="variableName" format!`
      );
    }

    const path = contextFromArrayWith(pathIn, variableName);
    pushOrCreateArrayAt(variableSubscribers, path, element);

    let currentValue = variables[path]
    if (currentValue === undefined && options.firstVariableValueStrategy !== undefined) {
      currentValue = options.firstVariableValueStrategy(element);
    }
    if (currentValue !== undefined) {
      variables[path] = currentValue;
      notifyOneVariableSubscriber(options, element, currentValue);
    }

    if (!options.tagNamesForUserInput.includes(element.tagName)) {
      return;
    }
    const broadcastValue = (/*event*/) => {
      //wil call setter to broadcast the value
      const value = element[options.propertyFromElement(element)];
      variables[path] = value;
      feedHook(path, value);
      // would notify everything including itself
      // notifyVariableSubscribers(options, variableSubscribers[path], value);
      variableSubscribers[path].forEach((variableSubscriber) => {
        if (variableSubscriber !== element) {
          notifyOneVariableSubscriber(options, variableSubscriber, value);
        }
      });
    };
    element.addEventListener(
      options.eventNameFromElement(element),
      broadcastValue,
      false
    );

  };

  const applyDirectiveElement = (element, attributeValue) => {
    /* stores element for direct access !*/
    const elementName = attributeValue;

    if (!elementName) {
      console.error(
        element,
        `Use ${options.directives.element}="elementName" format!`
      );
    }
    const path = contextFromArrayWith(pathIn, elementName);
    elements[path] = element;
  };

  const applyTemplate = (element, attributeValue) => {
    /* stores a template element for later reuse !*/
    if (!attributeValue) {
      console.error(
        element,
        `Use ${options.directives.template}="d-name" format!`
      );
    }

    templateFromName[attributeValue] = element;
  };

  const activateCloneTemplate = (template, key) => {
    /* clones a template and activates it
    */
    enterObject(pathIn, key);
    const activatedClone = cloneTemplate(template);
    activate(activatedClone);
    cloneHook();
    leaveObject(pathIn);
    return activatedClone;
  };

  const applyInside = (element, key) => {
    /* looks for an html template to render
    also calls applyDirectiveElement with key!*/
    if (!key) {
      console.error(
        element,
        `Use ${options.directives.inside}="insideWhat" format!`
      );
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
        options.directives.inside,
        options.doneSymbol + key
      );
      // parse children under name space (encapsulation of variable names)
      enterObject(pathIn, key);
      activate(element);
      leaveObject(pathIn);
    }
  };

  const directivePairs = [
    /*order is relevant applyVariable being before applyFunction,
    we can use the just changed live variable in the bind function*/
    [options.directives.element, applyDirectiveElement],
    [options.directives.variable, applyVariable],
    [options.directives.function, applyFunctions],
    [options.directives.list, applyList],
    [options.directives.inside, applyInside],
    [options.directives.template, applyTemplate]
  ];

  const tryApplyDirectives = (element) => {
    /* looks if the element has dom99 specific attributes and tries to handle it*/
    // todo make sure no impact-full read write
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
        `${options.doneSymbol}${attributeValue}`
      );
    });
    if (
      element.hasAttribute(options.directives.inside) ||
      element.hasAttribute(options.directives.list)
    ) {
      return;
    }
    /*using a custom element without data-inside*/
    let customName = customElementNameFromElement(element);
    if (hasOwnProperty.call(templateFromName, customName)) {
      element.appendChild(
        cloneTemplate(templateFromName[customName])
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
   Convenience function for activate, feed and assigning functions from
   an object

   @param {object} dataFunctions
   @param {object} initialFeed
   @param {Element} startElement
   @param {function} callBack

   @return {any} callBack return value
   */
  const start = (
    dataFunctions = {},
    initialFeed = {},
    startElement = document.body,
    callBack = undefined
  ) => {

    Object.assign(functions, dataFunctions);
    feed(``, initialFeed);
    activate(startElement);
    if (!callBack) {
      return;
    }
    return callBack();
  };

  const cloneHook = function () {
    const context = contextFromArray(pathIn);
    clonePlugins.forEach((clonePlugin) => {
      clonePlugin(context);
    });
  };

  const feedHook = (startPath, data) => {
    feedPlugins.forEach((feedPlugin) => {
      feedPlugin(startPath, data);
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
        const preventDefault = function () {
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
    activate,
    elements,
    functions,
    variables,
    get,
    element: getElement,
    feed,
    plugin
  };
};
