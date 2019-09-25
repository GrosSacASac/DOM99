"use strict";
const hljs = require(`highlight.js/lib/highlight`);
const hljs_js = require(`highlight.js/lib/languages/javascript`);
const xml_html = require(`highlight.js/lib/languages/xml`);
hljs.registerLanguage(`javascript`, hljs_js);
hljs.registerLanguage(`html`, xml_html);
hljs.initHighlightingOnLoad();
