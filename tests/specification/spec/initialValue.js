import {
    create,
    parentScope,
    scopeFromArray,
    FIRST_VARIABLE_FROM_HTML,
    FIRST_VARIABLE_FROM_USER_AGENT,
} from "../../../source/dom99create.js";
import { defaultOptions } from "../../../source/defaultOptions.js";

describe(`firstVariableValueStrategy`, function () {
    let expectedValue, content;
    beforeEach(function () {
        expectedValue = `abc`;
        content = document.createElement(`div`);
        content.innerHTML = `
            <input data-variable="string1" value="${expectedValue}">
        `;
    });

    it(`it should be undefined when firstVariableValueStrategy is set to undefined`, function () {
        const d = create(Object.assign(
            {},
            defaultOptions,
            { firstVariableValueStrategy: undefined },
        ));

        d.start(content);
        expect(d.get(`string1`)).toEqual(undefined);
    });

    it(`it should use the variable from html source with strategy FIRST_VARIABLE_FROM_HTML`, function () {
        const d = create(Object.assign(
            {},
            defaultOptions,
            { firstVariableValueStrategy: FIRST_VARIABLE_FROM_HTML },
        ));

        d.start({
            startElement: content,
        });
        expect(d.get(`string1`)).toEqual(expectedValue);
    });

    it(`it should use the active variable from the user agent with strategy FIRST_VARIABLE_FROM_USER_AGENT`, function () {
        const d = create(Object.assign(
            {},
            defaultOptions,
            { firstVariableValueStrategy: FIRST_VARIABLE_FROM_USER_AGENT },
        ));
        d.start({
            startElement: content,
        });
        expect(d.get(`string1`)).toEqual(expectedValue);
    });

    xit(`d.scopeFromArray (implementation detail)`, function () {
        const d = create(defaultOptions);
        d.scopeFromArray = scopeFromArray;
        const context = d.scopeFromArray([`Hello`, `World`]);
        expect(`Hello>World`).toEqual(context);
    });

    xit(`d.parentScope  (implementation detail)`, () => {
        const d = create(defaultOptions);
        d.parentScope = parentScope;
        const contextPath = `ParentContext>ChildContext`;
        const parentContext = d.parentScope(contextPath);
        expect(`ParentContext`).toEqual(parentContext);
    });
});
