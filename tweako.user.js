// ==UserScript==
// @name         TweaKO
// @namespace    https://www.toolkitwebsites.co.uk/
// @version      0.3
// @updateURL    https://raw.githubusercontent.com/Will-Toolkit/Toolkit-Userscripts/main/tweako.js
// @downloadURL  https://raw.githubusercontent.com/Will-Toolkit/Toolkit-Userscripts/main/tweako.js
// @description  Small frontend tweaks to TKO
// @author       Will Thrussell
// @match        https://www.toolkitoffice.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toolkitoffice.co.uk
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  'use strict';

  const modules = {
      addFindAndReplaceLinks: true,
      bottomBorderFix: true,
      resizeCSSEditor: true,
      monospaceText: true,
      autoRefreshContentList: true,
  };

  // Your code here...
  window.addEventListener("load", () => {
      if ((modules.addFindAndReplaceLinks) && window.location.href.includes("findandreplace")) {
          addFindAndReplaceLinks();
      }
      if (modules.bottomBorderFix) {
          bottomBorderFix();
      }
      if ((modules.resizeCSSEditor) && window.location.href.includes("css.aspx")) {
          resizeCSSEditor();
      }
      if ((modules.monospaceText) && (window.location.href.includes("/ticket/") || window.location.href.includes("/content/"))) {
          monospaceText();
      }
      if ((modules.autoRefreshContentList) && window.location.href.includes('https://www.toolkitoffice.co.uk/pages/support/content.aspx')) {
          autoRefreshContentList();
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

  function bottomBorderFix() {
      GM_addStyle(`.btMainContent {
background: none;
background: #bbbbbb;
border-bottom-left-radius: 4px;
border-bottom-right-radius: 4px;
}`);
  }

  function resizeCSSEditor() {
      GM_addStyle(`.CodeMirror {
height: calc(100vh - 100px) !important;
background: #f8f8f8;
}`);
  }

  function monospaceText() {
      GM_addStyle(
          `.txtContent {
font-family: monospace;
}`
      );
  }

  function autoRefreshContentList() {
      setTimeout(() => {getNewContentList()}, 300000);
      function getNewContentList() {
          fetch('https://www.toolkitoffice.co.uk/pages/support/content.aspx')
              .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok ' + response.statusText);
              }
              return response.text(); // Get the response as plain text (HTML)
          })
              .then(html => {
              const target = document.querySelector(".bgMainContent");
              document.body.insertAdjacentHTML("beforeend", `<div class="dummy" style="display: none;">${html}</div>`);
              const dummy = document.querySelector(".dummy");
              target.innerHTML = dummy.querySelector(".bgMainContent").outerHTML;
              dummy.remove();
          })
              .catch(error => {
              console.error('There was a problem with the fetch operation:', error);
          });
      }
  }
})();