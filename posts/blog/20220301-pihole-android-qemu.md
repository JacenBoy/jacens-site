---
layout: blog.html
title: "Hosting Pi-hole on Android Using QEMU"
date: 2022-03-01
---

Advertisements suck. Beyond being generally obnoxious, they can cause performance issues and even sometimes be downright malicious. There are plenty of ad-block solutions for your browser, but not as many to help with ads not hosted on websites, especially in apps on your phone. One of the most notable solutions to that problem is [Pi-hole](https://pi-hole.net), a DNS-level ad-blocker that can run on something as simple as a Raspberry Pi. That's great for when you're at home, but the official solution for using Pi-hole on the go is a bit obnoxious.

Fortunately, there's always an alternative solution.

It's not a good or viable solution, but beggars can't be choosers, right?
<!-- more -->

I have [previously run a Linux virtual machine on an Android phone](https://write.jacen.moe/running-qemu-on-an-android-host) using [Termux](https://github.com/termux/termux-app) and [QEMU](https://www.qemu.org), and while the performance was about as bad as you'd expect, Pi-hole's system requirements are fairly low, so why not try and adapt that solution to run a local Pi-hole instance on a phone?

If you haven't installed it already, the first step is to get Termux. It seems like they really want you to just install it from GitHub, but it is available on F-Droid as well. Instructions for installing it are available in their GitHub repository.

Termux uses `apt` for package management, but provides and recommends using [pkg](https://wiki.termux.com/wiki/Package_Management) for package management. We'll need to use pkg to install QEMU, but I'd recommend setting up [OpenSSH](https://wiki.termux.com/wiki/Remote_Access#Using_the_SSH_server) as well so you can type commands on a full-sized keyboard instead of relying on your phone keyboard. We'll be emulating an x86 CPU, so we'll grab that version of QEMU along with a collection of extra tools we'll need.

```bash
pkg install qemu-system-x86-64-headless qemu-utils
```

To help keep things tidy, I've created a dedicated directory for storing QEMU's files, so we'll created the disk image file for our VM to boot from in there. We’ll use the `qcow2` format, which has the advantage of taking up space as needed rather than allocating all of it at once at the cost of speed. If you really want that bit of extra performance, you can use the `raw` format instead. You can also adjust the maximum size of the disk as needed.

```bash
cd qemu
qemu-img create -f qcow2 pihole.img 64G
```

Previously I used Arch as the OS for the VM, but Pi-hole (fortunately) doesn't support Arch. Of the supported options, Ubuntu should be the easiest, so we'll grab a copy of that. I'd recommend using the server variant, which excludes a fair bit of unnecessary bulk. If you're using SSH, you can just download it on your desktop and transfer it to your phone using SFTP.

With the ISO prepared, use a command similar to the one below in order to perform the initial install. We'll explain the various options in further detail later, so I'll ask you to just press the "I believe" button for now.

```bash
qemu-system-x86_64 -smp 4 -m 4G -drive file=~/qemu/pihole.img,format=qcow2 -cdrom ~/qemu/ubuntu.iso -vga std -boot menu=on -display vnc=0.0.0.0:0
```

You should now be able to connect to your phone via VNC and complete the install process for Ubuntu. Ubuntu has a nice guided installer, so the install process should be pretty straightforward.

Now we'll shut down the VM and update the boot command to the one we'll use for properly running the VM. You can save it to a shell script so you don't have to remember the whole thing. You can also adjust it as needed to fit your needs.

```bash
qemu-system-x86_64 \
-name Pihole \
-smp 4 \
-m 4G \
-drive file=~/qemu/pihole.img,format=qcow2 \
-nic user,hostfwd=tcp:127.0.0.1:8080-:80,hostfwd=tcp:127.0.0.1:8053-:53,hostfwd=udp:127.0.0.1:8053-:53 \
-vga std \
-boot menu=on \
-display vnc=0.0.0.0:0
```

Here's a basic rundown of the options and what they actually do:

- `-name`: Set up a nice friendly name for the VM. Not strictly necessary, but definitely aesthetic.
- `-smp`: Set the number of CPU cores the VM will use. Depends on you and your phone's hardware.
- `-m`: Set the amount of memory for the VM. Like the CPU cores, this depends on your preferences and hardware.
- `-drive`: Mounts our disk image in the VM.
- `-nic`: Sets up our network interface. `user` is basically the equivalent of NAT mode in other hypervisors like VirtualBox. More importantly, it lets us define the `hostfwd` options to forward the ports Pi-hole uses from the VM to the phone. In particular, we need port 80 for the web admin interface and port 53 for actually serving DNS requests. Note that unless your phone is rooted, ports 80 and 53 will be [inaccessible on the host side of things](https://www.staldal.nu/tech/2007/10/31/why-can-only-root-listen-to-ports-below-1024/), so you'll need to pick port numbers above 1023.
- `-vga`: Selects what kind of video output we want to emulate. This isn't strictly necessary, since if you don't define it QEMU uses `std` by default anyway.
- `-boot`: Sets the boot order. `menu=on` gives us the option to see the boot menu and manually override the boot order if we need to.
- `-display`: Sets how we will interact with the VM. VNC is the easiest to set up, although also the least secure. `vnc=0.0.0.0:0` means to listen on all IP addresses on port 5900.

If you have the time on your hands, you can always look through the [QEMU documentation](https://www.qemu.org/docs/master/system/invocation.html) to look for any additional options you might want to try out.

Now that Ubuntu is installed, we can install Pi-hole. It also has a nice guided installer, so just follow the [instructions on their website](https://docs.pi-hole.net/main/basic-install/) to kick things off. If you're still overwhelmed, all of the default options should be fine. Just select the public DNS service you want the Pi-hole to use. Make sure you note the admin password that Pi-hole generates. It's easy enough to [reset from the command line](https://docs.pi-hole.net/core/pihole-command/#password) if you don't, but you'd probably rather just remember it.

With that done, now we need to point DNS for our phone to our new Pi-hole. Unfortunately, things get a bit messy here. In Android 8.1 and older, you would need to manually set the DNS for every network connection you ever use, and as of Android 9, this can be set globally but requires the DNS server to support DNS over TLS, which Pi-hole does not out of the box. Fortunately, there's an app called [DNSChanger](https://play.google.com/store/apps/details?id=com.frostnerd.dnschanger), which uses Android's VPN API to redirect requests without having to manually configure DNS settings over and over. It's [open-source](https://git.frostnerd.com/PublicAndroidApps/DnsChanger) to boot.

We have another small roadblock thanks to the issue of privileged ports that I referenced earlier. UNIX-based operating systems such as Android only allow the root user to open ports below 1024. This is allegedly a security measure, although the end result is that users are encouraged to run public-facing and potentially vulnerable apps as root instead of a lower-privilege user. Unless your phone is rooted, you'll have to use alternate ports for both Pi-hole's HTTP admin interface and the DNS server itself. Fortunately, there is an option to change what port DNSChanger sends its DNS queries to, although it's hidden in the "advanced settings" section. There's also an option to allow setting the DNS servers to localhost, so we'll enable both of those options.

With all the setup complete, all we need to do it point the DNS settings in DNSChanger to our VM and just like that we have our convenient on-the-go ad-blocker! It comes at the low cost of greatly reduced battery life and extraordinary heat output. Still, at least it's a bit more practical than the Arch VM was.