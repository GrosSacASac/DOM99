// hidden polyfill
// also requires css polyfill
const bodyHidden = document.body.hidden;
if (bodyHidden !== true && bodyHidden !== false) {
    // no support
    const privateHidden = "_hidden";
    Object.defineProperty(HTMLElement.prototype, "hidden", {
        get: function get() {
            if (Object.prototype.hasOwnProperty.call(this, privateHidden)) {
                return this[privateHidden];
            } else if (this.hasAttribute("hidden")) {
                return true;
            }
            return false;
        },
        set: function set(isHidden) {
            this._hidden = isHidden;
            if (isHidden) {
                this.setAttribute("hidden", "");
            } else {
                this.removeAttribute("hidden");
            }
        }
    });
}
