## v0.7.2 - 2018-08-11
* Remove unsafe calls to innerHTML

## v0.7.1 - 2018-08-11
* Pre-release quick tidy of code.
* Add GPLv3
* Rewrite README

## v0.7.0 - 2018-08-10
* Schedule settings now operational
* popup.js now queries background script for scheduled snooze status

## v0.6.2 - 2018-08-10
* Added weekly schedule settings UI to options page
* Tidied up look of options page a bit
* Cleaned up i18n tags for logic (translations still incomplete)
* localise.js now auto-localises short weekday names
* Weekly schedule settings UI now functional

## v0.6.1 - 2018-08-09
* Removed 'update' button from snooze settings - now autosaves on select change
* Fix startup settings load bug
* Update to less fugly icons
* Update look of popup page

## v0.6.0 - 2018-08-09
* popup.js now honours snooze timeout timeout

## v0.5.4 - 2018-08-09
* Options page now includes timeout settings.
* background.js now honours snooze timeout settings.

## v0.5.3 - 2018-08-08
* options.js now stores site list properly
* options.html updated with warning on 'reset to defaults' button

## v0.5.2 - 2018-08-05
* Blocking toggle now called 'snooze'
* Snooze timeout implemented - can only snooze 5mins each hour
* 'Unsnooze' removed as spurious, since we auto-unsnooze.
* New code now i18n-ready

## v0.5.1 - 2018-08-05
* Timeout on blocking toggle now implemented

## v0.5.0 - 2018-08-02
* Implemented enable/disable feature and show settings in popup
* i18n-ified popup code

## v0.4.2 - 2018-07-30
* JSLinted all js; only one formatting warning left to remove

## v0.4.1 - 2018-07-30
* Implemented non-functional browser popup button

## v0.4.0 - 2018-07-29
* i18n now working so long as locale language pack is installed (I think).
* Now with (dodgy) German translation
* Now with (dodgy) Spanish translation

## v0.3.2 - 2018-07-29
* Added i18n code for all user-visible text
* Added (dodgy) French translation

## v0.3.1 - 2018-07-29
* Added applications and developer keys to manifest.json

## v0.3.0 - 2018-07-29
* Sites can now be removed from blocklist

## v0.2.4 - 2018-07-28
* Options page now uses select multiple not textarea for list of sites

## v0.2.3 - 2018-07-28
* Blocklist handles 'www.' prepending sensibly

## v0.2.2 - 2018-07-28
* Blocklist URLs get slash appended iff required

## v0.2.1 - 2018-07-25
* Improve URL parsing logic

## v0.2.0 - 2018-07-23
* Blocklist in options page is now functional and updates real blocklist

## v0.1.5 - 2018-07-23
* Disabled non-functional buttons in options page
* Implemented 'restore defaults'
* Implemented 'add to block list'
* URLs in block list must be valid and can't be duplicated

## v0.1.4 - 2018-07-22
* Added (non-functional) options page

## v0.1.1 - 2018-07-22
* Added css to blocked.html page

## v0.1.0 - 2018-07-22
* Blocking of hardwired list of sites implemented.
