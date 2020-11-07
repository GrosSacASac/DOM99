import { create } from "../../../source/dom99create.js";
import { defaultOptions } from "../../../source/defaultOptions.js";

// note the first one is yaml
const options = ["yaml", "json", "toml"].map(option => {
    return {
        textContent: option,
        value: option
    }
});
const inputType = `json`;

describe("data-list and data-variable", function () {
    beforeEach(function () {
        this.d = create(defaultOptions);
        this.content = document.createElement("div");
        // this.childType = `li`;
        this.content.innerHTML = `
            <select 
                data-list="options"
                data-use="option"
                data-variable="inputType"
                data-element="targetElement"
            ></select>
        `;
        this.d.start({
            startElement: this.content,
            initialFeed: {
                options,
                inputType,
            },
        });
    });

    it("should have a value always equal to data-variable", function () {
        const valueFromDGet =this.d.get("inputType")
        const {value} =this.d.elements.targetElement;
        expect(value).toEqual(valueFromDGet);
        expect(value).toEqual(inputType);
    });

});
