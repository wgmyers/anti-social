## TODO

* Allow user to set times when blocking should occur
* Allow user to remove items from block list individually
* Auto-handling of 'www.' prefix and trailing slash on blocklist
* Implement optional enable/disable blocking browser button (?)
* Implement optional timeout on browser button (?)
* Per-site blocking times(?)
* Decide on licensing
* Figure out signing / publishing process

## Issues

* URL handling is super-naive and needs thinking through. There is currently the
implicit assumption that we will only try to block top-level domains - in which
case we ought to enforce this properly, force the addition of the trailing
slash, autoblock foo.com if www.foo.com added to the list and (?) auto-block both
http:// and https:// - but what if a user does want to block a specific page?
