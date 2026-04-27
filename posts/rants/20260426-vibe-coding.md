---
layout: rant.html
title: I'm Concerned That I Enjoy Vibe Coding
date: 2026-04-26
thumbnail: https://jacen-safe.s3.us-west-004.backblazeb2.com/w3OhTMwiUYR7.png
---
I can code. I'm not very good at it, and I haven't had much formal training, but I can do it for the most part. So, when I need some software for something, rather than using an off-the-shelf solution that doesn't have all of the features I want, I have the option to write it myself.
<!-- more -->

That's the thing: I don't code because I enjoy it; I code because I can.

And that's where I fell into the rabbit hole. I want the customization of a fully custom-built solution without the stress and frustration of building it myself. Maybe that's why the forbidden fruit of vibe coding finally got me.

## The First Hit

While trying to consolidate tools at my job, we've run into one consistent snag. Our CEO has a tool that generates reports based on the Microsoft Secure Score. While I, personally, don't think the Secure Score matters all that much, he likes having a list of actionable items to show to clients.

So, out of curiosity, I booted up Antigravity and asked it to build a dashboard that could pull the secure score using the Microsoft Graph API and generate a report from the data.

It almost one-shotted it.

![A Microsoft Secure Score dashboard written in Next.js](https://jacen-safe.s3.us-west-004.backblazeb2.com/dox5wNvJQ95t.png)

It wasn't entirely perfect, and it still needs some work to get it to the point where it's really useful for us, but it was still an incredible starting point.

I'm sure I could have built it myself. It would have taken weeks of digging through documentation and banging my head against the keyboard. Gemini pulled it off in under a half-hour.

And so I had to see what other useful tools AI could build for me.

## Back for More

I've wanted to get rid of Disqus on my site for quite a while. I stuck with it for so long because it was the easiest way to get comments working without spending any money, but I've wanted to build my own system for a very long time. I had a vision for a REST API, giving me extra flexibility on the frontend, and an email-based OTP system for basic identification and anti-spam. The requirements were pretty simple, but I never had the motivation to actually build it.

So, I once again booted up Antigravity and set it to work.

In under an hour, I had a working baseline loaded up into XAMPP, and before the end of the night, after a bit of back-and-forth, it had built a system to my specifications. Once again, this is something that I absolutely could have made by myself, but it would have taken me days of work, and it wouldn't have been quite as elegant as the system I ultimately ended up with.

I'll try my best not to say I did anything or I made anything, because I didn't. I described my vision to a computer, which spat out a bunch of code. I tested it and made sure it worked, and that's about it. I didn't even really look into the code too in-depth.

Despite that, I didn't feel unfulfilled or anything like that. Like I said, I don't code because I enjoy it; I code because I can. I have something I want, so I make it. So, being able to have the thing I want without having to make it myself is fine with me. It gives me more time to work on the things I actually enjoy working on.

## Cleaning Up

Of course, blindly pushing clanker-generated code to a live environment is a pretty bad idea. However, if I'm not going to code my own project, I'm certainly not going to search for security vulnerabilities on my own. So, I once again delegated the task to AI, this time using Claude via OpenCode to do a basic security audit.

The main issues it found were a lack of CSRF and XSS protection. Both of these were probably things I would have considered if I had been building the project myself. However, since I wasn't engaging my brain, it didn't cross my mind to add that as a requirement to the project.

Yet again, I set Gemini to the task of adding in appropriate protections for both of those issues. Again, I didn't do much beyond a cursory overview of the code and testing to make sure everything worked. Just like that, I had [the comment system I always wanted](https://github.com/JacenBoy/jacen-comment-system).

## Conclusion

The AI boom is affecting a lot of people that I know and consider to be friends. Artists are dealing with AI image generation and editing tools constantly being added to any graphics products. Deezer has reported that [44% of music uploads on their site are AI generated](https://arstechnica.com/ai/2026/04/deezer-says-44-of-new-music-uploads-are-ai-generated-most-streams-are-fraudulent/). Even I am technically competing against slop machines that can pump out hundreds of written media articles in the time it takes me to write one.

And despite knowing all the issues AI is creating, here I am, not only using AI but proudly implementing my vibe-coded creation onto my site. What exactly does that make me?
