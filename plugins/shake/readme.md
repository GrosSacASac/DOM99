# Adds a shake event

## How to use ?

### HTML
```
<body data-function="shake-deviceShaked">
```

### JS

```
// import d
import {shake, shakeSupport} from "dom99/plugins/shake/shake.js";

d.plugin(shake);

d.functions.deviceShaked = function (event) {
    // do something
};

d.start();
```
