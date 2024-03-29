// ==UserScript==
// @name         Toolkit Quality of Life
// @namespace    https://www.toolkitwebsites.co.uk/
// @version      0.4
// @updateURL    https://raw.githubusercontent.com/Will-Toolkit/Toolkit-Userscripts/main/toolkit-quality-of-life.js
// @downloadURL  https://raw.githubusercontent.com/Will-Toolkit/Toolkit-Userscripts/main/toolkit-quality-of-life.js
// @description  Small suite of improvements to the Toolkit platform for frontend devs.
// @author       Will Thrussell
// @match        https://www.toolkit.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toolkit.uk
// @grant        GM_addStyle
// ==/UserScript==

(function() {

    'use strict';

    const modules = {
        graphicsUploadDropdownToIcons: true,
        imagesQuickCopy: true,
        graphicsQuickCopy: true,
        webmasterTextAreaFix: true,
        formNotificationsAbsolute: true,
        resizeCodeMirrorPopup: true,
        removeClickOffPopup: true
    };


    // Your code here...
    const windowURL = window.location.href;
    if (windowURL.includes(`https://www.toolkit.uk/graphics/upload`) && modules.graphicsUploadDropdownToIcons) {
        dropdownToIcons();
    }
    if (modules.imagesQuickCopy && windowURL.includes(`https://www.toolkit.uk/images`)) {
        imageQuickCopyURL();
    }
    if (modules.graphicsQuickCopy && windowURL.includes(`https://www.toolkit.uk/graphics`)) {
        imageQuickCopyURL();
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
                        newButton.innerHTML = "Copy";
                    }, 2000);
                }
            });

            buttonDiv.appendChild(newButton);
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

})();
