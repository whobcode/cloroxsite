// ==UserScript==
// @name         Cloroxsite
// @namespace    https://www.github.com/whobcode/cloroxsite.git
// @tag          Cleansig
// @version      pichu
// @license       MIT
// @description  Dynamically fixes CSP vulnerabilities without breaking the script functionality.
// @author       whobcode
// @match        *
// @include      *://*
// @run-at       document-start
// @sandbox      JavaScript
// @grant        GM_addElement(tag_name, attributes), 
// @grant        GM_addElement(parent_node, tag_name, attributes)
// @grant        GM_addStyle(css)
// @grant        GM_download(details), 
// @grant        GM_download(url, name)
// @grant        GM_getResourceText(name)
// @grant        GM_getResourceURL(name)
// @grant        GM_info
// @grant        GM_log(message)
// @grant        GM_notification(details, ondone), GM_notification(text, title, image, onclick)
// @grant        GM_openInTab(url, options),
// @grant        GM_openInTab(url, loadInBackground)
// @grant        GM_registerMenuCommand(name, callback, options_or_accessKey)
// @grant        GM_unregisterMenuCommand(menuCmdId)
// @grant        GM_setClipboard(data, info, cb)
// @grant        GM_getTab(callback)
// @grant        GM_saveTab(tab, cb)
// @grant        GM_getTabs(callback)
// @grant        GM_setValue(key, value)
// @grant        GM_getValue(key, defaultValue)
// @grant        GM_deleteValue(key)
// @grant        GM_listValues()
// @grant        GM_setValues(values)
// @grant        GM_getValues(keysOrDefaults)
// @grant        GM_deleteValues(keys)
// @grant        GM_addValueChangeListener(key, (key, old_value, new_value, remote) => void)
// @grant        GM_removeValueChangeListener(listenerId)
// @grant        GM_xmlhttpRequest(details)
// @grant        GM_webRequest(rules, listener)
// @grant        GM_cookie.list(details[, callback])
// @grant        GM_cookie.set(details[, callback])
// @grant        GM_cookie.delete(details, callback)
// @grant        window.onurlchange
// @grant        window.close
// @grant        window.focus
// @connect      *
// @connect      self
// @connect      localhost
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
