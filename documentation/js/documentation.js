"use strict";

var dom99Possible = (Object.defineProperty && Object.keys && Object.assign && Object.freeze && Array.isArray && window.document && Symbol);

if (dom99Possible) {
    /*Display*/
    var D = dom99;
    D.linkJsAndDom();

    var displayHtmlJsAndResult = function(name, htmlSourceElement, jsSourceElement) {
        D.vr[name].title = name;
        D.vr[name].JsSourceDisplay = D.el[jsSourceElement].textContent + "\ndom99.linkJsAndDom();";
        D.vr[name].HtmlSourceDisplay = D.el[htmlSourceElement].innerHTML;
        D.el[name].ResultDisplay.innerHTML = D.el[htmlSourceElement].innerHTML;
        D.linkJsAndDom(D.el[name].ResultDisplay);
    };

    displayHtmlJsAndResult("Hello World", "helloWorldHtml", "helloWorldJs");
    displayHtmlJsAndResult("Hello World 2", "helloWorldHtml2", "helloWorldJs2");
} else {
    document.getElementById("errors").textContent = "DOM99 not supported on this browser";
}

