import * as d from "../../../source/dom99.js";
import { move } from "../../../plugins/move/move.js";

const todos = [{
    text: `Make a todo list`,
}];

const updateTodos = (todos) => {
    d.feed({
        allToDos: todos,
        count: todos.length,
    });
};

Object.assign(d.functions, {
    add() {
        const text = d.get(`todoText`);
        if (!text) {
            return;
        }
        todos.push({ text });
        updateTodos(todos);
        d.feed(`todoText`, ``);
    },
    delete(event) {
        const scope = d.scopeFromEvent(event);
        const index = d.leafIndex(scope);
        todos.splice(index, 1);
        updateTodos(todos);
    }
});

d.feed({
    allToDos: todos,
    todoText: ``,
});
updateTodos(todos);
d.plugin(move);
d.start();
window.d = d;
