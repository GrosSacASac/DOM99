import * as d from "../../../source/dom99.js";
import {move} from "../../../plugins/move/move.js";

const todos = [{
    text: `Make a todo list`,
}];

Object.assign(d.functions, {
    add() {
        todos.push({text: d.get(`todoText`)});
        d.feed(`allToDos`, todos);
        d.feed(`todoText`, ``);
    },
    delete(event) {
        const scope = d.scopeFromEvent(event);
        console.log(scope);
    }
});

d.feed({
    allToDos: todos,
    todoText: ``,
});
d.plugin(move);
const options = {
    firstVariableValueStrategy: d.FIRST_VARIABLE_FROM_USER_AGENT
};
d.start();
window.d = d;