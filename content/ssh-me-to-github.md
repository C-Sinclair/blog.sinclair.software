+++
title = "SSH me to Github"
icon = "🐙"
date = 2021-03-21

[taxonomies]
tags = ["SSH", "Git"]
+++

<aside>
🔥 SSH randomly no longer wanting to work when pushing/pulling/fetching etc?

</aside>

<!-- more -->

After a good half an hour of confusion at why both my work laptop and home arch box are now seemingly refusing to connect to Github, this gem of a StackOverflow answer solved the issue for me.

[ssh: connect to host github.com port 22: Connection timed out](https://stackoverflow.com/a/52817036/10590986)

That's right, I just needed to add a remapping for [github.com](http://github.com) → [ssh.github.com](http://ssh.github.com) 

I know, strange one, but the most important thing is it works!

Github suggest that you use the command `ssh -T git@github.com` to test your connection. Slam a couple of v's in there to get `ssh -vvT git@github.com` and you've got yourself a nice debuggable output from OpenSSL.

In that output I could see an IP address, which on navigating to the IP in the browser, it does indeed route to Github. So I knew it wasn't a local DNS issue, it was finding the right IP address.

Half an hour wasted, but a Git crisis has been averted! Thank you Mahan_F!

