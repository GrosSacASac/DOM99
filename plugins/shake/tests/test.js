import d from "../../../built/dom99Module.js";
import {shake, shakeSupport} from "../shake.js";

d.plugin(shake);

let shaken = 0;
d.functions.deviceShaked = function (event) {
    shaken += 1;
    d.feed(shaken, `shakenCount`);
};

d.start(undefined, undefined, undefined, function () {
    if (!shakeSupport) {
        d.feed(`No supoort for device motion`, `shakenCount`);
    }
});
