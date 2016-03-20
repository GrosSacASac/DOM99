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
 
[Chat demo](http://rawgit.com/GrosSacASac/DOM99/master/examples/chat.html) 