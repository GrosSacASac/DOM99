/* eslint-disable */
import * as d from "../../source/dom99.js";
let globalNumber = 0;
// increment local does not update the list, how to make the data flow

const setAllGlobalCopyInside = function (value) {
    const changeDescriptor = {
        globalCopy: String(value),
    };

    d.feed(d.scopeFromArray([`outerList`, 0]), changeDescriptor);
    d.feed(d.scopeFromArray([`outerList`, 1]), changeDescriptor);
    d.feed(d.scopeFromArray([`outerList`, 2]), changeDescriptor);
};

const globalIncrement = function (event) {
    globalNumber += 1;
    setAllGlobalCopyInside(globalNumber);

};

const globalSet = function (event) {
    const context = d.scopeFromEvent(event);
    const newGlobalNumber = Number(
        d.variables[
        d.scopeFromArray([context, `globalCopy`])
        ]);
    globalNumber = newGlobalNumber;

    setAllGlobalCopyInside(globalNumber);
};

const localIncrement = function (event) {
    const context = d.scopeFromEvent(event);
    const spanElement = d.elements[d.scopeFromArray([context, `span`])];
    const localNumber = Number(
        d.variables[
        d.scopeFromArray([context, `local`])
        ]) + 1;
    const localColor = `rgb(${(localNumber * 25) % 255},0,0)`;

    d.feed(context, {
        local: String(localNumber)
    });

    spanElement.style.border = `1px ${localColor} solid`;
};

const listremake = function (event) {
    /* display list size of global, with value local */
    const context = d.scopeFromEvent(event);
    const localNumber = Number(
        d.variables[
        d.scopeFromArray([context, `local`])
        ]);
    const global = globalNumber;
    const newList = [];
    let i;
    for (i = 0; i < global; i += 1) {
        newList.push({
            "a": localNumber,
            "b": localNumber
        });
    }
    d.feed(context, {
        innerlist: newList
    });

};
const functions = {
    globalIncrement,
    localIncrement,
    listremake,
    globalSet
};

const initialData = {

    outerList: [
        {
            globalCopy: String(globalNumber),
            local: `-5`,
            innerlist: [
                {
                    a: `1 item a`,
                    b: `1 item b`
                }
            ]
        },
        {
            globalCopy: String(globalNumber),
            local: `-2`,
            innerlist: [
                {
                    a: `crazy nesting 0 a aaa`,
                    b: `crazy nesting 0 b`
                },
                {
                    a: `crazy nesting 1 a`,
                    b: `crazy nesting 1 b`
                },
            ]
        },
        {
            globalCopy: String(globalNumber),
            local: `3`,
            innerlist: [
                {
                    a: `1crazy nesting 0 a`,
                    b: `1crazy nesting 0 b`
                },
                {
                    a: `1crazy nesting 1 a`,
                    b: `1crazy nesting 1 b zzz`
                },
                {
                    a: `third item (b is unset)`
                },
            ]
        },
    ]
};

d.start({
    startElement: document.body,
    initialFeed: initialData,
    dataFunctions: functions
});
