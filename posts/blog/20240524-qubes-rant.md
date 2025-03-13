---
layout: blog.html
title: "Why I Dropped Qubes OS After Four Hours"
date: 2024-05-24
---

Qubes is a project that has always intrigued me. Although I don't have a threat model that necessitates the level of compartmentalization it provides, the idea of organizing my computer usage into containers is appealing from an organizational standpoint.

All my previous attempts to daily drive Qubes were cut short for one simple reason: performance. I simply didn't have a device that could run Qubes at an acceptable level of performance.

However, now armed with a shiny new [Framework 16](https://jacen.moe/blog/20240221-jacens-framework-16-review/), I was hopeful that I could actually run Qubes to a degree that I was happy with. Unfortunately, it wasn't quite as smooth as I would have hoped.
<!-- more -->

## Installation

I didn't expect getting Qubes installed on a device to be the first challenge, but it turned out to be more of a hassle than it should have been.

My original plan was to just have a test machine rather than a daily machine, so I chose the [GPD Win Max](https://www.indiegogo.com/projects/gpd-win-max-handheld-game-console-for-aaa-games#/) as my device of choice. The Win Max is listed in the [Qubes HCL](https://www.qubes-os.org/hcl/#gpd_win-max-g1619-01_i5-1035g7_integrated-graphics-iris-plus-g7_alex-long_r4-1-beta) without any disclaimers or other notes, so I wasn't anticipating any issues. Ultimately, every attempt failed, with the installer freezing at the "Installing boot loader" step. The only solutions I found recommended changing the boot mode from UEFI to BIOS, which is not possible on the Win Max, so I had no choice but to abandon the attempt.

As for installing Qubes on the Framework, I had to try multiple flash drives before I found one that worked. Once I finally got the installer to boot, however, it did finally install successfully, if a bit slowly (I thought one of the advantages of Linux over Windows was supposed to be the installation time). The only other major caveat is that I had to grab a mouse to actually navigate the installer, as I didn't have use of the touchpad (more on that later).

All told, I ended up having to try three different flash drives written using a variety of settings, software, and devices before I was finally able to get Qubes installed.

![Three flash drives that were used to install Qubes](https://i.snap.as/84TAyUjx.jpg)

## Post-Install

Once again, I wasn't really expecting the post-install process to be any kind of speed bump, but, once again, I ran into a couple of issues.

The biggest issue was the touchpad. Out of the box, the Framework 16 touchpad doesn't work in Qubes. Fortunately, I was clever enough to actually check the HCL before starting the installation process, so I was prepared for this one. Adding `ioapic_ack=new` to the `GRUB_CMDLINE_XEN_DEFAULT` line in `/etc/default/grub` (and regenerating the GRUB config with `grub2-mkconfig -o /boot/efi/EFI/qubes/grub.cfg` and `dracut -f`) fixed that issue, although the touchpad didn't feel as smooth as the Precision Touchpad driver. Whatever special sauce Microsoft uses is definitely very effective.

Another massive issue was the keyboard. The Framework 16 keyboard connects via USB, and, at the time of writing, there is a bug with the USB qube that causes it to not restart when the computer wakes from suspend. A workaround I found was to set up a Cron job to automatically try to restart the USB qube every minute, but that's definitely a really awful solution, namely because it means it can take up to a minute for your keyboard to actually work.

## Suspend

Speaking of suspend, that was really the main dealbreaker with the switch to Qubes. My workflow with my laptop involves closing it and throwing it into my backpack, so suspend and sleep are crucial features for me.

My original solution to the suspend USB issue was to bypass suspend entirely and just utilize hibernation. That would mean a slower resume time once I was ready to use it, but that seemed like a very small price to pay for an overall better user experience. What I didn't realize was that Qubes does not support hibernation. This isn't obvious, as the power settings expose hibernate as a valid option. Fortunately, I managed to catch the issue before the laptop completely cooked itself.

Suspend, on top of the USB issue, was also wildly inconsistent in general. When I took my laptop out of my bag, I found it was dangerously hot to the touch, and it wasn't able to resume, forcing me to do a full reboot. I also ran into network issues after resuming and found that the issue with the USB qube, even with the Cron workaround in effect, was just too unpredictable for me.

The [HCL forum post](https://forum.qubes-os.org/t/framework-laptop-16-amd-ryzen-7040-series/24985) recommended adding `mem_sleep_default=deep` to the GRUB config, which I did, and it seemed to have no meaningful impact on the stability of suspend.

There are a lot of issues I can deal with or work around, but the huge number of issues related to suspending were not ones I could just live with, so I made the decision to pull the plug on Qubes.

## Conclusion

The hardcore Linux and Qubes enthusiasts will probably assume I'm just being biased, and those people probably didn't make it this far into the post. However, to those who did, let me plead my case.

I really wanted Qubes to work out. I spent four days struggling to get it installed because I really did want to use it and, ultimately, enjoy using it.

With that said, I need an operating system that I know will be reliable, and with the suspend issues I had, Qubes just can't provide that. Like I said, I really like the concept of Qubes and would love to be able to give it a legitimate shot one day, but, as of right now, it's simply not in a state where I can give it any kind of extended test drive.