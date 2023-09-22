"use strict";

let disableDebug = document.querySelector("#disable-debug");
let version = document.querySelector("#version");

window.browser = window.browser || window.chrome;

browser.storage.sync.get(["disableDebug", "theme"], (result) => {
    if (result.theme) document.body.classList.add(result.theme);
    disableDebug.checked = !result.disableDebug;
});

version.textContent = browser.runtime.getManifest().version;

disableDebug.addEventListener("change", (event) => {
    browser.storage.sync.set({ disableDebug: !event.target.checked });
});


document.querySelector("#more-options").addEventListener("click", () => {
    browser.runtime.openOptionsPage();
});
