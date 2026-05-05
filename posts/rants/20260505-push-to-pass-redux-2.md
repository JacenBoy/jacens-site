---
layout: rant.html
title: Ranting About Push To Pass Yet Again
date: 2026-05-05
thumbnail: https://jacen-safe.s3.us-west-004.backblazeb2.com/RDrEZ81CPSpL.png
---
The IndyCar officiating team has released its findings about the push to pass situation from Long Beach a few weeks ago. They've also announced some changes to the push-to-pass system. Since I don't have anything better to do than yell into the void, let's go over what IndyCar announced today.
<!-- more -->

I've explained Push to Pass (or P2P) several times in the past, but to recap, it's a system that allows a driver to temporarily increase the boost pressure of the car's turbocharged engine to get an increase in horsepower. Drivers are allocated a pool of time that they can use P2P during the entire race, as well as a limit for how long the bursts of P2P can be. All of this is controlled electronically by IndyCar race control.

By rule, on starts and restarts, the P2P system is not activated until drivers reach the alternate start/finish line at the conclusion of the restart lap. Effectively, this means that drivers need to cross the main start/finish line and complete one green-flag lap before they're allowed to use P2P. Unfortunately, [at Long Beach a few weeks ago](https://jacen.moe/rants/20260420-it-happened-again-push-to-pass-rant-redux/), there was an error during the race's sole restart that caused all cars to have access to P2P a full lap before they were supposed to.

Today, IndyCar completed its review of the situation and [released its findings](https://www.indycar.com/news/2026/05/05-05-long-beach-review). To make a long story short, it's not that the system was enabled too early; it's that it was never disabled.

IndyCar race cars transmit a ton of data to the pit wall, the teams' race shops, and to race control. Likewise, IndyCar needs to be able to transmit data back to the cars, such as lap times, flag data, and, crucially, signals to enable or disable P2P. To handle this, IndyCar uses a standard called Controller Area Network, or CAN. This is a standard already designed for and used in automotive applications, making it a perfect fit for the job. CAN is designed to allow one device to communicate at a time and prioritize which data gets sent first. IndyCar also stated that their system is designed to only send one message from Race Control to the cars at a time. However, somehow, multiple signals were sent at once just before the race's sole yellow flag, causing a shutdown of the P2P system. This means that the signal to turn off P2P was never actually sent to the cars when the yellow came out.

Of the 24 cars still running at the time, 12 of them used P2P during the restricted lap, and IndyCar did release the drivers and their usages in the report. Since the rules stated that IndyCar was responsible for the operation of the P2P system, they were unable to penalize any of the drivers that used it, and they determined that there weren't any position changes directly related to the use of P2P anyway. In short, since IndyCar is the one that screwed up, they decided to make a no-call.

That will not be the case next time. IndyCar has updated the rule book to put the burden on the drivers to make sure they aren't using P2P when they shouldn't be, regardless of whether or not the software is functioning or not.

> **Rule 14.19.17:** Competitor Responsibility and Prohibited Utilization. INDYCAR-controlled Push to Pass is prohibited during the periods identified in Rule 14.19.16 and it is the sole responsibility of the Competitors to ensure that Push to Pass is not utilized during any period where prohibited. Any successful utilization of the Push to Pass during such periods, regardless of INDYCAR signal status, is prohibited and subject to penalty per Rule 9.2.2.

Of course, IndyCar isn't just leaving the system as-is and putting all the responsibility on the teams. They're also adjusting the software of the P2P system to be more robust to prevent multiple messages from being sent like this, as well as adding an extra human to review P2P messages and confirm that they're properly received by the cars.

This is all mostly a moot point because of the second change to the rules. [IndyCar will allow P2P on the start and any restarts the first time by the alternate start/finish line once the green flag is displayed.](https://www.indycar.com/news/2026/05/05-05-p2p)

It's a bit convenient timing to make this rule change, and IndyCar president Doug Boles admits as much. However, what he hasn't said, and what is important to note, is that this is something that IndyCar has been exploring for some time. It was experimented with during the All-Star Race at the Thermal Club a few years ago, and it was mentioned as something IndyCar was discussing when Team Penske was caught cheating that same year. The series just decided that now was the right time to finally pull the pin.

I'm not sure this change will make much of a difference long-term. We saw demonstrably that it didn't matter much at Long Beach. Still, there's a chance it could make a difference at tracks where it's a bit easier to pass, and simplifying the rulebook is a net positive regardless.

So, the series lives, learns, and moves on. We'll get a chance to see the new rule in action at IMS GP this weekend, so we'll see how it affects the racing there.
