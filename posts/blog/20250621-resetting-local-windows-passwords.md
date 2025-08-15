---
layout: blog.html
title: IT Pro Tip - Recovering Local Admin Access
date: 2025-06-21
thumbnail: "https://jacen-safe.s3.us-west-004.backblazeb2.com/ylSmTswhk4UN.png"
---
Even in a domain environment, once in a while things go wrong and you need a local administrator account. Maybe you're taking over for an unhelpful rival IT department, or maybe you've had an employee who didn't document things correctly. Regardless of the reason, sometimes you just don't have access to everything you need to do your job.
<!-- more -->

Fear not. Reinstalling Windows isn't the only way to regain access to this computer. Let me run through some suggestions for how to recover access to a computer that you've been locked out of.

## Online Solutions

This is a solution that I'm surprised no one in the place I work ever thinks of. If you have a good RMM tool (you *do* have a good RMM tool, right?), it probably has a command prompt function running as `NT AUTHORITY\SYSTEM`. If it does, you can use the `NET` command to create a new admin account.

```batch
net user <username> * /add
net localgroup Administrators <username> /add
```

These commands will create a new user and add it to the "Administrators" group. The "\*" will cause Windows to prompt you to enter a password for the account as the command runs. You can replace that with a plain-text password if you want, but it's not recommended to keep passwords lying around in plain-text.

If you instead want to just reset a user's password, you can leave out the `/add` and skip adding them to the "Administrators" group.

```batch
net user <username> *
```

For more details, [SS64](https://ss64.com) is a great resource, and it has a [full explanation](https://ss64.com/nt/net-useradmin.html) of how to use the `NET` command.

## Offline Solutions

If the RMM isn't an option, you'll need to get a little more creative.

My favorite trick used to be the `UtilMan` method. It involved replacing the `UtilMan.exe` executable, which handles accessibility setting in Windows, with `cmd.exe`. `UtilMan` runs as `NT AUTHORITY\SYSTEM` pre-login, giving it the highest level of privilege that Windows can bestow. With this setup, you'll have an elevated command prompt that you can use to reset the password or create a new account using `NET` the same way we did above. Unfortunately, Windows Defender now flags and blocks this method. If you're quick and get lucky, you can get Command Prompt to launch before Defender blocks it, but it's still no longer a reliable method. We'll have to get a bit more creative.

The Security Account Manager (SAM) is a file that holds account information for Windows machines. That means we should be able to edit it in order to reset a user's password. However, due to the sensitive nature of the contents of the file, Microsoft has various protections in place for the SAM database.

Enter [NTPWEdit](http://cdslow.org.ru/en/ntpwedit/). It handles decrypting the SAM and lets you perform tasks such as resetting passwords and unlocking accounts. Windows locks the SAM when the computer is in-use, so you will need to take the SAM offline by booting into a Windows PE environment to use it, but tools like [Hiren's BootCD PE](https://www.hirensbootcd.org) (not to be confused with the [original Hiren's BootCD](https://www.hiren.info/pages/bootcd)) come with it bundled.

There are two major caveats. First, NTPWEdit doesn't play nicely with fast startup. Fast startup causes the computer to hibernate rather than fully shut down. If you try to run NTPWEdit while the computer is in this state, you will run into problems, so either disable fast startup or make sure Windows shuts down properly before you try to reset the password.

Second, if the boot drive is protected with some kind of encryption such as BitLocker, you will need the decryption key to reset the password. If you don't have that, you'll be stuck reinstalling Windows.

Linux enthusiasts might be aware of [chntpw](https://pogostick.net/~pnh/ntpasswd/), a Linux program that effectively does the same thing. It has a boot disk option, saving the hassle of creating/finding a PE image, and it's available from many standard package repositories. So, why NTPWEdit instead of chntpw?

Firstly, the reset function of chntpw doesn't work on modern Windows. The only option you have is to blank the password, meaning the account is set to have no password. While this *should* be fine (as long as you set a password on the account once you're done), there are instances where Windows won't let you log in with a blank password. This isn't something I've run into a lot, but I *have* seen it once or twice.

The second issue is that chntpw doesn't support encrypted drives, even if you have the decryption key. That means that if the device you're trying to repair is protected with BitLocker, you're out of luck. NTPWEdit seems to be overall more reliable, so I think it's best to just stick with that.

## Conclusion

If you're an IT provider, hopefully these tips are helpful to you the next time you need to gain or regain access to a computer.

If you're a user, I have a different takeaway for you: encrypt the drives on your computer. It's trivial for an attacker to use any of these methods to gain access to your data (or none of these methods and still get access to your data). As Microsoft's Scott Culp says in his ["10 Immutable Laws of Security"](https://web.archive.org/web/20081202153333/http://technet.microsoft.com:80/en-us/library/cc722487.aspx#EIAA), "If a bad guy has unrestricted physical access to your computer, it's not your computer anymore". Using BitLocker or some other encryption solution isn't a magic bullet, but it is a good tool in your toolbox to defend against your computer being lost or stolen.