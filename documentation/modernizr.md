https://modernizr.com/

Using modernizr to prevent programs with undefined behaviours to run is a good idea.

##Complete

var dom99Possible = (Modernizr.template && Object.defineProperty && Object.keys && Object.assign && Object.freeze && Array.isArray && window.document && Symbol);