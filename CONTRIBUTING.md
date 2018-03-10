# Contributing


## Code of Conduct

Respect the [Code of Conduct](CODE_OF_CONDUCT.md)


## About this guide


Use this guide as guidance not as strict rules.


## How

### Questions

Feel free to ask any question.


### Reporting Bugs

Thanks. Give as many relevant details as possible.


### Suggestions

Thanks.


### Queries

Feel free to query any kind of upgrades. Contributors are allowed to ask for payment.


### Pull Request or Make any Changes

To edit the core of dom99

edit file js/dom99.js

`npm run` to list all commands.

`http-server` or `python -m http.server 8080` to serve static files. (use a second command prompt to be able to rebuild while serving)


 * Discuss with in the chat, and/or open issue first to discuss
 * Fork, create branch, make changes, Pull request (recommended)
 * OR clone + make changes + send changed files via message


### Donations

Open an issue to make us open a donation channel


## What to do


 * explain the philosophy that dom99 is really low level API and is made to be encapsulated inside a framework that give better developer experience. Show how to do it inside create-dom99-app
 * provide an optional wrapper for the API that seems to scales better for large teams
 * compare values before updating ? with data-compare-before ?
 * explain better where dom99 comes from and what differentiates it
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
    * disabled js, and fall-backs
    * cross device support, phone, tablets, fridges, smartwatch, tv
        * UX, css media queries, button size, pointer events, touch events, both
    * website monetization and growth
        * navigator.share
        * social network sharing, email link
        * donation links
 * server side rendering
    * static
    * on the fly, streaming html
    * html + js + css in one file ? .vue
    * html Transpiler or research html template engine
 * streaming text editor
 * better developer tools
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
 * don't use blah blah in examples it is distracting, make more standard examples like todoMVC
 * make doc experience more streamlined
 * enable and test tree shaking possibilities. Would it be better to export multiple things instead of 1 big
 * finish https://github.com/GrosSacASac/DOM99/community
 * add examples for async (network) data and how it looks
 * regenerate landing-page.min.css from source landing-page.css
 * use surge or gh-pages
 * docs make code not look like plain text (more syntax colors)
 * top level variable integration like displayjs
 * base dom99 lighter do not import everything


## Coding Style Guides


Read existing code to analyse the coding style.


## Licensing

Any contribution that is incorporated into the project has by default the license of the project. Until then, all contributions including issues are "CC0-1.0".


## Attribution, Identities and links

Any major contributor may ask (it is opt in) to have the name/username and 1 link and 1 private contact and 1 enterprise/donation link of the major contributor included in both readme and official documentation.

A major contributor is someone who made at least 1 significant contribution.
