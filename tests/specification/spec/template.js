import { create } from "../../../source/dom99create.js";
import { defaultOptions } from "../../../source/defaultOptions.js";


describe(`data-template`, function () {
    let d, content, templateName, insideText, targetElementName, targetIsElementName;
    beforeEach(function () {
        d = create(defaultOptions);
        content = document.createElement(`div`);
        templateName = `x-test`;
        insideText = `hello`;
        targetElementName = `mysubject`;
        targetIsElementName = `mysubject2`;
        content.innerHTML = `
        <template data-template="${templateName}" data-element="${templateName}">
            <p>${insideText}</p>
        </template>
        <${templateName} data-element="${targetElementName}"></${templateName}>
        <div is="${templateName}" data-element="${targetIsElementName}"></div>
        `;
        d.start({
            startElement: content,
        });
    });

    it(`an element with the same tag as the template name should contain a copy of the inner html`, function () {
        const template = d.elements[templateName];
        const subject = d.elements[targetElementName];

        expect(template.innerHTML).toEqual(subject.innerHTML);
    });

    it(`an element with is="" with the template name should contain a copy of the inner html`, function () {
        const template = d.elements[templateName];
        const subject = d.elements[targetIsElementName];

        expect(template.innerHTML).toEqual(subject.innerHTML);
    });

});
