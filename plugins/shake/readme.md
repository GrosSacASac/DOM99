# Adds a shake event

## How to use ?

### HTML
```
<body data-function="shake-deviceShaked">
```

### JS

```
import {d, plugin, options, createElement2} from "./node_modules/dom99/source/dom99.js";
import {shake, shakeSupport} from "./node_modules/dom99/plugins/shake/shake.js";

d.plugin(shake);

d.functions.deviceShaked = function (event) {
    // do something
};

d.start();
```
