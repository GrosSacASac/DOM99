#yesNoDialog

##Files

* yesNoDialog.js
* yesNoDialog.css
* yesNoDialog.html

##How to use

    //requires browserify
    const D = require("dom99");
    const yesNoDialog = require("dom99/components/yesNoDialog/yesNoDialog.js").yesNoDialog;

    D.linkJsAndDom();
    
    //...
    
    yesNoDialog(questionText, yesText, noText).then(function (answer) {
        //do something with answer (Boolean)
    });
    
##API

yesNoDialog.yesNoDialog(question, yesText, noText)

question, yesText, noText are all strings.

returns a promise

##Description

The promise is resolved with a boolean depending on what the user clicks. The rest of the user interface is hidden as long as there is no answer provided by adding a class to the body(see yesNoDialog.css). question, yesText, noText are all strings. You need to include the html fragment and the css. The promise will never reject. It is possible to call yesNoDialog multiple times in a row even if the user is still answering previous questions. An encapsulated queue is used to handle that.

##Motivation

The native prompt function cannot be styled by css and blocks the main thread.

##Limitations

Requires Promise implementation (ES2015). Cannot use other dom99 directives with the string "answerYesNo", else there is a risk of variable clash. Need to include the <div class="dialog"> HTML fragment in yesNoDialog.html , see examples/yesNoDialogExample.html. Cannot use the class Name "dialog" in other HTML elements. Direct child elements of the body element will not be hidden during the dialog. This is avoidable with proper div section and article usage. Can be used to display the title of application.

Maybe obsoleted by `<dialog>` element. (Future)

##Changelog


###14/12/2016


 * yesNoDialog can now be used multiples times in a row even when previous ones are not answered and all promises will resolve correctly.
 
 * Scrolls back at the same scroll position as before yesNoDialog was called 
