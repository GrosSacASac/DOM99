import * as d from "../../source/dom99.js";

d.feed({
    x: `XXX`,
    z: `ZZZ`,
    c: `Test`,
    normal: [
        `Hi`,
        `Jordan`,
        `build design, iterate`,
    ],
    datain1: {
        a: `inside data-scope1`,
        b: `me too`,
    },
    listtitle: `list without data-scope`,
    listinisde: [
        `Hi without data-scope`,
        `Jordan without data-scope`,
        `build design, iterate without data-scope`,
    ],
    dlistinside: {
        listtitle: `list with data-scope`,
        listinisde: [
            `Hi with data-scope`,
            `Jordan with data-scope`,
            `build design, iterate with data-scope`,
        ],
    },
    componentinside: [
        {
            a: `componentinside 0 a`,
            b: `componentinside 0 b`,
        },
        {
            a: `componentinside 1 a`,
            b: `componentinside 1 b`,
        },
    ],
    outerlist: [
        {
            sideOuter: `side outer`,
            innerlist: [
                {
                    a: `crazy nesting 0 a`,
                    b: `crazy nesting 0 b`,
                },
                {
                    a: `crazy nesting 1 a`,
                    b: `crazy nesting 1 b`,
                },
            ],
        },
        {
            sideOuter: `side outer 2`,
            innerlist: [
                {
                    a: `1crazy nesting 0 a`,
                    b: `1crazy nesting 0 b`,
                },
                {
                    a: `1crazy nesting 1 a`,
                    b: `1crazy nesting 1 b`,
                },
            ],
        },
    ],
});

window.d = d;
d.feed(`items`, [{}, {}]);
d.feed(`itemsO`, [{}, {}]);

d.start();
