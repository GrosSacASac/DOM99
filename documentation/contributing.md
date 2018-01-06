# Contributing

## How

 * Discuss with me in the chat, and open issue first to discuss
 * Fork + make changes + Pull request (recommended)
 * OR Copy + make changes + send changed files via message
 * What could be better ?
 
## To do


 * make minimal example in readme
 * explain better where it comes from and what differentiates it
 * Create a better documentation experience
 * Extract IE artefacts from core and put these in polyfills/extensions
 * make better link to components folder in the documentation
 * Define typical process of creating and composing with custom elements
 * ie seems to fill forms after script executes and load (onload ?)
 * http://localhost:8080/examples/limited.html cannot set -4 in globalv
 * make a full stack creation template, (like create react app)
    * also explain how to scale to a big team
        * import export templates (<script type="module"> or <link rel="import">)
    * webpack
    * minifier, transpiler, etc
 * better explain the strengths and weaknesses of the library

 * see how checking for equality before assigning textContent affects performance
 * further explore and document best practices for
    * keyboard shortcuts, (acceskey, keydown listener), gamepad support
    * form validation, form submits
        * web payements
        * speech to text
        * biometric authentification (facial, voice, fingerprint recognition),
        * 2 factors (ex password + token)
        * social authentification (Open Auth ?)
    * multimedia content, 
        * audio , text to speech
        * video 
        * canvas
        * VR, AR
    * local navigation (menu bars, links, buttons)
    * disabled js, and fallbacks
    * cross device support, phone, tablets, fridges, smartwatch, tv
        * UX, css media queries, button size, pointer events, touch events, both
    * website monetization and growth
        * navigator.share
        * social network sharing, email link
        * donation links
 * server side rendering 
    * static
    * on the fly, streaming html
    * html + js + css in one file ? .vue ?
    * html transpiler or research html template engine
 * streaming text editor
 * better developper tools
    * indexed error messages in the doc
    * more warnings
    * text editors plugins
 * create plugin system to add and remove data-* directives
 * lit-html 
 * add tabindex="0" when data-function="keydown-anyname" is used on something that does not have focus by default (like div), and no tabindex is already set, body does not need it
 * make sure it integrates well with webpack, rollup, ie, "modules": false
 * make it easier to toggle attributes and class names from elements that are injected from template or from lists
 * https://github.com/bfred-it/select-dom see if that is faster to iterate on every dom element
 that has data-*
 * hooks for custom elements after/before create 
 * hash values for smaller memory footprint comparison (trade would make it slower make it an option)