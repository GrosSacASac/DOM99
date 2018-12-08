import {
    create,
    parentScope,
    scopeFromArray,
    FIRST_VARIABLE_FROM_HTML,
    FIRST_VARIABLE_FROM_USER_AGENT
} from "../../../source/dom99create.js";
import {defaultOptions} from "../../../source/defaultOptions.js";

describe("firstVariableValueStrategy", function() {
    beforeEach(function () {
        this.expectedValue = `abc`;
        this.myfunction = function () {};
        this.content = document.createElement("div");
        this.content.innerHTML = `
          <input data-variable="string1" value="${this.expectedValue}">
        `;
    });

  it("it should be undefined when firstVariableValueStrategy is not set", function() {
        const d = create(Object.assign(
            {},
            defaultOptions
            )
        );
           
        d.start(this.content);
        expect(d.get("string1")).toEqual(undefined);
  });
  
  it("it should use the variable from html source with strategy FIRST_VARIABLE_FROM_HTML", function() {
        const d = create(Object.assign(
            {},
            defaultOptions,
            {firstVariableValueStrategy:FIRST_VARIABLE_FROM_HTML})
        );
           
        d.start(this.content);
        expect(d.get("string1")).toEqual(this.expectedValue);
  });

  it("it should use the active variable from the user agent with strategy FIRST_VARIABLE_FROM_USER_AGENT", function() {
        const d = create(Object.assign(
            {},
            defaultOptions,
            {firstVariableValueStrategy:FIRST_VARIABLE_FROM_USER_AGENT})
        );
        d.start(this.content);
        expect(d.get("string1")).toEqual(this.expectedValue);
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
