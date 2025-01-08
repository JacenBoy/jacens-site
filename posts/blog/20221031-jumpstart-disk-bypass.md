---
layout: blog.html
title: "JumpStart/Reader Rabbit Disk Bypass"
date: 2022-10-31
---

The company I work for has a program where we take old computers and load them with Windows XP and various educational games to send to schools in other countries. They aren't top-of-the-line workstations, but it's enough for basic computer literacy, as well as any lessons taught by the educational software.

Low-budget education endeavors tend to lead to sketchy and unorthodox solutions, so I felt it would be a good idea to document the various problems we rant into and the solutions we used to get around them. Maybe one day someone else will find them useful.
<!-- more -->

## Investigation ~ Opening
The two main pieces of software that we ran into issues with were [JumpStart](https://jstart.fandom.com/wiki/JumpStart_Advanced_series) and [Reader Rabbit](https://readerrabbit.fandom.com/wiki/List_of_Reader_Rabbit_games). Both of these series use a common form of DRM used by many educational games of that era: they won't launch without the install disk being inserted into the CD drive. Even if we did purchase enough copies for this to be feasible across thousands of computers, it would still be inconvenient to have to swap disks every time a student wanted to play a different game.

In order to properly break something, you first need to understand how it works. If you've never heard of [Procmon](https://learn.microsoft.com/en-us/sysinternals/downloads/procmon), it's a tool that can be used to analyze programs by tracking what files they try to access and what subprocesses they try to launch. Using Procmon, we can figure out how exactly the disk check is implemented across the various programs.

I've created an ISO image with the installers for JumpStart and Reader Rabbit, mounted it in an XP environment using Virtual CloneDrive, and installed them.

JumpStart Kindergarten seems to have no issues being installed this way. As long as our ISO is mounted, it runs without any issues, and Procmon shows it grabbing files off of out mounted ISO. It's even smart enough to detect that the install was launched outside of the root of the drive.

![Procmon results for JumpStart Kindergarten](https://i.snap.as/qEsOTxLq.png)

Reader Rabbit's Preschool is perfectly happy running entirely off of the ISO; the only useful thing the installer seems to do is create a shortcut to point at the executable on the ISO.

![Properties for the Reader Rabbit's Preschool Start Menu shortcut](https://i.snap.as/Zs9F098S.png)

Reader Rabbit's 1st Grade is a bit of a different animal. Even with the ISO mounted, it doesn't seem to want to launch the game.

![CD error for Reader Rabbit's 1st Grade](https://i.snap.as/NTUWkese.png)

Procmon shows that it seems to expect the install files to exist on the root of the drive. Unlike JumpStart, which tracks the full installer path, Reader Rabbit seems to only keep track of which drive the install was initiated from.

![Procmon results for Reader Rabbit's 1st Grade](https://i.snap.as/GPo2whIB.png)

## Investigation ~ Middle
Obviously, these programs must be storing information about where the CD files are somehow, and while we can easily cheese JumpStart's check by installing it from an external drive (originally, we split the hard drive into a C: and D: partition, and used the D: to hold the install files; later we switched the the Virtual CloneDrive method), that isn't going to cut it for Reader Rabbit. We'll have to figure out exactly how it's storing the path to the CD and point it in the right direction.

First thought is the registry, which ultimately turned up nothing. While Reader Rabbit does create registry keys on install, no relevant data is actually stored there.

Staring mindlessly into the abyss tends to occasionally lead to good ideas, and in this case it helped me notice an `RRF.INI` file among the Reader Rabbit install files.

![Contents of RRF.INI](https://i.snap.as/2Kx3EG0x.png)

Presumably the purpose of this file it to inform the installer of where the files it needs to actually install the game are. This gave me a thought: what if there's another .ini file on the hard drive with the rest of Reader Rabbit's files?

Sure enough, it's there and pointing to the same path that we saw in our Procmon capture. We can update this to point at the correct path on our mounted ISO, which fixes our Reader Rabbit issue.

JumpStart also stores some file paths in its own .ini file, which will be relevant in the next section.

## Investigation ~ Core
So, if we can edit this file to point at the ISO, is there anything stopping us from arbitrarily pointing the `CDDrive` key to anything we want? To test, I copied all of the installers off of the ISO and onto the C: drive. Reader Rabbit includes software from Preschool to 2nd grade, and JumpStart from Preschool to 4th grade, so we'll try installing all of these and seeing what happens.

### Reader Rabbit
- As previously mentioned, Reader Rabbit Preschool seems to be completely self-contained, so we just need to point the shortcut at the executable, with no .ini editing required.

- Reader Rabbit's Kindergarten just seems to be completely broken; it's possible I have a bad installer, but we more or less just decided to skip installing this one.

- Reader Rabbit's 1st Grade, as mentioned, works with an .ini tweak. The `CDDrive` key just needs to be pointed at the `DATA` directory in the CD files.

- Reader Rabbit's 2nd Grade is slightly different for some reason. The `CDDrive` key needs to be pointed at the root of the folder containing the CD files.

### JumpStart
- JumpStart Preschool is pretty complex with several possible .ini files to edit, but if installed from the C: drive, it seems to run without complaint.

- JumpStart Kindergarten also seems to work fine if installed from the C: drive. It's less complex and has only one .ini, but several keys need to be edited to point to the right place. The keys also include references the the `Program Files` directory, so make sure you only edit what you need to.

- JumpStart 1st Grade and 2nd Grade seem to be pretty much identical to Kindergarten.

- JumpStart 3rd Grade and 4th Grade are also extremely modular with multiple .ini files. For your own sanity, just do the initial install off the C: drive and everything should work fine.

I don't know that anyone else will ever have a reason to do what I've done here, but if so, hopefully this points you in the right direction.