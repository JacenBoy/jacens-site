---
layout: rant.html
title: Moving Search From Google To PageFind
date: 2025-11-12
thumbnail: https://jacen-safe.s3.us-west-004.backblazeb2.com/Fx3akiUvBX3d.png
---
I'm just enough of a narcissist to believe that people deserve to hear the things I have to say, so discoverability is very important to me. To that end, I've wanted to have some kind of search function on my site to make it easier to find older posts. Around two months ago, I added a [Google Programmable Search Engine](https://programmablesearchengine.google.com/about/) as a temporary measure, but I always had my eye on [PageFind](https://pagefind.app) in the long term. Today, I finally took the time to implement the PageFind solution into the site.
<!-- more -->

The Google solution was never really viable. I wasn't able to limit the search to just the 11ty site, meaning it also picked up results from my Mastodon and Lemmy servers, most of which weren't even posted by me. That extra clutter made it impossible to actually find any posts on the actual site, with most of the results being completely unrelated to the search query.

That's where PageFind comes in. It's designed to work with static sites, building a search index and providing a JavaScript API for implementing the frontend. There are other solutions for static site search, but PageFind was the most appealing of the ones I found and seems pretty widely used by 11ty users.

Setting it up wasn't really difficult; in retrospect, not implementing it sooner was just pure laziness on my part. The best guide I was able to find was one from [Robb Knight](https://rknight.me/blog/using-pagefind-with-eleventy-for-search/), although I adjusted the workflow slightly. The first step was installing the PageFind package.

```bash
npm install --save-dev pagefind
```

By default, PageFind will index the `<body>` of all pages, but I wanted to narrow down the scope a bit. To do that, I added the `data-pagefind-body` HTML attribute to my post template, both in the `<h1>` tag that contains the post title and the `<div>` that contains the actual content.

![The template responsible for displaying posts, with the new attribute added for the PageFind index](https://jacen-safe.s3.us-west-004.backblazeb2.com/VvI37wHv9R4T.png)

Next was creating the actual index. I added a new NPM script to handle running the command that generates the index.

![My 11ty NPM scripts, with the new "index" script added](https://jacen-safe.s3.us-west-004.backblazeb2.com/oTKIlosHR7jK.png)

Then, to the GitHub workflow that handles building and uploading the site to Neocities, I just needed to add the new script to the end of the build process.

![The GitHub workflow that builds the static site](https://jacen-safe.s3.us-west-004.backblazeb2.com/ZyCO7CWw4bAM.png)

The index is saved in the output directory in a subdirectory named `pagefind`, along with the scripts we need to actually use it. Speaking of, we need a UI to allow people to actually search the site. As mentioned, PageFind provides an API you can use to build a custom search frontend, but it also provides a prebuilt UI to save you the trouble. Unfortunately, due to the way my templates work, the CSS for that UI is included in several pages where it doesn't need to be. I guess that's an optimization for later.

After the CSS was added, all I needed to do was replace the Google search interface with the new PageFind code.

![The code responsible for the search page](https://jacen-safe.s3.us-west-004.backblazeb2.com/CkZ7JR2bpOpA.png)

And just like that, I have a beautiful full-text search for the site.

![The new search page](https://jacen-safe.s3.us-west-004.backblazeb2.com/xv5ypD9trKnU.png)

Overall, the process only took me around ten minutes or so to set up. I'm very happy with how it turned out, and I'm probably going to end up using it myself to reference information from posts that I've written in the past.