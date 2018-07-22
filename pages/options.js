// Default block list
var defaultList = ["https://facebook.com/", "https://www.facebook.com/",
                   "https://twitter.com/", "https://www.twitter.com/"];

var blockList;
var listDisplay;

function saveOptions(e) {
  e.preventDefault(); // I don't know what this is for
  browser.storage.local.set({
    blocklist: blockList
  })
}

function restoreOptions() {

  function setCurrentBlockList(result) {

    // If no result was returned from storage.local.get,
    // set blockList to the defaultList
    blockList = result.value || defaultList;

    // populate textarea
    document.getElementById("blockitems").value = blockList.join('\n');

  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("blocklist");
  getting.then(setCurrentBlockList, onError);

}

document.addEventListener("DOMContentLoaded", restoreOptions);

// Copied and pasted from tutorial: this won't work here
// document.querySelector("form").addEventListener("submit", saveOptions);
