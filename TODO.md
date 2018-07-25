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
* Here is the best-yet logic for this: if a site is added which is just a domain,
enforce addition of a slash. If a site is added which is domain + something else,
leave it alone. When constructing the block list, add * only if given element
ends in slash (thus allowing specific page blocks but also auto-blocking
instances of site + sub-directory for that sub-directory only). Also, if given
a domain of form www.foo.com, also add foo.com. And vice versa, but only if
given domain is x.y, not x.y.z.
