// Default block list
// FIXME - this should live in an external defaults.json file
//         as background.js needs it too
var defaultList = ["https://facebook.com/", "https://www.facebook.com/",
                   "https://twitter.com/", "https://www.twitter.com/"];
var blockList;
var patterns = [];

var blockerPage = browser.extension.getURL("pages/blocked.html");

// createBlockList
// Our URL list needs wildcards added to it.
// This function nukes current patterns content,
// iterates through a given list, and populates patterns properly
function createBlockList(list) {
  console.log("createBlockList");
  patterns = list.map( function(v) {
    return v + "*";
  });
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
function redirectAsync(requestDetails) {
  console.log("Redirecting: " + requestDetails.url);
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve({blockerPage});
    }, 2000);
  });
}

// redirect
// Performs the redirection to the blocker page
function redirect(requestDetails) {
  console.log("Redirecting: " + requestDetails.url);
  return {
    redirectUrl: blockerPage
  };
}

// checkForUpdate
// Callback for Storage listener -
// If it's blockList in local that has changed, update redirect
function checkForUpdate(changes, area) {
  if (area === 'local') {
    if (Object.keys(changes).includes('blockList')) {
      updateBlockList();
    }
  }
}

// Populate our blocking list (this also updates the listener)
updateBlockList();

// Listen for changes in storage
browser.storage.onChanged.addListener(checkForUpdate);
