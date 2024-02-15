// ==UserScript==
// @name         TweaKO
// @namespace    https://www.toolkitwebsites.co.uk/
// @version      0.1
// @description  Small frontend tweaks to TKO
// @author       Will Thrussell
// @match        https://www.toolkitoffice.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toolkitoffice.co.uk
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const modules = {
        addFindAndReplaceLinks: true,
    };

    // Your code here...
    window.addEventListener("load", () => {
        if ((modules.addFindAndReplaceLinks) && window.location.href.includes("findandreplace")) {
            addFindAndReplaceLinks();
        }
    });

    function addFindAndReplaceLinks() {
      const results = document.querySelectorAll(".result + div + div table tr:not(:first-child) td:nth-child(3)");
      results.forEach(result => {
        const link = result.children[0];
        const id = result.textContent.match(/(?<=: )([^,]*)(?=,)/g);
        if (link.textContent.startsWith("Page ID")) {
          link.setAttribute("target", "_blank");
          link.href = (`https://www.toolkit.uk/page/` + id);
        } else if (link.textContent.startsWith("Blogs ID")) {
          link.setAttribute("target", "_blank");
          link.href = (`https://www.toolkit.uk/blog/tools/` + id);
        } else if (link.textContent.startsWith("Category ID")) {
          link.setAttribute("target", "_blank");
          link.href = (`https://www.toolkit.uk/pages/category/edit/` + id);
        } else if (link.textContent.startsWith("Toolkit Redirect ID")) {
          link.setAttribute("target", "_blank");
          link.href = (`https://www.toolkit.uk/redirects/edit/` + id)
        }
      });
    }
})();
