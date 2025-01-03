// ==UserScript==
// @name         Save Source Code Scroll
// @namespace    http://tampermonkey.net/
// @version      1.1
// @updateURL    https://raw.githubusercontent.com/Will-Toolkit/Toolkit-Userscripts/main/save-source-code-scroll.user.js
// @downloadURL  https://raw.githubusercontent.com/Will-Toolkit/Toolkit-Userscripts/main/save-source-code-scroll.user.js
// @description  Save how far down you're scrolled on the Toolkit editor.
// @author       Will Thrussell
// @match        https://www.toolkit.uk/pages/source/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toolkit.uk
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", () => {
        setTimeout(() => {
        document.querySelector(".CodeMirror-scroll").scrollTop = sessionStorage.getItem("scrollDown");

        document.querySelector(".CodeMirror-scroll").addEventListener("scroll", (e) => {
            sessionStorage.setItem("scrollDown", e.target.scrollTop);
        });
        }, 200);
    });
    
})();