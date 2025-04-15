---
layout: blog.html
title: IT Pro Tip - Don't Use .local
date: 2025-04-14
---

It's a tale as old as time. You're setting up a new Active Directory domain environment for the Example Corporation. As part of the setup, you're asked to choose the domain you want AD to use. Mindlessly, you enter "example.local".

Stop right there. This will cause problems for you down the line.

Let's dive into why you shouldn't do that.
<!-- more -->

## The beginning of .local

As far as I can tell, Microsoft has never considered .local to be a best practice. [Documentation from as far back as Windows 2000](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-2000-server/bb727085(v=technet.10)?redirectedfrom=MSDN) has said in not as many words *not* to do that.

![As a best practice use DNS names registered with an Internet authority in the Active Directory namespace.](https://i.snap.as/QQpU6Rjj.png)

So then, where did .local come from?

Windows Small Business Server was an entry-level server product that Microsoft used to sell years ago. It was basically designed for businesses with little to no IT support. It bundled together Active Directory, Exchange Server, SharePoint, and Remote Web Workplace, packaging them all into an easy to set up and maintain service.

One of the quirks of SBS was that it defaulted to setting up a .local domain. The proliferation of .local being used for AD domains is almost certainly a combination of people using this default and people assuming that the SBS implementation was a best practice.

## Why not use .local?

That's a nice history lesson, but why is using .local a problem?

The .local suffix used for Multicast DNS, or mDNS. To briefly explain, mDNS allows IP addresses to resolve to hostnames without needing to configure DNS entries. While most devices and services that rely on mDNS have alternate methods for configuring them, it complicates matters and will make things more difficult for you in the long run.

Even if you aren't using mDNS today, don't assume you won't be in the future. Years of working for an MSP have shown me that clients will buy devices without consulting you first, no matter how hard you try, and they'll be frustrated when things don't just work out of the box.

So, what should you use instead? Let's go back to that Windows 2000 documentation I mentioned earlier because it spells things out pretty clearly.

> As a best practice use DNS names registered with an Internet authority in the Active Directory namespace. Only registered names are guaranteed to be globally unique. If another organization later registers the same DNS domain name, or if your organization merges with, acquires, or is acquired by other company that uses the same DNS names then the two infrastructures can never interact with one another.

## Don't use bare domains either

So then, we should just use example.com for our AD domain, right?

No, don't do that either.

This creates a situation where the internal entries for your DNS are different from your external entries. Because AD takes over the A record for your domain, internal users won't be able to access your website using example.com. Additionally, issues will arise when you need to set up new DNS entries or update existing ones. Your changes won't be reflected on the internal network, requiring double entry.

You *can* get around this by setting up split-brain DNS (which is beyond the scope of this post), or you can just not use your base domain as your AD domain. Trust me, the latter option is better in the long run.

## Using a local subdomain

So, what *is* the correct answer? Once again, Microsoft spells things out for us.

> Add a prefix that is not currently in use to the registered DNS name to create a new subordinate name. For example, if your DNS root name were contoso.com then you should create an Active Directory forest root domain name such as concorp.contoso.com, where the namespace concorp.contoso.com is not already in use on the network. This new branch of the namespace will be dedicated to Active Directory and Windows 2000 and can easily be integrated with the existing DNS implementation.

The best thing to do would be to use a subdomain of a domain you own. For example, local.example.com would be a good choice for our Example Corporation. If you don't already own a domain for your business, you're already behind the IT 8-ball, so you should probably start with that.

As a note, Windows will automatically try to set the NetBIOS name to the first segment of your domain. For example, local.example.com will try to set the NetBIOS to LOCAL. You'll probably want to change that to something more meaningful. For our Example Corporation, I'd just set it to EXAMPLE.

## Conclusion

Renaming an Active Directory domain can be done, but it's a complex and non-trivial task. Save yourself the effort and name it right the first time. Even if it seems like it won't cause any issues today, you never know when something will change in the environment and start causing issues down the line.