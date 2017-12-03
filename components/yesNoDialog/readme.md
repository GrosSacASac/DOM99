# yesNoDialog

## Files

* yesNoDialog.js
* yesNoDialog.css
* yesNoDialog.html

## Example

examples/ScrollTest.html

## How to use

    // using es modules
    import d from "./node_modules/dom99/built/dom99Module.js";
    import {yesNoDialog} from "./node_modules/dom99/components/yesNoDialog/yesNoDialog.js";

    d.activate();
    
    //...
    
    yesNoDialog(questionText, yesText, noText).then(function (answer) {
        //do something with answer (Boolean)
    });
    
## API

### JS

#### yesNoDialog

    import {yesNoDialog, textDialog} from "./node_modules/dom99/components/yesNoDialog/yesNoDialog.js";
    yesNoDialog(question, yesText, noText)


question, yesText, noText are all of type `String`.

returns a `Promise` that eventually resolves with `true` or `false`.
The promise is resolved with a boolean depending on what the user clicks.


#### textDialog

    textDialog(question, label, input, submitText)


question, label, input, submitText are all of type `String`. input represents the initial text inside the input

returns a `Promise` that eventually resolves with a `String`

### CSS

extend styling with

 * .yes-no-dialog
 * .yes-no-dialog-text 
 * .yes-no-dialog-button
 * .yes-no-dialog-input-label
 * .yes-no-dialog-input-label > span
 * .yes-no-dialog-input
 * .yes-no-dialog-input-label + button
    
## Description

You need to include the html fragment and the css. 
The rest of the user interface is hidden as long as there is no answer provided by adding a class to the body (see yesNoDialog.css). 
The promise will never reject.
It is possible to call yesNoDialog multiple times in a row even if the user is still answering previous questions.
An encapsulated queue is used to handle that.

## Motivation

The native prompt function cannot be styled by css and blocks the main thread.

## Limitations

Requires Promise implementation (ES2015). Cannot use other data-function="yesNoDialogAnswer" elsewhere. 
Need to include the provided HTML fragment in yesNoDialog.html , see examples/yesNoDialogExample.html.
Cannot use the class Name "yes-no-dialog" in other HTML elements.

Maybe obsoleted by `<dialog>` element. (Future)

## Changelog

### 3/12/2017

force correct font-size, more consistent spacing

### 28/11/2017

Avoid having to scroll in landscape on mobile. Focus and active state have more distinct colors.

### 26/10/2017

Improved display and usability on small resolutions

### 23/10/2017

CSS is now somewhat more encapsulated by using the prefix yes-no-dialog

Better default styling

Remove hidden text leak (the dialog was not reset with empty strings after use, only hidden)

added textDialog

### 20/10/2017

Better encapsulation

### 14/12/2016


 * yesNoDialog can now be used multiples times in a row even when previous ones are not answered and all promises will resolve correctly.
 
 * Scrolls back at the same scroll position as before yesNoDialog was called 


## Todo

 * Add keyboard shortcut alternative to click Yes No with Enter ESC 
 * Add alert equivalent
 * figure out if https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#Notes is an issue or not
 * add placeholder capability