#readTextFile.js

##API

readTextFile (function)

##Description

readTextFile allows to get a string from an user chosen file. readTextFile() returns a Promise.
A top level <div data-element="readTextFileContainer"></div> is required

See readTextFileExample.html for a minimal example

##Motivation

The `<input type="file">` can be used to load data from the disk and send it to server very conveniently. However there is no simple way to process the data of the file locally before. readTextFile solves this problem

##Limitations

Poor browser support: Requires ES2015, Promises, FileReader and complete <input type="file">