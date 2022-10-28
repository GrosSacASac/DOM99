import * as d from "./../../source/dom99.js";


d.functions.closeDialog = function (event) {
    // const value = event.returnValue; // this is not the same (always true ?)
    const value = d.elements.dialog.returnValue;
    d.feed(`output`, value)
};

d.functions.openDialog = function (event) {
    d.elements.dialog.showModal();
};

d.start()
