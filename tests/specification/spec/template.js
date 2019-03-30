import {create} from "../../../source/dom99create.js";
import {defaultOptions} from "../../../source/defaultOptions.js";


describe(`data-template`, function() {
    beforeEach(function () {
        this.d = create(defaultOptions);
        this.content = document.createElement(`div`);
        this.templateName = `x-test`;
        this.insideText = `hello`;
        this.targetElementName = `mysubject`;
        this.targetIsElementName = `mysubject2`;
        this.content.innerHTML = `
        <template data-template="${this.templateName}" data-element="${this.templateName}">
            <p>${this.insideText}</p>
        </template>
        <${this.templateName} data-element="${this.targetElementName}"></${this.templateName}>
        <div is="${this.templateName}" data-element="${this.targetIsElementName}"></div>
        `;
        this.d.start(this.content);
    });

    it(`an element with the same tag as the template name should contain a copy of the inner html`, function() {
        const template = this.d.elements[this.templateName];
        const subject = this.d.elements[this.targetElementName];

        expect(template.innerHTML).toEqual(subject.innerHTML);
    });

    it(`an element with is="" with the template name should contain a copy of the inner html`, function() {
        const template = this.d.elements[this.templateName];
        const subject = this.d.elements[this.targetIsElementName];

        expect(template.innerHTML).toEqual(subject.innerHTML);
    });

});
