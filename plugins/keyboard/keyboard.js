export { keyboard };

const KEY = `key`;
const CODE = `code`;
const SEPARATOR = `+`;

const keyboard = {
    type: `function`,
    plugin: function (element, eventName, functionName, functions, preventDefault) {
        if (eventName !== KEY && eventName !== CODE) {
            return;
        }
        const split = functionName.split(SEPARATOR);
        const [identifier, name] = split;

        element.addEventListener(`keydown`, function (event) {
            if (event[eventName] !== identifier) {
                return;
            }
            functions[name](event);
        }, false);
        preventDefault();
    },
};
