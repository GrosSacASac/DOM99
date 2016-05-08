"use strict";

var dom99Possible = (Object.defineProperty && Object.freeze && window.document);

if (dom99Possible) {
    /*Display*/
    var D = dom99;
    D.linkJsAndDom();
    var demoTitles = ["Hello World", "Hello World 2", "Multiplier", "Lists"];
    var displayHtmlJsAndResult = function(name) {
        D.vr[name].title = name;
        D.vr[name].JsSourceDisplay = (D.el[name+"Js"].textContent.trim() + "\ndom99.linkJsAndDom();");
        D.vr[name].HtmlSourceDisplay = D.el[name+"Html"].innerHTML.trim();
        D.el[name].ResultDisplay.innerHTML = D.el[name+"Html"].innerHTML;
        D.linkJsAndDom(D.el[name].ResultDisplay);
    };
    
    demoTitles.forEach(function(name) {
        displayHtmlJsAndResult(name);
    });
    
} else {
    document.getElementById("errors").textContent = "DOM99 not supported on this browser";
}

