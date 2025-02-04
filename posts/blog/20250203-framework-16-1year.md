---
layout: blog.html
title: The Framework 16 - A 1-Year Review
date: 2025-02-03
---
About a year ago, I received my Framework 16 laptop. While I did [a post reviewing my first impressions](https://jacen.moe/blog/20240221-jacens-framework-16-review/), it's difficult to properly judge a device after only a couple of weeks. I decided I wanted to do a follow-up after daily driving it for longer.

The amount of hype I saw leading up to the release of the Framework 16 was way more than I've ever seen for a laptop before. The question is, does it actually live up to the hype? Let's dive into that.
<!-- more -->

## Repairability

The repairability and upgradability of the Framework 16 is its biggest selling point, so that seems like a good place to start.

To support the keyboard and touchpad modules, the Framework 16 has a midplate between the input modules and the actual internals. It takes 17 screws to remove the midplate and access the internals. If that seems like a lot, that's because it is. It's a bit tedious to get inside the Framework 16.

With that said, [after doing a keyboard swap on a Dell Precision](https://mastodon.jacen.moe/@jacenboy/113278238625709950), I'm more than happy to deal with the Framework's 17 screws. It's absolutely way easier to get into and work on than any other laptop I've ever repaired.

Moreover, I've found that finding first-party parts for some laptops, namely Dell or HP, is extremely difficult once the warranty has expired. Having a store filled with replacement parts and upgrades is nice, especially for commonly replaced parts like batteries.

## Hardware

I went with the Ryzen 7 variant of the Framework 16 with 32 GB of RAM. While performance has been pretty solid overall, there were two specific hardware pieces in particular that I've had issues with.

With the stock MediaTek wireless card, I had issues with Bluetooth functionality randomly disappearing, and it took a lot of effort to find [the solution](https://community.frame.work/t/bluetooth-driver-device-error/47124). I replaced it with an Intel AX210, and it's been solid ever since. It was only a $20 investment, but the experience with the MediaTek card overall was pretty frustrating.

I got the GPU module, and the RX 7700S has been solid enough for what I need it to do. However, I have had GPU crashes when waking from sleep, where the screen goes black and the computer freezes. It's only a minute or so of delay, and I'm guessing it's more of an AMD driver issue than a Framework issue, but it is something to keep in mind, and it certainly hasn't changed my perception of AMD GPUs.

## Input Modules

I like the keyboard and touchpad. The keyboard has a nice tactile feel, and the touchpad is larger than any that I've used before. Being able to quickly remove them is a great party trick that's always fun to do.

I do have an issue with the touchpad spacers. While they do leave visible gaps in the palmrest, that part isn't a dealbreaker for me. My issue is that they have a tendency to catch my arm hair and skin, which is a little painful and annoying. I appreciate that it's necessary for the touchpad to be as customizable as it is, but it is still a concern.

I've also had some issues with the keyboard backlight. Occasionally, after a cold boot, the backlight doesn't turn on. I can tell that the setting is correct, as pressing the backlight hotkey cycles the mode back to the backlight off mode.

Finally, as a minor nitpick, I would still love a number lock light so I can tell whether the number lock is on or not. It's shockingly common for keyboards to skip the number lock light, and I really don't understand why. 

## Expansion Cards

The Framework's modular I/O is a really great feature, letting you customize your port layout depending on what you need to do. My personal primary loadout is two USB-C ports, two USB-A ports, an HDMI port, and an audio jack. I also carry the NIC module and a DisplayPort module in my backpack.

Beyond customization, the module I/O also has the added bonus of making the device even more repairable, as ports can be replaced if they fail. This increases the longevity of the laptop even more.

One of the downsides of the Framework 16 is the complicated [port compatibility matrix](https://knowledgebase.frame.work/en_us/expansion-card-slot-functionality-on-framework-laptop-16-rkUjGm7cn), making it a bit difficult to tell which expansion cards will work effectively in which slot. While I'm sure there's a technical limitation requiring this, it's still a bit obnoxious.

Additionally, when plugging it into the official Framework charger, I occasionally get a warning from Windows telling me to plug it into a different USB port. I have the USB-C in the correct slot according to the matrix, and this warning doesn't show up every time, so I have no idea why it happens or how to fix it. It doesn't affect functionality or charging speed as far as I can tell, but it's definitely something that a less technical user would not appreciate.

## Acoustics

A major complaint about the Framework is fan noise. I find that the Framework's fans tend to run faster than they need to, running at high RPMs even when the exhaust temperature is extremely cool. This appears to be more of an issue when on AC power, and switching to battery quickly quiets the system down.

A tip I found online was to adjust the "maximum processor state" in your Windows power plan options. I've found lowering it to even 95% was enough to bring the acoustics while idle from "jet plane" to "completely silent". While this is an acceptable workaround for me, the correct solution would be for Framework to release a tool to allow adjusting the fan curves, or include some kind of silent mode in the firmware.

## Conclusion

I stand by what I said in my original review: the Framework 16 is a first-gen product with first-gen product issues, but it's still very solid for what it is. Framework has a good track record with providing updated mainboards for the Framework 13, so I'm hoping the 16 gets the same treatment. I know the Framework is a bit of a niche product, but I would still like to see more third-party parts and accessories as well, particularly with GPUs. My understanding is that Nvidia's board partners would probably not be allowed to make GPUs, but it would be nice to see more AMD GPU options, or even Intel now that the second generation of Arc GPUs is out.

As for if you should get one for yourself, if you're reasonably technical and willing to tinker with workarounds for common issues, I think the Framework 16 is a great choice. If you aren't very computer literate, it's worth waiting a few more generations for more of the bugs to be worked out, if it's even worth considering for you at all.