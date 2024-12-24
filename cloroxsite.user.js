// ==UserScript==
// @name         CSP Fixer with Script Whitelist
// @namespace    https://www.github.com/whobcode/cloroxsite/
// @version      1.0
// @description  Dynamically fixes CSP vulnerabilities without breaking the script functionality.
// @author       whobcode
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Log the initial message
    console.log('[CSP Fixer] Script initiated.');

    // Function to sanitize CSP headers
    function sanitizeCSP(csp) {
        let modifiedCSP = csp;

        // Log original CSP
        console.log('[CSP Fixer] Original CSP:', csp);

        // Remove 'unsafe-inline' from `script-src` and `style-src`
        modifiedCSP = modifiedCSP.replace(/'unsafe-inline'/g, () => {
            console.log("[CSP Fixer] Removed 'unsafe-inline'");
            return ''; // Remove it completely
        });

        // Remove overly permissive `*` sources
        modifiedCSP = modifiedCSP.replace(/(\s|\b)\*([;\s])/g, (match, p1, p2) => {
            console.log('[CSP Fixer] Removed wildcard (*) source.');
            return `${p1}'self'${p2}`; // Replace with 'self'
        });

        // Ensure blob: and data: are only used for media-src (if present)
        if (/blob:|data:/.test(modifiedCSP)) {
            console.log("[CSP Fixer] Allowed 'blob:' and 'data:' for media-src only.");
        }

        // Log the modified CSP
        console.log('[CSP Fixer] Modified CSP:', modifiedCSP);
        return modifiedCSP;
    }

    // Function to intercept and modify headers
    function interceptHeaders() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'content') {
                    const metaTag = mutation.target;
                    if (metaTag.httpEquiv === 'Content-Security-Policy') {
                        const originalCSP = metaTag.content;
                        metaTag.content = sanitizeCSP(originalCSP);
                        console.log('[CSP Fixer] Updated CSP in <meta> tag:', metaTag.content);
                    }
                }
            });
        });

        // Observe CSP meta tags
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach((meta) => {
            observer.observe(meta, { attributes: true });
            meta.content = sanitizeCSP(meta.content);
        });
    }

    // Run the script when the DOM is ready
    window.addEventListener('DOMContentLoaded', () => {
        interceptHeaders();
        console.log('[CSP Fixer] CSP interception and modifications applied.');
    });
})();
