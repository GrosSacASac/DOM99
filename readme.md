![DOM99](images/visual.png)

##What is DOM99 ?

DOM99 is a JavaScript framework to ease the interaction between the HTML and your program. You can preselect DOM nodes, add event listeners and synchronize UI elements and JavaScript variables, populate HTML templates with data and insert it in the document. You can also build the HTML with custom elements.[Try the intro playground](http://jsbin.com/migeya/11/edit?html,js,output)

##Why use DOM99 ?

DOM99 encourages you to link the UI and the logic declaratively. DOM99 naturally promotes to put only markup in HTML, only styling in CSS, and only logic in JS, instead of mixing things up. DOM99 makes no assumption about the logic code base architecture. DOM99 is fast, the source file is small (about 4KB minified), has no external dependency and is written respecting modern ES2015 and HTML5 standards. DOM99 is simple by design. You can learn how to use DOM99 in less than 15 minutes.
 
Also if you want to teach people JavaScript, without having to spend too much time explaining the gimmicks of the native DOM interface, DOM99 is for you. It is very beginner friendly yet powerful.

##Limitations

 * Old IE browser may not support the `<template>` element natively.

##How to use DOM99 ?

###The Basics

###In your HTML:

DOM99 will browse the DOM and react if an element has one of the following attributes

 * data-vr : **vr for variable**: data binding between DOM element and js variable
 * data-el : **el for element**: pre-selecting an element for later usage
 * data-fx : **fx for function** adds an event listener to that element
 * data-scope: (advanced) **scope for scope name** adds the linked template copy at load time


Examples:

    <input data-vr="b" type="text">
    <nav data-el="myNav">Navigation Links</nav>
    <button data-fx="click-deleteFoto">Delete Foto</button>
    <d-magicbutton data-scope="1"></d-magicbutton>      
    
The general syntax is 

`<tag data-99-Keyword="details" > bla bla </tag>`

If you are not using browserify you need to include this script tag in your html **before** other scripts that access dom99.

    <script src="js/dom99.js"></script>
    <script src="js/yourJavascriptFile.js"></script>
    


###In your JavaScript:

    //Use a shorter name
    const D = dom99;
    //to start using dom99 use this statement
    D.linkJsAndDom(); 

    
Store your functions in the D.fx object


    D.fx.functionName = aFunction;

aFunction is called when you click this button

    <button data-fx="click-functionName">Action</button>
    //Note we wrote functionName not aFunction


To changes the text of `<p data-vr="talkings"></p>` and all other element that share the variable talkings


    D.vr.talkings = "Hi";

Use the same data-vr="talkings" on `<input>` elements for two way data bindings


To use a preselected element

    D.el.bigTitle //An element reference, we can do what we want with it
    D.el.bigTitle.remove(); //for instance remove the bigTitle node

will remove `<h1 data-el="bigTitle">You can remove me to make space</h1>`

To compose html with predefined building blocks.

    <template data-el="commentTemplate-d-comment">
        <p data-vr="text">A comment</p>
        <datetime data-vr="date">06/04/2016</datetime>
    </template>

    <d-comment data-scope="first"></d-comment>
    <d-comment data-scope="second"></d-comment>
    
To edit a comment at run time do this:

    D.vr["first"].text = "A new comment";
    
    
    
You are ready to use DOM99 ! 
   
   


##Demo file:

Demoes use the transpiled dom99 file. (Tested with Firefox 47+ and Chrome 48+)

[Basic demo](http://rawgit.com/GrosSacASac/DOM99/master/index.html) 

[Chat demo](http://rawgit.com/GrosSacASac/DOM99/master/examples/chat.html) 

[Chat demo explanations](documentation/tutorial1_chat.md) 


##Complete overview

    
###Start with 

    const D = dom99;
    // creates an alias
    D.linkJsAndDom();
    
This will look the for DOM99 directives in the document tree.

Initialize variables with `D.vr.yourtarget = ...;`. Next store event listener functions in `D.fx`. You can use nodes references in `D.el`.

###Use HTML templates, it is healthy

There are 2 ways to use HTML templates

 * Static Load time template rendering with custom elements
 * Run time template rendering and insertion
 
Both ways are **complementary** and use the same core ideas. To illustrate this imagine you want to have a web page with an article and comments. When the page loads you want to display the article and already display the 2 last comments, later when the user scrolls down or clicks a button to show more comments we load more comments into the page. We here define a comment as some text and a date. What we want initially is something like this


    <html>

        <article>
            <p>...</p><p>...</p>
        </article>
        
        <!-- a comment is some text and a date -->
        <template data-el="commentTemplate-d-comment">
            <p data-vr="text"></p>
            <datetime data-vr="date"></datetime>
        </template>
        
        <d-comment data-scope="comment1"></d-comment>
        <d-comment data-scope="comment2"></d-comment>
        
        <button data-fx="click-showNextComment">Show more comments</button>

    </html>

    Note: `<d-comment>` is a valid custom element, `<comment>` is not.

Our initial JS code looks like this    

    "use strict";
    const D = dom99;

    D.fx.showNextComment = function(event) {
        ;//todo
    };

    let commentsData = {
        comment1: {
            text: "I am the first to comment, well written! Bravo!",
            date: "In the year 2016"
        },
        comment2: {
            text: "I really appreciate your work",
            date: "just now" 
        }
    };

    // we could also manually assign every property in a complicated for loop
    Object.assign(D.vr, commentsData);

    D.linkJsAndDom();
    
[Try templates1.html static template injection](http://rawgit.com/GrosSacASac/DOM99/master/examples/templates1.html) 
[Try templates2.html static+dynamic template injection](http://rawgit.com/GrosSacASac/DOM99/master/examples/templates2.html) 

under construction ...

####Short overview over dynamic template injection

    <body>
    <template data-el="templateName">
        <div data-el="SemanticName">
        
            <p data-vr="text" ></p>
            Any HTML ...
        </div>
    </template>
    ...
    <div data-el="target"></div>
    </body>
    
    // JS
    // 1 create clone and execute directives
    let clone = D.templateRender( "templateName", "scopeName" );
    
    // 2 populate the clone with any data and more
    D.vr["scopeName"]["text"] = "Anything I want";
    
    // 3 insert the clone in the DOM
    D.el["target"].appendChild(clone);
    
    // or 
    
    // 1 create HTML ELement
    let customElement = D.createElement2(customElementDescription);
    
    // 2 feed data in D.vr 
    // 3 link it
    D.linkJsAndDom(customElement);
    
    // 4 insert the Element that has a clone as a child in the DOM
    D.el.commentSection.appendChild(customElement);
    
####The details
    
If you have a `<template>` in your page, it is inert and not rendered. However the template itself with a `data-el` can be used to create copies of the content of the template. These copies can be inserted in your document. To do that use `D.templateRender(templateName, scopeName)` where `templateName` is the name of the template you found in `data-el`, the second is a scope name. That scope name is useful for dynamic templates, templates that have DOM99 directives inside.


    let clone = D.templateRender( "templateName", "scopeName" );

The `clone` here is the copy of the Document Fragment of the template. All DOM99 directives inside, have been applied under the scope name. You can now use all the techniques described above (`D.vr D.el D.fx`) by going in the correct scope:
  

    D.vr["scopeName"]["text"] = "A string"
    D.fx["scopeName"]["functionText"] = function(event) {...};
    D.el["scopeName"]["myElementIWantToChangeClassNameForInstance"].className = ...

The clone is not yet in the document itself. I recommend putting the Fragment in the document last to improve performance. To do that use the appendChild interface on a node that is in the Document. Here we have `<div data-el="target"></div>`. It doesn't need to be a `div`. Use whatever fits semantically and functionally the best for a container.
  
    D.el["target"].appendChild(clone);

At this point you should not need `clone` any more. Use the topmost element node instead. 

If a some point your program continuously uses `D.templateRender` and later `D.el["scopeName"].ElementName.remove()`, without reusing anything inside the `D.el["scopeName"]` then consider using `D.forgetScope("scopeName");` to avoid memory leaks. Read more about it in the comments of the dom99.js file. You may also consider reusing rendered template copies.

###Additional tips


You can handle new HTML with `D.linkJsAndDom(startNode);`. Already processed elements won't be affected at all because the ☀ is added to the attribute value after that.

If you accidentally made a mistake, open your console, warnings may give you clues.

You can add a class to your app element container like "not-ready". Then in your css display that .not-ready with a loading animation. Once you have initialized everything you can remove the "not-ready" class name.

You can change the DOM99 syntax. To do that follow the instructions in js/dom99ConfigurationExample.js

##Performance

###General Tips


In short: Rendering and painting the DOM is slow, JavaScript itself is fast. Simply changing a class name of an element can cause the browser to do heavy computation under the hood. For very simple programs, performance may not be an issue at all.

 * Avoid Document Object Model (DOM) Access in big loops
 * Instead compute the result in your loop first, then assign the final result to the DOM
 * Avoid read/write alternations with the DOM
 * Instead chain reads, then chain writes 
 * Use callbacks or Promises or equivalent for future events (example XMLHttpRequest), never block !
 * If you have more performance issues, profile first to know what is the cause
 * If you need to do heavy computation, consider using Web Workers
 * [More tips](https://docs.webplatform.org/wiki/tutorials/speed_best_practices)
 * [Even more tips](http://www.html5rocks.com/en/features/performance)



###How is DOM99 fast ?

 * Load time element selection and binding instead of runtime element selection and binding 
 * The abstraction layer is small, no assumptions are made
 * No complexity, no dirty checking, no separate model under the hood
 


##Downloads:

If you target older browsers, I recommend the transpiled version. Direct download (right click, save file as ...) 

 * [Development ES2015 with debug console.warn messages dom99.js](https://raw.githubusercontent.com/GrosSacASac/DOM99/master/js/dom99.js)
 * [Production transpiled ES5, minified dom99.es5.min.js](https://raw.githubusercontent.com/GrosSacASac/DOM99/master/js/dom99.es5.min.js)

 
or with npm

 * `npm install dom99`

##Known issues:

All previously known issues are fixed now. Clear.

##Security

###General tips

 * Don't BlackList, Aggressively White-list
 * Don't mix data with code, use parameter injection with proper escaping and encoding
 * Don't trust what you don't control, validate size and format instead
 * Every software component should be so simple that it is obviously safe
 * Avoid complexity
 * Aggressively block if some behaviours are undefined
 * Talk with security experts
 
###DOM99 and security

DOM99 itself is secure. It does nothing by itself really. It is only a framework to organize your view. `D.vr` uses textContent or value by default. 

If you apply the general tips above you know that you have to check if the clients browser have all features you need to run your software before running it. You also validate input on the server etc, etc. There are tons of blogs about security out there.

###Transpile to ES5 yourself


  1. Download node.js at https://nodejs.org/en/
  2. Open the node.js command prompt and go in the directory with the dom99.js file
  3. Download Babel, find out how at http://babeljs.io/docs/usage/cli/.
  4. Use this command `babel js/dom99.js --compact true --remove-comments -o js/dom99.es5.compact.js
  5. Now use dom99.es5.compact.js in your production.

##Some alternatives comparisons with Contras, Pros and some similarities

###Angular.js

Pro:

  * More features
  * Easily Testable
  * More browser compatibility
  
Contra:

  * Learning curve: wall
  * Forced to organize code base in the Angular MVC way
  * Logic in Markup
  * Heavy components for simple UIs
  * Heavier
    
Some similarities:

  * Declarative Markup
  * Shared variables are normal js objects


###React

Pro:

  * Easier to understand what is happening in large code bases
  * React native (still a thing ?)
  * More browser compatibility
  
Contra:

  * Encouraged to use JSX, a JavaScript extension syntax
  * Can be hard to understand how and why to use react
  * Forced V-V model
    
Some similarities:

  * Elegantly populate templates with data 
  * Focus on the view
  * Simple by design
 

###jQuery

Pro:

  * Imperative instructions are easy to understand
  * Beginner friendly
  * Best old browser compatibility
  * Also a non-UI library
  * One of the best things that happened in the Web Platform
  
Contra:

  * Not obvious how organize large code in a clean way
  * Can do almost everything as easily with browser APIs nowadays
    
Some similarities:

  * Freedom
  * Can be used alongside other JavaScript view frameworks
  * Simple


###Others

There are many other projects that will help you write client side applications. All have their advantages/problems. It will take you weeks/month maybe even years to browse them all and compare them. You have to make a choice at some point.

##History

The first version of DOM99 was created by Cyril Walle (GrosSacASac) in late 2015 for JavaScript teaching purposes to people with a designer background. It was easy to let them play with their first functions and see result on the web page just by assigning the result in a JS variable. It took away all the headaches about DOM manipulation. It was written in ES2015 code and transpiled to ES5.

In march 2016 I decided to share DOM99 after heavy code changes on Github and NPM in its own repository instead of some sub-folder in some other project.

##Future

###What is coming soon:


 * System improvements
 * Automated test
 * Easier to use
 * Better documentation
 * Deep HTML composition
 * API harmonization
 * Custom Element Lifecycle declaration
 * Better Support for D.vr on all elements 

###Abstract directions for the future or Specification

 * Freedom
 * Simplicity in system and usage
 * Encourage declarative UI programming models
 * Focus on the view
 
###DOM99 is not and will never be

 * Large library with all utility functions
 * Simplified API for client-server communication
 * A replacement for what CSS does

This leaves more freedom to combine DOM99 with the other needs. I encourage you to use simplified APIs for client-server communication alongside DOM99 and anything else that is complementary to accelerate the development process.

###Discussion

####Chat

https://dystroy.org/miaou/3

####Issues reports

https://github.com/GrosSacASac/DOM99/issues

##License

https://opensource.org/licenses/MIT
