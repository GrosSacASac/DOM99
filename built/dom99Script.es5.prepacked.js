"use strict";

var _defineProperty, d, _slicedToArray;

(function () {
  var __get_scope_binding_0 = function (__selector) {
    var __captured;

    switch (__selector) {
      case 0:
        __captured = [false, _1H, void 0, _1L];
        break;

      case 1:
        __captured = [9007199254740991];
        break;
    }

    __scope_0[__selector] = __captured;
    return __captured;
  };

  var __scope_0 = new Array(2);

  var $$0 = {
    enumerable: false,
    configurable: true,
    writable: false
  };

  var _$0 = this;

  var _$1 = _$0.Object;
  var _$2 = _$1.prototype;
  var _$3 = _$2.hasOwnProperty;
  var _$4 = _$1.defineProperty;

  var _N = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var _p = function (arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  };

  var _O = function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return _p(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };

  var _b = function (elementDescription) {
    /*element.setAttribute(attr, value) is good to set
      initial attribute like when html is first loaded
      setAttribute won't change some live things like .value for input,
      for instance, setAttribute is the correct choice for creation
      element.attr = value is good to change the live values
      always follow these words to avoid rare bugs*/
    var element = document.createElement(elementDescription.tagName);
    Object.entries(elementDescription).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      if (key !== 'tagName') {
        element.setAttribute(key, value);
      }
    });
    return element;
  };

  var _10 = function (x) {
    /*array or object*/
    return typeof x === 'object' && x !== null;
  };

  var _24 = function (array) {
    return array.slice();
  };

  var _26 = function (liveCollection) {
    var length = liveCollection.length;
    var frozenArray = [];
    var i = void 0;

    for (i = 0; i < length; i += 1) {
      frozenArray.push(liveCollection[i]);
    }

    return frozenArray;
  };

  var _1D = function (node, accessor) {
    var potentialValue = accessor(node);

    if (potentialValue) {
      return potentialValue;
    }

    var parent = node.parentNode;

    if (parent) {
      return _1D(parent, accessor);
    } // return undefined;

  };

  var _1v = function (object, key, valueToPush) {
    // don't need to use hasOwnProp as there is no array in the prototype
    // but still use it to avoid a warning
    // const potentialArray = object[key]
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      // eventually the if is always true
      object[key].push(valueToPush);
    } else {
      // only for the first time
      object[key] = [valueToPush];
    }
  };

  var _c = function () {
    var __captured__scope_2 = __scope_0[1] || __get_scope_binding_0(1);

    var id = '' + "id-" + __captured__scope_2[0];
    __captured__scope_2[0] -= 1;
    return id;
  };

  var _25 = function (node) {
    node.remove();
  };

  var $_0 = function (object, key) {
    if (_11.call(object, key)) {
      return object[key];
    }

    return object["MISS"];
  };

  var _19 = function (key) {
    return $_0.call(this, _1N, key);
  };

  var _1A = function (key) {
    return $_0.call(this, _1S, key);
  };

  var _1B = function (key) {
    return $_0.call(this, _1h, key);
  };

  var _1C = function (key) {
    return $_0.call(this, _1n, key);
  };

  var _W = function (element) {
    // defines what is changing when data-variable is changing
    // for <p> it is textContent
    var tagName = void 0;

    if (element.tagName !== undefined) {
      tagName = element.tagName;
    } else {
      tagName = element;
    }

    if (tagName === 'INPUT') {
      return _19(element.type);
    }

    return _1A(tagName);
  };

  var _X = function (element) {
    // defines the default event for an element
    // i.e. when data-function is omitting the event
    var tagName = element.tagName;

    if (tagName === 'INPUT') {
      return _1B(element.type);
    }

    return _1C(tagName);
  };

  var _q = function (startElement, callBack) {
    callBack(startElement); // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/firstElementChild
    // is not supported in Edge/Safari on DocumentFragments
    // let element = startElement.firstElementChild;
    // this does not produce an error, but simply returns undefined

    var node = startElement.firstChild;

    while (node) {
      if (node.nodeType === 1) {
        _q(node, callBack);

        node = node.nextElementSibling;
      } else {
        node = node.nextSibling;
      }
    }
  };

  var _1y = function (element) {
    var isAttributeValue = element.getAttribute('is');

    if (isAttributeValue) {
      return isAttributeValue;
    }

    return element.tagName.toLowerCase();
  };

  var _1w = function (element, eventName, callBack) {
    var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    element.addEventListener(eventName, callBack, useCapture);
  };

  var _22 = function (template) {
    if (!template) {
      console.error('Template missing <template data-template="d-name">\n\t\t\t\tTemplate Content\n\t\t\t</template>');
    }

    if (!template.content) {
      console.error('template.content is undefined, this can happen if a template is inside another template. Use only top level templates, also use recommended polyfills');
    }

    return document.importNode(template.content, true);
  };

  var _1E = function (element) {
    return element["DOM99_C"];
  };

  var _Z = function (event) {
    return _1D(event.target, _1E) || '';
  };

  var _Y = function (pathIn) {
    return pathIn.join(">");
  };

  var _a = function (context) {
    var split = context.split(">");
    split.pop();
    return split.join(">");
  };

  var _1t = function (pathIn, withWhat) {
    if (pathIn.length === 0) {
      return withWhat;
    }

    return '' + _Y(pathIn) + ">" + withWhat;
  };

  var _12 = function (startPath) {
    // this is because `a>b>c` is irregular
    // `a>b>c>` or `>a>b>c` would not need such normalization
    if (startPath) {
      return '' + startPath + ">";
    }

    return startPath;
  };

  var _13 = function (object, prefix) {
    Object.keys(object).forEach(function (key) {
      if (key.startsWith(prefix)) {
        delete object[key];
      }
    });
  };

  var _z = function (pathIn) {
    return pathIn.join(">");
  };

  var _20 = function (key) {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    __captured__scope_1[1].push(key);
  };

  var _21 = function () {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    __captured__scope_1[1].pop();
  };

  var _T = function (path) {
    _13(_j, path);

    _13(_k, path);

    _13(_5, path);

    _13(_3, path);
  };

  var _1u = function (variableSubscriber, value) {
    variableSubscriber[_6.propertyFromElement(variableSubscriber)] = value;
  };

  var _15 = function (subscribers, value) {
    if (value === undefined) {
      // undefined can be used to use the default value
      // without explicit if else
      return;
    }

    subscribers.forEach(function (variableSubscriber) {
      _1u(variableSubscriber, value);
    });
  };

  var _1x = function (listContainer, startPath, data) {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    var fragment = document.createDocumentFragment();

    if (_11.call(listContainer, "DOM99_X") && _11.call(_l, listContainer["DOM99_X"])) {
      // composing with custom element
      var template = _l[listContainer["DOM99_X"]];

      var previous = _24(__captured__scope_1[1]);

      __captured__scope_1[1] = startPath.split(">");

      var normalizedPath = _12(startPath);

      var newLength = data.length;
      var oldLength = void 0;
      var pathInside = void 0;

      if (_11.call(listContainer, "DOM99_R")) {
        // remove nodes and variable subscribers that are not used
        oldLength = listContainer["DOM99_R"].length;

        if (oldLength > newLength) {
          var i = void 0;

          for (i = newLength; i < oldLength; i += 1) {
            pathInside = '' + normalizedPath + i;
            listContainer["DOM99_R"][i].forEach(_25);

            _T(pathInside);
          }

          listContainer["DOM99_R"].length = newLength;
        }
      } else {
        listContainer["DOM99_R"] = [];
        oldLength = 0;
      }

      data.forEach(function (dataInside, i) {
        pathInside = '' + normalizedPath + i;

        _S(pathInside, dataInside);

        if (i >= oldLength) {
          // cannot remove document fragment after insert because they empty themselves
          // have to freeze the children to still have a reference
          var activatedClone = _1z(template, String(i));

          listContainer["DOM99_R"].push(_26(activatedClone.childNodes));
          fragment.appendChild(activatedClone);
        } // else reusing, feed updated with new data the old nodes

      });
      __captured__scope_1[1] = previous;
    } else {
      listContainer.innerHTML = '';
      data.forEach(function (value) {
        var listItem = document.createElement(listContainer["DOM99_I"]);

        if (_10(value)) {
          Object.assign(listItem, value);
        } else {
          listItem[listContainer["DOM99_L"]] = value;
        }

        fragment.appendChild(listItem);
      });
    }

    listContainer.appendChild(fragment);
  };

  var _16 = function (subscribers, startPath, data) {
    subscribers.forEach(function (listContainer) {
      _1x(listContainer, startPath, data);
    });
  };

  var _S = function (startPath, data) {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    if (data === undefined) {
      data = startPath;
      startPath = '';
    }

    if (_10(startPath)) {
      console.error('Incorrect types passed to d.feed,\n\t\t\t\td.feed(string, object) or d.feed(object)');
    }

    if (!__captured__scope_1[0]) {
      _14(startPath, data);
    }

    if (!_10(data)) {
      _5[startPath] = data;

      if (_11.call(_j, startPath)) {
        _15(_j[startPath], data);
      }
    } else if (Array.isArray(data)) {
      _5[startPath] = data;

      if (_11.call(_k, startPath)) {
        _16(_k[startPath], startPath, data);
      }
    } else {
      var normalizedPath = _12(startPath);

      __captured__scope_1[0] = true;
      Object.entries(data).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

        var path = '' + normalizedPath + key;

        _S(path, value);
      });
      __captured__scope_1[0] = false;
    }
  };

  var _R = function (input, tojoin) {
    var stringPath = void 0;

    if (Array.isArray(input)) {
      stringPath = _z(input);
    } else {
      stringPath = input;
    }

    if (tojoin) {
      stringPath = '' + stringPath + ">" + withWhat;
    }

    return _5[stringPath];
  };

  var _1L = function (element, eventName, functionName) {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    if (!_4[functionName]) {
      console.error('Event listener ' + functionName + ' not found.');
    }

    _1w(element, eventName, _4[functionName]); // todo only add context when not top level ? (inside sommething)


    element["DOM99_C"] = _z(__captured__scope_1[1]);
  };

  var _u = function (element, attributeValue) {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    attributeValue.split(_6.listSeparator).forEach(function (attributeValueSplit) {
      var tokens = attributeValueSplit.split(_6.tokenSeparator);
      var functionName = void 0;
      var eventName = void 0;

      if (tokens.length === 1) {
        functionName = tokens[0];
        eventName = _6.eventNameFromElement(element);
      } else {
        var _tokens = _slicedToArray(tokens, 2);

        eventName = _tokens[0];
        functionName = _tokens[1];
      }

      __captured__scope_1[3](element, eventName, functionName);
    });
  };

  var _v = function (element, attributeValue) {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    var _attributeValue$split = attributeValue.split(_6.tokenSeparator),
        _attributeValue$split2 = _slicedToArray(_attributeValue$split, 3),
        variableName = _attributeValue$split2[0],
        listItemTagName = _attributeValue$split2[1],
        optional = _attributeValue$split2[2];

    var fullName = '-';

    if (!variableName) {
      console.error(element, 'Use ' + _6.directives.list + '="variableName-tagName" format!');
    }

    if (optional) {
      // for custom elements
      fullName = listItemTagName + '-' + optional;
      element["DOM99_X"] = fullName;
    } else {
      element["DOM99_L"] = _6.propertyFromElement(listItemTagName.toUpperCase());
      element["DOM99_I"] = listItemTagName;
    } // could send path as array directly
    // but have to change notifyOneListSubscriber to take in path as Array or String
    // before


    var path = _1t(__captured__scope_1[1], variableName);

    _1v(_k, path, element);

    if (_11.call(_5, path)) {
      _1x(element, path, _5[path]);
    }
  };

  var _t = function (element, variableName) {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    /* two-way bind
       example : called for <input data-variable="a">
       in this example the variableName = `a`
       we push the <input data-variable="a" > element in the array
       that holds all elements which share this same `a` variable
       undefined assignment are ignored, instead use empty string*/
    if (!variableName) {
      console.error(element, 'Use ' + _6.directives.variable + '="variableName" format!');
    }

    var path = _1t(__captured__scope_1[1], variableName);

    _1v(_j, path, element);

    var lastValue = _5[path]; // has latest

    if (lastValue !== undefined) {
      _1u(element, lastValue);
    }

    if (!_6.tagNamesForUserInput.includes(element.tagName)) {
      return;
    }

    var broadcastValue = function broadcastValue(event) {
      //wil call setter to broadcast the value
      var value = element[_6.propertyFromElement(element)];

      _5[path] = value;

      _14(path, value); // would notify everything including itself
      // notifyVariableSubscribers(variableSubscribers[path], value);


      _j[path].forEach(function (variableSubscriber) {
        if (variableSubscriber !== element) {
          _1u(variableSubscriber, value);
        }
      });
    };

    _1w(element, _6.eventNameFromElement(element), broadcastValue);
  };

  var _r = function (element, attributeValue) {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    /* stores element for direct access !*/
    var elementName = attributeValue;

    if (!elementName) {
      console.error(element, 'Use ' + _6.directives.element + '="elementName" format!');
    }

    var path = _1t(__captured__scope_1[1], elementName);

    _3[path] = element;
  };

  var _x = function (element, attributeValue) {
    /* stores a template element for later reuse !*/
    if (!attributeValue) {
      console.error(element, 'Use ' + _6.directives.template + '="d-name" format!');
    }

    _l[attributeValue] = element;
  };

  var _1z = function (template, key) {
    /* clones a template and activates it
       */
    _20(key);

    var activatedClone = _22(template);

    _Q(activatedClone);

    _27();

    _21();

    return activatedClone;
  };

  var _w = function (element, key) {
    /* looks for an html template to render
       also calls applyDirectiveElement with key!*/
    if (!key) {
      console.error(element, 'Use ' + _6.directives.inside + '="insidewhat" format!');
    }

    var template = _l[_1y(element)];

    if (template) {
      var activatedClone = _1z(template, key);

      element.appendChild(activatedClone);
    } else {
      // avoid infinite loop
      element.setAttribute(_6.directives.inside, _6.doneSymbol + key); // parse children under name space (encapsulation of variable names)

      _20(key);

      _Q(element);

      _21();
    }
  };

  var _U = function (name) {
    if (!_11.call(_l, name)) {
      console.error('<template ' + _6.directives.template + '=' + name + '>\n\t\t\t\t</template> not found or already deleted and removed.');
    }

    _l[name].remove();

    delete _l[name];
  };

  var _y = function (element) {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    /* looks if the element has dom99 specific attributes and tries to handle it*/
    // todo make sure no impact-full read write
    if (!element.hasAttribute) {
      // can this if be removed eventually ? --> no
      return;
    } // spellcheck atributes


    var directives = Object.values(_6.directives);
    Array.prototype.slice.call(element.attributes).forEach(function (attribute) {
      if (attribute.nodeName.startsWith('data')) {
        if (directives.includes(attribute.nodeName)) ;else {
          console.warn('dom99 does not recognize ' + attribute.nodeName);
        }
      }
    });

    __captured__scope_1[2].forEach(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          directiveName = _ref6[0],
          applyDirective = _ref6[1];

      if (!element.hasAttribute(directiveName)) {
        return;
      }

      var attributeValue = element.getAttribute(directiveName);

      if (attributeValue[0] === _6.doneSymbol) {
        return;
      }

      applyDirective(element, attributeValue); // ensure the directive is only applied once

      element.setAttribute(directiveName, '' + _6.doneSymbol + attributeValue);
    });

    if (element.hasAttribute(_6.directives.inside) || element.hasAttribute(_6.directives.list)) {
      return;
    }
    /*using a custom element without data-inside*/


    var customName = _1y(element);

    if (_11.call(_l, customName)) {
      element.appendChild(_22(_l[customName]));
    }
  };

  var _Q = function () {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    var startElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body; //build array only once and use up to date options, they should not reset twice

    if (!__captured__scope_1[2]) {
      __captured__scope_1[2] = [
      /*order is relevant applyVariable being before applyFunction,
          we can use the just changed live variable in the bind function*/
      [_6.directives.element, _r], [_6.directives.variable, _t], [_6.directives.function, _u], [_6.directives.list, _v], [_6.directives.inside, _w], [_6.directives.template, _x]];
    }

    _q(startElement, _y);

    return startElement;
  };

  var _P = function () {
    var dataFunctions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var initialFeed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var startElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;
    var callBack = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
    Object.assign(_4, dataFunctions);

    _S(initialFeed);

    _Q(startElement);

    if (!callBack) {
      return;
    }

    return callBack();
  };

  var _27 = function () {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    var context = _z(__captured__scope_1[1]);

    _18.forEach(function (clonePlugin) {
      clonePlugin(context);
    });
  };

  var _14 = function (startPath, data) {
    _17.forEach(function (feedPlugin) {
      feedPlugin(startPath, data);
    });
  };

  var _V = function (featureToPlugIn) {
    var __captured__scope_1 = __scope_0[0] || __get_scope_binding_0(0);

    if (!_10(featureToPlugIn)) {
      console.error('plugin({\n\t\t\t\ttype,\n\t\t\t\tplugin\n\t\t\t});');
    }

    if (featureToPlugIn.type === 'function') {
      _m.push(featureToPlugIn.plugin);

      __captured__scope_1[3] = function applyFunction(element, eventName, functionName) {
        var defaultPrevented = false;

        var preventDefault = function preventDefault() {
          defaultPrevented = true;
        };

        _m.forEach(function (pluginFunction) {
          pluginFunction(element, eventName, functionName, _4, preventDefault);
        });

        if (defaultPrevented) {
          return;
        }

        _1L(element, eventName, functionName);
      };
    } else if (featureToPlugIn.type === 'variable') {
      _17.push(featureToPlugIn.plugin);
    } else if (featureToPlugIn.type === 'cloned') {
      _18.push(featureToPlugIn.plugin);
    } else {
      console.warn('plugin type ' + featureToPlugIn.type + ' not yet implemented');
    }
  };

  _$0._defineProperty = _N;
  _$0._slicedToArray = _O;
  var _4 = {};
  var _17 = [];
  var _5 = {};
  var _11 = _$3;
  var _j = {};
  var _A = {
    "function": "data-function",
    variable: "data-variable",
    element: "data-element",
    list: "data-list",
    inside: "data-inside",
    template: "data-template"
  };
  var _1N = {
    checkbox: "checked",
    radio: "checked",
    MISS: "value"
  };
  var _1S = {
    INPUT: "value",
    TEXTAREA: "value",
    PROGRESS: "value",
    SELECT: "value",
    IMG: "src",
    SOURCE: "src",
    AUDIO: "src",
    VIDEO: "src",
    TRACK: "src",
    SCRIPT: "src",
    OPTION: "value",
    LINK: "href",
    DETAILS: "open",
    MISS: "textContent"
  };
  var _1h = {
    checkbox: "change",
    radio: "change",
    range: "change",
    file: "change",
    MISS: "input"
  };
  var _1n = {
    SELECT: "change",
    TEXTAREA: "input",
    BUTTON: "click",
    MISS: "click"
  };
  var _H = ["INPUT", "TEXTAREA", "SELECT", "DETAILS"];
  var _6 = {
    doneSymbol: "*",
    tokenSeparator: "-",
    listSeparator: " ",
    directives: _A,
    propertyFromElement: _W,
    eventNameFromElement: _X,
    tagNamesForUserInput: _H
  };
  var _k = {};
  var _l = {};
  var _1H = [];
  var _3 = {};
  $$0.value = "applyFunctionOriginal", _$4(_1L, "name", $$0);
  var _18 = [];
  var _m = [];
  _$0.d = {
    start: _P,
    activate: _Q,
    elements: _3,
    functions: _4,
    variables: _5,
    get: _R,
    feed: _S,
    forgetContext: _T,
    deleteTemplate: _U,
    plugin: _V,
    options: _6,
    contextFromArray: _Y,
    contextFromEvent: _Z,
    getParentContext: _a,
    createElement2: _b,
    idGenerator: _c
  };
}).call(this);