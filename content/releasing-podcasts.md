+++
title = "Releasing Podcasts"
date = 2019-12-10

[extra]
icon = "🎙️"

[taxonomies]
languages = ["XML"]
tags = ["Podcasting"]
+++

Despite its popularity, the technology which drives the world of podcasting is surprisingly archaic. Although it is true that there are paid services which abstract the nitty gritty of what is actually happening away from *you*, the podcast releaser. I'm sure there are many DIY-minded content producers who would prefer, like me, to go it alone and see the release of their product from start to finish (or just want to do it on the cheap and not pay a third-party service when you don't need to). 
<!-- more -->

### Senario:

- You have just finished recording and editing your first podcast. Check.
- You're happy with your creation and are now ready to upload it to *the internet.* Double check.

This is where it all starts getting less intuitive.

Its difficult to get an explanation of what you actually have to do next. So let me break it down for you:

### The Dreaded XML

Once upon a time, there was a horrible file format call XML. eXtensible Markup Language. Don't. Just don't. 

You'll still find it around in various places. HTML is actually a subset of XML so its not all bad.   Anyway you better get vaguely comfortable with it. XML describes itself as human readable and self-descriptive, which it is. We just need to remember to include a few essential bits of information.

Each podcast you want to release will require its own RSS feed, which is written in XML. Each RSS feed can contain as many episodes as you'd like, and the big thing is you can add new ones to the feed later. 

We'll start feed with some details on the podcast itself, and its producer. 

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:itunesu="http://www.itunesu.com/feed" version="2.0">
<channel>
	<link>[ROOT_PODCAST_URL]</link>
	<language>en</language>
	<copyright>©2018</copyright>
	<webMaster>[PRODUCER_EMAIL]</webMaster>
	<managingEditor>[PRODUCER_EMAIL]</managingEditor>
	<image>
		<url>[PODCAST_ARTWORK_URL]</url>
		<title>[PODCAST_TITLE]</title>
		<link>[ROOT_PODCAST_URL]</link>
	</image>
	<itunes:owner>
		<itunes:name>[PODCAST_CHANNEL_NAME]</itunes:name>
		<itunes:email>[PRODUCER_EMAIL]</itunes:email>
	</itunes:owner>
	<itunes:category text="[CATEGORY]"></itunes:category>
	<itunes:keywords>[ANY KEYWORDS]</itunes:keywords>
	<itunes:explicit>[ yes | no ]</itunes:explicit>
	<itunes:image href="[PODCAST_ARTWORK_URL]" />
	<atom:link href="[PODCAST_RSS_URL]" rel="self" type="application/rss+xml" />
	<pubDate>[PODCAST_START_DATE]</pubDate>
	<title>[PODCAST_NAME]</title>
	<itunes:author>[PODCAST_CHANNEL_NAME]</itunes:author>
	<description>[PODCAST_DESCRIPTION]</description>
	<itunes:summary>[PODCAST_DESCRIPTION]</itunes:summary>
	<itunes:subtitle>[SUBTITLE]</itunes:subtitle>
	<lastBuildDate>[LAST_EPISODE_RELEASE_DATE]</lastBuildDate>	
	... 
	[EPISODES WILL GO HERE] 
	...
</channel>
</rss>
```

Pretty self explanatory. Straight away you'll see that you're doubling up on a lot of information. In classic Apple style, iTunes have their own way of reading the exact same document to everyone else. No worries, that's why God created copy & paste.

Lets cramp in that first episode for the feed.

```xml
<item>
	<title>[EPISODE_TITLE]</title>
	<description>[EPISODE_DESCRIPTION]</description>
	<itunes:summary>[EPISODE_DESCRIPTION ...AGAIN]</itunes:summary>
	<itunes:subtitle>[EPISODE_TITLE ...AGAIN!!!]</itunes:subtitle>
	<itunesu:category itunesu:code="[ITUNES_CATEGORY_CODE]"/>
	<enclosure url="[EPISODE_AUDIO_URL]" length="1" type="audio/mpeg"></enclosure>		
	<guid>[EPISODE_AUDIO_URL]</guid>
	<itunes:duration>[EPISODE_LENGTH]</itunes:duration>
	<pubDate>[EPISODE_RELEASE_DATE]</pubDate>
</item>
```

You will unfortunately need to look up which iTunes category code is right for your episode. And the audio hosting we will get to in the next section.

When you're ready to release a new podcast, you will need to add another one of these episode blocks to the RSS feed, and update the `<lastBuildDate>`

### Hosting your audio

There's as many different ways to host content on the interweb as there are cats who don't like being shook at things. Originally I opted to have my audio files next to my application files in my Hostgator web hosting site. This worked fine, but why pay £5 a month when you can do the whole thing for free? 

The best solution I have come across is to host the audio in a cloud storage bucket, any of the big cloud providers would do. I went for AWS. I'm not going to go into configuring an S3 bucket in this post, as its a bit of a topic on its own, but suffice as to say its basically a url you can go to to serve static files. Bang your audio in there.

Get the public url AWS gives you for the episode and use that in your RSS feed to point the podcast app to your audio file. 

### Hosting your RSS feed

You can actually host your RSS feed right next to your audio in that cloud storage bucket we provisioned, after all it is just another static file, just one which points to other files. 

In my case, I chose to keep my RSS feed with my website files, as I was creating a frontend for the podcast but it can really be anywhere. 

### Telling the podcast apps

Once we have our RSS feed hosted somewhere in the internet, and likewise with our audio files, we are ready to submit our feed to the various podcast platforms. 

Each platform has their own way of registering, Apple of course have a convoluted way of doing it, others are easier. I'll include some links below on where you'll need to go to get started.

