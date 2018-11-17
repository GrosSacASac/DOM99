import {
    create,
    parentScope,
    scopeFromArray,
    FIRST_VARIABLE_FROM_HTML,
    FIRST_VARIABLE_FROM_USER_AGENT
} from "../../../source/dom99create.js";

describe("initial value", function() {
    beforeEach(function () {
        const d = create();
        window.d = d;

        this.expectedValue = `abc`;
        this.myfunction = function () {};
        this.content = document.createElement("div");
        this.content.innerHTML = `
          <input data-variable="string1" value="${this.expectedValue}">
        `;


    });

  it("d.FIRST_VARIABLE_FROM_HTML", function() {
    d.options.firstVariableValueStrategy = FIRST_VARIABLE_FROM_HTML;
    d.start(this.content);
    expect("abc").toEqual(d.get("string1"));
  });

  it("d.FIRST_VARIABLE_FROM_USER_AGENT", function() {
    d.options.firstVariableValueStrategy = FIRST_VARIABLE_FROM_USER_AGENT;
    d.start(this.content);
    expect("abc").toEqual(d.get("string1"));
  });

  it("d.scopeFromArray", function() {
    d.scopeFromArray = scopeFromArray;
    let context = d.scopeFromArray(["Hello","World"])
    expect("Hello>World").toEqual(context);
  });

  it("d.parentScope", () => {
    d.parentScope = parentScope
    let contextPath = "ParentContext>ChildContext"
    let parentContext = d.parentScope(contextPath)
    expect("ParentContext").toEqual(parentContext);
  })
});
