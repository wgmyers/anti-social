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
* You can control when the blocker operates both with a weekly schedule and with a snooze button.
* The weekly schedule indicates which days anti-social should block sites: eg, only block Monday to Friday.
* On days when blocking is on, you can set an automatic window when blocking is temporarily turned off: eg, don't block at lunchtime.
* If you don't want an automatic window, you can set the length of it to zero, and there won't be one.
* You can turn blocking off with a 'snooze' button in the popup menu, but it comes back on again after five minutes.
* If you use the 'snooze' button, you can't use it again for the next hour.
* You can change these default snooze timeouts; snooze can be up to 30 minutes, snooze timeout up to six hours.
* If you set the snooze timeout to zero, you can snooze as often as you like: use of this option is between you and your conscience.

anti-social is still in the pre-release stage, so there's no package or licence yet. When it's ready for release there will be some kind of FLOSS licence for sure.

### Why not release it already?

I'm about to. As of now - 10th August 2018, 20:45, I've implemented all the features on my todo list and they seem to be working.

There's bound to be all kinds of bugs in it that I haven't found yet though.

But, yes, time to release already, so when I've decided which flavour of free licence to use, I'll package it up and - all being well - it will soon be available in the Firefox extensions repository. I have no idea how long that takes; I imagine it needs to go through some kind of code review.

### But I want to try it now

If you are comfortable installing temporary web extensions from source, have at it. Any and all feedback gratefully received. Caveats: doubt it'll work anywhere other than Firefox, for now (if it does I'll be delighted and astonished), and as a temporary extension, it's not going to remember its blocklist or any other settings between installations.

### This is your first go at a web extension isn't it

Is it that obvious?

### Yes

Thanks.
