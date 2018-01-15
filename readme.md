![DOM99](images/visual2.jpg)


## What is dom99 ?

dom99 is a JavaScript framework to ease the interaction between the HTML and your program. Declaratively select HTML elements, add event listeners and synchronize UI elements and JavaScript variables, populate HTML templates with data and insert it in the document.
You can also build the HTML with custom elements.
<!-- [Demo](http://jsbin.com/tepezuj/3/embed?html,js,output) -->

## Installation

`npm install dom99`


## Basic Use

### [Data-binding](https://cdn.rawgit.com/GrosSacASac/DOM99/master/documentation/documentation.html#Hello%20World%202)

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

### [HTML Composition](https://cdn.rawgit.com/GrosSacASac/DOM99/master/documentation/documentation.html#Composition)

```
<!-- Define the template for an user
every user has a picture, a short biography, and a contact button -->

<template data-template="user-element">
    <img alt="user-picture">
    <p>SHORT BIO</p>
    <button>Contact</button>
</template>

<!-- This div is the container for each user.
The list variable name is "users" and the template used is "user-element"
native html elements can also be used to display a list -->

<div data-list="users-user-element"></div>

<script>
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




## Design philosophy



### Optimized for page-load

By default dom99 is optimized for first page load, that means the size is small. (Under 2.5KB minified and gziped)


### HTML for mark-up, JS for logic

dom99 does not attempt to invent for the nth time how to write `if` statements and `for loops` inside HTML. Put logic in JS, and mark-up that you already know in HTML.


### Designers and coders can work on the same files

Elements in the mark-up linked to the DOM use `data-*` instead of the overused `class` and `id`. The benefits to this approach is that the js programmer can safely add data-attributes to stylized components without breaking the styles, and the designers can safely add `classes` and `ids` without breaking anything.


### Easy to learn

Get up an running fast.  [Documentation](https://cdn.rawgit.com/GrosSacASac/DOM99/master/documentation/documentation.html) Use a [premade starter pack create-dom99-app](https://github.com/GrosSacASac/create-dom99-app/).


### Work with the platform

dom99 is a web framework and is an extension to web standards HTML, CSS and JS, and does not intent to be a replacement.


### Zero-second compile time

dom99 can be used in a zero-second compile time development set-up with ES-modules. For production it is still recommended to bundle and minify files.


### Avoiding leaky abstractions

No virtual dom, no virtual events are used for maximum **possible** performance. [Explanation from chrismorgan about DOM and VDOM](https://news.ycombinator.com/item?id=15957517). The projects will have less subtle bugs that are hard to understand without understanding the framework.


### Unopiniated

dom99 is unopiniated and bigger frameworks can be built on top of it. That means you can chose your own router, state management system, etc.


## [Complete Documentation](https://cdn.rawgit.com/GrosSacASac/DOM99/master/documentation/documentation.html)

[Open](https://cdn.rawgit.com/GrosSacASac/DOM99/master/documentation/documentation.html)


Locally in /documentation/documentation.html


## Examples

[Graphs](https://github.com/GrosSacASac/graphs)

Other examples in examples/


## Discussion

[Chat](https://dystroy.org/miaou/3)

[Issues reports](https://github.com/GrosSacASac/DOM99/issues)


## Contributing

[Contributing and things to do](CONTRIBUTING.md)


## License

[Boost License](./LICENSE.txt)
