#yesNoDialog

##Files

* yesNoDialog.js
* yesNoDialog.css
* yesNoDialog.html

##API

yesNoDialog.yesNoDialog(question, yesText, noText)

##Description

yesNoDialog returns a promise. The promise is resolved with a boolean depending on what the user clicks. The user interface is hidden as long as there is no answer provided. question, yesText, noText are all strings. You need to include the html fragment and the css. The promise will never reject.

##Motivation

The native prompt function cannot be styled by css and blocks the main thread. prompt cannot be used with undefined behaviors in situation where you need to do computing in the background.

##Limitations

Cannot use other dom99 directives with answerYesNo, else there is a risk of variable clash. Need to include the <div class="dialog"> HTML fragment in yesNoDialog.html , see yesNoDialogExample.html. Cannot use the class Name dialog in other HTML elements. Direct child elements of the body element will not be hidden during the dialog. This is avoidable with proper div section and article usage. Can be used to display the title of application. Does not scroll back at the same scroll position. Cannot be used again before the previous yesNoDialog has been resolved.
