"use strict";
var hljs = require('highlight.js/lib/highlight');
var hljs_js = require('highlight.js/lib/languages/javascript')
hljs.registerLanguage('javascript', hljs_js);
hljs.initHighlightingOnLoad();
