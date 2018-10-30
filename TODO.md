## TODO

* Proper code tidy up
* Get feedback on and correct es, de translations
* Ask for more translations
* Port to Chrome

## ISSUES
* Scheduled snooze does not currently trigger notifications: this is non-trivial as we only test for this on site visit or popup display so would need to set explicit timed alarms. Also, do we *want* 'Scheduled Snooze On/Off' notifications? Not sure.

## NOTES

* Notifications are ugly on my version of Ubuntu (14.04): that is related to this bug:
https://bugzilla.mozilla.org/show_bug.cgi?id=1383964 and my only fix is to not use
notifications. WONTDO: if we're changing the state of the browser behind the users
back - and that is intrinsic to auto-timing out a block toggle - we must let the
user know we have done so. So ugly notifications for some it is. 14.04 has less than
six months till EOL anyway.
* Could do with prettification: in particular the options UI needs work / clarification, and the popup is tiny on Android.
* browser.local.storage is not visible directly in the about:debugging debugger - see: https://bugzilla.mozilla.org/show_bug.cgi?id=1292234 - debug console workaround:

    ```browser.storage.local.get(null, function(items) { console.log(items); });```
* Up to 0.7.3, uninstall/reinstall or unload/reload while snoozing resulted in permanent snooze state; need to ensure sane state on initial load. This should now be fixed, but if not, the debug console workaround is:

    ```var blockOnFlag = { key: true }; browser.storage.local.set({blockOnFlag});```

* Packaging notes from https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Package_your_extension_

    ```zip -r -FS ../my-extension.zip *```

* Chrome port #1 - will need rewrite of at least some of the promise based code.
Chrome has promises but they are unimplemented in the chrome webextensions API -
see: https://bugs.chromium.org/p/chromium/issues/detail?id=328932
* Chrome port #2 - There are various polyfills available to solve the promises
issue, including then-chrome (https://www.npmjs.com/package/then-chrome) and
webextension-polyfill (https://github.com/mozilla/webextension-polyfill), but
none of them fully support the webRequest API which provides the core blocking
functionality we need. Better to look into rewriting for chrome with callbacks then.
