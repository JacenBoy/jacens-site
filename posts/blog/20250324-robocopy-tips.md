---
layout: blog.html
title: IT Pro Tip - Robocopy
date: 2025-03-24
thumbnail: "https://jacen-safe.s3.us-west-004.backblazeb2.com/MOHUfjKWizWW.png"
---
I run into many situations where I need to copy numerous files, particularly when trying to move a user profile from one computer to another. A mistake I see even experienced IT techs make is using the standard Windows "drag-and-drop" to do these copy tasks. Doing things this way can take hours. There are also tools like [Transwiz](https://www.forensit.com/move-computer.html) that can handle this for you, but I've found them to be less reliable than I would like.

There's a much more efficient tool for copying lots of files, and it's been built into Windows for over a decade. Allow me to introduce you to Robocopy.
<!-- more -->

The Robocopy tool was first released in 1996, and Microsoft started including it with standard versions of Windows with the release of Windows Vista. While it has several advantages of copying through the file explorer or using other tools like `xcopy`, its biggest advantage is multithreading. Most other built-in Windows file copying tools can only copy one file at a time, which slows things down significantly. Robocopy can copy multiple files at a time, speeding up the file copy process, especially when you have a lot of small files to copy.

## Usage

Robocopy is a command line utility. If you work in IT, I assume you're already familiar with the command line. If you aren't, get familiar with it. It will be extremely useful to you in the long run.

On the surface, using Robocopy is pretty simple.

```batch
robocopy <source> <destination> <options>
```

There are, however, a lot of options, and you'll want to use at least a few of them. Which specific ones you'll want will depend on what you're doing, so there isn't a "one size fits all" approach. [SS64](https://ss64.com) is a great resource for remembering how to use the Windows command line, and they have [a full list of Robocopy options](https://ss64.com/nt/robocopy.html) for your convenience. With that said, it's not always clear which options you should use, so I'll explain the ones I have experience with so you can determine how to set up your command.

### `/mt`

I'm putting `/mt` first because it's the most important one, so let me be clear:

**ALWAYS USE `/mt`!**

The entire advantage of Robocopy is its multithreading, and `/mt` is how you enable that, so if you aren't using it, you're missing the entire point. Make sure you always use `/mt` in your Robocopy command.

You can add a number to the `/mt` option (e.g., `/mt:4`) to tell Robocopy the specific number of threads to use. If you don't, it will default to 8, which is normally a pretty good number for modern machines. There is a point of diminishing returns: the computer can only read from the disk so fast, and your network or USB link can only handle so much data, so don't go overboard. You also shouldn't go higher than the number of CPU cores you have available. For example, on a 6 core CPU, limit it to `/mt:6`.

### `/s` And `/e`

Realistically, `/s` and `/e` are redundant. `/s` tells Robocopy to copy subfolders, and `/e` tells it to copy subfolders, including empty ones. When you work in IT long enough, you pick up a few superstitions, so I use both out of habit. You will probably want to use at least one of them, since you're likely copying a full folder tree if you're using Robocopy in the first place.

### `/copy`

This tells Robocopy which elements of the files you want to copy. The possible elements you can choose are:

- **D**: Data - The actual contents of the file.
- **A**: Attributes - File attribute flags, such as "read only", "hidden", etc.
- **T**: Timestamps - The date created and modified data.
- **S**: Security - Any NTFS security settings that have been set on the file.
- **O**: Ownership - The data regarding which user or group owns the file.
- **U**: Auditing info - The NTFS audit logs regarding file access.

If you don't set `/copy`, Robocopy will default to `/copy:dat`. You can also use `/sec` as a shorthand for `/copy:dats`, and `/copyall` as a shorthand to copy everything (i.e., `/copy:datsou`).

I mostly work in Active Directory domain environments where keeping security information is important, so I usually use `/copy:datso`. I've seen issues arise from losing the ownership data, which is why I've adopted that rather than using `/sec`.

There are situations where you actually *don't* want the security data. If you're copying between two non-domain joined computers, you can create permissions issues if you include the security settings. In those cases, `/copy:dat` is sufficient.

I don't think I've ever worked in an environment that uses Microsoft's NTFS auditing features, so including `u` normally just adds a bunch of unnecessary error messages to my command output.

### `/b`

This tells Robocopy to run in backup mode. This uses the Windows backup and restore security privileges to bypass permissions issues. The easiest way to get these permissions is to run Robocopy as Administrator. If you happen to be running as admin, it makes sense to throw this in to make sure you don't have any permissions errors in your copy.

### `/j`

This tells Robocopy to use unbuffered I/O for its copying. Effectively, this bypasses the standard caching that Windows does when accessing files. This is most noticeable for large files, since it reduces the overhead of loading files into memory before they are written to the disk. This comes at the cost of increasing the number of disk I/O operations, which is most noticeable when working with smaller files.

### `/r` And `/w`

These handle the number of times to retry failed copies and the wait time between failed copies. By default, Robocopy will retry 1 million times (i.e., `/r:1000000`) and will wait 30 seconds between retries. (i.e., `/w:30`). Crank both of these down.

### `/secfix`

This is a panic button in case you wanted to copy security or ownership data but forgot the first time. Just run the exact same Robocopy command again (this time with the correct `/copy` flags, ideally) and include `/secfix` to have Robocopy update the security information on all the files in the destination to match the source.

### `/xf` And `/xd`

These let you exclude files or directories (folders) from your copy. As an example, I've seen issues related to copying the `ntuser.dat` file in a user's profile, so I frequently use `/xf ntuser.dat` to prevent that file from being copied. Similarly, if you want to speed things up even more, you can skip a lot of files by using `/xd appdata` if you're sure there's nothing there that you'll need later. These options can also take wildcards, so you can use something like `/xf *.txt` to exclude all text files.

### `/xj`

This option tells Robocopy not to follow junction points. Junction points are basically an alias pointing to a different file or folder on the disk.

The reason I point this one out is that there's an "Application Data" junction point in Windows user profiles. There is some kind of recursion on this junction point that causes Robocopy to get stuck in a loop trying to copy that folder forever. Using `/xj` fixes this. If you happen to be using junction points legitimately, this will also skip those, so keep that in mind.

### `/z`

**NEVER USE `/z`!**

I'm not sure that I was clear, so I'll say it again: **NEVER USE `/z`!**

`/z` tells Robocopy to run in restartable mode. This means that, if a copy is interrupted in the middle of a file, Robocopy will include enough information to re-run the command and restart the copy from where it left off.

This might seem like desirable behavior. There is, however, one major caveat: `/z` is extremely slow. Your copies will take exponentially longer than they would otherwise. It's not worth any possible advantages that you might have. Just don't ever use `/z`.

## Other Notes

I've used Robocopy pretty extensively, so here are a few things that I've picked up along the way.

- When using Robocopy to migrate user profiles, I've found that running both the backup and restore Robocopy commands as the user I'm migrating helps prevent potential permissions issues.
- If you're migrating between non-domain joined computers, make sure you *don't* copy any security information. Even if the usernames are the same, Windows will see the user of each machine as a unique user, and your permissions will be completely wrong.
- Conversely, make sure you *are* copying security information if you're dealing with domain accounts. Since the user will be completely identical regardless of which machine they log into, it's important to keep this information intact.
- I've seen issues related to copying `ntuser.dat` across computers, so it's safest to exclude that file.
- If you're trying to copy to a network location, it's easier to use UNC paths (`\\<server name>\<share name>`) rather than using mapped drive letters. Particularly if you're running Robocopy as admin, your mapped drives might not work as expected, and it's more likely that your UNC paths will work.
- Robocopy can detect new and modified files when copying. This means that you can seed a copy in advance of whatever job you need to do and re-run the same command later to pick up any files that have been added or changed since the initial copy.

## Conclusion

Robocopy has a lot of other helpful features regarding logging and automation, but I would again recommend visiting [SS64](https://ss64.com/nt/robocopy.html) if you want to dive even deeper into it.

Hopefully, this helps you get started with Robocopy. It's certainly a powerful tool, and there are plenty of challenges that come with that. However, once you do get the hang of it, it will help you get things done quicker and more efficiently.