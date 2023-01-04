+++
title = "Running my package json test command - the hard way"
date = 2022-01-05

[extra]
icon = "📦"

[taxonomies]
languages = ["Shell"]
tags = ["Terminal Tweaks"]
+++

Sometimes it can be super handy to have a quick and dirty way of accessing your package json scripts. Maybe you just want to know what the right name to call is. For that jq is our friend.
<!-- more -->

```bash
cat package.json | jq '.scripts'
```

`cat` creates a stream of our package json file and pipes the stream to `jq` which gives us full access to query or manipulate the json.

<aside>
🎨 The output also looks pretty neat to human eyes too!

</aside>

Ok cool, so this will output something akin to the following

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint '*/**/*.{js,ts,tsx}'",
  "test": "jest --env=jsdom --testPathIgnorePatterns /.storybook/*/"
}
```

So we can clearly see our `test` command there. So a layman could just use their mouse (yuck, *what an antipattern*!) to highlight and then copy the command itself ready for use. 

I say no. We must go further! 

So first we can select the actual command we want. 

```bash
cat package.json | jq '.scripts.test'
# returns
"jest --env=jsdom --testPathIgnorePatterns /.storybook/*/"
```

Ok nice, so next issue is those `"` marks. We can easily strip them with a good ol’ fashioned `tr`

```bash
cat package.json | jq '.scripts.test' | tr -d '"'
# returns 
jest --env=jsdom --testPathIgnorePatterns /.storybook/*/
```

Very nice, that’s the actual command right there. Crazy I know! 

So how’s about we push that into our system’s clipboard? 

```bash
cat package.json | jq '.scripts.test' | tr -d '"' | xclip -sel clipboard
```

Now you can paste that bad boy in any other program and you’re away 🚀 

## Beautiful Compositionality

This is possibly my favourite part of the Linux philosophy. Each of these tools does one thing well, and its up to us the humble power user to *compose* these commands together into a symphony of awesomeness. 

## Interactivity with FZF

Things can start to get really interesting when we incorporate a find and select into this flow. 

```bash
cat package.json | jq '.scripts' | head -n -1 | tail -n +2 | fzf
```

So this will feed each script line into `fzf` - everyone’s favourite fuzzy finder. 

Nice. But let’s take this a step further. 

How about if we could fuzzy search over the available package.json scripts, with a preview of the command itself, and then finally run the highlighted script on select. 

This is getting a bit crazy so we’ll split it over multiple lines, and I will break down each stage after.

```bash
cat package.json \
| jq '.scripts | keys' \
| head -n -1 \
| tail -n +2 \
| tr -d '"' \
| tr -d ',' \
| tr -d ' ' \
| fzf --preview="cat package.json | jq '.scripts[\"{}\"]' | tr -d '\"'" \
| xargs yarn
```

Its a bit of a beast, but it works! 

So first off we’re using `'.scripts | keys'` in the first `jq`. This gets us the keys of the scripts object. 

We then have some fun with `head` and `tail` to cut away the first and last lines of the array which is returned.

Next up, `tr` 3 of them in a row just to remove any characters we aren’t interested in displaying.

Piping that to `fzf` gives us fuzzy search over the items in that list, and the `--preview` option lets us pick what should be displayed in the right hand preview panel. The option takes a shell string with the currently highlighted record from the list injected wherever `{}` is seen. 

So we search the package.json scripts again with `jq` this time picking the exact script currently selected in the fuzzy search. Cut that to size with `tr` again to get rid of those `"` (this time escaped as we’re already inside `"`  

When the user hits enter on one of those record, `fzf` will pipe the selection to `stdout` so we catch this with `xargs` - which will append the piped input to the end of the command, and finally say we want to run `yarn` followed by the script. 

So if we run this and select “test” say. Then the final result will be `yarn test` 

Boom. 

All that’s left now is to release this as an npm package... ← Sarcasm.
