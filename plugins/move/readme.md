# Move

Legacy: If KeyboardEvent.key is supported use the keyboard plugin instead

←
↑
→
↓

is a shortcut for listening to keydown + specific keys


## How to use ?

They keyCode has to be used:

 * 13 ENTER
 * 37 ARROW_LEFT

### HTML

Add tabindex for html elements which are not naturally focusable

```
<body data-function="move+37-moveLeft" tabindex="0">
```

### JS

```
// import d
import {move} from "./node_modules/dom99/plugins/move/move.js";

d.plugin(move);

d.functions.moveLeft = function (event) {
    // do something
};

d.start();
```
