---
layout: blog.html
title: I Switched to Firefox
date: 2026-06-09
thumbnail: https://jacen-safe.s3.us-west-004.backblazeb2.com/HWRNpnahbp29.png
---
After five years of driving and recommending Vivaldi, it finally came time for me to make a switch. I've made the move to Firefox. Let me explain the reason for the switch and how I've set things up.
<!-- more -->

## My Browser History

I've used my fair share of browsers over the years. I started using Chrome back in 2009, which I stuck with until I decided to try out Opera in 2017. From there, I switched to Brave in 2019, then Edge briefly, before settling on Vivaldi, which I daily drove from 2021 until this year.

The main reason I stuck with Vivaldi as long as I did was its tab stacks. Most browsers implement tab groups within the tab bar, taking up precious space that could be better used to hold more tabs. Vivaldi has an option to have a second tab bar, with the first bar representing your tab groups and the second representing the tabs within the group. This means you give up a bit of vertical screen space, but it's incredible for managing a lot of tabs.

A couple of years in, Vivaldi also introduced workspaces, a feature that lets you group tabs (or tab stacks) together and quickly switch between those groups. Basically, this gave me all the tools I needed to manage and organize an effectively unlimited number of tabs.

## Time for a Change

Vivaldi 8.0 made a couple of changes that triggered my decision to finally jump ship. First was the design overhaul that put clashing colors on the tab and title bars. This was a pretty minor gripe; it was easy enough to customize the tab bar color back to something that looked more normal. The real issue was the changes that were made to the behavior of new tabs.

The two tab bars each have their own "new tab" button. The one on the top bar used to open a new tab stack, while the one on the bottom would open a new tab within the stack. What I noticed was that trying to open a new tab within a stack that had only one tab would instead open an entirely new tab stack. Moreover, it opened it at the *beginning* of the tab bar instead of the end. I tried adjusting a variety of settings, but all of them had unintended side effects that still made tab management more difficult than it used to be.

This is not the first major issue I've had with Vivaldi. Sync seems to break frequently, the graphics renderer crashes occasionally, extensions that I had explicitly removed from the sidebar continually reappear, and indexing tabs on mobile is slower than it used to be, even after several rounds of fixes. I've dealt with it because the tab stacks were such a nifty feature, but I finally decided it was time to switch to something new.

## Finding a Replacement

Without tab stacks, I would need another solution for organizing my tabs. The solution I came up with was vertical tabs. I had used them before when I used Edge, and they were a good solution to my main problem with having too many tabs open, which is the "close" button disappearing. Other than Edge, Firefox is the only other mainline browser to support vertical tabs, having added them last year.

To make a long story short, I don't like Mozilla as a company. Their fanboys take them at their word and herald them as a paragon of privacy, but they're just as two-faced liars as any other tech company. They first caught my eye back in 2017 when they [forcibly installed an advertisement extension for a show called Mr. Robot](https://www.bleepingcomputer.com/news/software/mozilla-angers-firefox-users-after-force-installing-mr-robot-promo-add-on/). More recently, they partnered with a data privacy company called Onerep, which claimed to remove personal information from people-search websites while [the CEO was the founder of dozens of those websites](https://krebsonsecurity.com/2024/03/ceo-of-data-privacy-company-onerep-com-founded-dozens-of-people-search-firms/). [It took Mozilla almost two years](https://krebsonsecurity.com/2025/11/mozilla-says-its-finally-done-with-two-faced-onerep/) to finally break ties with Onerep.

So, forgive me if I'm a bit suspicious of a supposedly privacy-focused non-profit.

With that said, no tech company is perfect. I don't think I need to go over the scandals of Microsoft or Google, but even Brave was caught [running ads about privacy to Chrome, Edge, and Firefox users](https://www.bleepingcomputer.com/news/software/brave-browser-taunts-chrome-edge-and-firefox-in-new-privacy-ad/) out of one side of its mouth while [whitelisting trackers for Facebook and Twitter](https://www.bleepingcomputer.com/news/security/facebook-twitter-trackers-whitelisted-by-brave-browser/) out of the other over the span of just two weeks. With that in mind, I'm willing to give Firefox one final chance.

## The Setup

Making the switch was pretty simple. Firefox imported my history and bookmarks from Vivaldi pretty seamlessly. Next was turning on vertical tabs and turning off the tab preview thumbnail, which I'm not a fan of in any browser. I also turned off spell-check, since I currently use [LanguageTool](https://languagetool.org/) for spelling and grammar. I also made sure to turn off Firefox studies to prevent a repeat of the Mr. Robot situation and blocked all AI tools, which can now be done with the click of a single switch.

A surprisingly difficult thing to set up was search. I currently use [Brave Search](https://search.brave.com/), and its help documentation says that Firefox is supposed to auto-detect the new search engine, but I wasn't able to get that to work and had to add it manually.

I did have to manually reinstall all of my extensions. I'm a little surprised there isn't a mechanism to detect and migrate those. Finding and installing each of them was a bit time-consuming, so some kind of better option for that transition would be nice.

## The Experience

I would describe the Firefox experience as "adequate". Everything works technically, but there are some compromises that I have to make.

For one thing, Firefox is both slower and more memory-intensive than Vivaldi was. People joke about how much of a RAM hog Chrome is, but it's been my experience that Firefox is more resource-heavy. I frequently found that I was dealing with Firefox lagging and even slowing down the rest of my system.

Firefox's implementation of tab groups is also as poor as every other browser. Even with the vertical tabs, I found myself just not using tab groups because they took up space for no benefit. I'd love to see Firefox try to replicate Vivaldi's two-level stacks, which seems like a way more sensible implementation.

Related to that, Firefox has an issue with horizontal tabs where the close button disappears from tabs with only a handful open. With 140 tabs for me to manage, that's a complete nonstarter. 140 might sound like a lot, but I can assure you from talking with other tab hoarders that those are rookie numbers. It's less of an issue with vertical tabs, but if I ever wanted to go back to horizontal, Firefox would be completely unusable as-is.

One thing Firefox doesn't have is workspace support. Without the two-level tab stacks, that feature is more important than ever. There are a handful of extensions to emulate that functionality. I'm using one called [Workspaces](https://addons.mozilla.org/en-US/firefox/addon/firefox-workspaces/), which works, but it's not nearly as good as a properly integrated solution would be.

## Conclusion

I'm giving up a lot to switch to Firefox for very little benefit. As is, it's perfectly functional, but there are quite a few concessions that I'm making. All I can do is hope that Mozilla continues to improve the browser to make it more usable. Or maybe a new browser will come along to pique my interest.
