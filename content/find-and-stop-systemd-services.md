+++
title = "Find and stop systemd services"
date = 2022-01-28

[extra]
icon = "🛑"

[taxonomies]
languages = ["Shell"]
tags = ["Linux Woes"]
+++


I use Caddy server on occasion for work. Its awesome. Well worth looking into, and I’m sure I’ll write a more in depth piece on its finer points sometime, but for now its the object of this particular narrative, not the focus. 

So I kept finding that when I went to start Caddy with a custom configuration, it would fail due to the ports required for Caddy to run being already in use. 

A bit of delving using our handy CLI toolbox identifies which process is hogging the port in question (2019)

```bash
sudo netstat -nlp | grep :2019
#=>  tcp  0  0  127.0.0.1:2019  0.0.0.0:*  LISTEN  18648/caddy
```

So Caddy is already running... 

This is strange as I never started that process.

For a while I took the amateur’s way out, and just killed the running Caddy process, before starting my own. 

```bash
sudo pkill caddy
```

But c’mon, we all know we can do much better than that.

The next clue as to why this keeps happening is the fact that this ghost Caddy process will be present from every time I start my machine. In Linux, `systemd` is responsible for starting processes at given times - like after boot. It does this via “services”. If a service is enabled then it will fire up on boot of the OS. 

We can find all the currently enabled services with a `systemd list-unit-files --state=enabled` command, but this will return us a bit of a beast of a list. So let’s pipe it to our old friend `fzf` (`grep` would be a fine choice as well).

```bash
systemd list-unit-files --state=enabled | fzf
```

I start typing Caddy and there it is: “caddy.service enabled enabled”. So all we need to do is `systemd disable` it and we’ll stop the service from being started on boot!

```bash
systemd disable caddy.service
```

And there we have it. Another minor annoyance solved, and literally seconds every day saved! Incredible!
