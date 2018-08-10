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
    var blockOn = blockOnDefault;

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

// lastToggle
// Only allows user to toggle blocking once every n hours
var lastToggle = function lastToggle() {
    var lastUsedToggle;
    var disableTimeout = 1000 * 60 * 60; // default to 1 hour

    function onError(error) {
        console.log(`disabler error: ${error}`);
    }

    function savedOK() {
        //console.log("New value of blockOn saved as: ", blockOn);
    }

    function saveLastUsedToggle(timestamp) {
        var lastToggleTime;
        var getting;

        // Check we have really been given a Date object
        //if (timestamp instanceof Date === false) {
        //    return undefined;
        //}

        // Ok, save it, return the promise
        lastToggleTime = {
            key: timestamp
        };
        getting = browser.storage.local.set({
            lastToggleTime
        }).then(savedOK, onError);
        return getting;
    }

    function setLastUsedToggle(result) {
        lastUsedToggle = result.lastToggleTime.key;
        if (lastUsedToggle === undefined) {
            lastUsedToggle = 0;
        }
    }

    function loadLastUsedToggle() {
        var getting = browser.storage.local.get("lastToggleTime");
        getting.then(setLastUsedToggle, onError);
        return getting;
    }

    function okToToggle() {
        var now = Date.now();
        if(!lastUsedToggle) {
            return true;
        }
        if((now - lastUsedToggle) > disableTimeout) {
            return true;
        }
        return false;
    }

    function getLastToggle() {
        return lastUsedToggle;
    }

    function setDisableTimeout(result) {
        var hours = result.settings.snoozeTimeoutHours;
        disableTimeout = 1000 * 60 * 60 * hours;
    }

    function loadDisableTimeout() {
        var getting = browser.storage.local.get("settings");
        getting.then(setDisableTimeout, onError);
    }

    loadLastUsedToggle();
    loadDisableTimeout();

    return {
        ok: okToToggle,
        load: loadLastUsedToggle,
        save: saveLastUsedToggle,
        get: getLastToggle,
        loadDisableTimeout: loadDisableTimeout
    }

}();

// initPopup
// Populate the popup window
function initPopup() {

    var getting;
    var statusLine = document.getElementById("status");
    var toggleButton = document.getElementById("toggle");

    function writeStatus(scheduleFlag) {

        // OK, because we only get here after blockFlag.load's promise
        // has been fulfilled.
        var flag = blockFlag.get();
        var d = lastToggle.get();
        var dStr;

        if(d === undefined) {
            dStr = browser.i18n.getMessage("popupStatusNever");
        } else {
            dStr = new Date(d).toString();
            dStr = dStr.replace(/(\d\d\:\d\d\:\d\d).*$/, "$1"); // lose TZ
        }

        // We need to add the status line
        statusLine.innerHTML =
            browser.i18n.getMessage("popupStatusLastUsed") +
            dStr + "<hr>" +
            ((flag && scheduleFlag) ?
                browser.i18n.getMessage("popupStatusEnabled") :
                browser.i18n.getMessage("popupStatusDisabled")
            );

        // We also need to toggle the 'Snooze' button

        // Grey it out if blockFlag or scheduleFlag are false
        // or if we are currently on a snooze timout
        if(flag === false || scheduleFlag === false || !lastToggle.ok()) {
            toggleButton.className = "disabled";
        }

        // popupSnoozing = Snoozing...
        // popupSnooze = Snooze
        // popupScheduledSnooze - Scheduled Snooze
        // Yes, this is confusing.
        if(scheduleFlag === false) {
            toggleButton.innerHTML = browser.i18n.getMessage("popupScheduledSnooze");
        } else {
            toggleButton.innerHTML =
                (flag ?
                    browser.i18n.getMessage("popupSnooze") :
                    browser.i18n.getMessage("popupSnoozing")
                );
        }
    }

    function onError(error) {
        console.log(`initPopup error: ${error}`);
    }

    function requestScheduleFlag() {
        var message = browser.runtime.sendMessage ({
            "message": "scheduleFlag"
        });
        return message;
    }

    function gotScheduleFlag(message) {
        console.log("gotScheduleFlag got:")
        console.log(message);
        // This function doesn't return a promise, so we have to call
        // writeStatus() here, which seems ugly, but hopefully will work.
        writeStatus(message.response);
    }

    // We need to load blockFlag, which returns a promise,
    // but we also need to message background.js to tell us the schedule status,
    // which is a different promise.
    // Finally we call writeStatus with the response message value.
    // Convolutedly, this happens in gotScheduleFlag, but I can't see how to
    // make this happen in a prettier way.
    getting = blockFlag.load();
    getting.then(requestScheduleFlag, onError)
            .then(gotScheduleFlag, onError);

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

    // If called with true, blocking is on.
    // Send a message to the background script and set lastToggleTime
    // Otherwise, blocking is off - just toggle back on
    function doToggle(flag) {
        var toggling = blockFlag.toggle()
        toggling.then(initPopup, onError);
        if(flag === true) {
            sendMsgToBackground();
            lastToggle.save(Date.now());
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
            toggler.toggle(blockFlag.get());
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
        if (Object.keys(changes).includes("settings")) {
            toggler.loadDisableTimeout();
        }
    }
}

// Listen for changes in storage
browser.storage.onChanged.addListener(checkForUpdate);
