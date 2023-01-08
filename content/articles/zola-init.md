+++
title = "Moving to Zola"
date = 2023-01-08

[extra]
icon = "🛫"

[taxonomies]
languages = ["Rust"]
tags = ["Static Site Generation", "Zola"]
+++

First article of the new year, and I tell myself that this time, this time I'll actually stick to writing!

As every developer knows, you can't just go and start writing articles, you need to build the platform which they will be hosted on first!

<!-- more -->

## My previous blog setup

So in the previous iteration, I was writing posts as [Notion](https://notion.so) pages, and then hitting their API at build time from [Netlify](https://netlify.app) to construct a [SvelteKit](https://kit.svelte.dev) static site.

Somewhat custom, and really annoying to be wrangling the many many nested blocks Notion uses in its proprietary markup.

Bah. I want the whole thing to be:

- Simpler
- Faster
- More controlled

I don't want to rely on Notion, pure markdown is plenty powerful enough for me to pen my ideas down.

## Hola, Zola

Enter [Zola](https://getzola.org).

Straight out of the gate, I should mention its written in [Rust](/languages/rust). Very important _feature_!

Also its [🔥 Blazingly Fast 🔥](https://twitter.com/ThePrimeagen/status/1577074062781997056?s=20&t=LJHIGXJpNf5fWuUU6l_62g) of course.

Images, assets, [Sass](https://sass-lang.com/) and syntax highlighting are all handled out of the box. You just follow some conventions on where to place content and you're away.

Also you can get started _blazingly_ quickly by using a built in [theme](https://www.getzola.org/themes/). I picked the [After dark](https://github.com/getzola/after-dark) theme as my starting point. Installed theme files go in the `themes/[THEME]` directory, and the chosen `THEME` placed in the `config.toml` - which is a file Zola looks at for its core configuration.

I prefer to keep magic to a minimum so my first move was to blow away the `themes/` directory and manually copy across the pieces of the theme I actually wanted - just a taste of the styles and the main templates.

{% note() %}

Each theme directory follows the same structure as the top level folder conventions (`content`, `sass`, `templates`, etc)

{% end %}

Of course this broke everything, and it took a good bit of debugging to get everything running again, _but_ I dang sure learned how all of the pieces fit together.

## Tera Templates

At its core, Zola is a wrapper around the [Tera](https://github.com/Keats/tera) library.

👆 A template engine for Rust based on Jinja2/Django

Its pretty nice, pretty _ergonomic_, and funnily enough yes I am a fan of the [\{\{ Mustache flavoured variables \}\}](https://mustache.github.io/mustache.5.html)

All the templates live in... wait for it... the `templates/` directory.

There's a convention around which templates are used for which resource type, but basically `index.html` is the main page, `page.html` is then the template used for every content page, and finally `section.html` is for the listing pages - content directories with a `_index.md` file. Most of these can be overwritten on a file by file basis, but strong conventions can be pretty helpful.

A very powerful feature of Tera, is the ability to extend templates. Any template can define `block`s which can then be overwritten in later templates.

So say the `index.html` (that's the top level template remember) looks like this:

```tera
{% block content %}
    {% block header %}
        <header>Head of the page</header>
    {% endblock header %}
    <p>Some shared content</p>
{% endblock content %}
```

Each content page's `page.html` template can extend and override pieces of this template

```tera
{% extends "index.html" %}

{% block content %}
    {% block header %}
        {{ print(text="super()") }}    {% endblock header %}
    <p>Page specific content</p>
{% endblock content %}
```

In this example, the `header` block will delegate to the main `index.html`, but the rest of the `content` block is overwritten. As you can imagine, this feature alone opens up some interesting opportunities for composition.

## Content

Zola takes a slight change to my usual style of Markdown writing, for the frontmatter (that's the metadata at the start of a markdown file) I'm used to using sections surrounded by a triple `-` line, and in YAML syntax. For Zola's preferred flavour, the delimiter is a `+` and TOML style syntax.

I actually don't mind this. The plus's look very clear, and also pretty funky with ligatures turned on 🕺 so I was happy to make the switch.

## Drawbacks

One drawback/area for improvement is the editor integration for Tera templates. I'm sorely in need of good syntax highlighting (yes I will be looking into writing my own [Treesitter grammar](https://github.com/tree-sitter/tree-sitter)... watch this space!), and ideally some basic [LSP](https://microsoft.github.io/language-server-protocol/) functionality - I crave _Go to definition_ in all contexts.

Also, [Javascript](/languages/javascript) feels like a second class citizen here. Its not even mentioned in Zola's docs. Basically its a _handle it urself_ kind of a deal. Which is fine, its actually quite refreshing to not need to touch the mess that is the npm ecosystem/js toolchain. Keep it simple stupid!

When client side interactivity does come into play, I think a simple plain `.js` file in the `static/` directory will be enough. Everything in static is copied over to the output folder.

So if fancy packages or compile to JS languages feel like being played with, just outputting the built js file to static will give the frontend access. Perhaps this the subject for another day, for now I'm happy with the new, simplified set up!

## References

[This repo](https://github.com/mTvare6/hello-world.rs) is clearly the most _🔥 Blazingly Fast 🔥_ hello world out there
