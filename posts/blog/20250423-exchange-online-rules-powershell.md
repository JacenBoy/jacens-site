---
layout: blog.html
title: IT Pro Tip - Viewing Outlook Rules Using Powershell
date: 2025-04-23
---

With people continuing to insist on using poor and easily guessable passwords, hacked emails are something I deal with occasionally.

Of all cybersecurity incidents, hacked emails are some of the easiest to remediate. Once you've kicked the attacker out by forcing a global sign-out and resetting their password, then informed any affected recipients about the hack, you're done, right?

Wrong. There's a step I've seen even experienced IT techs forget about. Inevitably, you'll receive another call from the user informing you that they aren't receiving emails anymore. Let's take a look at how to troubleshoot that.
<!-- more -->

## The reason

When an attacker compromises a mailbox, their goal is to stay undetected as long as possible. Sending out spam creates bounceback messages from inaccessible recipients as well as replies from savvy users asking about the spam. To stay undetected, these responses need to be moved someplace where they won't be seen by the victim.

The most common way this is handled is by creating an Outlook rule to redirect all email to a folder that the victim is unlikely to find. One common target is the "RSS Feeds" folder. That means part of the remediation will need to be finding and removing this rule. This also means that you generally have a pretty good indicator of compromise, as the existence of this rule is a sign that the mailbox has likely been hacked.

In my experience, this rule isn't always visible in Outlook. So, then, how do you find and remove this rule reliably?

## I've got the PowerShell

Microsoft provides PowerShell access to Exchange Online instances to allow for advanced management of the tenant. Microsoft's PowerShell documentation is normally pretty good, and [this is no exception](https://learn.microsoft.com/en-us/powershell/exchange/exchange-online-powershell-v2?view=exchange-ps), but for people who are afraid of reading, here's a breakdown of how to connect to it.

First thing first, you'll need to install the module that has the commands (or cmdlets as PowerShell calls them) that you'll need. Open a PowerShell window as administrator, go to [the download page](https://www.powershellgallery.com/packages/ExchangeOnlineManagement/), and grab the installation command that's on the page to get the latest version.

```powershell
Install-Module -Name ExchangeOnlineManagement -RequiredVersion <version>
```

Close and reopen your PowerShell window to load your newly installed module. If you're feeling paranoid, you can explicitly load the module into your PowerShell session.

```powershell
Import-Module ExchangeOnlineManagement
```

Now, you need to connect to your Exchange instance. [Microsoft once again provides full documentation](https://learn.microsoft.com/en-us/powershell/exchange/connect-to-exchange-online-powershell?view=exchange-ps), but to get started, you can just use this.

```powershell
Connect-ExchangeOnline -UserPrincipalName <global admin username>
```

If you're a Microsoft partner and manage multiple Microsoft 365 tenants, in theory you should be able to use the `-DelegatedOrganization` option to allow you to access them from your own account. I, however, had issues getting that to work. While you could just use global admin credentials directly, I don't like having multiple Microsoft accounts logged into my computer, even temporarily, as Microsoft struggles with remembering which one should be the primary one.

Fortunately, I found something of a workaround. It will require you to install and use [PowerShell 7](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows) if you haven't already. Once you've done that, run this command.

```powershell
Connect-ExchangeOnline -Device
```

You should get a code and a prompt to go to https://microsoft.com/devicelogin on another device. You can, instead, open that link in a private/incognito window. Enter the code and sign in with your global admin credentials. You should now be connected to Exchange Online PowerShell.

## One cmdlet to rule them all

Now that you're connected to Exchange Online, you can start hunting for that rogue rule. You can do this with the `Get-InboxRule` cmdlet.

```powershell
Get-InboxRule -Mailbox <target address>
```

This will give you a nice table with all of the Outlook rules that the user has configured. A lot of these rules are named with dots ("." or ".." or the like), so they're normally very obvious.

![The output of the "Get-InboxRule" cmdlet](https://i.snap.as/bCF6h1Kp.png)

Once you've found the rule, you can get some more information about it by piping it to `Format-List` (or `fl` for short).

```powershell
Get-InboxRule -Mailbox <target address> -Identity "<rule identity>" | fl
```

You'll get a lot of output, but the description is the main thing you're looking for.

![The description of an Outlook rule built to delete all incoming messages](https://i.snap.as/fJd8rRMI.png)

This rule seems to be pretty suspect, so we'll go ahead and just disable it.

```powershell
Disable-InboxRule -Mailbox <target address> -Identity "<rule identity>"
```

Once you're sure the rule can be deleted, you can do that from PowerShell as well.

```powershell
Remove-InboxRule -Mailbox <target address> -Identity "<rule identity>"
```

With that done, email should be flowing to the user again.

## Conclusion

In the aftermath of a hacked mailbox, checking for malicious rules is an important step, both for understanding the extent of the compromise and for remediating it. I see this step forgotten a lot, so make sure you remember to do it. Hopefully, these commands help make the process a little easier for you.