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
// May be over-engineered.
// Thing is, we need to allow popup.js, and possibly also options.js to alter
// the value of blockOn in storage, but somehow access it here.
// background.js does not need to alter the value, just read it,
// so our two visible methods are:
// blockFlag.get() - gets current value,
// blockFlag.load() - reads current value from storage.
var blockFlag = function blockToggle() {
    var blockOnDefault = true;
    var blockOn;

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
        load: loadValue
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

// updateBlockList
// Populates the block list from storage or defaults
// Updates the patterns array
function updateBlockList() {

    function setCurrentBlockList(result) {
        // If no result was returned from storage.local.get,
        // set blockList to the defaultList
        blockList = result.blockList || defaultList.slice();
        // populate patterns properly and update listener
        createBlockList(blockList);
        updateListener();
    }

    function onError(error) {
        console.log(`updateBlockList error: ${error}`);
    }

    var getting = browser.storage.local.get("blockList");
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

// checkForUpdate
// Callback for Storage listener -
// If it's blockList in local that has changed, update redirect
// If the blockOn flag that has changed, load the new value.
function checkForUpdate(changes, area) {
    if (area === "local") {
        if (Object.keys(changes).includes("blockList")) {
            updateBlockList();
        }
        if (Object.keys(changes).includes("blockOnFlag")) {
            blockFlag.load();
        }
    }
}

// Populate our blocking list (this also updates the listener)
updateBlockList();

// Listen for changes in storage
browser.storage.onChanged.addListener(checkForUpdate);
