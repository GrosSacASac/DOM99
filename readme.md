#DOM99

##What is DOM99 ?

DOM99 is a framework to ease the interaction between the HTML/DOM and your program. You can preselect DOM nodes, add event listeners and synchronize UI and JavaScript variables very easily and conveniently. It is very beginner friendly yet powerful and ultra fast. DOM99 is written in JavaScript ES2015 edition. The source file is small.

##Some Alternatives comparisons

###Angular.js
Angular.js also uses custom attributes in HTML elements for declarative bindings. Angular is a heavier framework with more features but also a much higher learning curve which is often criticized whereas DOM99 can be learned in less than 15 minutes. Angular can be slower, and has some edge cases you should know about. It forces you to organize your code in a certain way, DOM99 can be included very easily in any project. Angular is more popular and been tested with older browsers too.

###React
You typically want to learn JSX, a JavaScript extension syntax with React. React also lets you define custom element that you can later populate(feature in progress for DOM99) with data and gracefully inject it in the DOM. React and DOM99 focus on the View ; the UI : both let you have a clean application architecture. React is in a way safer for the average developer because it encourages one way data movement, it can be easier to reason about to what happens. React has a linear learning curve which is nice. There is also react native, a side project for writing native phone application using React.

###jQuery
jQuery is large library of functions that can very well be used alongside DOM99. However it doesn't make sense to use both for node selection, DOM manipulation etc. jQuery is used in an imperative manner, as opposed to react, Angular and DOM99 that use declarative models. Imperative programming is very easy to understand, but makes it less obvious to how organize code in a clean way. Declarative, especially for UI is quite handy and lets you collaborate easier with designers who know little about programming. jQuery is the most solid choice if you target old browser.

###Others
There are many other projects that will help you write client side applications. All have their advantages/problems. It will take you weeks/month maybe even years to browse them all and compare them. You have to make a choice at some point.

##History

The first version of DOM99 was created by Cyril Walle (GrosSacASac) in late 2015 for JavaScript teaching purposes to people with a designer background. It was easy to let them play with their first functions and see result on the web page just by assigning the result in a JS variable. It took away all the headaches about DOM manipulation. It was written in ES2015 code and transpiled to ES5.

In march 2016 I decided to share DOM99 after heavy code changes on Github and NPM in its own repository instead of some sub-folder in some other project.


##How to use DOM99 ?

###The HTML

DOM99 will browse the DOM and react if an element has one of the following attributes

* data-99-var :  data binding between DOM element and js variable
* data-99-node : pre-selecting a node for later usage
* data-99-bind : adds an event listener to that element

Examples:

    <input data-99-var="b" type="text">
    <nav data-99-node="myNav">Navigation Links</nav>
    <button data-99-bind="click-deleteFoto">Delete Foto</button>
            
The general syntax is 

`<tag data-99-Keyword="details" > bla bla </tag>`

###In your JavaScript code

    //Start by requiring dom99 (you may need browserify)

    const dom99 = require('./dom99.js');

    //Store your functions in the dom99.fx object

    dom99.fx.functionName = aFunction;

    //For example aFunction would be called if you click this button
    //<button data-99-bind="click-functionName">Action</button>
    //Note data-99-bind="click-__functionName__" and not data-99-bind="click-__aFunction__"

    //to start using dom99

    dom99.linkJsAndDom(); 

    //Now <button data-99-bind... and others are live !

    //To change a shared variable

    dom99.vars.talkings = "Hi";

    //Changes the text of this paragraph and all other nodes that share the variable talkings
    //<p data-99-var="talkings"></p>
    //Use <input> elements for two way data bindings

    //To use a preselected node

    dom99.nodes.bigTitle //the node, we can do what we want with it
    dom99.nodes.bigTitle.remove(); //for instance remove the bigTitle node

    //will remove <h1 data-99-node="bigTitle">You can remove me to make space</h1>

You are ready to use DOM99 ! 
    
##Demo file:

index.html and main.js

[Open demo](http://rawgit.com/GrosSacASac/DOM99/master/index.html)

##Known issues:

having data-99-var="x" and data-99-bind="keyup,click-functionThatUsesX" can have the funtion use the old x value then updating x. This will soon be updated.

##Details

You can handle new HTML with `DOM99.linkJsAndDom(startNode);`. Already processed nodes won't be affected at all because the ☀ is added to the attribute value after that.

###Additional Explanations to understand dom99.js file

varListeners contains arrays of nodes , each array contains all nodes
that listen to the same variable. 

If you have this in your document <input data-99-var="a">

--> you can then use vars.a or vars["a"] in dom99.js

--> you can then use dom99.vars.a

or dom99.vars.["a"] in your js
    
    
all assignments will be reflected in the document


If you have this in your document <div data-99-node="box1"></div>


--> you can then use nodes.box1 or nodes["box1"]


it is basically a short cut for getElementBy...()
  



custom attribute names must start with "data-" see
https://docs.webplatform.org/wiki/html/attributes/data-*

##License

MIT
