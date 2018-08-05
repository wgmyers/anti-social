## anti-social

A browser extension aimed at increasing human happiness by blocking social
media sites.

### Oh, like Impulse Blocker.

Yes, much like [Impulse Blocker](https://addons.mozilla.org/en-US/firefox/addon/impulse-blocker/).

### And Block Site.

Yes. A lot like [Block Site](https://addons.mozilla.org/en-US/firefox/addon/block-site-2/).

### And that other one you found last week but can't find now

Yes. That was the very phone-homey one. ~~I'll link to it here when I find it again.~~

UPDATE: Found it, it is/was (confusingly) also called 'BlockSite' (no space) and is/was not just phone-homey but also generally annoying in other ways to the extent of being widely regarded as malware. It has now been withdrawn from the Firefox extension repository, from the Chrome Store and from Google Play. Not linking to it.

anti-social will *never* phone home or collect any data from users in any way.

### And SelfControl

Sort of. Not really. [SelfControl](https://selfcontrolapp.com/) does the same sort of thing but at the network level. Plus it's Mac only. anti-social is a Firefox extension; it doesn't mess with your hosts file and it's not a proxy. (*Translation from Geek: anti-social only works in Firefox - it does not stop you from accessing blocked sites using other programs. SelfControl and the other programs mentioned in this paragraph work on your whole internet connection, and stop you from accessing blocked sites completely.*) If you want something like that there's also [SelfRestraint](https://github.com/ParkerK/selfrestraint/) for Windows and [Chomper](https://github.com/aniketpanjwani/chomper) for Linux. I haven't tried any of them so am slightly hazy on how they actually work.

### What's different about anti-social, then?

* You can block specific pages, directories, or whole domains.
* You turn blocking off with a 'snooze' button in the popup menu, but it comes back on again after five minutes.
* If you use the 'snooze' button, you can't use it again for the next hour.

anti-social is still in the pre-release stage, so there's no package or licence yet. When it's ready for release there will be some kind of FLOSS licence for sure.

### Why not release it already?

There are core features I haven't added yet:
* Toggle timeout: length should be settable by the user, and so should the length of time before you are allowed to use it again.
* Automatic toggles: so you can allow yourself say one or two hours of social media per day at set times without faffing about with toggle buttons.

When I've implemented those, I'll package it up for release.

### But I want to try it now

If you are comfortable installing temporary web extensions from source, have at it. Any and all feedback gratefully received. Caveats: doubt it'll work anywhere other than Firefox, for now (if it does I'll be delighted and astonished), and as a temporary extension, it's not going to remember its blocklist or any other settings between installations.

### This is your first go at a web extension isn't it

Is it that obvious?

### Yes

Thanks.
