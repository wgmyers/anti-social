## TODO

* Allow user to set times when blocking should occur
* Implement optional timeout on browser button
* Per-site blocking times(?)
* Decide on licensing
* Figure out signing / publishing process

## NOTES

Current Stupid Bug: the timed de-toggle implementation with alarms works, but only
if you keep the popup open.

That's because I'm doing the right thing by using alarms (indeed, the only thing,
since the Webextension API does not let you use setTimeout) but I'm Doing It Wrong
by putting the heavy lifting in popup.js - which gets unloaded each time you close
it, rather than background.js - which is where any Must Be Always On heavy lifting
should be.

So having finally got the toggle to work at all, I now need to refactor it so the
real work takes place in background.js, and popup.js just tells background.js what
to do. Then the alarms will be set in background.js, as Mozilla and the Good Lord
clearly intended, and the timeout thing will work properly.

I imagine this will involve using Messages.
