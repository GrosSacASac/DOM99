/*globals D*/
"use strict";

let globalNumber = 0;
// increment local does not update the list, how to make the data flow

const setAllGlobalCopyInside = function (value) {
    const changeDescriptor = {
        globalCopy: String(value),
    };

    D.feed(changeDescriptor, D.contextFromArray(["outerList", 0]));
    D.feed(changeDescriptor, D.contextFromArray(["outerList", 1]));
    D.feed(changeDescriptor, D.contextFromArray(["outerList", 2]));
};

const globalIncrement = function (event) {
    globalNumber += 1;
    setAllGlobalCopyInside(globalNumber);

};

const globalSet = function (event) {
    const context = D.contextFromEvent(event);
    const newGlobalNumber = Number(
        D.variables[
            D.contextFromArray([context, "globalCopy"])
        ]);
    globalNumber = newGlobalNumber;
    
    setAllGlobalCopyInside(globalNumber);
};

const localIncrement = function (event) {
    const context = D.contextFromEvent(event);
    const spanElement = D.elements[D.contextFromArray([context, "span"])];
    const localNumber = Number(
        D.variables[
            D.contextFromArray([context, "local"])
        ]) + 1;
    const localColor = `rgb(${(localNumber * 25) % 255},0,0)`;

    D.feed({
        local: String(localNumber)
    },
    context);
    
    spanElement.style.border = `1px ${localColor} solid`;
};

const listremake = function (event) {
    /* display list size of global, with value local */
    const context = D.contextFromEvent(event);
    const localNumber = Number(
    D.variables[
        D.contextFromArray([context, "local"])
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
    D.feed({
        innerlist: newList
    },
    context);

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
            local: "-5",
            innerlist: [
                {
                    a: "1 item a",
                    b: "1 item b"
                }
            ]
        },
        {
            globalCopy: String(globalNumber),
            local: "-2",
            innerlist: [
                {
                    a: "crazy nesting 0 a aaa",
                    b: "crazy nesting 0 b"
                },
                {
                    a: "crazy nesting 1 a",
                    b: "crazy nesting 1 b"
                },
            ]
        },
        {
            globalCopy: String(globalNumber),
            local: "3",
            innerlist: [
                {
                    a: "1crazy nesting 0 a",
                    b: "1crazy nesting 0 b"
                },
                {
                    a: "1crazy nesting 1 a",
                    b: "1crazy nesting 1 b zzz"
                },
                {
                    a: "third item (b is unset)"
                },
            ]
        },
    ]
};

D.start(functions, initialData);
