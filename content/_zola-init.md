+++
title = "Moving to Zola"
icon = "🛫"
date = 2023-01-01
draft = true

[taxonomies]
languages = ["Rust"]
tags = ["Static Site Generation", "Zola"]
+++

First article of the new year, and I tell myself that this time, this time I'll actually stick to writing!

As every developer knows, you can't just go and start writing articles, you need to build the platform which they will be hosted on first! 

## My previous blog setup 

So in the previous iteration, I was writing posts as [Notion](https://notion.so) pages, and then hitting their API at build time from [Netlify](https://netlify.app) to construct a [SvelteKit](https://kit.svelte.dev) static site. 

Somewhat custom, and really annoying to be wrangling the many many nested blocks Notion uses in its proprietary markup. 

Bah. I want the whole thing to be 
- simpler
- faster
- more controlled

I don't want to rely on Notion, pure markdown is plenty powerful enough for me to pen my ideas down. 

## Hola, Zola

Enter [Zola](https://getzola.org). 

Straight out of the gate, I should mention its written in [Rust](/languages/rust)
