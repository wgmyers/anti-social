/*
    localise.js is part of anti-social, a Firefox extension to help users
    stop themselves from wasting too much time on social media.

    Copyright (C) 2018  Wayne Myers (wgmyers@gmail.com)

    anti-social is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
