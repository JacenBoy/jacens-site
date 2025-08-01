---
layout: blog.html
title: The GL.iNet Comet - A Review
date: 2025-05-03
---
A while back, I purchased GL.iNet's AC1300 router for a project that never ended up materializing. Despite that, it is still a staple in my backpack, and it put GL.iNet on my radar. So, when I received an email about the [GL-RM1 Comet remote KVM](https://www.gl-inet.com/products/gl-rm1/), my interest was definitely piqued.
<!-- more -->

A remote KVM, or IP KVM, is a device that allows you to remotely view a remote computer's screen, as well as control the keyboard and mouse. This is useful for working on headless systems or troubleshooting in situations where setting up a keyboard and mouse would be inconvenient.

Consumer grade IP KVMs have existed for a while. Most famous is the [PiKVM](https://pikvm.org), and, more recently, the [JetKVM](https://jetkvm.com) has gained popularity. So, exactly how does the Comet stack up to the other similar solutions? Let's dive into it.

## In The Box

The box comes with all the cables you'll need to get started. You'll find the Comet itself, an HDMI cable, a USB-C-to-C cable for power, a USB-C-to-A cable for the KVM, and a network cable. It doesn't come with a power adapter, so you'll need to provide your own 5V 2A DC power supply.

While a little larger overall than something like a JetKVM, it's flatter, making it easier to throw into a bag or even a pocket to take with you for troubleshooting. This also makes it substantially smaller than a PiKVM V4 Mini. It has a very premium look and feel, with a robust CNC aluminum chassis.

![Banana for scale](https://i.snap.as/5psrZxEr.jpg)

Along the sides, you'll find two USB-C ports, one for power and one for keyboard and mouse operations, a gigabit Ethernet port, an HDMI port, and a USB-A 2.0 port. Personally, I would have liked to see a 3.0 or even a 3.2 port with the capability to plug in some kind of mass storage device. The Comet does not come with Wi-Fi, so the Ethernet is the only connectivity the Comet comes with.

![An image from the GL.iNet press kit showing the ports](https://i.snap.as/dYVblEN5.jpg)

The Comet can be purchased with an ATX board to allow for remotely powering on machines (which is what the USB-A is actually meant for), but I chose not to get it.

## The Software

The Comet runs a modified version of the PiKVM software, which is open-source and available to view and modify on [GitHub](https://github.com/gl-inet/glkvm). The interface is far more aesthetic and a bit easier to use and navigate than the standard PiKVM GUI.

![The GLKVM GUI](https://i.snap.as/cplGt1aw.png)

For accessing the Comet remotely, GL.iNet's fork of PiKVM has much more seamless integration with the Tailscale private VPN service, allowing you to install and configure it from the GUI instead of having to use the terminal. Alternatively, GL.iNet has their own cloud service if you prefer.

## The Experience

The experience overall was just like using any other IP KVM. The nicer GLKVM GUI was more friendly to use than the stock PiKVM experience. In particular, setting up Tailscale only took a handful of clicks.

Video and audio, unsurprisingly, work about as well as they do in PiKVM. It's definitely not ideal for browsing YouTube, but it will work in a pinch. Keyboard and mouse inputs were also as responsive as expected, with minimal input latency.

One missing feature that I found to be very obnoxious was the scroll speed. By default, PiKVM is set to scroll three lines per notch on the scroll wheel, which makes fine adjustments impossible. The option to customize that is available in stock PiKVM, and I'd love to see it ported over to the GLKVM Project.

## Conclusion

Effectively, this is a more portable PiKVM V4 Mini for almost half the cost, starting at $89. I'm impressed with the look and feel of both the hardware and the software. The Comet is likely to be a new staple in my backpack for the times when an IP KVM would come in handy.

If you decide you want to purchase the Comet or any other GL.iNet products, I do have a [referral link](http://rwrd.io/nma4vqw?c) that you can use to get a $10 discount, which also gives me a small kickback.

**Update 1:** As of GLKVM version 1.3.0, released on June 10th, 2025, [the scroll rate option has been added,](https://github.com/gl-inet/glkvm/issues/7#issuecomment-2958616039) as well as a handful of other improvements. Hopefully GL.iNet continues to iterate on and improve the software, although it feels like it's in a good state for basic operation.