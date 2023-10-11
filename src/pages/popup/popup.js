"use strict";

window.browser = window.browser || window.chrome;
const crossStorage = chrome.storage || browser.storage;
const storageMethod = crossStorage.local;

let clearButton = document.querySelector("#clear-history");
let version = document.querySelector("#version");

window.browser = window.browser || window.chrome;

storageMethod.get(["theme"], (result) => {
    if (result.theme) document.body.classList.add(result.theme);
});

version.textContent = browser.runtime.getManifest().version;

clearButton.addEventListener("click", (event) => {
    storageMethod.clear();
});


document.querySelector("#more-options").addEventListener("click", () => {
    browser.runtime.openOptionsPage();
});
