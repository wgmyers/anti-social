"use strict";

// blockFlag
// May be over-engineered.
// Definitely unhappy with having the same code copypasta'ed from background.js
// but don't yet know how to share a function between two different parts of
// a webextension in a sensible way.
// blockFlag.toggle() - gets current value, flips it, stores new value
// blockFlag.get() - gets current value,
// blockFlag.load() - reads current value from storage.
var blockFlag = function blockToggle() {
    var blockOnDefault = true;
    var blockOn;

    function savedOK() {
        //console.log("New value of blockOn saved as: ", blockOn);
    }

    // Return the promise so callers can access it
    function saveValue() {
        var blockOnFlag = {
            key: blockOn
        };
        var getting = browser.storage.local.set({
            blockOnFlag
        }).then(savedOK, onError);
        return getting;
    }

    // Return the promise so callers can access it
    function toggleValue() {
        blockOn = !blockOn;
        return saveValue();
    }

    function setBlockOnFromStorage(result) {
        //console.log("setBlockOnFromStorage");
        //console.dir(result);
        blockOn = result.blockOnFlag.key;
        if (blockOn === undefined) {
            blockOn = blockOnDefault;
        }
    }

    function onError(error) {
        console.log(`blockToggle error: ${error}`);
    }

    // Return the promise so callers can access it
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

// initPopup
// Populate the popup window
function initPopup() {

    var getting;
    var statusLine = document.getElementById("status");
    var toggleButton = document.getElementById("toggle");

    function writeStatus(flag) {

        // OK, because we only get here after blockFlag.load's promise
        // has been fulfilled.
        var flag = blockFlag.get();

        //console.log("initPopup thinks flag is: ", flag);

        // We need to add the status line
        statusLine.innerHTML =
            (flag ?
                browser.i18n.getMessage("popupStatusEnabled") :
                browser.i18n.getMessage("popupStatusDisabled")
            );

        // We also need to toggle the 'Enable/Disable' button
        toggleButton.innerHTML =
            (flag ?
                browser.i18n.getMessage("popupDisable") :
                browser.i18n.getMessage("popupEnable")
            );
    }

    function onError(error) {
        console.log(`initPopup error: ${error}`);
    }

    // We can't call writeStatus until the promise is fulfilled
    getting = blockFlag.load();
    getting.then(writeStatus, onError);

}

// toggler
// Implement toggling block on and off
var toggler = function handleToggle() {

    var message;

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    function sendMsgToBackground() {
        var message = browser.runtime.sendMessage({
            "message": "doToggle"
        });
    }

    // If called with true, send a message to the background script
    function doToggle(flag) {
        var toggling = blockFlag.toggle()
        toggling.then(initPopup, onError);
        if(flag === true) {
            sendMsgToBackground();
        } else {
            console.log("doToggle received false.");
        }
    }

    return {
        toggle: doToggle
    };

}();

// On load, populate popup HTML properly with current values
document.addEventListener("DOMContentLoaded", initPopup);

// Listener handling button clicks on the popup window itself
document.addEventListener("click", function(e) {
    if (!e.target.classList.contains("choice")) {
        return;
    }

    function onOpened() {
        //console.log(`Options page opened`);
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
            toggler.toggle(true);
            break;
        default:
            // Do nothing
            break;
    }

});

// checkForUpdate
// Callback for Storage listener -
// In the event that the background alarm triggers while the popup is open,
// we need to handle it and update ourselves.
function checkForUpdate(changes, area) {

    var promise;

    function onError(error) {
        console.log(`checkForUpdate error: ${error}`);
    }

    if (area === "local") {
        if (Object.keys(changes).includes("blockOnFlag")) {
            promise = blockFlag.load();
            promise.then(initPopup, onError)
        }
    }
}

// Listen for changes in storage
browser.storage.onChanged.addListener(checkForUpdate);
