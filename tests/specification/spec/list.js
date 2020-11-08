import { create } from "../../../source/dom99create.js";
import { defaultOptions } from "../../../source/defaultOptions.js";


const exampleData = [`a`, `b`, `c`];
const { length } = exampleData;

describe(`data-list simple`, function () {
    let d, content, childType;
    beforeEach(function () {
        d = create(defaultOptions);
        content = document.createElement(`div`);
        childType = `li`;
        content.innerHTML = `<ol data-element="targetElement" data-list="myList" data-use="${childType}"></ol>`;
        d.start({
            startElement: content,
        });
        d.feed(`myList`, exampleData);
    });

    it(`should contain as many child elements as there are elements in the array`, function () {
        const { childElementCount } = d.elements.targetElement;

        expect(childElementCount).toEqual(length);
    });

    it(`should contain the specified element in the directive`, function () {
        const { childNodes } = d.elements.targetElement;

        expect(
            Array.from(childNodes).every(node => {
                return node.tagName === childType.toUpperCase();
            }),
        ).toEqual(true);
    });

    it(`should contain the wanted content`, function () {
        const { textContent } = d.elements.targetElement;

        expect(
            exampleData.every(data => {
                return textContent.includes(data);
            }),
        ).toEqual(true);
    });

});
