# Move

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

```
<body data-function="move+37-moveLeft">
```

### JS

```
import * as d from "./node_modules/dom99/source/dom99.js";
import {move} from "./node_modules/dom99/plugins/move/move.js";

plugin(move);

d.functions.moveLeft = function (event) {
    // do something
};

d.start();
```
