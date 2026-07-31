---
layout: blog.html
title: Regarding Hugging Face, OpenAI, and Anthropic
date: 2026-07-31
thumbnail: https://jacen-safe.s3.us-west-004.backblazeb2.com/HiTDqPVSpynG.png
---
Assuming OpenAI and Anthropic are telling the truth, there have been some interesting developments in the world of LLMs and cybersecurity over the past few weeks. The big news, of course, came from OpenAI, but Anthropic had some interesting nuggets as well. Let's look at each instance as well as why they're important.
<!-- more -->

## The OpenAI Incident

On July 16, 2026, [Hugging Face released a disclosure regarding a breach of their infrastructure](https://huggingface.co/blog/security-incident-july-2026). If you aren't familiar, Hugging Face is more or less the GitHub of machine learning, a place for developers to openly share models, datasets, and other resources. Hugging Face stated that an autonomous agent system exploited a vulnerability in the data processing pipeline to gain initial access, then moved laterally to gain access to other internal systems.

Five days later, on July 21, [OpenAI came forward to claim responsibility for the attack](https://openai.com/index/hugging-face-model-evaluation-security-incident/). They claimed that a combination of OpenAI models, including a pre-release model, broke out of a "highly isolated environment" while running through the [ExploitGym](https://arxiv.org/abs/2605.11086) cybersecurity benchmark. The agent exploited a zero-day in [JFrog's Artifactory proxy](https://jfrog.com/artifactory/), giving it unrestricted Internet access. From there, it targeted Hugging Face, where it thought it could find the solution to ExplotGym. Put simply, it tried to break into the teacher's locked drawer to steal the answer key rather than studying for the test.

Honestly, something about this entire incident feels a little funky. In particular, [JFrog's blog post trying to put a positive spin on the incident](https://jfrog.com/blog/jfrog-and-openai-collaboration-on-zero-day-security-findings/) reads very strangely. There's definitely a conspiracy theory in here somewhere about Hugging Face and OpenAI colluding as some kind of publicity stunt, although I'll leave that for someone more paranoid than me to figure out. I *will* say that a five-day wait sounds more like a company with something to hide than two companies working together.

## The Anthropic Incident

In the aftermath of the Hugging Face incident, Anthropic did a review of their own models and found [several incidents of its models breaching real companies](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals) during test exercises run by [Irregular](https://www.irregular.com), an AI security lab. The models were supposed to be contained in a simulated environment isolated from the Internet, but, due to human error, they were not. In one instance it created a PyPI account and published a malicious package that was installed by 15 machines before being taken down by PyPI. In the other two instances, it exploited vulnerabilities in public-facing infrastructure, dumping a production database in one instance and cancelling the attack after realizing the host was not part of the exercise in the other. The two organizations that Anthropic was able to contact stated that they hadn't detected the malicious activity before Anthropic reached out to them.

## What Does This Mean?

Neither of these incidents was anything a human couldn't have done; in fact, the OpenAI incident probably would have been handled more efficiently by a human. In [a report published by the Cloud Security Alliance](https://cloudsecurityalliance.org/artifacts/hugging-face-ciso-post-mortem), Hugging Face noted that the OpenAI agent took some inefficient routes and executed some pointless actions, as well as leaving behind a sloppy paper trail behind itself.

The difference is that now the barrier to entry is lower. These test models had their safety guardrails disabled, but there will always be open-source models with those safeties turned off, and there will always be ways to bypass those guardrails. Anyone with the ability to do that can now orchestrate a cyberattack, regardless of their cybersecurity expertise. It might be sloppy and inefficient, but, as Anthropic has proven, there are always companies that don't have enough protection in place to notice even the noisiest of attackers.

## What Next?

Assuming OpenAI and Anthropic are telling the truth about their models' capabilities (which is still up for debate), where do we go from here? The obvious answer is to slow or even completely halt AI development. That isn't going to fix things; Hugging Face themselves proved that. They tried to use mainstream commercial LLMs to analyze the logs from OpenAI's attack and were blocked by their safety guardrails. They instead used Z.ai's GLM 5.2 to perform the analysis. Open-source and open-weight models will continue to exist no matter what, and companies like Z.ai and DeepSeek aren't going to stop development just because the US companies do. The genie is out of the bottle at this point.

So, what *is* the optimal next step?

Fantastic question.
