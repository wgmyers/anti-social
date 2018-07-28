// Default block list
// FIXME - this should live in an external defaults.json file
//         as background.js needs it too
var defaultList = ["https://facebook.com/", "https://www.facebook.com/",
                   "https://twitter.com/", "https://www.twitter.com/"];

var blockList;
var listDisplay;

// saveList
// Saves the blocklist to storage
function saveList() {
  browser.storage.local.set({
    blockList
  });
  console.log("saveList");
  for (var i of blockList) {
    console.log(i);
  }
}

// updateList
// Updates the textarea with current block list
function updateList(list) {
  document.getElementById("blockitems").value = list.join('\n');
}

// isUrlOk
// Validates candidate additions to blockList
function isUrlOk(url) {

  function isUrlInList(url) {
    return blockList.includes(url);
  }

  function isUrlValid(url) {
    // Found on stackoverflow
    //https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
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

// addToBlockList
// Adds a URL to block list
function addToBlockList(e) {
  e.preventDefault(); // prevent default form 'submit' action

  // Get new url to add from form.
  var newUrl = document.getElementById("newsite").value;

  // Validate url
  if(isUrlOk(newUrl) === true) {
    // If ok, add to block list,
    // otherwise silently do nothing
    // Save list also so it persists
    // Add trailing slash if domain only given and slash missing
    newUrl = addSlashIfNeeded(newUrl);
    blockList.push(newUrl);
    updateList(blockList);
    saveList();
  }

}

// restoreDefaults
// Restores the default block list
function restoreDefaults(e) {
  e.preventDefault(); // prevent default form 'submit' action

  blockList = defaultList.slice();

  updateList(blockList);
  saveList();
}

// restoreOptions
// Called on option page load,
// Loads current blocklist and displays it
function restoreOptions() {

  function setCurrentBlockList(result) {

    // If no result was returned from storage.local.get,
    // set blockList to the defaultList
    blockList = result.blockList || defaultList.slice();

    // populate textarea
    updateList(blockList);

  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("blockList");
  getting.then(setCurrentBlockList, onError);

}

// On load, populate block list with current list
document.addEventListener("DOMContentLoaded", restoreOptions);

// Enable Restore Defaults button
document.getElementById("reset").addEventListener("submit", restoreDefaults);

// Enable Add URL button
document.getElementById("add").addEventListener("submit", addToBlockList);
