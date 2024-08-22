// ==UserScript==
// @name         Flag Large Images
// @namespace    http://tampermonkey.net/
// @version      0.1
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

        document.querySelectorAll("img").forEach(el => {
            var imageUrl = el.src || el.dataset.src;
            if (!imageUrl) {return;}
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

    function sizeBoom(el, byteSize) {
        el.classList.add("size-boom");

        const newTab = document.createElement("div");
        newTab.classList.add("size-counter");
        newTab.textContent = `${Math.floor(byteSize / 1000)}KB`;

        const center = getCenter(el);

        document.body.append(newTab);

        console.log(center);



        newTab.style.left = center.x + "px";
        newTab.style.top = center.y + "px";
    }

    function getCenter (el) {
        const rect = el.getBoundingClientRect();

        const x = rect.left + (rect.width / 2) + window.pageXOffset;
        const y = rect.top + (rect.height / 2) + window.pageYOffset;


        return {"x":x, "y": y};

    }
})();
