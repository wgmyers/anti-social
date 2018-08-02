"use strict";

// blockFlag
// May be over-engineered.
// Definitely unhappy with having the same code copypasta'ed from background.js
// but don't yet know how to share a function between two different parts of
// a webextension in a sensible way.
// Here we need to expose (and implement) an extra method that implements the
// actual toggling:
// blockFlag.toggle() - gets current value, flips it, stores new value
// blockFlag.get() - gets current value,
// blockFlag.load() - reads current value from storage.
var blockFlag = function blockToggle() {
    var blockOnDefault = true;
    var blockOn;

    function savedOK() {
        console.log("New value of blockOn saved as: ", blockOn);
    }

    function saveValue() {
        var blockOnFlag = {
            key: blockOn
        };
        var getting = browser.storage.local.set({
            blockOnFlag
        }).then(savedOK, onError);
        return getting;
    }

    function toggleValue() {
        blockOn = !blockOn;
        return saveValue();
    }

    function setBlockOnFromStorage(result) {
        console.log("setBlockOnFromStorage");
        console.dir(result);
        blockOn = result.blockOnFlag.key;
        if (blockOn === undefined) {
            blockOn = blockOnDefault;
        }
    }

    function onError(error) {
        console.log(`blockToggle error: ${error}`);
    }

    function loadValue() {
        var getting = browser.storage.local.get("blockOnFlag");
        getting.then(setBlockOnFromStorage, onError);
        return getting;
    }

    function getBlockOn() {
        return blockOn;
    }

    loadValue();

    return {
        get: getBlockOn,
        load: loadValue,
        toggle: toggleValue
    };

}();

function initPopup() {

    var getting;
    var statusLine = document.getElementById("status");
    var toggleButton = document.getElementById("toggle");

    function writeStatus(flag) {

        var flag = blockFlag.get();

        console.log("initPopup thinks flag is: ", flag);

        // We need to add the status line
        statusLine.innerHTML = "Status: " + (flag ? "Enabled" : "Disabled");

        // We also need to toggle the 'Enable/Disable' button
        toggleButton.innerHTML = (flag ? "Disable" : "Enable");
    }

    function onError(error) {
        console.log(`initPopup error: ${error}`);
    }

    getting = blockFlag.load();
    getting.then(writeStatus, onError);

}

// On load, populate popup HTML properly with curreent values
document.addEventListener("DOMContentLoaded", initPopup);

document.addEventListener("click", function(e) {
    if (!e.target.classList.contains("choice")) {
        return;
    }

    function onOpened() {
        console.log(`Options page opened`);
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    switch(e.target.id) {
        case "settings":
            var opening = browser.runtime.openOptionsPage();
            opening.then(onOpened, onError);
            break;
        case "toggle":
            var toggling = blockFlag.toggle()
            toggling.then(initPopup, onError);
            break;
        default:
            // Do nothing
            break;
    }

});
