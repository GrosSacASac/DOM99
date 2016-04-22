https://modernizr.com/

Using modernizr to prevent programs with undefined behaviours to run is a good idea.

##Use dom99Possible in an if statement to decide if you want to run DOM99 or not

var dom99Possible = (Modernizr.template && Object.defineProperty && Object.keys && Object.assign && Object.freeze && Array.isArray && window.document && Symbol);

##Also
<template>

should be invisible and inert. Use normalize.css or

    [hidden],
    template {
      display: none;
    }