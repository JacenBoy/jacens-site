---
layout: blog.html
title: IT Pro Tip - Don't Deny Permissions
date: 2025-07-12
thumbnail: "https://jacen-safe.s3.us-west-004.backblazeb2.com/RC69hXfSoAOr.png"
---
You're setting up a new shared folder on a Windows file server, probably one that holds sensitive information. You want to be sure that no one unauthorized can access the files, so in the Security tab, you set a new permission entry to deny access to the "Everyone" object.

You've just fallen for one of the oldest pitfalls in the book. Let's go over Windows file permissions and why the "deny" permission is one of the most dangerous.
<!-- more -->

## Asking For Permission

Compared to the basic "read/write/execute" system of Unix-like operating systems, Microsoft's NTFS permissions system is much more robust and granular, giving admins a lot of control. It also includes inheritance, allowing you to set permissions at the root level of a folder structure and have it trickle down to files and folders underneath. This makes managing complex file structures much easier.

Under NTFS, there are three states a permission can be set as: "allow", "deny", and unset. There are two main rules for how Windows evaluates the permissions you set up.

1. Explicit permissions take precedence over inherited permissions.
2. "Deny" permissions take precedence over "allow" permissions.

With those rules in mind, the full order of precedence would be:

1. Explicit "deny"
2. Explicit "allow"
3. Inherited "deny"
4. Inherited "allow"

"Deny", then, is extremely powerful. That's exactly why it can create issues when applied incorrectly.

## Living In Denial

Let's say you're an overeager server administrator, and, to increase security, you "deny" the "full control" permission to the "Everyone" object. After all, you only want people within your organization to be able to access those files, right?

First of all, keep in mind that "full control" includes every possible permission; you may note that Windows automatically unchecks the "full control" checkbox if you remove any of the permissions underneath it. Rather than just denying dangerous permissions, you've just denied every possible permission on the files. Secondly, remember that an explicit "deny" overrides an explicit "allow". This means that you've just blocked everyone in your organization from accessing any of those files, even if you've set up any "allow" permissions for them.

It's wholly unnecessary to use "deny" for this purpose, anyway. An unset permission is effectively a soft "deny". This means that as long as "Everyone" isn't explicitly in your permissions list, no random person off the street can just come in and access your files. Likewise, if you want a shared folder specifically for executives of the company, just create a group and make sure only that group is listed in the permissions for that folder.

So, then, the rule of thumb: **never ever use "deny" permissions.**

I'm not sure that I was clear, so I'll say it again. **Never, under any circumstances, use "deny" permissions.**

## When To Use Deny

But surely Microsoft wouldn't include the "deny" option if it wasn't meant to be used. There must be a legitimate use case for it, right?

No. Never use it.

Obviously, I'm exaggerating when I say that. Rules are made to be broken, and figuring out exactly when to break those rules is something that comes with experience. With that said, if you have to ask, the answer is "no".

## Conclusion

This is a pretty high-level overview of NTFS permissions and doesn't go too far into the various complexities, but hopefully I've at least helped steer you away from a potential pitfall. As enticing as the "deny" permission seems at times, there's almost always a better way to accomplish whatever you're trying to do. Critical thinking is a very important skill in the IT industry, so just think of it as yet another lesson in doing that.