import {create} from "../../../source/dom99create.js";
import {defaultOptions} from "../../../source/defaultOptions.js";


const exampleData = ["a", "b", "c"];
const {length} = exampleData;

describe("data-template", function() {
    beforeEach(function () {
        this.d = create(defaultOptions);
        this.content = document.createElement("div");
        this.templateName = `x-test`;
        this.insideText = `hello`;
        this.targetElementName = `mysubject`;
        this.content.innerHTML = `
        <template data-template="${this.templateName}" data-element="${this.templateName}">
            <p>${this.insideText}</p>
        </template>
        <${this.templateName} data-element=${this.targetElementName}></${this.templateName}>
        `;
        this.d.start(this.content);
    });

    it("an element with the same tag as the template name should contain a copy of the inner html", function() {
        const template = this.d.elements[this.templateName];
        const subject = this.d.elements[this.targetElementName];

        expect(template.innerHTML).toEqual(subject.innerHTML);
    });

});
