import d from "../../built/dom99Module.js";
let globalNumber = 0;
// increment local does not update the list, how to make the data flow

const setAllGlobalCopyInside = function (value) {
    const changeDescriptor = {
        globalCopy: String(value),
    };

    d.feed(changeDescriptor, d.contextFromArray(["outerList", 0]));
    d.feed(changeDescriptor, d.contextFromArray(["outerList", 1]));
    d.feed(changeDescriptor, d.contextFromArray(["outerList", 2]));
};

const globalIncrement = function (event) {
    globalNumber += 1;
    setAllGlobalCopyInside(globalNumber);

};

const globalSet = function (event) {
    const context = d.contextFromEvent(event);
    const newGlobalNumber = Number(
        d.variables[
            d.contextFromArray([context, "globalCopy"])
        ]);
    globalNumber = newGlobalNumber;
    
    setAllGlobalCopyInside(globalNumber);
};

const localIncrement = function (event) {
    const context = d.contextFromEvent(event);
    const spanElement = d.elements[d.contextFromArray([context, "span"])];
    const localNumber = Number(
        d.variables[
            d.contextFromArray([context, "local"])
        ]) + 1;
    const localColor = `rgb(${(localNumber * 25) % 255},0,0)`;

    d.feed({
        local: String(localNumber)
    },
    context);
    
    spanElement.style.border = `1px ${localColor} solid`;
};

const listremake = function (event) {
    /* display list size of global, with value local */
    const context = d.contextFromEvent(event);
    const localNumber = Number(
    d.variables[
        d.contextFromArray([context, "local"])
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
    d.feed({
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

d.start(functions, initialData);
