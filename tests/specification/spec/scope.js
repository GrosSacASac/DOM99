import { create, scopeFromArray } from "../../../source/dom99create.js";
import { defaultOptions } from "../../../source/defaultOptions.js";

const exampleText = `salad and fish`;
const textInner = `inner x`;
const textOuter = `outer x`;

describe(`data-scope`, function () {
    let d, content;
    beforeEach(function () {
        d = create(defaultOptions);
        content = document.createElement(`div`);
        content.innerHTML = `
            <div data-scope="myscope" data-element="scopeParent">
                <p data-variable="x" id="p0">inner x</p>
                <p data-element="e" id="p1">Hello</p>
            </div>
            <p data-variable="x">outer x</p>
        `;
        d.start({
            startElement: content,
        });
        d.feed(`myList`, {
            myscope: {
                x: textInner,
            },
            x: textOuter,
        });
    });

    it(`should contain innerText inside the div with data-scope="myscope"`, function () {
        expect(d.elements[`scopeParent`].textContent.includes(textInner)).toEqual(true);
    });

    it(`should not contain textOuter inside the div with data-scope="myscope"`, function () {
        expect(d.elements[`scopeParent`].textContent.includes(textOuter)).toEqual(false);
    });

    it(`should not have an effect on outer`, function () {
        expect(content.textContent.includes(textOuter)).toEqual(true);
    });

    it(`data-element should be able to preselect an element (scoped)`, function () {
        expect(d.element(`myscope`, `e`)).toEqual(content.querySelector(`#p1`));
    });

    it(`d.feed and data-variable should be able to set a new value in the dom (scoped)`, function () {
        d.feed(scopeFromArray([`myscope`, `x`]), exampleText);
        expect(exampleText).toEqual(content.querySelector(`#p0`).textContent);
    });


    it(`data-function should be able fire a function if the event occurs (scoped)`, function (done) {
        content.innerHTML = `
            <div data-scope="myscope" data-element="scopeParent">
                <button data-function="x" data-element="b0">inner x</button>
            </div>
        `;
        d.functions.x = function () {
            expect(true).toEqual(true);
            done();
        };
        d.start({
            startElement: content,
        });

        const event = document.createEvent(`Event`);
        event.initEvent(`click`, true, true);
        d.element(`myscope`, `b0`).dispatchEvent(event);
    });

});
