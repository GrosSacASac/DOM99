import {
    create,
    parentScope,
    scopeFromArray,
    FIRST_VARIABLE_FROM_HTML,
    FIRST_VARIABLE_FROM_USER_AGENT
} from "../../../source/dom99create.js";
import {defaultOptions} from "../../../source/defaultOptions.js";

describe("initial value", function() {
    beforeEach(function () {

        this.expectedValue = `abc`;
        this.myfunction = function () {};
        this.content = document.createElement("div");
        this.content.innerHTML = `
          <input data-variable="string1" value="${this.expectedValue}">
        `;


    });

  it("d.FIRST_VARIABLE_FROM_HTML", function() {
        const d = create(Object.assign(
            {},
            defaultOptions,
            {firstVariableValueStrategy:FIRST_VARIABLE_FROM_HTML})
        );
        window.d = d;
    
    d.start(this.content);
    expect("abc").toEqual(d.get("string1"));
  });

  it("d.FIRST_VARIABLE_FROM_USER_AGENT", function() {
        const d = create(Object.assign(
            {},
            defaultOptions,
            {firstVariableValueStrategy:FIRST_VARIABLE_FROM_USER_AGENT})
        );
        window.d = d;
    d.start(this.content);
    expect("abc").toEqual(d.get("string1"));
  });

  xit("d.scopeFromArray (implementation detail)", function() {
    d.scopeFromArray = scopeFromArray;
    let context = d.scopeFromArray(["Hello","World"])
    expect("Hello>World").toEqual(context);
  });

  xit("d.parentScope  (implementation detail)", () => {
    d.parentScope = parentScope
    let contextPath = "ParentContext>ChildContext"
    let parentContext = d.parentScope(contextPath)
    expect("ParentContext").toEqual(parentContext);
  })
});
