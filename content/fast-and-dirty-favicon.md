+++
title = "Fast and dirty favicon"
icon = "🧙"
date = 2021-12-28

[taxonomies]
languages = ["Shell"]
tags = ["FFMPEG"]
+++

We’ve all been there. We need a favicon for our new shiny website, but its in the wrong bloody format. 

Legends across the internet have spoken of a tool. A single tool so mighty, it can handle any image, video or audio manipulation any young squire could possibly dream up.

That tool... is `ffmpeg`.
<!-- more -->

If you don’t know, its well worth getting to know. This guy is the OG. 

<aside>
👆 With great power comes great potential for confusion.

</aside>

So luckily for us the task at hand is about as simple as it gets with `ffmpeg` 

I have a `jpeg` file. Its a beautiful image of me. 

![me.jpeg](/me.jpeg)

Lovely.

Now favicons *can* be pretty much any file format, here’s a [chart for reference](https://en.wikipedia.org/wiki/Favicon#File_format_support), but not all image formats are created equally.

For the purposes of this article, I have arbritrarily decided that the format for my favicon should be png.

Now `ffmpeg` is clever. You can give it an input file, and specify an output file name and it will automagically turn your image from one format to the other. 

```bash
ffmpeg -i ./me.jpeg ./favicon.png
```

Here we say “oi, `ffmpeg` do us a favour and take this input file (`-i` for input file/stream followed by the path to the file) and output me a `./favicon.png`”

And in a flash `ffmpeg` does the deed. 

Nice one `ffmpeg` 

### References

- [https://en.wikipedia.org/wiki/Favicon](https://en.wikipedia.org/wiki/Favicon)
