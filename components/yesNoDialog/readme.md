#yesNoDialog

##Files

* yesNoDialog.js
* yesNoDialog.css
* yesNoDialog.html

##API

yesNoDialog(question, yesText, noText)

##Description

yesNoDialog returns a promise. The promise is resolved with a boolean depending on what the user clicks. The user interface is hidden as long as there is no answer provided. todo ... See example

##Motivation

The prompt function cannot be styled by css and blocks the main thread

##Limitations

**First draft**, cannot use other directives with answerYesNo, else there is a risk of variable clash. Need to include the <div class="dialog"> HTML fragment also, see yesNoDialog.html