import { create, scopeFromArray } from "../../../source/dom99create.js";
import { defaultOptions } from "../../../source/defaultOptions.js";


describe(`dom99 basics`, function () {
    let d, content, myfunction;
  beforeEach(function () {
    d = create(defaultOptions);
    window.d = d;
    myfunction = function () { };
    content = document.createElement(`div`);
    content.innerHTML = ``;
    d.start({
      startElement: content,
    });
  });


  it(`scopeFromArray falsy values`, function () {
    expect(scopeFromArray(["a", 0])).not.toEqual(scopeFromArray(["a"]));
  });

  it(`scopeFromArray ignore empty string`, function () {
    expect(scopeFromArray(["", "a"])).toEqual(scopeFromArray(["a"]));
  });

  it(`scopeFromArray ignore empty string 2`, function () {
    expect(scopeFromArray(["a", ""])).toEqual(scopeFromArray(["a"]));
  });

});
