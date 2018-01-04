![DOM99](images/visual2.jpg)


## What is dom99 ?

dom99 is a JavaScript framework to ease the interaction between the HTML and your program. Declaratively select HTML elements, add event listeners and synchronize UI elements and JavaScript variables, populate HTML templates with data and insert it in the document.
You can also build the HTML with custom elements.
<!-- [Demo](http://jsbin.com/tepezuj/3/embed?html,js,output) -->

## Design philosophy

### Work with the platform

dom99 is a web framework and is built on top of web standards HTML, CSS and JS, and does not intent to be a replacement.


### Zero-second compile time

dom99 can be used in a zero-second compile time development set-up with ES-modules. For production it is still recommended to bundle and minify files.


### Avoiding leaky abstractions

No virtual dom, no virtual events are used for maximum possible performance. [Explanation from chrismorgan about DOM and VDOM](https://news.ycombinator.com/item?id=15957517). The projects will have less subtle bugs that are hard to understand without understanding the framework.


### Optimized for page-load

By default dom99 is optimized for first page load, that means the size is small.


### Unopiniated

dom99 is unopiniated and bigger frameworks can be built on top of it. That means you can chose your own router, state management system, etc.

### HTML for mark-up, JS for logic

dom99 does not attempt to invent for the nth time how to write `if` statements and `for loops` inside HTML. Put logic in JS, and mark-up that you already know in HTML.


### Designers and coders can works on the same files

Elements in the mark-up linked to the DOM use `data-*` instead of the overused `class` and `id`. The benefits to this approach is that the js programmer can safely add data-attributes to stylized components without breaking the styles, and the designers can safely add `classes` and `ids` without breaking anything.


### Easy to learn

Get up an running fast.  [Documentation](https://cdn.rawgit.com/GrosSacASac/DOM99/master/documentation/documentation.html) Use a [premade starter pack create-dom99-app](https://github.com/GrosSacASac/create-dom99-app/).

## Discussion

[Chat](https://dystroy.org/miaou/3)

[Issues reports](https://github.com/GrosSacASac/DOM99/issues)

## Contributing

[Contributing and things to do](documentation/contributing.md)

edit file js/dom99.js

`npm run` to list all commands.

`python -m http.server 8080` or `http-server` to serve static files. (use a second command prompt to be able to rebuild while serving)


## [Complete Documentation](https://cdn.rawgit.com/GrosSacASac/DOM99/master/documentation/documentation.html)

 * With cdn.rawgit.com [Open](https://cdn.rawgit.com/GrosSacASac/DOM99/master/documentation/documentation.html)
 * Locally in /documentation/documentation.html


## License

[Boost License](./LICENSE.txt)
