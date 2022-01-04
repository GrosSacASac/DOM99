import * as d from "../../../source/dom99.js";
import { keyboard } from "../keyboard.js";

d.plugin(keyboard);

let x = -1;
d.functions.moveUp = function () {
    x += 1;
    d.feed(`count`, x);
};
d.functions.moveDown = function () {
    x -= 1;
    d.feed(`count`, x);
};
d.functions.throw = function (event) {
    event?.preventDefault();
    x -= 1;
    d.feed(`count`, `throw`);
};
d.functions.logger = function (event) {
    console.log(event.code, event.key);
};

d.start();
d.feed(`count`, String(x));
