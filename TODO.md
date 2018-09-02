## TODO

* Proper code tidy up
* Get feedback on and correct fr, es, de translations
* Ask for more translations
* Port to Chrome

## ISSUES
* Scheduled snooze does not currently trigger notifications: this is non-trivial as we only test for this on site visit or popup display so would need to set explicit timed alarms. Also, do we *want* 'Scheduled Snooze On/Off' notifications? Not sure.

## NOTES

* Notifications are ugly on my version of Ubuntu: that is related to this bug:
https://bugzilla.mozilla.org/show_bug.cgi?id=1383964 and my only fix is to not use
notifications. WONTDO: if we're changing the state of the browser behind the users
back - and that is intrinsic to auto-timing out a block toggle - we must let the
user know we have done so. So ugly notifications for some it is.
* Could do with prettification: in particular the options UI needs work / clarification, and the popup is tiny on Android.
* browser.local.storage is not visible directly in the about:debugging debugger - see: https://bugzilla.mozilla.org/show_bug.cgi?id=1292234 - debug console workaround:

    ```browser.storage.local.get(null, function(items) { console.log(items); });```
* Up to 0.7.3, uninstall/reinstall or unload/reload while snoozing resulted in permanent snooze state; need to ensure sane state on initial load. This should now be fixed, but if not, the debug console workaround is:

    ```var blockOnFlag = { key: true }; browser.storage.local.set({blockOnFlag});```

* Packaging notes from https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Package_your_extension_

    ```zip -r -FS ../my-extension.zip *```
