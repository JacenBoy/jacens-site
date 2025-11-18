---
layout: rant.html
title: Please Stop Using Cloudflare
date: 2025-11-18
thumbnail: https://jacen-safe.s3.us-west-004.backblazeb2.com/aTuLBdb2JSni.png
---
With [the recent Cloudflare outage](https://www.bleepingcomputer.com/news/technology/cloudflare-hit-by-outage-affecting-global-network-services/) resolved, I suspect most websites are going to go back to normal, not thinking anything of it until the next time things go sideways. Still, I'm here to make a plea: please consider not using Cloudflare.
<!-- more -->

It's estimated that almost 20% of all websites on the Internet use Cloudflare, and Cloudflare themsevles have estimated in the past that 16% of all Internet traffic goes through them at some point. Given how big the Internet is and how many people access it every day, that's a substantial amount of data.

So, when it goes down, a lot of things are impacted.

And it goes down a lot. Even outside of this most recent outage, there have been a [few](https://www.bleepingcomputer.com/news/security/cloudflare-says-1111-outage-not-caused-by-attack-or-bgp-hijack/) [other](https://www.bleepingcomputer.com/news/technology/google-cloud-and-cloudflare-hit-by-widespread-service-outages/) [instances](https://www.bleepingcomputer.com/news/security/cloudflare-outage-caused-by-botched-blocking-of-phishing-url/) this year alone. Very few other services affect such a wide range of people as regularly as Cloudflare does.

But maybe you don't buy that argument. After all, plenty of other major services go down. We just had the AWS outage last month, not to mention the constant issues that Microsoft 365 seems to have. So, let's look at another angle: how Cloudflare's market share makes it uniquely dangerous to the open web.

If big tech had their way, sites like mine wouldn't be able to exist. Everything would be aggregated into a small bucket of social media sites meant to maintain your attention and harvest as much data as possible. The beauty of the web as we know it is that anyone can create anything they want and put it out there for all to see.

So, then, why are we putting so many of those sites in the hands of a single company?

Cloudflare's CEO has said that he doesn't want to be a gatekeeper of the web. Cloudflare has actually received criticism for not taking action against sites that host deplorable content. And the times it has taken action, it's generally been on the correct side of things.

But what happens when they stop being on the correct side?

Keep in mind that Cloudflare can take action against sites that aren't even using their DDoS and anti-bot protections. They run the second-biggest public DNS resolver in the world. At the flip of a switch, they could remove access to any site they want for millions of people.

Likely, in the aftermath of this outage, nothing will change, and everyone will keep using Cloudflare the way they have been. Still, I can only hope that someone will consider that maybe Cloudflare isn't that much of a force for good.