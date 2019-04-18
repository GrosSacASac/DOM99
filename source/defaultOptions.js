export { defaultOptions };
import { FIRST_VARIABLE_FROM_USER_AGENT } from "./dom99create.js";


const MISS = `MISS`;
const valueElseMissDecorator = (object) => {
    /* Decorator function around an Object to provide a default value
    Decorated object must have a MISS key with the default value associated
    Arrays are also objects */
    return (key) => {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            return object[key];
        }
        return object[MISS];
    };
};


const propertyFromTag = valueElseMissDecorator({
    // TAG NAME: appropriate property name to retrieve and set the value
    [`INPUT`]: `value`,
    [`TEXTAREA`]: `value`,
    [`PROGRESS`]: `value`,
    [`SELECT`]: `value`,
    [`IMG`]: `src`,
    [`SOURCE`]: `src`,
    [`AUDIO`]: `src`,
    [`VIDEO`]: `src`,
    [`TRACK`]: `src`,
    [`SCRIPT`]: `src`,
    [`OPTION`]: `value`,
    [`LINK`]: `href`,
    [`DETAILS`]: `open`,
    [MISS]: `textContent`
});

const propertyFromInputType = valueElseMissDecorator({
    // Input Type : appropriate property name to retrieve and set the value
    [`checkbox`]: `checked`,
    [`radio`]: `checked`,
    [MISS]: `value`
});

const inputEventFromType = valueElseMissDecorator({
    [`checkbox`]: `change`,
    [`radio`]: `change`,
    [`range`]: `change`,
    [`file`]: `change`,
    [MISS]: `input`
});

const eventFromTag = valueElseMissDecorator({
    [`SELECT`]: `change`,
    [`TEXTAREA`]: `input`,
    [`BUTTON`]: `click`,
    [MISS]: `click`
});

const defaultDirectives = {
    function: `data-function`,
    variable: `data-variable`,
    element: `data-element`,
    list: `data-list`,
    inside: `data-scope`,
    template: `data-template`
};

const propertyFromElement = (element) => {
    // defines what is changing when data-variable is changing
    // for <p> it is textContent
    let tagName;
    if (element.tagName !== undefined) {
        tagName = element.tagName;
    } else {
        tagName = element;
    }
    if (tagName === `INPUT`) {
        return propertyFromInputType(element.type);
    }
    return propertyFromTag(tagName);
};

const eventNameFromElement = (element) => {
    // defines the default event for an element
    // i.e. when data-function is omitting the event
    const tagName = element.tagName;
    if (tagName === `INPUT`) {
        return inputEventFromType(element.type);
    }
    return eventFromTag(tagName);
};

const tagNamesForUserInput = [
    `INPUT`,
    `TEXTAREA`,
    `SELECT`,
    `DETAILS`,
];

const defaultOptions = {
    doneSymbol: `*`,
    tokenSeparator: `-`,
    listSeparator: ` `,
    firstVariableValueStrategy: FIRST_VARIABLE_FROM_USER_AGENT,
    directives: defaultDirectives,
    propertyFromElement,
    eventNameFromElement,
    tagNamesForUserInput,
};
