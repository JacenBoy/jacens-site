---
layout: blog.html
title: Migrating from WriteFreely to 11ty
date: 2025-01-08
thumbnail: "https://jacen-safe.s3.us-west-004.backblazeb2.com/dRAVOBuw37Do.png"
---

For someone who doesn't blog regularly, I change blog platforms a lot. I've used WordPress, Jekyll, WriteFreely, and now 11ty. We'll see how long this lasts for, but let me dive into why I made the change and how I have everything set up.
<!-- more -->

## Why 11ty?

Like I said, I've used Jekyll in the past, so I'm familiar with static site generators. However, I switched from that to WriteFreely as I was getting more and more into the Fediverse.

It turns out, having Fediverse integration on a blog isn't very useful, especially when you don't have any readers.

I was hosting my blog on Write.as, and, while it's a great platform, it was a bit more restrictive with customization that I would have liked. Additionally, I noticed there was a significant caching delay between making an edit to a post and that edit showing up on the custom subdomain I had set up. These are pretty minor gripes, but, since Write.as didn't really have any features I was relying on, I decided it was time for a change.

I could have solved some of these problems by self-hosting WriteFreely, but at this point in my life, I'd really rather just pay someone else to handle the hosting headache for me. That was the reason I used Write.as in the first place.

While I could have migrated back to Jekyll, I wanted to be able to customize the site more, and I'd rather use JavaScript than Ruby to do that. After looking at the various options, 11ty was the one that I liked the most.

11ty appears to be more geared toward general websites rather than blogs, but that does have the advantage of making it way more powerful and customizable. And, while it was a ton of work to fine-tune my initial templates, I'm hoping the posting workflow is as easy as it was with Jekyll.

## Setting Up 11ty

Nunjucks seems to be the most popular templating engine among people who use 11ty. I, however, am more familiar with Liquid thanks to my time using Jekyll, and I decided I wanted to just stick with that. It does make it more difficult to find help when searching online, but the syntax is close enough to Nunjucks that many basic concepts transfer easily. Because I want posting to be as easy as possible, my posts are written in Markdown.

As you can probably tell, I am not a web designer, nor do I play one on TV. I started with Bootstrap as a baseline to help make the site look a little more visually appealing. I don't care too much about how the site looks beyond that, so my customizations are extremely minimal.

Since WriteFreely posts are written in Markdown, migrating posts was as simple as copying and pasting. While tedious and manual, it was simple to do.

## Hosting

If I wanted a completely seamless workflow, I could have hosted on GitHub Pages, Codeberg Pages, or some other git-based site host. However, I ended up going with Neocities. I appreciate how easy they make hosting a website for people who don't know what they're doing, while still providing tools for people who do.

## Writing With Obsidian

I do all of my coding in VS Code, and while I could use that for writing posts, I decided to go with Obsidian. I have the Templater plugin installed for powerful snippet generation in case I decide I want to do anything complicated. Additionally, I use LanguageTool as a Grammarly alternative to make fixing spelling and grammar a bit easier, and there's a plugin to integrate that into Obsidian as well.

## Comments

Even though I don't get enough traffic to justify it, I like having comments enabled on the blog. I went with Disqus for this. I know that isn't a hugely popular choice among the open-source crowd due to their tracking and performance issues, but I don't really want to have to host a server myself, and I couldn't get any of the other free options to work. For now, this is the best I could find.

## Conclusion

Overall, setting up 11ty was a lot of work, but I'm pretty satisfied with the results. I'm sure eventually I'll get the urge to switch platforms again, but, for now at least, I think this is a usable platform for me to post on.