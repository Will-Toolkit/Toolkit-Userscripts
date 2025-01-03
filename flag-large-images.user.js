// ==UserScript==
// @name         Flag Large Images
// @namespace    http://tampermonkey.net/
// @version      0.4
// @updateURL    https://github.com/Will-Toolkit/Toolkit-Userscripts/raw/main/flag-large-images.user.js
// @downloadURL  https://github.com/Will-Toolkit/Toolkit-Userscripts/raw/main/flag-large-images.user.js
// @description  Flags any images over 250KB.
// @author       William Thrussell
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toolkitredesign.co.uk
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const metaTag = document.querySelector('head meta[property="og:image"]');

    // Test if the site is a toolkit site
    if (metaTag && (metaTag.content.includes("toolkitfiles"))) {
        addContextMenu();
        GM_addStyle(`
.size-boom {
  border: 5px solid red;
  filter: saturate(3);
}

.size-counter {
  position: absolute;
  z-index: 100000;
  transform: translate(-50%, -50%);
  background: #eee;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff0000;
  pointer-events: none;
}
`);
    }

    function addContextMenu() {
        GM_registerMenuCommand("Flag Large Images", flagLargeImages, "i");
    }

    function flagLargeImages() {
        document.querySelectorAll("img.lazy").forEach(el => {
            if (el.dataset.src) {
                el.src = el.dataset.src;
                el.removeAttribute("data-src");
            }
        });

        document.querySelectorAll("*").forEach(el => {
            var imageUrl = "";
            if (el.nodeName == "IMG") { imageUrl = el.src || el.dataset.src; }
            else {
                imageUrl = getBackgroundImageUrl(el);
            }
            if (!imageUrl) {return;}
            if (!imageUrl.includes('toolkitfiles')) { return; }
            console.log(imageUrl);
            var blob = null;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', imageUrl, true);
            xhr.responseType = 'blob';
            xhr.onload = function()
            {
                blob = xhr.response;
                if (blob.size > 250000) {
                    sizeBoom(el, blob.size);
                }
            }
            xhr.send();
        });
    }

    function getBackgroundImageUrl(div) {
        // Get the computed style of the element
        const style = window.getComputedStyle(div);

        // Get the background-image property
        const backgroundImage = style.backgroundImage;

        // Define a regular expression to match URLs in the background-image
        const urlPattern = /url\((['"]?)(.*?)\1\)/;

        // Extract the URL from the background-image using the regex
        const match = backgroundImage.match(urlPattern);

        // Check if a match was found and return the URL part
        if (match && match[2]) {
            return match[2]; // match[2] contains the URL
        }

        // Return null if no URL is found
        return null;
    }

    function sizeBoom(el, byteSize) {
        el.classList.add("size-boom");

        const newTab = document.createElement("div");
        newTab.classList.add("size-counter");
        newTab.textContent = `${Math.floor(byteSize / 1000)}KB`;

        // const center = getCenter(el);

        if (el.nodeName != "IMG") {
            el.append(newTab);
            el.style.position = "relative";
        } else {
            el.parentElement.append(newTab);
            el.parentElement.style.position = "relative";
        }
        newTab.style.left = "50%";
        newTab.style.top = "50%";
        newTab.style.transform = "translate(-50%, -50%)";
    }

    function getCenter (el) {
        const rect = el.getBoundingClientRect();

        const x = rect.left + (rect.width / 2) + window.pageXOffset;
        const y = rect.top + (rect.height / 2) + window.pageYOffset;


        return {"x":x, "y": y};

    }
})();
