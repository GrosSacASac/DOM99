import * as d from "../../../source/dom99.js";
import { move } from "../move.js";

d.plugin(move);

let x = 0;
d.functions.moveLeft = function (event) {
    x += 1;
    d.feed(`count`, x);
};

d.start();
d.feed(`count`, `-1`);
