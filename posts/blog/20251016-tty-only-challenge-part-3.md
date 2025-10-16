---
layout: blog.html
title: Blatant Cheating - The TTY-Only Challenge Part 3
date: 2025-10-16
thumbnail: https://jacen-safe.s3.us-west-004.backblazeb2.com/Fvj7ejQxUsQg.png
---
One problem with my TTY-only setup is that I don't have a way to link it into my blog workflow. That means that chronicling my adventures from within the TTY isn't possible yet. Today, I'm going to fix that by blatantly cheating.
<!-- more -->

## The Problem

I've gone over my blog workflow [in a previous post](https://jacen.moe/blog/20250108-migrating-from-writefreely-to-11ty/), but it has changed a bit since then, so I'll recap. Posts are written in [Obsidian](https://obsidian.md), then pushed to [GitHub](https://github.com/JacenBoy/jacens-site), where the site is built with [11ty](https://www.11ty.dev) using GitHub actions and then pushed to [Neocities](https://neocities.org).

The main issue is my draft system, or rather the lack thereof. I have no way to make a post as incomplete, so the only way to prevent it from being published is to just not commit the file. That itself wouldn't be an issue except for the fact that I like to be able to work from multiple devices, so I need some way to sync files across them. Previously, I used [Proton Drive](https://proton.me/drive), keeping my in-progress posts separate from the site's Git repository, since storing a Git repo in a shared folder didn't seem like the best idea. To simplify the workflow, I eventually switched to [Obsidian Sync](https://obsidian.md/sync) instead. That way, the files can be stored directly in the Git repo, and I can just commit them when I'm ready.

The problem is that Obsidian Sync requires Obsidian to be running, and there isn't a TUI version the way there is of other similar products like [Joplin](https://joplinapp.org).

Fortunately, I *did* manage to find a solution: cheating.

This idea was taken from [Rolle](https://rolle.design/setting-up-a-headless-obsidian-instance-for-syncing), who wanted a headless Obsidian instance for different reasons. He was using Ubuntu, so we'll have to adapt things to work for Arch.

First, we'll be using [Xvfb](https://www.x.org/archive/X11R7.7/doc/man/man1/Xvfb.1.xhtml) as a lightweight X11 server, and [Openbox](https://wiki.archlinux.org/title/Openbox) as a lightweight window manager. Since we're not allowed to actually use the GUI locally, we'll need [X11vnc](https://wiki.archlinux.org/title/X11vnc) to be able to actually access Openbox. While this is definitely against the letter of the TTY-only challenge, and arguably against the spirit as well, I'm considering it in-play, since we won't actually be using Openbox for any day-to-day work.

## X Marks the Spot

First things first, let's install all the prerequisite packages we're going to need. Conveniently, Obsidian is available from the official repos, so we won't need any AUR packages for this.

```bash
sudo pacman -Syu --needed xorg-server-xvfb openbox python-pyxdg x11vnc obsidian
```

Next, we'll set up and secure the password for our VNC server.

```bash
x11vnc -storepasswd
chmod 600 ~/.vnc/passwd
```

Now, we'll use `systemd` to run Xvfb and Openbox as services. Since they only need to run as long as we're logged in, we can set them up as user services, which you can save in `~/.config/systemd/user`. If that path doesn't already exist, you'll need to create it.

First, the unit file for the Xvfb service. `:5` is an arbitrary display number, since it's an available TTY, but you can adjust it if you prefer. If you want a different screen resolution, you can adjust that as well.

```
[Unit]
Description=Xvfb X11 server

[Service]
ExecStart=/usr/bin/Xvfb :5 -extension GLX -screen 0 800x600x16
KillSignal=SIGINT
Type=exec
Restart=on-failure
RestartSec=30s

[Install]
WantedBy=default.target
```

Next, the service for Openbox. I'm assuming you named the Xvfb unit file something like `xvfb.service`, so you'll need to adjust the `After` line if you chose something different. You'll also need to adjust the `DISPLAY` environment variable if you chose a different display number.

```
[Unit]
Description=Openbox window manager
After=xvfb.service

[Service]
ExecStart=/usr/bin/openbox-session
KillSignal=SIGINT
Environment="DISPLAY=:5"
Type=exec
Restart=on-failure
RestartSec=30s

[Install]
WantedBy=default.target
```

For security, we don't actually need to run X11vnc as a service. Since it's something that we'll only need to access for short periods of time, we can explicitly invoke it when we need it so we don't have a VNC server running on our device at all times. To make it easier, I'll set up an alias in the `.zshrc.local` file.

```bash
alias vnc=/usr/bin/x11vnc -rfbport 5900 -display :5 -rfbauth /home/james/.vnc/passwd
```

Adjust the port, display number, and password file path to match your configuration.

## Better Than Bethesda

Now, we can access our Openbox session from a remote device using VNC. Using our TTY, we can launch Obsidian like so.

```bash
DISPLAY=:5 obsidian
```

The `DISPLAY=:5` is necessary so that Obsidian knows where the display server is. We can add `export DISPLAY=:5` to our `.zshrc.local` to set that permanently.

Nice, but running Obsidian as a foreground app isn't very useful to us. We really want it to run as a background service. So, let's set up one final systemd unit file.

```
[Unit]
Description=Obsidian notetaking app
After=openbox.service

[Service]
ExecStart=/usr/bin/obsidian
KillSignal=SIGINT
Environment="DISPLAY=:5"
Type=exec
Restart=on-failure
RestartSec=30s

[Install]
WantedBy=default.target
```

Back in the VNC, we can now sign into Obsidian and sync the vault that contains the files we want. As long as Obsidian is running, any changes will be synced, even those made in an external program. That means I can use nano to continue writing blog posts.

## Conclusion

Our X11 server has a few other uses. There are some CLI apps that need to use a browser as part of the OAuth process, and this allows us to sign into them. Once again, this *does* seem like cheating, but I think it's okay to stretch the rules to this degree as long as we aren't using the GUI as part of our normal operations.

This was a neat experiment to set up, and hopefully it will come in handy for expanding everything we can do in our semi-TTY-only environment.