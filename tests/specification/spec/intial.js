import * as d from "../../../source/dom99.js";
describe("DOM99 basics", function() {
  
  let myfunction = function () {};
  const content = document.createElement("div");
  content.innerHTML = `
    <div></div>
    <input data-variable="string1" value="abc">
    <div></div>`;
    
  d.options.firstVariableValueStrategy = d.FIRST_VARIABLE_FROM_HTML;
  d.activate(content);
  window.d = d;  
  
  
  it("d.FIRST_VARIABLE_FROM_HTML", function() {
    expect("abc").toEqual(d.get("string1"));
  });

});
