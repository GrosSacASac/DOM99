import { create } from "../../../source/dom99create.js";
import { defaultOptions } from "../../../source/defaultOptions.js";

const exampleText = `abwxyz \\ " \' <html> <script>http // %20 blabla`;

describe(`dom99 basics`, function () {
  beforeEach(function () {
    const d = create(defaultOptions);
    window.d = d;
    this.myfunction = function () { };
    this.content = document.createElement(`div`);
    this.content.innerHTML = `
        <div id="div1" data-element="div1"></div>
        <input data-element="input1" data-variable="string1">
        <div data-element="div2" data-function="click-functionX"></div>`;

    d.functions.functionX = (...args) => {
      this.myfunction(...args);
    };
    d.start({
      startElement: this.content,
    });
  });


  it(`this test suite uses querySelector`, function () {
    expect(this.content.querySelector).toBeDefined();
  });

  it(`data-element should be able to preselect an element`, function () {
    expect(d.elements.div1).toEqual(this.content.querySelector(`#div1`));
  });

  it(`d.feed and data-variable should be able to set a new value in the dom`, function () {
    d.feed(`string1`, exampleText);
    expect(exampleText).toEqual(d.elements.input1.value);
  });

  it(`data-variable should be able to see the change if an user input event is fired`, function () {

    d.elements.input1.value = exampleText;
    const event = document.createEvent(`Event`);
    event.initEvent(`input`, true, true);
    d.elements.input1.dispatchEvent(event);

    expect(exampleText).toEqual(d.get(`string1`));

  });

  it(`data-function should be able fire a function if the event occurs`, function () {
    const initialValue = `initialValue`;
    const finalValue = `finalValue`;
    let currentValue = initialValue;
    this.myfunction = function (event) {
      currentValue = finalValue;
    };

    const event = document.createEvent(`Event`);
    event.initEvent(`click`, true, true);
    d.elements.div2.dispatchEvent(event);

    expect(currentValue).toEqual(finalValue);
  });

});
