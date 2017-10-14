"use strict";
const D = dom99;

D.feed({
    x: "XXX",
    z: "ZZZ",
    c: "Test",
    normal: [
        "Hi",
        "Jordan",
        "build design, iterate"
    ],
    datain1: {
        a:"inside data-inside1",
        b: "me too"
    },
    listtitle: "list without data-inside",
    listinisde: [
        "Hi without data-inside",
        "Jordan without data-inside",
        "build design, iterate without data-inside"
    ],
    dlistinside: {
        listtitle: "list with data-inside",
        listinisde: [
            "Hi with data-inside",
            "Jordan with data-inside",
            "build design, iterate with data-inside"
        ]
    },
    componentinside: [
        {
            a:"componentinside 0 a",
            b: "componentinside 0 b"
        },
        {
            a:"componentinside 1 a",
            b: "componentinside 1 b"
        },
    ],
    outerlist: [
        {
            sideOuter: "side outer",
            innerlist: [
                {
                    a: "crazy nesting 0 a",
                    b: "crazy nesting 0 b"
                },
                {
                    a: "crazy nesting 1 a",
                    b: "crazy nesting 1 b"
                },
            ]
        },
        {
            sideOuter: "side outer 2",
            innerlist: [
                {
                    a: "1crazy nesting 0 a",
                    b: "1crazy nesting 0 b"
                },
                {
                    a: "1crazy nesting 1 a",
                    b: "1crazy nesting 1 b"
                },
            ]
        },
    ]
});

// D.feed({normal:["come", "join"]});
D.linkJsAndDom();
// D.feed({
    
    // outerlist: [
        // {
            // sideOuter: "side outer",
            // innerlist: [
                // {
                    // a: "crazy nesting 1 a",
                    // b: "crazy nesting 1 b"
                // },
            // ]
        // },
        // {
            // sideOuter: "siiiiiii",
            // innerlist: [
                // {
                    // a: "1crazy nesting 0 a",
                    // b: "1crazy nesting 0 b"
                // },
                // {
                    // a: "1crazy nesting 1 a",
                    // b: "1crazy nesting 1 b"
                // },
            // ]
        // },
    // ]
// });
// D.variablesSubscribers
// D.prepopulatedData
// D.get("c")
// D.get("normal>1")