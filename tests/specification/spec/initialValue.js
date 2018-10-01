import {
    create,
    FIRST_VARIABLE_FROM_HTML
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
    d.activate(this.content);
    expect("abc").toEqual(d.get("string1"));
  });

});
