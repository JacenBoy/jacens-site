---
permalink: "{{ metadata.feed.path }}"
excludeFromCollections: true
---

<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>{{ metadata.title }}</title>
  <subtitle>{{ metadata.feed.subtitle }}</subtitle>
  <link href="{{ metadata.feed.url }}" rel="self"/>
  <link href="{{ metadata.url }}"/>
  <updated>{{ collections.posts | getNewestCollectionItemDate | toFeedTime }}</updated>
  <id>{{ metadata.feed.id }}</id>
  <author>
    <name>Jacen Sekai</name>
  </author>
  {%- assign posts = collections.posts | reverse -%}
  {%- for post in posts %}
  {%- capture absolutePostUrl %}{{ post.url | htmlBaseUrl: metadata.url }}{% endcapture %}
  <entry>
    <title>{{ post.data.title | formatExcerpt }}</title>
    <link href="{{ absolutePostUrl }}" />
    <published>{{ post.date | toFeedTime }}</published>
    <updated>{{ post.date | toFeedTime }}</updated>
    <id>{{ absolutePostUrl }}</id>
    <category term="{{ post.data.tags | postType }}" />
    <content type="html">{{ post.data.page.excerpt | stripNewlines | formatExcerpt }}</content>
    <summary type="html">{{ post.data.page.excerpt | stripNewlines | formatExcerpt }}</summary>
  </entry>
  {%- endfor %}
</feed>