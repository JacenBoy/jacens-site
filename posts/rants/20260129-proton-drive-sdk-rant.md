---
layout: rant.html
title: I'm Hopeful For Proton Drive - The SDK Rant
date: 2026-01-29
thumbnail: https://jacen-safe.s3.us-west-004.backblazeb2.com/yVVR58RbVaX5.png
---
Last July, [Proton teased their upcoming Drive SDK](https://proton.me/blog/proton-drive-sdk-preview), which would allow third-party developers to build clients for Proton Drive or implement Drive into their applications. Today, they've given us [an update on the status of the SDK](https://proton.me/blog/drive-sdk-january-2026). Let's take a look at what the Proton Drive SDK could mean for the future of Proton Drive.
<!-- more -->

Proton Drive is one of the few things keeping me tied to Windows. I've tried self-hosting NextCloud before, and it was way too slow and buggy for my needs. Since I was already paying for Proton Mail, Proton Drive seemed like a great alternative when it was released. I haven't had nearly as many issues with it as some people seem to; performance and reliability have both been pretty solid, even when moving large amounts of data like my 400 GB music library. However, it certainly has its pain points, including the lack of integration between apps on Android and, more relevantly, the lack of Linux support. The second one in particular has been a big sore spot for the community, with some people flat-out refusing to even consider it until that's changed. There are other solutions; [Rclone](https://rclone.org) has had [support for Proton Drive](https://rclone.org/protondrive/) for quite a while. However, that still isn't the same as a proper syncing client.

That's what makes the SDK such an exciting prospect. Even if Proton never makes a Linux client (although they've mentioned several times that it is in development), an official SDK would allow quality third-party clients to be created.

To be clear, we aren't there yet. While the SDK supports pretty much all of the basics that you could want in a cloud storage provider, it's notably missing authentication support, which is the one piece that would fully enable third-party client support. However, it certainly seems like we're getting closer. Proton has also announced that some CLI tools are coming soon to provide some functionality that isn't yet in the SDK, so it will be interesting to see what comes of those.

As for the 2026 roadmap, I notice that authentication is notably absent from the list of features Proton is working to add to the SDK. Like I said, authentication is the one feature that will open the door to a proper file sync client, so I'd like to see it be given a bit more priority, since that seems more generally useful than features like photo support and file sharing. Of course, if the official client comes out first, that renders the entire point moot, so we'll see what happens over the course of the year.
