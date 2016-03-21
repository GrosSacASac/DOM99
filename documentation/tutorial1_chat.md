#Tutorial simple chat client

##General Template Usage

For good reasons, it is not possible to write JavaScript in your Markup. You cannot write for-loops in the markup. However you can encapsulate Markup generation instructions in a function and you can call that function in a loop. How to clone a template and populate it with data once:

  <body>
    <template data-el="templateName">
        <div data-el="SemanticName">
            <p data-vr="text" ></p>
            <img data-el="foto" >
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
    D.el["scopeName"]["foto"].src = "visual.jpg";
    
    // 3 insert the clone in the DOM
    D.el["target"].appendChild(clone);
    
    
How to reuse the template multiple times, and how to change the injected markup. (Do not rerender everything)


  <body>
    <template data-el="templateName">
        <div data-el="SemanticName">
            <p data-vr="text" ></p>
            <img data-el="foto" >
        </div>
    </template>
    ...
    <div data-el="target"></div>
    </body>
    
    // JS
    
    const updateData = function(data, scopeName) {
        D.vr[scopeName]["text"] = data.text;
        D.el[scopeName]["foto"].src = data.fotoSrc;
    };
    
    const injectMarkupWithData = function(data, scopeName) {
        // 1 create clone and execute directives
        let clone = D.templateRender( "templateName", scopeName );
        
        // 2 populate the clone with any data and more
        updateData(data, scopeName)
        
        // 3 insert the clone in the DOM
        D.el["target"].appendChild(clone);
    };
    
    // first time
    injectMarkupWithData({text:"blabla", fotoSrc:"fotoUrl..."}, "1");
    injectMarkupWithData({text:"blabla 2", fotoSrc:"other/fotoUrl..."}, "2");
    
    //later when an event occurs we can change with
    updateData({text:"new bla", fotoSrc:"new foto url"}, "1");
    
##A concrete example: making a chat client

 * 10 last messages viewable
 * each message is displayed with author name and foto
 * we can type new messages
 * The server side part is out of scope for this tutorial
 * We create 2 fake users

###Define our visible elements

####The chat

An ordered list `<ol>` that will contain all the messages. `data-el="messagesContainer"` to have direct access with `D.el["messagesContainer"]` A `<textarea>` to write. And A `<button>` to send.

    <div data-el="chat">
        <ol data-el="messagesContainer">
        
        </ol>
        <textarea data-el="textarea" data-vr="currentMessage" autofocus></textarea>
        <button data-fx="click-trySendMessage">Send !</button>
    </div>
    
####The message template

the text, author and foto

    <template data-el="messageTemplate">
        <!-- Everything here has its own scope  -->
        <li data-el="message">
            <div>
                <span data-vr="authorName" ></span>
                <img data-el="authorFoto">
            </div>
            <p data-vr="messageText" ></p>
        </li>
    </template>
    
###Define our functions to display new messages

`data` is an object containing information about the message. The server-side can send data objects. The scope `nameName` is used to separate the different template clones that otherwise share the same `data-vr` and `data-el`. 

    const updateMessageElement = function(data, scopeName) {
        D.vr[scopeName]["authorName"] = data.authorName;
        D.el[scopeName]["authorFoto"].src = data.authorFoto;
        D.vr[scopeName]["messageText"] = data.messageText;
    };

    const renderNewMessageElement = function(data, scopeName) {
        // 1 create clone and execute directives
        let clone = D.templateRender( "messageTemplate", scopeName );
        
        // 2 populate the clone with any data and more
        updateMessageElement(data, scopeName)
        
        // 3 insert the clone in the DOM
        // to this at the end to improve performance
        D.el["messagesContainer"].appendChild(clone);
    };

###Handle the limit of messages displayed (10)

There are many ways to achieve this, when a new message comes:

 * After 10 messages, remove the oldest message and create a new message
 * After 10 messages, rotate the oldest message and overwrite its content with the new data
 * ...
 
###details coming soon

[Finished Chat demo](http://rawgit.com/GrosSacASac/DOM99/master/examples/chat.html) 