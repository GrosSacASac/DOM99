import {create} from "../../../source/dom99create.js";

const exampleData = ["a", "b"];
const {length} = exampleData;

describe("data-list", function() {
  beforeEach(function () {
      const d = create();
      window.d = d;
      this.content = document.createElement("div");
  });

  it("data-list should work with raw elements", function() {
    this.content.innerHTML = `<ol data-element="targetElement" data-list="myList-li"></ol>`;
    d.start(this.content);
    d.feed(`myList`, exampleData);
    
    const {childElementCount, childNodes} = d.elements.targetElement;
    
    expect(childElementCount).toEqual(length);
    expect(childNodes[0].tagName).toEqual(`LI`);
  });

});
