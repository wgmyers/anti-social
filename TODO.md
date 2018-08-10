## TODO

* Decide on licensing
* Figure out signing / publishing process
* Code tidy up
* Complete fr, es, de translations
* Ask for more translations

## NOTES

* Notifications are ugly on my version of Ubuntu: that is related to this bug:
https://bugzilla.mozilla.org/show_bug.cgi?id=1383964 and my only fix is to not use
notifications. WONTDO: if we're changing the state of the browser behind the users
back - and that is intrinsic to auto-timing out a block toggle - we must let the
user know we have done so. So ugly notifications for some it is.
* Icons need to be prettier.
* Popup needs some serious restyling / rewording
* Options UI needs work
* browser.local.storage is not visible directly in the about:debugging debugger - see:
https://bugzilla.mozilla.org/show_bug.cgi?id=1292234 - however there is a workaround
involving typing 'browser.storage.local.get(null, function(items) { console.log(items); });'
into the about:debugging debugger console.
* Weekday picker was taken from codepen here: https://codepen.io/steelwater/pen/BjeZQx
so I need to include an MIT licence somewhere in acknowledgement.
