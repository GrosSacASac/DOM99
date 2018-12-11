import {create} from "../../../source/dom99create.js";
import {defaultOptions} from "../../../source/defaultOptions.js";


const textInner = `inner x`;
const textOuter = `outer x`;

describe("data-scope", function() {
    beforeEach(function () {
        this.d = create(defaultOptions);
        this.content = document.createElement("div");
        this.content.innerHTML = `
            <div data-scope="myscope" data-element="scopeParent">
                <p data-variable="x">inner x</p>
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
});
