---
layout: blog.html
title: "Pi-hole: The Ad Blocker That Falls Short"
date: 2024-06-09
---

With [the sunsetting of Manifest V2 well underway](https://blog.chromium.org/2024/05/manifest-v2-phase-out-begins.html), ad block users must decide between switching to a Manifest V2 supported browser like Firefox, or finding an alternative ad blocker that doesn't rely on browser extensions. DNS-based solutions like [Pi-hole](https://pi-hole.net) are among the more popular alternatives I've seen recommended.

Unfortunately, as far as ad blockers go, DNS-based ad blockers don't really live up to some of the promises they make. In fact, I'd argue that DNS ad blocking really is the worst way to handle blocking ads. Let's talk about some issues with it.
<!-- more -->

## Manifest V3 Destiny

If you're confused about what the Manifest V2 situation is, I'll do my best to explain.

The "manifest" is a configuration file for browser extensions that tells the browser some information about the extension, including what permissions and capabilities it requires. The "V2" is for "version 2", which Google is attempting to phase out in favor of the newer "V3".

The main point of contention with Manifest V3 is that it restricts some capabilities of browser extensions, primarily by reducing the scope of websites they can access. Considering that ad blockers need to access virtually every website on the Internet to be effective, this is a significant problem.

## How Stuff Works

Solutions like [Pi-hole](https://pi-hole.net) or [AdGuard Home](https://adguard.com/en/adguard-home/overview.html) solve this by using DNS to block ads.

Every device that connects to the Internet, including the servers that run your favorite websites, needs to have an IP address to be accessible. However, remembering IP addresses would be a pretty inefficient way of using the Internet and would make certain techniques, like load balancing or hosting multiple sites on one server, a bit more difficult.

Enter DNS. DNS, or the Domain Name System, is a service that takes easy to remember domain names and converts them into IP addresses.

DNS-based ad blockers work by sitting between you and your preferred DNS server. If a site matches an entry in the ad blockers list of domain names, it routes the DNS request to a fake IP address, preventing the site, and therefore the ad, from loading.

## How Stuff Doesn't Work

Unfortunately, there are a handful of issues with DNS ad blockers that limit their effectiveness.

### Missed Ads

There are some websites that serve their ads from the same domain name that they serve their normal content from. A very notable example of this is YouTube. Since DNS ad blockers work based on domain names, that means they can't block ads on these sites without also blocking the normal content. That creates many holes that other ad block solutions don't have to deal with.

### Difficulty Of Setup

Pi-hole in particular makes the claim that their solution is easy to set up, and, for a moderately technical person, it is. However, for normal users, the barrier to entry is high, and the general maintenance is also complex. This makes it not even worth considering for many people who don't have a tech-savvy nephew to help them out.

### Lack Of Granularity

Ads aren't the only thing on the Internet that you might want your ad blocker to be able to block. Extension-based ad blockers that have direct access to the web pages as they load can block plenty of other annoyances, like cookie banners, social media prompts, and other individual site elements that you just want to see. DNS-based ad blockers don't have that level of site access, further reducing their overall effectiveness.

### Difficulty Of Customization

Extension-based ad blockers can whitelist or blacklist sites and elements with just a couple clicks of a button. A DNS-based ad blocker requires access to an entirely different user interface, probably behind an extra sign-in screen, making it a lot less convenient to whitelist a site for the purpose of troubleshooting.

## Alternative Solutions

So, if DNS-based ad blockers aren't a viable solution, what should we be using instead. Unfortunately, every other alternative has its own downsides, so there isn't really an easy answer.

### Switching Browsers

Browsers like [Firefox](https://www.mozilla.org/en-US/firefox/) have committed to supporting Manifest V2, so if you aren't already using it or one of its forks, that is a solution to keep your extension-based ad blocker alive. Personally, as a [Vivaldi](https://vivaldi.com) user, there are a handful of features that just are not worth giving up to switch. Even if I was willing to switch, there are technical issues with Firefox that prevent it from being a viable solution for me. I'm sure there are other people in the same boat.

Alternatively, you can switch to a browser with a built-in ad blocker. [Brave](https://brave.com) is a popular option, and Vivaldi does have this option as well. However, in my experience, built-in ad blockers tend to be much less reliable than dedicated options, particularly on sites that implement any kind of anti-ad block.

### MitM Ad Blockers

A man-in-the-middle (MitM) attack is a security vulnerability where an attacker places a server in between your computer and the Internet to log everything you do on the Internet. If you do this to yourself intentionally, however, you can stop connections that try to load ads, effectively working as an extension-based ad blocker but without the extension.

[AdGuard (affiliate link)](https://adguard.com/?aid=134807) is one solution that works this way. I use it personally, and I've been thrilled with it. Unfortunately, unlike Pi-hole, it can only protect a single computer rather than your entire network, leaving things like your phone or TV vulnerable. While Adguard does also have solutions for those devices, they aren't perfect. Additionally, it lacks a Linux version of the software, which could be a deal-breaker for some people.

Theoretically, a whole-network MitM ad blocker *could* exist, but I have yet to find one. It also would require installing an SSL certificate on every device you would want it to protect to be able to block HTTPS traffic. This could be enough of a barrier to entry to turn off many people.

### Router-based Ad Blockers

While router-based ad blockers like [Diversion](https://diversion.ch/diversion/diversion.html) do exist, they have just about all the same issues as DNS ad blockers do, while being arguably even harder to install and requiring more specialized equipment.

## Conclusion

At the end of the day, the war on ads will continue for as long as ads exist, and our tools for fighting will continue to grow even more sophisticated. Personally, I would prefer if MitM ad blockers would continue to be developed, as that seems like the most optimal and universal way to handle blocking ads. Unfortunately, the open-source community seems to disagree, continuing to develop more solutions that rely on DNS. Hopefully, that will change eventually.