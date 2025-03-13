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
  <updated>{{ collections.posts | getNewestCollectionItemDate | dateToRfc3339 }}</updated>
  <id>{{ metadata.feed.id }}</id>
  <author>
    <name>Jacen Sekai</name>
  </author>
  {%- for post in collections.posts | reverse %}
  {%- capture absolutePostUrl %}{{ post.url | htmlBaseUrl: metadata.url }}{% endcapture %}
  <entry>
    <title>{{ post.data.title | formatExcerpt }}</title>
    <link href="{{ absolutePostUrl }}" />
    <updated>{{ post.date | dateToRfc3339 }}</updated>
    <id>{{ absolutePostUrl }}</id>
    <content type="html">{{ post.data.page.excerpt | stripNewlines | formatExcerpt }}</content>
  </entry>
  {%- endfor %}
</feed>