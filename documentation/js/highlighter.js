import hljs from "highlight.js/lib/core.js"
import hljs_js from "highlight.js/lib/languages/javascript.js";
import hljs_xml_html from "highlight.js/lib/languages/xml.js";

hljs.registerLanguage(`javascript`, hljs_js);
hljs.registerLanguage(`xml`, hljs_xml_html);
hljs.initHighlightingOnLoad();
