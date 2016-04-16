#Open questions

##Should we use the latest ES features or limit ourselves to the ones that are easily compilable to ES5 ?

Context: We could use proxies, for of loops and other handy tools from the latest ES releases to make the code better. However some of these are not easily automatically compilable to ES5. Doing it by hand is unmaintainable too. Example from babeljs.io "Due to the limitations of ES5, Proxies cannot be transpiled or polyfilled".

##To iterate over an array, should we use `.forEach` or `for in` or `for of` or `for ... .length` ?

Context:See above. Also can we safely assume that the developer that uses dom99 does not mess with Array.prototype ? If yes the for in could be good.

##How could we express the concepts of DOM99 without HTML and the DOM ?

Context: Using HTML to sculpt the skeleton of the UI is not the only way of doing UIs. Especially in 3D interfaces we usually build up the UI procedurally (à la JSX or createElement+appendChild)

##How do we expose inner variables and elements

Example
    
    <template data-el="templateExample-d-example">
        <p data-vr="text"></p>
        <a data-el="link"></a>
    </template>
    
    <d-example data-scope="1"></d-example>
    
    //(1)using an object that's in (that s how it works now)
    D.vr["1"]["text"] = ...
    D.el["1"]["link"].href = ...
    
    //(2)using a prefix
    D.vr["1"+"text"] = ...
    D.el["1"+"link"].href = ...
    