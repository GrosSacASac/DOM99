# Contributing


## Code of Conduct

Respect the [Code of Conduct](CODE_OF_CONDUCT.md)

## Coding Style Guides


Read existing code to analyze the coding style.


## Licensing

Any contribution that is incorporated into the project has by default the license of the project. Until then, all contributions including issues are "CC0-1.0".


## Attribution, Identities and links

Any major contributor may ask (it is opt in) to have the name/username and 1 link of that person included in both readme and official documentation.

A major contributor is someone who made at least 1 significant contribution.

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

`npm run` to list all commands.


 * Discuss with in the chat, and/or open issue first to discuss
 * Fork, create branch, make changes, Pull request (recommended)
 * OR clone + make changes + send changed files via message


### Donations

Open an issue to make us open a donation channel


## What to do


 * explain better where dom99 comes from and what differentiates it
 * compare values before updating ? with data-compare-before ?
 * see how checking for equality before assigning textContent affects performance
 * Create a better documentation experience
	* New html page with articles
	* Remake sections
		* Components
		* Plugins

 * further explore and document best practices for
    * keyboard shortcuts, (acceskey, keydown listener), gamepad support
    * form validation, form submits
    * disabled js, and fall-backs
 * server side rendering
    * static
    * on the fly, streaming html
 * better developer tools
    * indexed error messages in the doc
    * text editors plugins
 * lit-html compatible API could be interesting
 * add tabindex="0" when data-function="keydown-anyname" is used on something that does not have focus by default (like div), and no tabindex is already set, body does not need it
 * https://github.com/bfred-it/select-dom see if that is faster to iterate on every dom element
 that has data-*
 * finish https://github.com/GrosSacASac/DOM99/community
 * add examples for async (network) data and how it looks
 * top level variable integration like displayjs experiment
 * base dom99 lighter
 * document ELEMENT_PROPERTY, LIST_ITEM_PROPERTY, CONTEXT element extension,


    decide when to use event
        .target
        .orignialTarget
        .currentTarget

    add data-list-strategy to allow opt in declarative optimization
        same length, different content
        same content, different length
        key based identification
    data-function-context to allow context less

    transform recursive into sequential flow

    add data-scoped for data-function to allow them to be
    scoped inside an element with data-scope ?

Changing Runtime target: 2020
Windows 7 and IE 11- will be deprecated,

Possibilites in code and functionality
(check compatibility, performance before )

 * explore addEventListener(`x`, y, {passive: true});
 * WeakMap, Symbol to simplify code
 * assume forEach on HTMLNodes
 * assume correct <template> implementation
 * assume custom elements support
 * document.createTreeWalker
