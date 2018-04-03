// global d

const demoTitles = ["Hello World", "Hello World 2", "Multiplier", "Lists", "Lists2", "Composition"];

const displayHtmlJsAndResult = function(name) {
    d.elements[d.contextFromArray([name, "penContainer"])] .setAttribute("id", name); // for anchor links
    const JsSourceOriginal = d.elements[name+"Js"].textContent;
    const JsSourceDisplay = (
        `import d from "../dom99Module.js";
${JsSourceOriginal.trim()}

d.activate();`);
    const HtmlSourceDisplay = d.elements[name+"Html"].innerHTML.trim();
    d.feed(name, {
        title: name,
        JsSourceDisplay,
        HtmlSourceDisplay
    });
    const resultElement =  d.elements[d.contextFromArray([name, "ResultDisplay"])];
    resultElement.innerHTML = HtmlSourceDisplay;
    if (window.usesModules) {
        eval(JsSourceOriginal);
    }
    d.activate(resultElement);
};

d.activate();
demoTitles.forEach(function(name) {
    displayHtmlJsAndResult(name);
});
