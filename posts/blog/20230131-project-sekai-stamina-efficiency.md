---
layout: blog.html
title: "Project Sekai Stamina Efficiency"
date: 2023-01-31
thumbnail: "https://jacen-safe.s3.us-west-004.backblazeb2.com/h5PY5hSDFRvp.png"
---

[Project Sekai, or Hatsune Miku: Colorful Stage as it's called in English](https://www.colorfulstage.com), is one of the plethora of rhythm games chasing after the success of franchises such as [Love Live!](https://lovelive-sif-global.bushimo.jp) and [BanG Dream!](https://bang-dream-gbp-en.bushiroad.com), and is also one of the few to gain that same success. Like those other games, it features an event system, where players earn points for playing the game and compete on a leaderboard for the top spot. Unsurprisingly, it's attracted a number of diehard players who compete for those top spots and the bragging rights that come with it. Like most diehard gamers, playing the game as efficiently as possible is important to those players and their quest to the the very best. So, in the interest of hyperfixation, let's take a look at one of the resources those players use as they climb the ladder and aim for the top.
<!-- more -->

## Stamina By Any Other Name
Like most gachas, Project Sekai features a stamina resource that players consume to play the game. Unlike most gachas, however, consuming stamina in Project Sekai is completely optional, and a player could theoretically play the game forever without ever actually using it. The game calls this stamina "Live Bonus" or "Bonus Energy". 

As the name implies, Bonus Energy provides a bonus when consumed, increasing the experience points, reward items, and event points you earn from playing songs. The player has a soft cap of 10 Bonus Energy, although it can be obtained beyond that cap in various ways. When the player is below the soft cap, Bonus Energy is regenerated at the rate of 1 every 30 minutes.

The player can choose how much of their Bonus Energy they want to stake on a song. By default, they can use up to 5. During events, however, the cap increases to 10. The more Bonus Energy used, the bigger the bonus received, although there are diminishing returns the more energy the player uses.

| Bonus Energy | Exp. Multiplier | Event Point Multiplier |
| --- | --- | --- |
| 0 | x1 | x1 |
| 1 | x5 | x5 |
| 2 | x10 | x10 |
| 3 | x14 | x15 |
| 4 | x17 | x19 |
| 5 | x20 | x23 |
| 6 | x21 | x26 |
| 7 | x22 | x29 |
| 8 | x23 | x31 |
| 9 | x24 | x33 |
| 10 | x25 | x35 |

## Putting Things Into Practice
For the purposes of making our numbers actually useful, we'll create an admittedly unrealistic scenario to give us some actual numbers to work with.

One of the more popular songs in the game is Hitorinbo Envy. At about 75 seconds long, it's currently the shortest song in the English version of the game. Conveniently, that length is extremely easy to work with for the math portion of things.

The experience point formula in Project Sekai is extremely basic. At the end of a song, players earn a letter rank based on their score, with D being the lowest and S being the highest. Each letter corresponds to an amount of experience points to be gained, and that number is multiplied by the Bonus Energy multiplier. At D rank, the base experience is 20, so we'll use that number for the experience calculations.

Event points are a bit more tricky. Each song gives a base amount of event points, which is plugged into a formula that takes the player's score and the Bonus Energy multiplier into account. To keep things simple, we'll just work with the base value. For Hitorinbo Envy, this is 100.

| Bonus Energy | Exp. Gained | Event Points Gained |
| --- | --- | --- |
| 0 | 20 | 100 |
| 1 | 100 | 500 |
| 2 | 200 | 1,000 |
| 3 | 280 | 1,500 |
| 4 | 340 | 1,900 |
| 5 | 400 | 2,300 |
| 6 | 420 | 2,600 |
| 7 | 440 | 2,900 |
| 8 | 460 | 3,100 |
| 9 | 480 | 3,300 |
| 10 | 500 | 3,500 |

Bigger is better, right? Not really. Remember that we only have 10 Bonus Energy to work with before we have to wait for it to regenerate. So, it's a matter of finding the sweet spot of optimal efficiency. It's actually pretty easy to figure it out just by looking at the multipliers, but let's back it up with math just for kicks.

## Taking Minutes
First, to have a baseline metric to work off of, we'll figure out the amount of experience and event points we can earn per minute. If Hitorinbo Envy is 75 seconds, we can divide the experience and event point gains by 75 to calculate how many we earn per second, and multiply that by 60 to convert it into minutes.

| Bonus Energy | Exp. Per Min. | Event Points Per Min. |
| --- | --- | --- |
| 0 | 16 | 80 |
| 1 | 80 | 400 |
| 2 | 160 | 800 |
| 3 | 224 | 1,200 |
| 4 | 272 | 1,520 |
| 5 | 320 | 1,840 |
| 6 | 336 | 2,080 |
| 7 | 352 | 2,320 |
| 8 | 368 | 2,480 |
| 9 | 384 | 2,640 |
| 10 | 400 | 2,800 |

These are pretty numbers, but they don't really mean much of anything. Let's try taking them and turning them into a metric that actually gives us some useful data.

## Daily Quests
We regenerate Bonus Energy at a rate of once every 30 minutes, or twice an hour. Assuming the timer is always counting down, that means we can regenerate up to 48 times per day. If we start the day with a full tank of 10 Bonus Energy, meaning we have a pool of 58 Bonus Energy to work with for the day.

Let's assume we're spamming Hitorinbo Envy with ungodly levels of luck. Every time we play a song, regardless of how much energy we consume, costs us 1.25 minutes. Since we know how many times we're playing the song, the length of the song, and how many points we earn each minute of playing, let's get some actually meaningful numbers.

| Bonus Energy | Exp. Per Day | Event Points Per Day |
| --- | --- | --- |
| 1 | 5,800 | 29,000 |
| 2 | 5,800 | 29,000 |
| 3 | 5,413 | 29,000 |
| 4 | 4,930 | 27,550 |
| 5 | 4,640 | 26,680 |
| 6 | 4,060 | 25,133 |
| 7 | 3,646 | 24,029 |
| 8 | 3,335 | 22,475 |
| 9 | 3,093 | 21,267 |
| 10 | 2,900 | 20,300 |

So, using 2 Bonus Energy is the most overall efficient use, although 3 Bonus Energy is also a good option if the only thing you care about is event points.

I didn't mention using 0 Bonus Energy for two reasons. First, the formula involving the Bonus Energy pool is completely irrelevant since we aren't using Bonus Energy. The only metric that matters in that case is how fast we can spam the song. Second, it doesn't really make sense to do anyway. Regardless of how fast you can spam, the only reason you should be using 0 Bonus Energy is because you've already used up all of your Bonus Energy.

That said, ignoring pesky details like load times and personal hygiene, we could theoretically play Hitorinbo Envy 1,152 times over the course of 24 hours. That means we could earn 23,040 experience points and 115,200 event points.

## The Formula
- `E` = Bonus Energy
- `M` = Bonus multiplier
- `Ex` = Base exp.
- `Ev` = Base event points
- `L` = Song length, in seconds

```
Exp Per Day = (58 / E) * (L / 60) * (((Ex * M) / L) * 60)

Event Points Per Day = (58 / E) * (L / 60) * (((Ev * M) / L) * 60)
```

The event point formula can be (and probably is) used to figure out the most time efficient song in the game, but that's a discussion for another time.