Use a polyfill

<script src="polyfill.min.js"></script>

Using modernizr to prevent programs with undefined behaviours to run is a good idea. https://modernizr.com/

##Use dom99Possible in an if statement to decide if you want to run DOM99 or not

var dom99Possible = (Object.defineProperty && Object.freeze && window.document);//can test more

##Also

<template>

should be invisible and inert. Use normalize.css or

    [hidden],
    template {
      display: none;
    }