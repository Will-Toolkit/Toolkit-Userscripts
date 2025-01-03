# Toolkit Userscripts

A handful of scripts to help with in-house work within the Toolkit.

All the files here are userscripts. You can install userscripts into your browser via the [Tampermonkey](https://www.tampermonkey.net/) extension.

Once the extension is installed, individual userscripts can be installed by copying the links below (or navigating to the source code in the repository) and opening them in your browser. Tampermonkey will automatically prompt to install (or update) the userscript.

---

## [Open In Toolkit CMS](https://github.com/Will-Toolkit/Toolkit-Userscripts/raw/refs/heads/main/open-in-toolkit-cms.user.js)

Allows for quicker finding of pages in the CMS - useful for clients with larger websites.
This adds a right-click option on all Toolkit pages to open the respective page's editor in the CMS.

You must be logged into the client's Toolkit in order for this to work properly.

Additionally, you can press Shift+T to quickly open up the page in the CMS.

---

## [Toolkit Quality of Life](https://github.com/Will-Toolkit/Toolkit-Userscripts/raw/refs/heads/main/toolkit-quality-of-life.user.js)

Provides a bunch of convenient changes across the Toolkit CMS.
Each change is modular and can be turned on or off by editing the "modules" array in the userscript.

### **`graphicsUploadDropdownToIcons`**
This changes the dropdown when uploading graphics to be "Icons" be default. No longer necessary.

### **`imagesQuickCopy`**
Adds a new button under each image in the Images module to quickly copy its URL.

### **`imageTooltips`**
Adds filename tooltips to each image when hovering over them in the Images module.

### **`graphicsQuickCopy`**
Adds a new button under each graphic in the Graphics module to quickly copy its URL.

### **`imageTooltips`**
Adds filename tooltips to each graphics when hovering over them in the Graphics module.

### **`webmasterTextAreaFix`**
Widens the three HTML fields in Webmaster, removes the "Skype" link.

### **`formNotificationsAbsolute`**
When updating form fields or scroller frames, the pop-up green notification will push everything else down on the page. This prevents that from happening, making the page less jittery.

### **`resizeCodeMirrorPopup`**
Every Source Code popup editor (such as in the Classic Editor) resizes to appropriately fill the screen.

### **`removeClickOffPopup`**
Prevents accidentally closing the Source Code popup editor by clicking outside of it.

### **`addSourceCodeTools`**
Adds Source Code Tools to the popup editor.

---

## [TweaKO](https://github.com/Will-Toolkit/Toolkit-Userscripts/raw/refs/heads/main/tweako.user.js)

Another modular quality-of-life plugin that tweaks things in Toolkit Office.

All individual features can be switched on and off by editing the `modules` object within the script.

### **`addFindAndReplaceLinks`**
When using TKO's Find feature, search results for Pages, Blogs, Page Folders, and Redirects can all be clicked to link directly to them in the CMS. Requires logging into the client's Toolkit first.

### **`bottomBorderFix`**
Small aesthetic fix to adjust the grey rounded border at the bottom of the table on all TKO pages.

### **`resizeCSSEditor`**
Fixes incorrect sizing on the CSS editor, removing the "double scrollbar" effect.

### **`monospaceText`**
Turns the internal notes & email notes on TKO to fullwidth for the purposes of code readability.

### **`autoRefreshContentList`**
Refreshes the Content ticket list every 5 minutes, similar to the Support ticket list.

---

## Save Source Code Scroll
Saves how far down the browser is scrolled when the the Source Code editor is saved or reloaded.

---

## Flag Large Images
Highlights and saturates images over 250KB on a page. Can be activated through the right-click Tampermonkey menu, or through the Tampermonkey icon in the browser toolbar.
![alt text](assets/tournerbury-large-image.jpg)