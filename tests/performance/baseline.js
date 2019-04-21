import * as d from "../../source/dom99.js";
import {
    chainRequestAnimationFrame,
    timePromise
} from "../../node_modules/utilsac/utility.js";
import {
    createMeasured, store
} from "./common.js";

let selectedRowElement = undefined;

var updateRows = function () {
    d.feed("rows", store.data);
};

var run = function () {
    unselect();
    store.run();
    updateRows();
};

var add = function () {
    unselect();
    store.add();
    updateRows();
};

var runLots = function () {
    unselect();
    store.runLots();
    updateRows();
};

var update = function () {
    store.update();
    updateRows();
}

var clear = function () {
    unselect();
    store.clear();
    updateRows();
};

var swapRows = function () {
    let old_selection = store.selected;
    unselect();
    store.swapRows();
    updateRows();
    if (old_selection >= 0) {
        let index = store.data.findIndex(d => d.id === old_selection);
        const rowPath = d.scopeFromArray(["rows", String(index), "row"]);
        const rowToSelected = d.elements[rowPath];
        store.select(old_selection);
        select(rowToSelected);
    }

};

var deleteRow = function (e) {
    e.preventDefault();
    e.stopPropagation();
    let context = d.scopeFromEvent(e);
    let idContext = d.scopeFromArray([context, "id"]);
    let id = d.variables[idContext];
    unselect(); // TODO remove
    store.delete(id);
    d.feed("rows", store.data);
};


// var handleRow = function (event) {
// const dataElement = event.target.getAttribute("data-element");
// if (!dataElement) {
// return;
// }
// if (dataElement.includes("label")) {
// selectRow(event);
// }
// console.log(event);
// console.log(event.target);
// };

var unselect = function () {
    if (selectedRowElement !== undefined) {
        selectedRowElement.className = "";
        selectedRowElement = undefined;
    }
};

var select = function (elementToSelect) {
    if (elementToSelect !== undefined) {
        elementToSelect.className = "danger";
        selectedRowElement = elementToSelect;
    }
};

var selectRow = function (e) {
    e.preventDefault();
    e.stopPropagation();
    unselect();
    let context = d.scopeFromEvent(e);
    let rowContext = d.scopeFromArray([context, "row"]);
    let rowElement = d.elements[rowContext];
    let rowIndexContext = d.scopeFromArray([context, "id"]);
    let rowIndex = d.variables[rowIndexContext];
    let index = Number(rowIndex);
    store.select(index);
    select(rowElement);
};

const all = [
    createMeasured(run),
    createMeasured(add),
    createMeasured(update),
    createMeasured(swapRows),
    createMeasured(runLots),
    createMeasured(clear)
];

const runAll = function () {
    timePromise(() => {
        return chainRequestAnimationFrame(all);
    }).then(({ timeElapsed, value }) => {
        const measures = {};
        console.log(`total time (including the testing overhead) ${timeElapsed}`);
        value.forEach(function ([name, duration]) {
            console.log(`${name} took ${duration}`);
            measures[name] = duration;
        });
        displayAllResults(measures);
    }).catch(console.error);
};

const displayAllResults = function (measures) {
    if (!d.variables.displayAllResults) {
        return;
    }
    d.feed(measures);
};

var functions = {
    // handleRow,
    runAll,
    delete: deleteRow,
    select: selectRow,
    delegate: function (e) {
        // console.log("delegate");
        if (e.target.matches('#add')) {
            e.preventDefault();
            //console.log("add");
            add();
        }
        else if (e.target.matches('#run')) {
            e.preventDefault();
            //console.log("run");
            run();
        }
        else if (e.target.matches('#update')) {
            e.preventDefault();
            //console.log("update");
            update();
        }
        // else if (e.target.matches('#hideall')) {
        // e.preventDefault();
        // console.log("hideAll");
        // hideAll();
        // }
        // else if (e.target.matches('#showall')) {
        // e.preventDefault();
        // console.log("showAll");
        // showAll();
        // }
        else if (e.target.matches('#runlots')) {
            e.preventDefault();
            //console.log("runLots");
            runLots();
        }
        else if (e.target.matches('#clear')) {
            e.preventDefault();
            //console.log("clear");
            clear();
        }
        else if (e.target.matches('#swaprows')) {
            e.preventDefault();
            //console.log("swapRows");
            swapRows();
        }

    }
};

var initialFeed = {
    displayAllResults: true
};
var startElement = document.body;
d.start(functions, initialFeed, startElement, function () {
    // console.log("ready");
    // run();
});
