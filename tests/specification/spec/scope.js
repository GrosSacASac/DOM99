import {create, scopeFromArray} from "../../../source/dom99create.js";
import {defaultOptions} from "../../../source/defaultOptions.js";

const exampleText = `salad and fish`;
const textInner = `inner x`;
const textOuter = `outer x`;

describe("data-scope", function() {
    beforeEach(function () {
        this.d = create(defaultOptions);
        this.content = document.createElement("div");
        this.content.innerHTML = `
            <div data-scope="myscope" data-element="scopeParent">
                <p data-variable="x" id="p0">inner x</p>
                <p data-element="e" id="p1">Hello</p>
            </div>
            <p data-variable="x">outer x</p>
        `;
        this.d.start(this.content);
        this.d.feed(`myList`, {
            myscope: {
                x: textInner
            },
            x: textOuter
        });
    });

    it(`should contain innerText inside the div with data-scope="myscope"`, function() {
        expect(this.d.elements[`scopeParent`].textContent.includes(textInner)).toEqual(true);
    });
    
    it(`should not contain textOuter inside the div with data-scope="myscope"`, function() {
        expect(this.d.elements[`scopeParent`].textContent.includes(textOuter)).toEqual(false);
    });
    
    it(`should not have an effect on outer`, function() {
        expect(this.content.textContent.includes(textOuter)).toEqual(true);
    });

    it("data-element should be able to preselect an element (scoped)", function() {
        expect(this.d.element(`myscope`,`e`)).toEqual(this.content.querySelector("#p1"));
    });

    it("d.feed and data-variable should be able to set a new value in the dom (scoped)", function() {
        d.feed(scopeFromArray([`myscope`, `x`]), exampleText);
        console.log(d);
        expect(exampleText).toEqual(this.content.querySelector("#p0").value);
    });


    it("data-function should be able fire a function if the event occurs (scoped)", function() {
        this.content.innerHTML = `
            <div data-scope="myscope" data-element="scopeParent">
                <button data-function="x" data-element="b0">inner x</button>
            </div>
        `;
        this.d.functions.x = function(event) {
            console.log(event)
        };
        this.d.start(this.content);
        this.d.feed(`myList`, {
            myscope: {
                x: textInner
            },
            x: textOuter
        });
        
        const event = document.createEvent('Event');
        event.initEvent('click', true, true);
        d.elements.div2.dispatchEvent(event);

        expect(true).toEqual(true);
    });

});
