export { move };

const CUSTOM_EVENT = `move`;
const SEPARATOR = `+`;

const move = {
    type: `function`,
    plugin: function (element, eventName, functionName, functions, preventDefault) {
        if (eventName !== CUSTOM_EVENT) {
            return;
        }
        const split = functionName.split(SEPARATOR);
        let [keyCode] = split;
        const [, name] = split;
        keyCode = Number(keyCode);

        element.addEventListener(`keydown`, function (event) {
            if (event.keyCode !== keyCode) {
                return;
            }
            functions[name](event);
        }, false);
        preventDefault();
    },
};
