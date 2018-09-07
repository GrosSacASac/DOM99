import * as d from "../../../source/dom99.js";
describe("DOM99 basics", function() {
  
  let myfunction = function () {};
  const content = document.createElement("div");
  content.innerHTML = `
    <div id="div1" data-element="div1"></div>
    <input data-element="input1" data-variable="string1">
    <div data-element="div2" data-function="click-functionX"></div>`;
    
  d.functions.functionX = function (...args) {
	myfunction(...args);
  };
  d.activate(content);
  window.d = d;  

  it("this test suite uses querySelector", function() {
    expect(content.querySelector).toBeDefined();
  });
  
  it("data-element should be able to preselect an element", function() {
    expect(d.elements.div1).toEqual(content.querySelector("#div1"));
  });  
  
  it("data-variable should be able to set D.vr.string1 and see the change in the dom", function() {
    const text = "abwxyz \\ \" \' <html> <script>http // %20 blabla";
    d.feed('string1', text);
    expect(text).toEqual(d.elements.input1.value);
  });
  
  it("data-variable should be able to see the change if an user input event is fired", function() {
    const text = "abwxyz \\ \" \' <html> <script>http // %20 blabla";
    
    d.elements.input1.value = text;
    const event = document.createEvent('Event');
    event.initEvent('input', true, true);
    d.elements.input1.dispatchEvent(event);
    
    expect(text).toEqual(d.get('string1'));
    
  });
  
  it("data-function should be able fire a function if the event occurs", function() {
    let a = 0;
	const finalValue = 10;
    myfunction = function(event) {
        a = finalValue;
    };
    
    const event = document.createEvent('Event');
    event.initEvent('click', true, true);
    d.elements.div2.dispatchEvent(event);
    
    expect(a).toEqual(finalValue);
    
  });

});
