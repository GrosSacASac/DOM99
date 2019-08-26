import * as d from "../../../source/dom99.js";
import { shake, shakeSupport } from "../shake.js";

d.plugin(shake);

let shaken = 0;
d.functions.deviceShaked = function () {
    shaken += 1;
    d.feed(`shakenCount`, shaken);
};

d.start();
if (!shakeSupport) {
    d.feed(`shakenCount`, `No supoort for device motion`);
}
