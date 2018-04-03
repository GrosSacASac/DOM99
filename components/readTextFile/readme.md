# readTextFile.js

## API

readTextFile

## Description

readTextFile allows to get a string from an user chosen file. readTextFile() returns a Promise.
A top level <div data-element="readTextFileContainer"></div> is required. It will contain the `<input type="file">`

See readTextFileExample.html for a minimal example

## Usage

```
import d from "../../built/dom99Module.js";
import {readTextFile} from "./readTextFile.js";


d.activate();

readTextFile().then(function (value) {

}).catch(function (reason) {

});
```

## Motivation

The `<input type="file">` can be used to load data from the disk and send it to server very conveniently. However there is no simple way to process the data of the file locally before. readTextFile solves this problem

## Limitations

Requires Promises, FileReader and complete <input type="file">
