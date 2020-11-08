import { create } from "../../../source/dom99create.js";
import { defaultOptions } from "../../../source/defaultOptions.js";

// note the first one is yaml
const options = [`yaml`, `json`, `toml`].map(option => {
    return {
        textContent: option,
        value: option,
    };
});
const inputType = `json`;

describe(`data-list and data-variable`, function () {
    let d, content;
    beforeEach(function () {
        d = create(defaultOptions);
        content = document.createElement(`div`);
        // this.childType = `li`;
        content.innerHTML = `
            <select 
                data-list="options"
                data-use="option"
                data-variable="inputType"
                data-element="targetElement"
            ></select>
        `;
        d.start({
            startElement: content,
            initialFeed: {
                options,
                inputType,
            },
        });
    });

    it(`should have a value always equal to data-variable`, function () {
        const valueFromDGet = d.get(`inputType`);
        const {value} = d.elements.targetElement;
        expect(value).toEqual(valueFromDGet);
        expect(value).toEqual(inputType);
    });

});
