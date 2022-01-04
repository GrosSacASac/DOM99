# keyboard.js


is a shortcut for making keyboard shortcuts


## How to use ?

There are two data points: The .key property and the .code property:

 * Use key when you want a character to be pressed
 * Use code when you want an usual keyboard location to be pressed (for example for directional keys)


[See what code you need](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)

### HTML

Add `tabindex` for html elements which are not naturally focusable

```html
<body 
    data-function="key+ArrowLeft-moveLeft key+ArrowRight-moveRight"
    tabindex="0"
>
<!-- Will always be the key at the top left no watter what keyboard type is used-->
<div data-function="code+KeyQ-throw" tabindex="0"></div>
<!-- Use the key here, so that it works for both NumpadEnter and regular Enter
No needd to use tabindex here sincec textarea can already capture input -->
<textarea data-function="key+Enter-sendMessage"></textarea>
```

Separate with space to have multiple shortcuts.

### JS

```js
// import d
import {keyboard} from "dom99/plugins/keyboard/keyboard.js";

d.plugin(keyboard);

d.functions.moveLeft = function (event) {};
d.functions.moveRight = function (event) {};
d.functions.throw = function (event) {};
d.functions.sendMessage = function (event) {};

d.start();
```

Those function can be called a lot in a short amount of time. Make sure to use throttled function if necessary.
