# Adds a shake event

## How to use ?

### HTML
```
<body data-function="shake-deviceShaked">
```

### JS

```
import d from "./node_modules/dom99/built/dom99Module.js";
import {shake, shakeSupport} from "./node_modules/dom99/plugins/shake/shake.js";

d.plugin(shake);

d.functions.deviceShaked = function (event) {
    // do something
};

d.start();
```
