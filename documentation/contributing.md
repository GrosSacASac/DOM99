# Contributing

## How

 * Discuss with me in the chat, and open issue first to discuss
 * Fork + make changes + Pull request (recommended)
 * OR Copy + make changes + send changed files via message
 * What could be better ?
 
## To do

 * Create a better documentation experience
 * Extract IE artefacts from core and put these in polyfills/extensions
 * make better link to components folder in the documentation
 * Define typical process of creating and composing with custom elements
 * ie seems to fill forms after script executes and load (onload ?)
 * http://localhost:8080/examples/limited.html cannot set -4 in globalv
 * make a full stack creation template, (like create react app)
 * better explain the strengths and weaknesses of the library
 * Make performances test 
    * edit a huge number of items in a list
        * see how checking for equality before assigning textContent affects performance
        * compare with Inferno preact
 * remove the micro jumps when browsing the doc
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
    * more warning
    * text editors plugins
 