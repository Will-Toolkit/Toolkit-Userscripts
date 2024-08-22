// ==UserScript==
// @name         Toolkit Quality of Life
// @namespace    https://www.toolkitwebsites.co.uk/
// @version      0.8
// @updateURL    https://raw.githubusercontent.com/Will-Toolkit/Toolkit-Userscripts/main/toolkit-quality-of-life.js
// @downloadURL  https://raw.githubusercontent.com/Will-Toolkit/Toolkit-Userscripts/main/toolkit-quality-of-life.js
// @description  Small suite of improvements to the Toolkit platform for frontend devs.
// @author       Will Thrussell
// @match        https://www.toolkit.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toolkit.uk
// @require      https://github.com/Will-Toolkit/Editor-Scripts/raw/main/utils.js?g
// @require      https://github.com/Will-Toolkit/Editor-Scripts/raw/main/templates.js?g
// @grant        GM_addStyle
// ==/UserScript==

(function() {

    'use strict';

    window.TKVars = {};
    let modal; // The bootstrap editor popup modal.
    let cm; // The popup node's CodeMirror section.

    const modules = {
        graphicsUploadDropdownToIcons: true,
        imagesQuickCopy: true,
        imageTooltips: true,
        graphicsQuickCopy: true,
        graphicsTooltips: true,
        webmasterTextAreaFix: true,
        formNotificationsAbsolute: true,
        resizeCodeMirrorPopup: true,
        removeClickOffPopup: true,
        addSourceCodeTools: true
    };

    const TKOverlay = document.createElement("div");
    TKOverlay.id="TK-overlay";
    document.body.appendChild(TKOverlay);

    GM_addStyle(`body {
              position: relative;
            }
            #TK-overlay {
              display: block;
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              z-index: 9999;
              overflow: hidden;
              pointer-events: none;
            }`);


    // Your code here...
    const windowURL = window.location.href;
    if (windowURL.includes(`https://www.toolkit.uk/graphics/upload`) && modules.graphicsUploadDropdownToIcons) {
        dropdownToIcons();
    }
    if (modules.imagesQuickCopy && windowURL.includes(`https://www.toolkit.uk/images`)) {
        imageQuickCopyURL();
    }
    if (modules.imageTooltips && windowURL.includes(`https://www.toolkit.uk/images`)) {
        imageTooltips();
    }
    if (modules.graphicsQuickCopy && windowURL.includes(`https://www.toolkit.uk/graphics`)) {
        imageQuickCopyURL();
    }
    if (modules.graphicsTooltips && windowURL.includes(`https://www.toolkit.uk/graphics`)) {
        imageTooltips(true);
    }
    if (modules.webmasterTextAreaFix && windowURL.includes(`https://www.toolkit.uk/setting/webmaster`)) {
        webmasterTextAreaFix();
    }
    if (modules.formNotificationsAbsolute && (windowURL.includes(`https://www.toolkit.uk/formsredesign/elementsview`) || windowURL.includes(`https://www.toolkit.uk/forms/elementsview`))) {
        formNotificationsAbsolute();
    }
    if (modules.resizeCodeMirrorPopup) {
        resizeCodeMirrorPopup();
    }
    if (modules.removeClickOffPopup) {
        removeClickOffPopup();
    }
    if (modules.addSourceCodeTools) {
        addSourceCodeTools();
    }

    function dropdownToIcons () {
        const dropdown = document.querySelector(".form-control");
        dropdown.options.selectedIndex = 2;
    }

    function imageQuickCopyURL() {
        GM_addStyle(
            `a.copy-btn {
      background-color: #ddeedd;
      border-color: #ccddcc;
      opacity: 1;
      pointer-events: inherit;
      transition = none;
    }

    a.copy-btn.copyOn {
      background-color: #ddddee;
      border-color: #ccccdd;
      transition: opacity 1s ease-in-out;
      opacity: 0;
      pointer-events: none;
    }
    a.copy-btn.copied {
      background-color: #ddddee;
      border-color: #ccccdd;
    }`
            );


            let imageTiles = document.querySelectorAll(".row .col-lg-12 > .row:last-child .col-sm-6.col-md-3");

            imageTiles.forEach((tile) => {
                let currentImg = tile.querySelector(".row:nth-child(1) img").src;
                currentImg = currentImg.replace(/(\/143x93\/)/gm, '/hires/');
                let buttonDiv = tile.querySelector(".row:last-child > div:nth-child(1)");

                const newButton = document.createElement("a");
                newButton.classList.add("btn", "copy-btn");
                newButton.innerHTML = "Copy";
                newButton.addEventListener("click", () => {
                    navigator.clipboard.writeText(currentImg);

                    if (!newButton.classList.contains("copyOn")) {
                        newButton.classList.add("copyOn");
                        newButton.innerHTML = "Done"
                        setTimeout(() => {
                            newButton.classList.remove("copyOn");
                            newButton.classList.add("copied");
                            newButton.innerHTML = "Copy";
                        }, 2000);
                    }
                });

                buttonDiv.appendChild(newButton);
            });
        }

    function imageTooltips(graphicsPage = false) {
        GM_addStyle(`
            #TK-tooltip {
              display: flex;
              pointer-events: none;
              text-align: center;
              position: absolute;
              border: 1px solid #ccc;
              border-radius: 5px;
              line-height: 1;
              background: #fff;
              width: 100%;
              max-width: 240px;
              transform: translate(-50%, calc(-100% - 5px));
              transition: opacity 0.2s ease;
              opacity: 0;
            }

            #TK-tooltip.active {
              opacity: 1;
            }

            #TK-tooltip .label {
              position: relative;
              width: 100%;
              font-size: 12px;
              color: #444;
              padding: 5px;
              text-wrap: wrap;
            }
            `);
            const isGraphics = graphicsPage;
            const tooltip = document.createElement("div");
            tooltip.id="TK-tooltip";
            TKOverlay.appendChild(tooltip);
            tooltip.innerHTML = `<div class="label"></div><div class="tail"></div>`;

            function updateTooltip(target) {
                if (target?.tagName == "IMG" && target.closest('[id$="hlnkImage"], [id$="hlnkIcon"]')) {
                    const src = target.src;
                    var label;
                    if (isGraphics) {
                        label = target.src.match(/(?<=(\/icons\/)).*(?=\?)/g)[0];
                    } else {
                        label = target.src.match(/(?<=(143x93\/)).*(?=\?)/g)[0];
                    }
                    tooltip.querySelector(".label").innerHTML = label;
                    tooltip.classList.add("active");
                } else {
                    tooltip.classList.remove("active");
                }
            }

            function updateTooltipPosition() {
                tooltip.style.left = window.TKVars.clientX + window.scrollX + "px";
                tooltip.style.top = window.TKVars.clientY + window.scrollY + "px";
            }

            window.addEventListener("mouseover", (event) => {
                updateTooltip(event.target);
            });

            window.addEventListener("mousemove", (event) => {
                window.TKVars.clientX = event.clientX;
                window.TKVars.clientY = event.clientY;
                updateTooltipPosition();
            });

            window.addEventListener("scroll", (event) => {
                updateTooltipPosition();
            });
        }

    function webmasterTextAreaFix() {
        document.querySelectorAll("textarea").forEach(el => {
            el.style.fontFamily = "monospace";
            el.setAttribute("rows", "12");
            el.parentNode.classList.replace("col-md-4", "col-md-8");
        });
    }

    function formNotificationsAbsolute() {
        GM_addStyle(`
    #ctl00_cphGeneral_ctl00_lblDeleteError, #ctl00_cphGeneral_ctl00_lblDelete, #ctl00_cphGeneral_ctl00_lblError, #ctl00_cphGeneral_ctl00_lblResorted {
      position: absolute !important;
    }
    `);
        }

    function resizeCodeMirrorPopup() {
        GM_addStyle(`.bootstrap-dialog .modal-body .CodeMirror {
      height: calc(100vh - 200px);
    }`);
        }

    function removeClickOffPopup() {
        GM_addStyle(`.modal.bootstrap-dialog {
      pointer-events: none;
    }

    .modal.bootstrap-dialog > div {
      pointer-events: all;
    }`);
        }

    function addSourceCodeTools() {
        // Function to be executed when a new .modal-content element is detected
        function handleModalContentAdded(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if ((node.matches('.bootstrap-dialog .modal-content') || node.querySelector('.bootstrap-dialog .modal-content')) && (node.querySelector(".CodeMirror"))) {
                                modal = node;
                                cm = node.querySelector(".CodeMirror")?.CodeMirror;
                                addEditorStyle();
                                scrubSpaces();
                                addExtensionDiv();
                                addUtilityList();
                                addToolbar();
                            }
                        }
                    }
                }
            }
        }

        // Create a new MutationObserver instance
        const observer = new MutationObserver(handleModalContentAdded);

        // Start observing the document body for child node additions
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function cmReplace(filter, replaceStr) {
        const returnCursor = cm.doc.getCursor();
        cm.execCommand("selectAll");
        cm.doc.replaceSelection(cm.doc.getSelection().replace(filter, replaceStr));
        cm.doc.setCursor(returnCursor);
    }

function scrubSpaces() {
        // console.log("Scrubbing!");

        // Scrubs spaces
        cmReplace(/( )+(?=(\\n|$))/gm, '');

        // Turns thumbnail images into hires images
        cmReplace(/(\/143x93\/)/gm, '/hires/');
    }

    function addButton(text, action, parentElement) {
        let newButton = document.createElement("a");
        newButton.innerHTML = text;
        newButton.setAttribute("id", text);
        newButton.setAttribute("style", "");
        newButton.classList.add(
            "bootstrapeditor-btn",
            "bootstrapeditor-btn-cancel"
        );
        parentElement.prepend(newButton);
        document.getElementById(text).addEventListener("click", action, false);
        return newButton;
    }

    function addExtensionDiv() {
        const extensionDiv = `<div id="TK-extras"></div>`;

        const parent = modal.querySelector(
            ".bootstrap-dialog-header"
        );

        parent.insertAdjacentHTML("beforeend", extensionDiv);
    }

    function addToolbar() {
        const parent = modal.querySelector(
            "#TK-extras"
        );
        let toolbar = document.createElement("span");
        toolbar.setAttribute("id", "expandToolbar");

        addExpandButton();

        parent.prepend(toolbar);
        addCodeInput();
    }

    function addExpandButton() {
        const parent = modal.querySelector(
            "#TK-extras"
        );
        const toolbar = modal.querySelector("#expandToolbar");
        const newButton = document.createElement("a");

        newButton.innerHTML = "+";
        newButton.setAttribute("id", "expandBtn");
        newButton.classList.add(
            "bootstrapeditor-btn",
            "bootstrapeditor-btn-cancel"
        );
        parent.prepend(newButton);
        newButton.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                const toolbar = document.querySelector("#expandToolbar");
                newButton.innerHTML = newButton.innerHTML == "+" ? "-" : "+";
                toolbar.classList.toggle("active");
            },
            false
        );
    }

    function addCodeInput() {
        let toolbar = document.querySelector("#expandToolbar");
        const exeText = document.createElement("textarea");
        exeText.setAttribute("id", "codeInput");
        toolbar.prepend(exeText);

        const exeButton = addButton("Execute", executeInput, toolbar);
    }

    function executeInput() {
        // Get the current cursor location, to return to later
        const returnCursor = cm.doc.getCursor();

        if (cm.doc.getSelections()[0].length == 0) {
            cm.execCommand("selectAll");
        }

        const oldText = cm.getSelections()[0];

        var stringToHTML = function (str) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(str, "text/html");
            return doc.body;
        };

        var globalScript = new Function(
            `
            let cm = document.querySelector(".CodeMirror").CodeMirror;
            const oldText = cm.getSelection();
            var stringToHTML = function (str) {
              var parser = new DOMParser();
              var doc = parser.parseFromString(str, 'text/html');
              return(doc.body);
            };

            window.doc = document.implementation.createHTMLDocument("SpoofDoc");
            window.doc.body = stringToHTML(oldText);
            const functionString = document.querySelector("#codeInput").value;
            const filteredString = functionString.replace(/(document.)/gm, "window.doc.");

            var F = new Function(filteredString);

            F();


            cm.replaceSelection(window.doc.body.innerHTML);
        `
    );

      globalScript();

      // Return the cursor to where it was before the edit
      cm.doc.setCursor(returnCursor);
  }

    function addUtilityList() {
        let parent = document.querySelector("#TK-extras");
        const utilityButton = addButton("Utils", toggleUtils, parent);

        // Adds Utility buttons
        modal.insertAdjacentHTML(
            "beforeend",
            `<div class="util-container"><div class="move"></div><b>Utilities</b><a class="util-close bootstrapeditor-btn bootstrapeditor-btn-cancel" href="javascript:;">x</a><div class="util-grid"></div><b>Templates</b><div class="template-grid">
      </div></div>`
    );
      document.querySelectorAll(".util-close").forEach((el) => {
          el.addEventListener("click", () => {
              toggleUtils();
          });
      });

      const utilContainer = document.querySelector(".util-container");
      utilContainer.style.display = "none";

      dragElement(document.querySelector(".util-container"));

      function dragElement(elmnt) {
          var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
          if (elmnt.querySelector(".move")) {
              /* if present, the "move" container is where you move the DIV from:*/
              elmnt.querySelector(".move").onmousedown = dragMouseDown;
          } else {
              /* otherwise, move the DIV from anywhere inside the DIV:*/
              elmnt.onmousedown = dragMouseDown;
          }

          function dragMouseDown(e) {
              e = e || window.event;
              e.preventDefault();
              // get the mouse cursor position at startup:
              pos3 = e.clientX;
              pos4 = e.clientY;
              document.onmouseup = closeDragElement;
              // call a function whenever the cursor moves:
              document.onmousemove = elementDrag;
          }

          function elementDrag(e) {
              e = e || window.event;
              e.preventDefault();
              // calculate the new cursor position:
              pos1 = pos3 - e.clientX;
              pos2 = pos4 - e.clientY;
              pos3 = e.clientX;
              pos4 = e.clientY;
              // set the element's new position:
              elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
              elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
          }

          function closeDragElement() {
              /* stop moving when mouse button is released:*/
              document.onmouseup = null;
              document.onmousemove = null;
          }
      }

      utils.forEach((util) => {
          const utilTitle = util[0];
          const utilDesc = util[1];
          const utilString = util[2];

          const button = document.createElement("a");
          utilContainer.querySelector(".util-grid").appendChild(button);
          button.innerHTML = utilTitle;
          button.title = utilDesc;

          button.addEventListener("click", () => {
              const returnCursor = cm.doc.getCursor();

              if (cm.doc.getSelections()[0].length == 0) {
                  cm.execCommand("selectAll");
              }

              const oldText = cm.getSelections()[0];

              var stringToHTML = function (str) {
                  var parser = new DOMParser();
                  var doc = parser.parseFromString(str, "text/html");
                  return doc.body;
              };

              // Set the global variable to the command to execute
              const scriptToRun = document.createElement("textarea");
              scriptToRun.id = "script-to-run";
              scriptToRun.value = utilString;
              document.body.prepend(scriptToRun);

              // Declare the global script to run on a spoof document, and then return it into the CodeMirror editor
              const globalScript = new Function(
                  `
            let cm = document.querySelector(".CodeMirror").CodeMirror;
            const oldText = cm.getSelection();
            var stringToHTML = function (str) {
              var parser = new DOMParser();
              var doc = parser.parseFromString(str, 'text/html');
              return(doc.body);
            };

            window.doc = document.implementation.createHTMLDocument("SpoofDoc");
            window.doc.body = stringToHTML(oldText);
            const functionString = document.querySelector("#script-to-run").value;
            const filteredString = functionString.replace(/(document.)/gm, "window.doc.");

            var F = new Function(filteredString);

            F();


            cm.replaceSelection(window.doc.body.innerHTML);
        `
        );

          globalScript();
          scriptToRun.remove();
      });
    });


      templates.forEach((template) => {
          const templateTitle = template[0];
          const templateString = template[1];
          const button = document.createElement("a");
          utilContainer.querySelector(".template-grid").appendChild(button);
          button.innerHTML = templateTitle;
          button.addEventListener("click", () => {
              cm.replaceSelection(templateString + `\n`);
          });
      });
  }

    function toggleUtils() {
        const utilContainer = modal.querySelector(".util-container");
        if (utilContainer) {
            if (utilContainer.style.display == "flex") {
                utilContainer.style.display = "none";
            } else {
                utilContainer.style.display = "flex";
            }
        }
    }



    function addEditorStyle() {
        GM_addStyle(
        `
#TK-extras {
  display: inline-block;
  margin-right: 15px;
  flex-direction: row-reverse;
  position: absolute;
  right: 30px;
  top: 0;
  height: 52px;
}
#expandToolbar {
  display: none;
  margin-right: 15px;
  line-height: 1;
}

#TK-extras a {
  background: #ad2126;
  border: 1px solid #ad2126;
  color: #fff;
  border-radius: 3px;
  line-height: 1;
  margin: 8px 5px;
  padding: 10px 15px;
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
  position: relative;
}

#TK-extras a:hover {
  background-color: #c13d42;
  border-color: #c13d42;
}

#expandToolbar.active {
  display: inline-flex;
  align-items: center;
}

#TK-extras #codeInput {
  background: #fff;
  height: 36px;
  position: relative;
  border: 1px solid #ccc;
  resize:none;
}

.util-container {
  position: absolute;
  top: 70px;
  left: max(calc(100vw - 550px), 50px);
  z-index: 9999;
  background: #eee;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  padding-top: 20px;
  gap: 15px;
  max-width: min(500px, calc(100vw - 115px));
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 0px 20px 10px rgba(0,0,0,0.15);
}

.util-container .move {
  position:absolute;
  top: 0;
  left:0;
  width: 100%;
  height: 15px;
  background: #960909;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  cursor: move;
}

.util-container a {
  text-decoration: none;
  padding: 5px 10px;
}

.util-close {
  width: fit-content;
  float: right;
  margin: 0;
}

.util-grid, .template-grid {
  display: flex;
  width: 100%;
  gap: 5px;
  padding-top: 5px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.util-grid a, .template-grid a {
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #ddd;
  background-color: #fff;
  color: #3a3a3a;
  cursor: pointer;
  text-align: center;
  border-radius: 5px;
}

.util-grid a:hover, .template-grid a:hover {
  background-color: #d8d8d8;
  border-color: #aaa;
  color: #000;
}
`
  );
        GM_addStyle(`
/* Fixes modal clickable issue? */
.CodeMirror-gutters {
  left: 0px !important;
}
        `);
    }

})();
