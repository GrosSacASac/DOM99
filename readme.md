<h1>dom99</h1>

[![npm bundle size minified + gzip](https://img.shields.io/bundlephobia/minzip/dom99.svg)](https://bundlephobia.com/result?p=dom99)
[![npm](https://img.shields.io/npm/v/dom99.svg)](https://www.npmjs.com/package/dom99)
[![Chat on Miaou](https://miaou.dystroy.org/static/shields/room-en.svg?v=1)](https://miaou.dystroy.org/2813?dom99)

<hr>

## What is dom99 ?

dom99 is a JavaScript framework focused to make web development faster. Select HTML elements, add event listeners, synchronize state with the view, clone HTML templates with your data and insert it directly in the document.


## Installation

[npm install dom99](https://www.npmjs.com/package/dom99)


## Basic Use

### Data-binding

```
<!-- The input and the paragraph as well as the js variable always have the same value -->

<input data-variable="text">
<p data-variable="text"></p>

<script>
    d.feed({text : "Hello dom99"});
    d.activate();
    console.log(d.variables.text);
</script>
```


##  [Changelog](https://dom99.now.sh/documentation#timeline)

## Design philosophy



### Optimized for page-load

By default dom99 is optimized for first page load, that means the size is small.


### HTML for mark-up, JS for logic

Get up an running fast. dom99 does not attempt to invent for the n<sup>th</sup> time how to write <code>if</code> statements and <code>for</code> loops inside HTML. Put logic in JS, and mark-up that you already know in HTML.


### Separation of concerns

Designers and Developers can work on the same files. Elements in the mark-up linked to the DOM use `data-*` instead of the overused `class` and `id`. The benefits to this approach is that the developers can safely add data-attributes to stylized components without breaking the styles, and the designers can safely add `classes` and `ids` without breaking anything.


### Easy to learn

Get up an running fast.  [Documentation](https://dom99.now.sh/documentation) Use a [premade starter pack create-dom99-app](https://github.com/GrosSacASac/create-dom99-app/).


### Work with the Web platform

dom99 is a web framework and is an extension to web standards HTML, CSS and JS, and does not intent to be a replacement.


### Zero-second compile time

dom99 can be used in a zero-second compile time development set-up with ES-modules.


### Avoiding leaky abstractions

No virtual dom is used for maximum **possible** performance. [Explanation from chrismorgan about DOM and VDOM](https://news.ycombinator.com/item?id=15957517).


### Unopinionated

dom99 is unopinionated and bigger frameworks can be built on top of it. That means you can chose your own architecture, state management system, CSS system etc


## [Complete Documentation](https://dom99.now.sh/documentation)


Locally found in [./documentation/documentation.html](./documentation/documentation.html)


## Examples

[Graphs](https://github.com/GrosSacASac/graphs)


### [HTML Composition](https://dom99.now.sh/documentation#Composition)

```
<!--
Define the template for an user
every user has a picture, a short biography, and a contact button
-->
<template data-template="user-element">
    <img data-variable="picture">
    <p data-variable="bio">SHORT BIO</p>
    <button>Contact</button>
</template>

<!--
The list variable name is "users" and the template used is "user-element"
native html elements can also be used to display a list
-->
<div data-list="users-user-element"></div>
<script type="module">
    import * as d from "./node_modules/dom99/built/dom99ES.js";

    d.feed({users :
        [
            {
                picture: "usera.jpg",
                bio: "Loves biking and skating"
            },
            {
                picture: "userb.jpg",
                bio: "Drinks tons of café."
            }
        ]
    });
    d.activate();
</script>
```

<details>
<summary>HTML Result</summary>
<pre><code>

&lt;div data-list=&quot;*users-user-element&quot;&gt;&#10;    &lt;img data-variable=&quot;*picture&quot; alt=&quot;user-picture&quot; src=&quot;usera.jpg&quot;&gt;&#10;    &lt;p data-variable=&quot;*bio&quot;&gt;Loves biking and skating&lt;/p&gt;&#10;    &lt;button&gt;Contact&lt;/button&gt;&#10;&#10;    &lt;img data-variable=&quot;*picture&quot; alt=&quot;user-picture&quot; src=&quot;userb.jpg&quot;&gt;&#10;    &lt;p data-variable=&quot;*bio&quot;&gt;Drinks tons of caf&eacute;.&lt;/p&gt;&#10;    &lt;button&gt;Contact&lt;/button&gt;&#10;&lt;/div&gt;
</code></pre>
</details>

[Other examples](./examples)


## Discussion


[![Chat on Miaou](https://miaou.dystroy.org/static/shields/room-en.svg?v=1)](https://miaou.dystroy.org/2813?dom99)


[Issues reports](https://github.com/GrosSacASac/DOM99/issues)


## Contributing

[Contributing and things to do](CONTRIBUTING.md)

## Dev

`npm run buildAll` to run all scripts in package.json in one go

open tests/specification/SpecRunner.html to run unit tests

## License

[Boost License](./LICENSE.txt)
