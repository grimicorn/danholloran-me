import Turbolinks from "turbolinks";
import HighlightJs from "highlight.js";

Turbolinks.start();
HighlightJs.initHighlightingOnLoad();

/**
 * Highlight code when Turbolinks loads a page.
 */
document.addEventListener("turbolinks:load", function() {
    document.querySelectorAll("pre code").forEach(HighlightJs.highlightBlock);
});
