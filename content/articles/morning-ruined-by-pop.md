+++
title = "A morning ruined by Pop"
date = 2022-04-10
draft = true
+++

> 💡 The tale of how Pop OS stole a morning from me

Its 5pm. Its a Wednesday.

I'm hacking on a new Docker build pipeline for my project at work. Basically the backend would be a whole lot nicer to work in if it had a consistent build and deployment, but alas this is likely the topic for another piece.

Suffice as to say, I'm experimenting with some new paradigms.

Hours pass, I try many failing experiments. Frustration is mounting, inadequately counter balanced by the small progress made towards my shining goal on the horizon.

My build reaches step 22 of 36. A new record. Rejoice rejoice.

The error feels like one I should be able to tackle with relative ease, so I tell myself this is the last run.

I re-jig the Dockerfile a final time and run ye olde faithful `docker build -t NOT_THE_REAL_NAME .`

A new failure. Earlier in the Dockerfile. "No space on disk". Great. And its on the root partition. This is the one which stores all of the global packages and apps on my PopOS machine. Basically whenever you do a `sudo apt install` it will be installing to one of the scary depths of the root partition (specifically `/var/cache/apt/archives` in that case).

I suppose at this point I should paint the landscape of my machine. The PopOS install consists of 4 partitions:

- Home partition `/home/` - my stuff
- Root partition `/` - system stuff
- Swap partition - a place for RAM stuff to happen
- Boot partition - a lot more of this spicy fella to come

So its pretty neat right? Operating system stuff is safely segregated from my home files. If disaster was to strike I'd have a chance of retrieving my home files.

Spoiler alert\* - disaster may strike.

Anyway, so no stress right, just clear out some old cached packages and root will limber on happy enough to not bother me during my important work.

```bash
sudo apt-get clean
sudo apt-get autoclean
sudo apt-get autoremove
```

There is differences between what each does, but I was under the impression that throwing this trifecta of cleanliness down on a TTY was enough to purge any outdated or unused packages and give you back that bit of headroom needed to move forward in life.

This brings us onto the topic of [Linux Kernels](https://en.wikipedia.org/wiki/Linux_kernel), they are often one of the more sizeable packages which need cleaning. They get updated reasonably often, and the old ones can be kept hanging around, but really you only need the previous one (in case of a kernel related emergency and rollback is the only option). Hold that thought.

So I pack up for the night. My head is a mess from the docker madness.

Skip forward til morning. Coffee in hand I go to power up my workstation.

I'm greeted by a mess of what I assume is text cassading from right to left at a disjointed angle on a black background. WTF?

I slam on the keyboard, I disconnect and reconnect and redisconnect the monitors, the power supply, I jiggle the mouse I disconnect the mouse and jiggle the trackpad. No use. So I start a methodically off and on again routine. Off and on, same result, off and on again, same same.

The moment of panic eventually passes as I remember that this is not the only tool in my tool belt. I do know some things about this stuff. At least that's what I tell management.

I power off by holding the power button and then back on, but this time I bang all the F keys repetitively. One of them I'm sure triggers the opening of BIOS settings. I don't get it the first try so I focus my fingering to the first 3 keys. Success. It is one of them (I still don't know which one, but think maybe its F1 or F2).

Ok so BIOS is fine, that means the hardware is somewhat OK at least. I mean its basically always a software issue right!

I should probably note that time is ticking at this point. I have my daily standup at 9.15. Thankfully I got cracking early today. A roll-out-of-bed-and-get-to-it approach would not have worked at all on a day like today. But there's pressure. I need this machine to work to be able to dial in.

9am rolls around. This is clearly going to take longer to sort than the 15 minutes I have left before I have to face to digital face with the team.

Time to cut my losses and hop onto my personal machine. Its a little dusty but functional at least.

I get all my work accounts setup and dial in on time to the standup. There are jokes about my incompetence (made mostly by me!) My manager swears that this occurrence happens at least once a year for Linux users. I'm inclined to agree. In fact once a year sounds pretty stable in comparison to my setups. Queue the Arch flashbacks 🪖

Back to the coalface. I need my machine back.

Where is that USB flash drive I have? I'm sure I have multiple, but of course when they're needed most is when they choose to disappear. Why do I need a flash drive? I need something to boot into. My machine is thundering into BIOS just fine, so the issue is clearly happening after this point. That's when the hand off to your OS of choice happens.

I eventually beg my partner to give me one and thankfully the one she finds is 8Gb - big enough to hold an ISO for a distro I can boot from. I slam the stick into my personal machine and get a PopOS ISO downloading. When its done I use USB Flasher to flash the ISO onto the flash drive.

![[flasher 1.png]]

Flashing complete, time to put it to use.

So from Bios I boot into the USB drive I'm welcomed by the familiar PopOS welcome screen, as if I was starting a fresh install. I find the terminal so I can check what's going on with the machines harddrives.

`lsblk` is the command to see what drives and partitions are available. Using this I work out which partitions relate to my home and root and boot partitions.

`sudo mount /dev/sda4 /mnt/safezone` is how you take one of those partitions and mount it ready for action. The sda4 part might be different depending on how your hardrive is set up. Also safezone any name.

So I mount the root partition o

### Final Thoughts

There's been quite a load of Pop-`bash`ing (in and out of the terminal lol!) but I just want to be clear that overall Pop is a freaking great distro. Its 100% up there as one of my favourites. The theming is crisp and beautiful. I think of it as the closest thing to a Mac-like experience to be found in Linux land. Or at least so far that I've found.

Other than this hiccup, the only other major annoyance I have with Pop is the tendency to constantly change around what `Cmd + P` does. Not sure if this is just me but sometimes it switches applications - think that was my choice of setting if I remember correctly - and other times it decides to bring up a change display function menu which I can't get out of and whichever option I pick ruins my carefully picked 3 monitor setup. Small bugbear.

Here's a great [comment](https://askubuntu.com/a/846172) on whether the Swap partition is structured or not. The answer is no, _but_ it can be. [rootfs](https://www.kernel.org/doc/Documentation/filesystems/ramfs-rootfs-initramfs.txt) and initramfs are on the structured side, and its the initramfs which is inside the boot partition. Interesting!

### References:

[](https://askubuntu.com/a/846172)[https://askubuntu.com/a/846172](https://askubuntu.com/a/846172)

[](https://www.kernel.org/doc/Documentation/filesystems/ramfs-rootfs-initramfs.txt)[https://www.kernel.org/doc/Documentation/filesystems/ramfs-rootfs-initramfs.txt](https://www.kernel.org/doc/Documentation/filesystems/ramfs-rootfs-initramfs.txt)

[](https://en.wikipedia.org/wiki/Linux_kernel)[https://en.wikipedia.org/wiki/Linux_kernel](https://en.wikipedia.org/wiki/Linux_kernel)
