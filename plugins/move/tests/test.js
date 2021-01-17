import * as d from "../../../source/dom99.js";
import { move } from "../move.js";

d.plugin(move);

let x = 0;
d.functions.moveUp = function () {
    x += 1;
    d.feed(`count`, x);
};
d.functions.moveDown = function () {
    x -= 1;
    d.feed(`count`, x);
};
d.functions.logger = function (event) {
    console.log(event.keyCode)
};

d.start();
d.feed(`count`, `-1`);
