"use strict";

var dom99Possible = (Object.defineProperty && Object.keys && Object.assign && Object.freeze && Array.isArray && window.document && Symbol);

if (dom99Possible) {
    /*Display*/
    var D = dom99;
    D.linkJsAndDom();

    var displayHtmlJsAndResult = function(name) {
        D.vr[name].title = name;
        D.vr[name].JsSourceDisplay = D.el[name+"Js"].textContent + "\ndom99.linkJsAndDom();";
        D.vr[name].HtmlSourceDisplay = D.el[name+"Html"].innerHTML;
        D.el[name].ResultDisplay.innerHTML = D.el[name+"Html"].innerHTML;
        D.linkJsAndDom(D.el[name].ResultDisplay);
    };
    
    ["Hello World", "Hello World 2", "Multiplier"].forEach(function(name) {
        displayHtmlJsAndResult(name);
    });
    
} else {
    document.getElementById("errors").textContent = "DOM99 not supported on this browser";
}

