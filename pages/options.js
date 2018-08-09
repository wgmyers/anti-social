"use strict";

// Default settings object
// FIXME - this should live in an external defaults.json file
//         as background.js, popup.js need it too
var defaults = {
    blockList:
        ["https://facebook.com/", "https://www.facebook.com/",
        "https://twitter.com/", "https://www.twitter.com/"],
    snoozeMins: 5,
    snoozeTimeoutHours: 1
};

var settings = {
    blockList: defaults.blockList.slice(),
    snoozeMins: defaults.snoozeMins,
    snoozeTimeoutHours: defaults.snoozeTimeoutHours
}

// saveSettings
// Saves the settings to storage
function saveSettings() {
    browser.storage.local.set({
        settings
    });
    console.log("saveSettings");
    console.dir(settings);
}

// updateList
// Updates the multi-select box with current block list
function updateList(list) {
    var selector = document.getElementById("blockitems");
    while(selector.hasChildNodes()) {
        selector.removeChild(selector.childNodes[0]);
    }
    list.forEach(function(el) {
        var line = document.createElement("option");
        line.textContent = el;
        line.value = el;
        selector.appendChild(line);
    });
}

// removeSelected
// Removes selected items from the blockList
function removeSelected(e) {
    e.preventDefault(); // prevent default form 'submit' action

    var selector = document.getElementById("blockitems");

    // Check we have nodes that might be selected (list could be empty)
    if(selector.hasChildNodes()) {
        // Use Array.from here as we will modify the actual hasChildNodes
        // when we iterate over it below - this avoids weirdness
        var nodes = Array.from(selector.childNodes);

        // For each selected node we:
        // a) remove it from blocklist
        // b) remove it from selector
        // Finally, we save the new blocklist
        // No need to call updateList as we call removeChild right here
        nodes.forEach(function(site) {
            if(site.selected) {
                //console.log(site.value);
                var i = settings.blockList.indexOf(site.value);
                settings.blockList.splice(i,1);
                selector.removeChild(site);
            }
        });
        saveList();
    }
}

// isUrlOk
// Validates candidate additions to blockList
function isUrlOk(url) {

    function isUrlInList(url) {
        return settings.blockList.includes(url);
    }

    function isUrlValid(url) {
        // Found on stackoverflow
        // stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
        try {
            new URL(url);
            return true;
        } catch (_) {
            console.log(`isUrlValid: ` + url);
            return false;
        }
    }

    var ret = false;
    if((isUrlValid(url) === true) && (isUrlInList(url) === false)) {
        ret = true;
    }
    return ret;
}

// addSlashIfNeeded
// Checks if given url is domain only,
// If so, ensures trailing slash is present
function addSlashIfNeeded(url) {
    var testURL = new URL (url);
    // This will Do The Right Thing:
    // ie add trailing '/' if needed, but
    // leave it alone if pathname is more than just '/'
    url = testURL.href;
    return url;
}

// addWwwIfNeeded
// Takes candidate URL and checks it is of form foo.bar
// If so, returns new URL of form www.foo.bar -
// Otherwise returns undefined
function addWwwIfNeeded(url) {
    var testURL = new URL (url);

    // We only add www. to domains of form foo.bar,
    // We leave domains of form foo.bar.baz alone.
    if((testURL.hostname.slice(0,4) !== "www.") &&
        (testURL.hostname.indexOf(".") === testURL.hostname.lastIndexOf("."))) {
            testURL.hostname = "www." + testURL.hostname;
            return testURL.href;
    }

    return;
}

// addToBlockList
// Adds a URL to block list
function addToBlockList(e) {
    e.preventDefault(); // prevent default form 'submit' action

    // Get new url/s to add from form.
    var newUrl = document.getElementById("newsite").value;
    var newUrlWithWWW;

    // Validate url
    if(isUrlOk(newUrl) === true) {
        // If ok, add to block list,
        // otherwise silently do nothing
        // Save list also so it persists
        // Add trailing slash if domain only given and slash missing
        newUrl = addSlashIfNeeded(newUrl);
        settings.blockList.push(newUrl);
        // Check to see if we also need to block with prepended 'www.'
        newUrlWithWWW = addWwwIfNeeded(newUrl);
        if(newUrlWithWWW && (!settings.blockList.includes(newUrlWithWWW))) {
            settings.blockList.push(newUrlWithWWW);
        }
        updateList(settings.blockList);
        saveSettings();
    }
}

// restoreDefaults
// Restores the default block list
function restoreDefaults(e) {
    e.preventDefault(); // prevent default form 'submit' action
    settings.blockList = defaults.blockList.slice();
    settings.snoozeMins = defaults.snoozeMins;
    settings.snoozeTimeoutHours = defaults.snoozeTimeoutHours;
    updateList(settings.blockList);
    saveSettings();
}

// restoreOptions
// Called on option page load,
// Loads current blocklist and displays it
function restoreOptions() {

    function setCurrentBlockList(result) {
        // If no result was returned from storage.local.get,
        // set blockList to the defaults.blockList
        settings.blockList = result.blockList || defaults.blockList.slice();
        // populate textarea
        updateList(settings.blockList);
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.local.get("settings");
    getting.then(setCurrentBlockList, onError);
}

// On load, populate block list with current list
document.addEventListener("DOMContentLoaded", restoreOptions);

// Enable Remove Selected button
document.getElementById("blocked").addEventListener("submit", removeSelected);

// Enable Restore Defaults button
document.getElementById("reset").addEventListener("submit", restoreDefaults);

// Enable Add URL button
document.getElementById("add").addEventListener("submit", addToBlockList);
