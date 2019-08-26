"use strict";
const hljs = require(`highlight.js/lib/highlight`);
const hljs_js = require(`highlight.js/lib/languages/javascript`);
hljs.registerLanguage(`javascript`, hljs_js);
hljs.initHighlightingOnLoad();
