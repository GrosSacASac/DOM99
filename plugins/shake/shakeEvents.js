/*
acceleration = acceleration or deceleration

devicemotionListener must be used like this
window.addEventListener(`devicemotion`, devicemotionListener(function () {
    // do something when shake events occurs
}), false);
*/
export {devicemotionListener, shakeSupport};

const minimumAcceleration = 25;
const minimumTimeSpace = 600;
const shakeSupport = window.ondevicemotion !== undefined;


let before = Date.now();

let xMotion;
let yMotion;
let zMotion;

const devicemotionListener = function(shakeListener) {
    return function (event) {
        const accelerationIncludingGravity = event.accelerationIncludingGravity;

        if (xMotion !== undefined) {
            const now = Date.now();
            if ((now - before) > minimumTimeSpace) {
                const xAcceleration = Math.abs(xMotion - accelerationIncludingGravity.x);
                const yAcceleration = Math.abs(yMotion - accelerationIncludingGravity.y);
                const zAcceleration = Math.abs(zMotion - accelerationIncludingGravity.z);
                const totalAcceleration = xAcceleration + yAcceleration + zAcceleration;

                if (totalAcceleration > minimumAcceleration) {
                    before = now;
                    shakeListener();
                }
            }
        }

        xMotion = accelerationIncludingGravity.x;
        yMotion = accelerationIncludingGravity.y;
        zMotion = accelerationIncludingGravity.z;
    };
};
