#Tutorial simple chat client

... = needs to be rewritten (check chat.js and chat.html for now)


##General Template Usage

For good reasons, it is not possible to write JavaScript in your Markup. You cannot write for-loops in the markup. However you can encapsulate Markup generation instructions in a function and you can call that function in a loop. In your JavaScript. How to clone a template and populate it with data once:

  ...
    
How to reuse the template multiple times, and how to change the injected markup. (Do not rerender everything)

...

##A concrete example: making a chat client

 * 10 last messages viewable
 * each message is displayed with author name and foto
 * we can type new messages
 * The server side part is out of scope for this tutorial
 * We create 2 fake users

###Define our visible elements

####The chat

An ordered list `<ol>` that will contain all the messages. `data-element="messagesContainer"` to have direct access with `D.el["messagesContainer"]` A `<textarea>` to write. And A `<button>` to send.


    
####The message template

the text, author and foto

...
    
###Define our functions to display new messages

`data` is an object containing information about the message. The server-side can send data objects. The ... is used to separate the different template clones that otherwise share the same `data-variable` and `data-element`. 

...

###Handle the limit of messages displayed (10)

There are many ways to achieve this, when a new message comes:

 * After 10 messages, remove the oldest message and create a new message
 * After 10 messages, rotate the oldest message and overwrite its content with the new data
 * ...
 
###details coming soon

[Finished Chat demo](http://rawgit.com/GrosSacASac/DOM99/master/examples/chat.html) 