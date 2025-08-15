---
layout: blog.html
title: TryHackMe - Git Happens
date: 2025-08-05
thumbnail: "https://jacen-safe.s3.us-west-004.backblazeb2.com/iE0ESFLASefF.png"
---
[Git Happens](https://tryhackme.com/room/githappens) is an easy-ranked box on TryHackMe. It's extremely short and simple, but it serves as a good reminder of the dangers of using Git if you don't really know what you're doing.
<!-- more -->

## Nmap Enumeration

As ever, the first thing to do is run an Nmap scan to see what services are accessible to us on the box. People always have their own methodology for what command line options to use, but here are the ones I went with.

- `-sC`: Run default scripts. Nmap can do additional enumeration beyond just checking for open ports, and this option will run some quick and useful extra scans to give us even more information about what we’re working with.
- `-sV`: Run version detection. Knowing what specific version of a service is in use can help with finding potential vulnerabilities or ruling them out.
- `-v`: Be verbose. This outputs extra information to the console as the scan runs, the most useful of which are status updates and showing open ports as it finds them.
- `-oA`: Outputs the result of the command into several file formats. Having a persistent record of the scan to go back to later is always useful.

```bash
nmap -sC -sV -oA nmap/initial -v 10.201.33.184
```

It's good to do a quick basic Nmap scan of the top 1000 ports first to have a starting point and then run a second more comprehensive scan in the background later while you're working on other things. In this case, the first scan gives us pretty much all the information we'll need to proceed.

Nmap finds just one open port: port 80 running an HTTP server using Nginx. Thanks to the default scripts, we also know that there's a `.git` directory on the server.

```
80/tcp open  http    nginx 1.14.0 (Ubuntu)
|_http-title: Super Awesome Site!
| http-methods:
|_  Supported Methods: GET HEAD
|_http-server-header: nginx/1.14.0 (Ubuntu)
| http-git:
|   10.201.33.184:80/.git/
|     Git repository found!
|_    Repository description: Unnamed repository; edit this file 'description' to name the...
```

## HTTP Enumeration

Accessing the website gives us a very basic-looking login page.

![Login page](https://jacen-safe.s3.us-west-004.backblazeb2.com/CF5gDOy5m5Mv.png)

Investigating the source code doesn't reveal anything interesting, save for a blob of obfuscated JavaScript at the bottom.

![JavaScript snippet](https://jacen-safe.s3.us-west-004.backblazeb2.com/8W8CiMHp9PxT.png)

We could investigate this further and deobfuscate it, but the better plan is to poke at the Git repository we uncovered. Fortunately, directory indexes are enabled on the server, which will make our job even easier.

![Directory index of .git](https://jacen-safe.s3.us-west-004.backblazeb2.com/I7avTlhdZ73a.png)

We'll use a tool called [git-dumper](https://github.com/arthaud/git-dumper) to pull all the information we can out of the `.git` directory and convert it into a working Git repo. Kali complains if we try to follow the instructions and install using `pip`, so we'll use `pipx` instead.

```bash
pipx install git-dumper
```

Once that's finished, we can scrape the `.git` directory.

```bash
git-dumper http://10.201.33.184/.git/ source
```

We now have a fully functional Git repo that we can explore. One common pitfall is committing passwords or API keys to Git repositories, so let's explore the commit history to see if there's anything useful.

```bash
git log
```

![Output of "git log"](https://jacen-safe.s3.us-west-004.backblazeb2.com/UfWhIpljpHsZ.png)

From the commit messages, we can see that the obfuscation was added in later. Furthermore, the reference to SHA-512 implies that the password was at one point written in plain text on the page and hashed after the fact. Assuming it wasn't changed, we should have our in.

We'll revert the repo back to the pre-obfuscation commit so we can explore further.

```bash
git checkout 395e087334d613d5e423cdf8f7be27196a360459 --force
```

Sure enough, that blob of JavaScript is now a fully readable `login()` function, featuring a plain-text password.

![The JavaScript "login()" function](https://jacen-safe.s3.us-west-004.backblazeb2.com/aqjPQb7BTGBo.png)

We can enter that into Task 1 on TryHackMe and call the box complete.