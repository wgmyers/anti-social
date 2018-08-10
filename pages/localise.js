"use strict";

// Modified WITH TEARS, PAIN AND SHOUTING from code found on
// https://stackoverflow.com/questions/25467009/
// internationalization-of-html-pages-for-my-google-chrome-extension

function replace_i18n(obj, tag) {
    var msg;
    var tr;
    var trOptions = {
        weekday: "short"
    };
    var date;

    // Handle weekdays separately
    if(tag.slice(0,7) === "weekday") {
        // Handle weekdays separately
        // We ensure the last character of all weekday data-localize tags is
        // numeric, Sun=1, Mon=2, etc.
        // Using the fact that 1st January 1978 was a Sunday
        // we can now do this:
        date = new Date(1978, 0, tag.slice(-1));
        tr = new Intl.DateTimeFormat(browser.i18n.getUILanguage(), trOptions).format;
        msg = tr(date);
    } else {
        // Handle normal messages in the normal way
        msg = browser.i18n.getMessage(tag);
    }
    if (msg) {
        obj.textContent = msg;
    }
}

function localiseHtmlPage() {
    // Localize using __MSG_***__ data tags
    var data = document.querySelectorAll("[data-localize]");
    data.forEach(function (el) {
        var tag = el.getAttribute("data-localize").toString();
        replace_i18n(el, tag);
    });
}

localiseHtmlPage();
