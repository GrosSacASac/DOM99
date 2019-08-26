/*
shake is a plugin
*/
import {devicemotionListener, shakeSupport} from "./shakeEvents.js";
export {shake, shakeSupport};


const CUSTOM_EVENT = `shake`;
const handlers = [];

let listening = false;
let functionsStore;

const shake = {
    type: `function`,
    plugin: function (element, eventName, functionName, functions, preventDefault) {
        if (eventName !== CUSTOM_EVENT) {
            return;
        }
        // do not run default after this
        preventDefault();
        if (!shakeSupport) {
            return;
        }
        handlers.push(functionName);
        if (listening) {
            return;
        }
        window.addEventListener(`devicemotion`, devicemotionListener(function () {
            handlers.forEach(function (handlerName) {
                functionsStore[handlerName]();
            });
        }), false);
        functionsStore = functions;
        listening = true;
    }
};
