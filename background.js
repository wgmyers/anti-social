"use strict";

// Default block list
// FIXME - this should live in an external defaults.json file
//         as options.js needs it too
var defaultList =
    ["https://facebook.com/", "https://www.facebook.com/",
    "https://twitter.com/", "https://www.twitter.com/"];

var blockList;
var patterns = [];


// blockFlag
// Annoyingly, more-or-less-the-same code lives in popup.js, but I don't
// yet know how to implement DRY properly around here.
// blockFlag.get() - gets current value,
// blockFlag.load() - reads current value from storage.
// blockFlag.toggle() - toggles blocking
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
        blockOn = result.blockOnFlag.key;
        console.log("background.js setBlockOnFromStorage found", blockOn);
        if (blockOn === undefined) {
            blockOn = blockOnDefault;
        }
    }

    function onError(error) {
        console.log(`blockToggle error: ${error}`);
    }

    function getBlockOn() {
        return blockOn;
    }

    function loadValue() {
        var getting = browser.storage.local.get("blockOnFlag");
        getting.then(setBlockOnFromStorage, onError);
    }

    loadValue();

    return {
        get: getBlockOn,
        load: loadValue,
        toggle: toggleValue
    };

}();

// createBlockList
// Our URL list needs wildcards added to it.
// This function nukes current patterns content,
// iterates through a given list, and populates patterns properly.
// We add * to anything with a trailing slash, but leave deliberately
// constructed URLs without trailing slash alone.
function createBlockList(list) {
    console.log("createBlockList");
    patterns = list.map(function (v) {
        // Add wildcard to anything with trailing slash
        // Leave everything else alone.
        if (v.slice(-1) === "/") {
            return v + "*";
        } else {
            return v;
        }
    });
    patterns.forEach(function (p) {
        console.log(p);
    });
}

// redirect
// Performs the redirection to the blocker page
function redirect(requestDetails) {

    var blockerPage = browser.extension.getURL("pages/blocked.html");

    // Only perform redirect if blocking actually switched on
    if (blockFlag.get()) {
        console.log("Redirecting: " + requestDetails.url);
        return {
            redirectUrl: blockerPage
        };
    } else {
        // console.log("Redirect disabled.");
        // Seems this is all we need to do.
        // HOWEVER - all requests for foo.com/* still now get filtered through
        // here - is this ok or is it worth trying to remove and replace the
        // Listener. I don't know. For now, it Just Works.
    }
}

// updateListener
// Removes any existing listener and replaces with new one.
function updateListener() {

    if (browser.webRequest.onBeforeRequest.hasListener(redirect)) {
        browser.webRequest.onBeforeRequest.removeListener(redirect);
    }

    browser.webRequest.onBeforeRequest.addListener(
        redirect,
        {urls: patterns},
        ["blocking"]
    );
}

// updateSettings
// Populates the block list from storage or defaults
// Updates the patterns array
function updateSettings() {

    function setCurrentBlockList(result) {
        console.log("setCurrentBlockList", result);
        // If no result was returned from storage.local.get,
        // set blockList to the defaultList
        if (result.settings) {
            blockList = result.settings.blockList;
            // While we're here, also update toggler timeout.
            toggler.setSnoozeMins(result.settings.snoozeMins);
        } else {
            blockList = defaultList.slice();
        }
        // populate patterns properly and update listener
        createBlockList(blockList);
        updateListener();
    }

    function onError(error) {
        console.log(`updateSettings error: ${error}`);
    }

    var getting = browser.storage.local.get("settings");
    getting.then(setCurrentBlockList, onError);
}

// redirectAsync
// Performs the redirect asynchronously
// Not currently used, keeping it here in case it becomes useful
//function redirectAsync(requestDetails) {
//    console.log("Redirecting: " + requestDetails.url);
//    return new Promise((resolve, reject) => {
//        window.setTimeout(() => {
//            resolve({blockerPage});
//        }, 2000);
//    });
//}

// toggler
// Handles the auto-timeout of block toggling.
var toggler = function toggler() {

    var promise;
    var snoozeMins = 5;

    function onError(error) {
        console.log(`toggler error: ${error}`);
    }

    // Set timeout for blocker toggle
    function setAlarm() {
        const delayInMinutes = snoozeMins;
        // snoozeMins may be 0, in which case don't bother
        console.log("setAlarm sees snoozeMins as '" + snoozeMins + "' minutes.");
        console.log("snoozeMins is a " + typeof snoozeMins);
        if (snoozeMins === 0) {
            return;
        }
        browser.alarms.create("toggleAlarm", {
            delayInMinutes
        });
        console.log("toggler.setAlarm() set alarm");
    }

    function sendNotification() {
        var blockNotification = "block-notification";

        browser.notifications.create(blockNotification, {
            "type": "basic",
            "iconUrl": browser.extension.getURL("icons/no-entry-96.png"),
            "title": browser.i18n.getMessage("extensionName"),
            "message": browser.i18n.getMessage("notificationMessage")
        });

        //browser.browserAction.onClicked.addListener(()=> {
        //  var clearing = browser.notifications.clear(blockNotification);
        //  clearing.then(() => {
        //    console.log("Cleared notification");
        //  });
        //});

        //console.log("sendNotification: trying to notify user.");
    }

    // Timeout timed out - toggle blocker back on.
    // Don't auto toggle back off if we are in weird state.
    function handleAlarm() {
        if(blockFlag.get() === false) {
            promise = blockFlag.toggle();
            promise.then(sendNotification, onError);
        } else {
            console.log("handleAlarm - block already on - not auto unblocking.");
        }
    }

    // setSnoozeMins
    // Set the number of minutes to snooze
    function setSnoozeMins(mins) {
        snoozeMins = parseInt(mins);
    }

    return {
        setAlarm: setAlarm,
        handleAlarm: handleAlarm,
        setSnoozeMins: setSnoozeMins
    };

}();

// handleMessage
// Listens for messages from popup.js
// The message will be 'doToggle', so we set an alarm to
// undo the toggle in n minutes time.
function handleMessage(request) {
    //console.log("handleMessage: ");
    if(request.message === "doToggle") {
        //console.log("background.js got doToggle message from popup.js");
        toggler.setAlarm();
    } else {
        console.log("background.js got unexpected message")
        console.log(request.message);
    }
}

// checkForUpdate
// Callback for Storage listener -
// If it's blockList in local that has changed, update redirect
// If the blockOn flag that has changed, load the new value.
function checkForUpdate(changes, area) {
    if (area === "local") {
        if (Object.keys(changes).includes("settings")) {
            updateSettings();
        }
        if (Object.keys(changes).includes("blockOnFlag")) {
            blockFlag.load();
        }
    }
}

// Load settings and populate blocking list
updateSettings();

// Listen for changes in storage
browser.storage.onChanged.addListener(checkForUpdate);

// Listen for messages from popup.js
browser.runtime.onMessage.addListener(handleMessage);

// Listener for the toggle alarm
browser.alarms.onAlarm.addListener(toggler.handleAlarm);
