export {move};

const CUSTOM_EVENT = `move`;
const SEPARATOR = `+`;

const move = {
    type: `function`,
    plugin: function (element, eventName, functionName, functions, preventDefault) {
        let [keyCode, name] = functionName.split(SEPARATOR);
        if (eventName !== CUSTOM_EVENT) {
            return;
        }
        keyCode = Number(keyCode);

        element.addEventListener(`keydown`, function (event) {
            console.log(event, keyCode, event.keyCode);
            if (event.keyCode !== keyCode) {
                return;
            }
            functions[name](event);
        }, false);
        preventDefault();
    }
};
