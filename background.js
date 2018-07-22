var patterns = ["https://www.facebook.com/*", "https://facebook.com/*",
                "https://www.twitter.com/*", "https://twitter.com/*",
                "http://www.basha.org/*", "http://basha.org/*"];

var blockerPage = browser.extension.getURL("pages/blocked.html");

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

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  {urls: patterns},
  ["blocking"]
);
