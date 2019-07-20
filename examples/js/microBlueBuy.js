import { create } from "../../source/dom99create.js";
import { defaultOptions } from "../../source/defaultOptions.js";

const prices = {
    t_porsche: '66,00 €',
    t_fendt: '54,00 €',
    t_eicher: '58,00 €',
};

class BlueBuy extends HTMLElement {
    static get observedAttributes() {
        return ['sku'];
    }
    constructor() {
        super();
        this.d = create(defaultOptions);
        this.render();
    }
    render() {
        const sku = this.getAttribute('sku');
        this.displayFreshPrice(sku);

        this.innerHTML = `<button>buy for <span data-variable="price"></span></button>`;
        this.d.start({
            startElement: this
        });
    }
    displayFreshPrice(sku) {
        const price = prices[sku];
        this.d.feed(`price`, price);
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        if (attr === 'sku') {
            this.displayFreshPrice(newValue);
        }
    }
    disconnectedCallback() {
        this.innerHTML = ``
        // garbage collection does the rest
    }
}
window.customElements.define('blue-buy', BlueBuy);
