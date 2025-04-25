---
layout: rant.html
title: IT Pro Tip - Start At Layer Zero
date: 2025-04-25
---
This is [a story I've told before](https://www.reddit.com/r/talesfromtechsupport/comments/6lr7xz/simple_solutions/), but I think it fits well with my IT Pro Tip series. It's pretty short, so I figured it worked better as a rant than a full blog post.
<!-- more -->

I was still a teenager, thrown into the deep end as the primary IT contact at the local arm of a multinational company. While I had support from the company headquarters, pretty much anything on the local network fell to me to fix.

On this day, the issue was a workstation that wasn't connecting to the Internet. A second computer in the same office and plugged into the same switch was having no such issues.

I jumped right in, checking every configuration setting I could on the computer and the various switches involved in the routing. Despite my best efforts, everything seemed to be correct on the software side. Eventually, I gave up on that front and finally decided to check the physical connection.

I traced the network cable back to the unmanaged switch it was connected to and found that it was unplugged. The reason the second computer was still working was that it was connected to the Wi-Fi and had automatically switched over when the switch went down.

Always start at the very beginning, no matter what. It's tempting to jump into the deep end and start planning for every possible contingency, but when you do that, you tend to miss the things that are right in front of you. No matter how confident you are that you already know or how much of a waste of time it seems to be, check every link in the chain before moving on to the next.