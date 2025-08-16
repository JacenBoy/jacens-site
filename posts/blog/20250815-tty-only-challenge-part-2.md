---
layout: blog.html
title: Staying Entertained - The TTY-Only Challenge Part 2
date: 2025-08-15
thumbnail: https://jacen-safe.s3.us-west-004.backblazeb2.com/SadxKiOcShLj.png
---
[In the first post in this series](https://jacen.moe/blog/20250802-can-you-use-linux-without-leaving-the-command-line-the-tty-only-challenge/), we set up a TTY-only laptop running Arch Linux with the intent of daily driving it. We got a lot of the productivity essentials done, but we didn't do much in the way of entertainment. Let's start looking into how we can make things less boring and have fun in our command-line environment.
<!-- more -->

## Video Killed The Radio Star

YouTube is one of my primary sources of entertainment, so it seems like a good target to get working next. How, you might ask, do I expect to get video working in this text-only environment?

Modern Linux systems can use the Direct Rendering Manager (DRM) to directly access your computer's graphics hardware. This allows arbitrary data like images or videos to be displayed, even in a TTY environment like ours.

Enter mpv, one of Linux's premier media players. It doesn't require any graphical prerequisites to install, and it can output data to the DRM to let you watch videos from the TTY. It does completely take over the screen, so you can't really do much multitasking, but it's better than nothing.

Once you've installed mpv, you can use `--vo=drm` to tell it to use the DRM for output. This is a bit cumbersome, so you can also create a config file at `~/.config/mpv/mpv.conf` and add `vo=drm` to make that the default behavior.

Now we can watch videos, but how do we find them? We can use yt-dlp to download YouTube videos, but that still requires us to have a link first. Even if we wanted to use an official client, Google hasn't given us a YouTube command-line client (and I'm not holding my breath on that ever becoming a reality). So, how exactly are we supposed to find content to watch?

This is where [a neat project](https://github.com/Benexl/yt-x) called yt-x comes into play. It creates a neat Terminal User Interface (TUI) for yt-dlp. It lets us download videos with yt-dlp or watch them directly with mpv. You can install yt-x from the AUR using yay.

## Just Chatting

Unfortunately, most of my friends use Discord, and they haven't given us any legitimate mechanism to use their app from a headless environment. While there *are* projects that can bridge this gap (albeit not many of them), they are technically against Discord's ToS, and while Discord's abuse team has said that they don't specifically target people using these solutions, I'd still rather not put my account at risk.

For the friends that aren't on Discord, we do have solutions. I've used gomuks previously (available in the official Arch repos) as a Matrix client, but it struggles with the session verification process. Our only other real option is iamb, which supports more Matrix features than gomuks does, such as spaces and threads. Unfortunately, it was created by a vim user, meaning the usage can sometimes be a bit obtuse. Regardless, it's certainly a much more polished experience compared to gomuks overall. If you want to try it out, it's available in the AUR as `iamb-git`.

If you're interested in something more old-school, irssi is the ubiquitous IRC client for Linux users. In typical Linux fashion, it's not the easiest to use and configure, but it is very customizable, and its popularity means you'll probably be able to find help for whatever issues you run into pretty easily. If you're interested, irssi is available in the official repos.

## Socializing

There used to be various third-party apps for social sites like Reddit and Twitter, but now that most of the social sites have completely locked down their APIs, the mainstream sites don't really have much (if any) third-party app support.

Fortunately, we have *do* more open options available to us. My primary social media account is on Mastodon (where you should definitely follow me), with posts mirrored to Bluesky (where you should definitely follow me). We'll focus on Mastodon, since that's the one I care more about.

Fortunately, there's a CLI app called toot that provides many tools for posting to and reading from Mastodon, as well as a TUI to let us browse. Unfortunately, just days before starting this challenge, I updated my Mastodon instance to version 4.4, which removes the functionality that allowed toot to log in straight from the command line. This means we'll have to get an OAuth link out of our TTY and onto a device that we're logged into Mastodon on, followed by getting the Mastodon authorization token back into the TTY. I've tried magic-wormhole to handle that, and it seems to work pretty well.

Once we're logged in, we can use `toot tui` to launch the interface. Alternatively, there are lots of other commands that you can explore for viewing and interacting with posts, which you can peruse with `toot -h`.

If you prefer Bluesky, there's tuisky, available from the AUR. It's a bit clunky to use, but it has multi-account support and is just functional enough to browse your timeline.

## Conclusion

With these, hopefully our TTY challenge is a bit less boring and isolated. I haven't even gotten into games and other sources of entertainment that we can have in the command line, so I wish you luck in exploring and finding those.
