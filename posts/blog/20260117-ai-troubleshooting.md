---
layout: blog.html
title: I Hate AI, But I Used it Anyway - FSMO Troubleshooting Writeup
date: 2026-01-17
thumbnail: https://jacen-safe.s3.us-west-004.backblazeb2.com/6UjZOXL3L2D5.png
---
I'm not the biggest fan of AI. It's [very obvious to me when people use it](https://jacen.moe/rants/20250510-people-can-tell-when-you-use-ai/), and its outputs almost always have major issues that people refuse to take responsibility for. Overall, it just doesn't feel like it's reached the point where it's useful to me on a regular basis.

On this day, however, I was at my wits end, so I booted up Claude to give me a helping hand. Here's a look at what I did and how it responded, because it's a good showcase of the good and bad of LLMs.
<!-- more -->

## The Problem

Without going too deep into the weeds, I was experiencing a ton of issues on an Active Directory domain controller that I had determined would be most easily resolved by just reinstalling the OS on the server. I wasn't too worried, because this was one of the most rock-solid environments I manage, with proper DHCP failover and three DCs for some reason. The one thing I wanted to do was properly demote the DC and remove it from the domain to make sure any cleanup was performed automatically.

Without going too far into detail, while AD is designed to use multi-master replication, meaning any server can handle performing any task, there are certain tasks where there cannot be even the slightest risk of conflict. Microsoft handled this by creating five roles called FSMO roles, or Operations Master roles, that can be assigned to a single server. I'm planning a more in-depth post on FSMO roles, so keep an eye on that if you want to know more.

By default, `dcpromo` is supposed to handle automatically transferring FSMO roles to another DC on the domain. However, in this case, the transfer failed, preventing me from demoting the problematic DC. FSMO roles can be manually transferred via various GUI tools as well as PowerShell, and this worked perfectly for three of the roles, but the remaining two failed with the same stubborn error: "The current FSMO holder cannot be contacted".

This is actually an issue I've run into before. Last year, I did a livestream setting up an AD test lab to use for some blog posts, and it ended up devolving into a troubleshooting stream as I tried to figure out why I was getting that exact error. Ultimately, it was solved by installing the latest Windows updates. Unfortunately, Windows Update was one of the issues I was running into on this DC, so that wasn't an option for me.

There is a mechanism to seize the FSMO roles from a permanently offline DC, but that's precisely the problem: the DC needs to be permanently offline. If it were to come back online, it would be unaware of the role changes, meaning you would have two servers trying to perform the same roles, with potentially catastrophic results. I considered just reloading the OS and seizing the roles, since the newly loaded OS wouldn't have any of those FSMO roles assigned, but I would have preferred resolving the core issue rather than trying to clean up a messy DC demotion.

I wasn't entirely sure how to word a web search to troubleshoot exactly the issue I was dealing with, and with this being such a delicate operation, I decided to throw my Hail Mary.

## Enter Claude

Once I explained my situation to Clause, it gave me a couple of options.

{% chatbox %}
{% chatmsg "Jacen", "snd" %}What should my next step be?{% endchatmsg %}
{% chatmsg "Claude", "rec" %}**Option A - Seize the roles (cleaner but requires some functionality):**

Since the primary DC is still online, you could try seizing the FSMO roles from the secondary DC using ntdsutil rather than transferring them:  

```
ntdsutil
roles
connections
connect to server <secondary-dc-name>
quit
seize schema master
seize domain naming master
seize pdc
seize rid master
seize infrastructure master
quit
quit
```

**Option B - Force removal and metadata cleanup:**

If the primary DC is truly unresponsive for FSMO operations, you may need to forcibly demote it, seize the roles, then clean up the metadata before rebuilding.{% endchatmsg %}
{% endchatbox %}

Both of the options it gave me involved seizing the FSMO roles, which, as I've already explained earlier, is a horrible idea when the DC is still online and functioning. This is a textbook example of why it's a bad idea to use AI for anything you aren't already reasonably familiar with and why you need to double-check its outputs at all times.

Regardless, I called it on this, and it gave me a different set of steps.

{% chatbox %}
{% chatmsg "Jacen", "snd" %}Isn't it a problem to seize the roles while the primary DC is still online, since it will still try to perform its FSMO roles?{% endchatmsg %}
{% chatmsg "Claude", "rec" %}You're absolutely right - that's a critical point I glossed over. Seizing FSMO roles while the original holder is still online and functioning can create serious problems, including:

- **Split-brain scenarios** where both DCs think they own the roles
- **Conflicting updates** especially with the Schema Master and Domain Naming Master
- **Replication conflicts** that can corrupt AD
- **RID pool collisions** if both DCs are issuing RIDs

Seizing is really meant for when the original FSMO holder is permanently offline/dead. Since your primary DC is online and accessible, you need to fix the transfer issue, not seize.

Seizing is really meant for when the original FSMO holder is permanently offline/dead. Since your primary DC is online and accessible, you need to fix the transfer issue, not seize.

**Better approach - troubleshoot the transfer failure:**

**Check replication status** between the DCs:
```
repadmin /replsummary
repadmin /showrepl
```
If replication is broken, that could block FSMO transfers.{% endchatmsg %}
{% endchatbox %}

I had assumed replication was working, since I was able to transfer some of the FSMO roles, but you should [always start at layer zero](https://jacen.moe/rants/20250425-it-pro-tip-start-at-layer-zero/), so I tried it just to be sure. Sure enough, there were some replication failures reported.

![The output of "repadmin /replsummary" showing replication errors](https://jacen-safe.s3.us-west-004.backblazeb2.com/OufAClJV7gCH.png)

Since I was clearly past the point of using my brain, I fed this output back into Claude.

{% chatbox %}
{% chatmsg "Jacen", "snd" %}I'm seeing some replication errors on the domain.{% endchatmsg %}
{% chatmsg "Claude", "rec" %}There's your problem! You have replication failures between DC01 (the primary DC you're on) and DC02 (the secondary DC you're trying to transfer FSMO roles to).

**The key issue:**
- Configuration and Schema partitions are failing to replicate from DC02 to DC01
- Error 1908: "Could not find the domain controller for this domain"
- The failures are over an hour old for Configuration partition

**This is why FSMO transfers are failing** - Active Directory requires healthy replication between DCs to transfer FSMO roles, especially for the Schema Master and Domain Naming Master roles.

**Error 1908 typically indicates DNS issues.** Here's what to check:

1. **On DC01, verify DNS can resolve DC02:**
   ```
   nslookup DC02
   nslookup DC02.local.501jfw.moe
   ping DC02.local.501jfw.moe
   ```

2. **Check DNS SRV records for DC02:**
   ```
   nslookup -type=SRV _ldap._tcp.dc._msdcs.local.501jfw.moe
   ```
   Make sure DC02 is listed there.

3. **On DC02, force DNS registration:**
   ```
   ipconfig /registerdns
   net stop netlogon && net start netlogon
   ```

4. **Verify DC01's DNS settings** - it should be pointing to itself and DC02 (or other DCs), not external DNS servers as primary.

5. **Try forcing replication manually:**
   ```
   repadmin /syncall DC02 /AdeP
   ```

Once you get replication healthy (no 1908 errors), the FSMO transfers should work.{% endchatmsg %}
{% endchatbox %}

Once again, I took it step-by-step. DNS to DC02 resolved as expected, and the SRV record also returned the expected response. I could have tried the DNS registration, but since I was already working on DC01, I decided to jump all the way to forcing the replication manually, since it seemed likely that, for once, DNS wasn't the issue. To my surprise, the `repadmin` resolved the issue. The replication summary no longer showed any errors, and I was able to transfer the final two FSMO roles.

I decided to check if Claude could give me an explanation for why that was the fix.

{% chatbox %}
{% chatmsg "Jacen", "snd" %}The manual replication seemed to fix it without any DNS changes or registration. Is there a reason why just doing that would fix the replication errors?{% endchatmsg %}
{% chatmsg "Claude", "rec" %}Yes, actually! The manual replication kick-starting things is pretty common, and here's why it likely worked:

**Possible reasons the manual sync fixed it:**

1. **Stale replication metadata** - Sometimes the DCs have outdated information about each other's replication state. The manual sync forces them to re-establish communication and update their metadata about what needs to be replicated.

2. **Temporary network glitch** - There may have been a brief network issue or DNS cache problem an hour ago that caused the initial failures. By the time you ran the manual sync, the network was fine, but AD replication hadn't automatically retried yet (it uses exponential backoff after failures).

3. **RPC connection reset** - The manual replication command forces new RPC connections to be established, which can clear out stale or hung connections that were blocking automatic replication.

4. **Replication schedule/topology** - Even though it shows "1 consecutive failure," AD might not have attempted another automatic replication cycle yet depending on your replication schedule and the failure backoff timer.

Since DNS was already correct, it was likely just a transient issue that had resolved itself, but the replication system hadn't retried yet. The manual sync essentially told AD "ignore the backoff timer, try again now."

**Now that replication is healthy, you should be able to successfully transfer the FSMO roles to DC02.** Try the transfer again - it should work now. Once that's done, you can safely proceed with your OS reinstall on DC01.{% endchatmsg %}
{% endchatbox %}

I'm not sure about any of those explanations, but I was able to complete the OS reinstall safely regardless.

## Conclusion

This experience was a bit of a mixed bag. On one hand, I *was* able to ultimately resolve my issue thanks to Claude. On the other hand, the first solution it gave me was wildly dangerous, and the advice it did ultimately give wasn't anything I couldn't have found on my own. There is something to be said about the conversational format; best-case scenario, it's easier to talk to the computer like a human rather than trying to formulate a good search query. Worst case, you can use it like a [rubber duck](https://en.wikipedia.org/wiki/Rubber_duck_debugging) to help you work out issues on your own.

I'm never going to be an AI evangelist, especially with people overusing it and refusing to double-check its outputs. However, it still seems to be a useful tool when used and supervised correctly. While nothing it gave me in this case was groundbreaking, it at least saved me a handful of brain cycles that I could apply elsewhere later in the day, and I think there's a value to that.