import {create} from "../../../source/dom99create.js";
import {defaultOptions} from "../../../source/defaultOptions.js";


const exampleData = ["a", "b", "c"];
const {length} = exampleData;

describe("data-list simple", function() {
    beforeEach(function () {
        this.d = create(defaultOptions);
        this.content = document.createElement("div");
        this.childType = `li`;
        this.content.innerHTML = `<ol data-element="targetElement" data-list="myList-${this.childType}"></ol>`;
        this.d.start(this.content);
        this.d.feed(`myList`, exampleData);
    });

    it("should contain as many child elements as there are elements in the array", function() {
        const {childElementCount} = this.d.elements.targetElement;

        expect(childElementCount).toEqual(length);
    });

    it("should contain the specified element in the directive", function() {
        const {childNodes} = this.d.elements.targetElement;
        
        expect(
            Array.from(childNodes).every(node => {
                return node.tagName === this.childType.toUpperCase();
            })
         ).toEqual(true);
    });
    
    it("should contain the wanted content", function() {
        const {textContent} = this.d.elements.targetElement;

        expect(
            exampleData.every(data => {
                return textContent.includes(data);
            })
        ).toEqual(true);
    });

});
