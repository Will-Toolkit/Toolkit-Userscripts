// ==UserScript==
// @name         Open In Toolkit CMS
// @namespace    https://toolkitwebsites.co.uk
// @version      0.3
// @description  Adds a right-click option to open the page in the Toolkit CMS
// @author       Will Thrussell
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toolkitredesign.co.uk
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const metaTag = document.querySelector('head meta[property="og:image"]');

    // Test if the site is a toolkit site
    if (metaTag && (metaTag.content.includes("toolkitfiles"))) {
        addContextMenu();
    }

    function addContextMenu() {
        GM_registerMenuCommand("Open in Toolkit", openInToolkit, "t");
        GM_registerMenuCommand("Open Backups", openBackups, "b");
    }

    function openInToolkit() {
        const pageID = document.body.id.split("page")[1];
        if (pageID) {
            const toolkitURL = `https://www.toolkit.uk/page/` + pageID;
            GM_openInTab(toolkitURL);
        }
    }

    function openBackups() {
        const pageID = document.body.id.split("page")[1];
        if (pageID) {
            const toolkitURL = `https://www.toolkit.uk/pages/backups/${pageID}?pid=1`
            GM_openInTab(toolkitURL);
        }
    }

    document.body.addEventListener("keydown", (event) => {
        if (event.code == "KeyT" && event.shiftKey && document.activeElement == document.body) {
            openInToolkit();
        }
    });
})();
