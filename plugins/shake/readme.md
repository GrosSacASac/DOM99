# Adds a shake event

## How to use ?

### HTML
```
<body data-function="shake-deviceShaked">
```

### JS

```
import * as d from "./node_modules/dom99/source/dom99.js";
import {shake, shakeSupport} from "./node_modules/dom99/plugins/shake/shake.js";

plugin(shake);

d.functions.deviceShaked = function (event) {
    // do something
};

d.start();
```
