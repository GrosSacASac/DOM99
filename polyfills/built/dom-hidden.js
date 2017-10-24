"use strict";

// hidden polyfill
// also requires css polyfill
var bodyHidden = document.body.hidden;
if (bodyHidden !== true && bodyHidden !== false) {
    // no support
    Object.defineProperty(HTMLElement.prototype, "hidden", {
        get: function get() {
            return this.hidden || false;
        },
        set: function set(isHidden) {
            this.hidden = isHidden;
            if (isHidden) {
                this.setAttribute("hidden", "");
            } else {
                this.removeAttribute("hidden");
            }
        }
    });
}

