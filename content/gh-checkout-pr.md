+++
title = "Checkout that PR"
date = 2022-07-27

[extra]
icon = "🪢"

[taxonomies]
languages = ["Shell"]
tags = ["Productivity", "Git", "GH", "Command Line"]
+++

The `gh` CLI is awesome. Everyone and their nan knows this. 

For me one of the best parts about it, is its potential for compose-ability with other CLI tools. 
<!-- more -->

## The Use Case

One of the actions I find myself making near enough constantly in a repository is hopping from one Pull Request to another. 

`gh` provides us with a handy command for doing exactly this:

```bash
gh pr checkout [PR number]
```

Very handy. 

BUT, it requires you to know the number of the PR you want to checkout. 

To get the currently open PR’s we have this command: 

```bash
gh pr list
```

Run this and you’ll see a list of PR’s with their numbers, titles and branch names all in a neat CLI table. 

So, we need to connect these together. We want to be able to fuzzy search across all the open PR’s, and then when we select one, checkout onto that branch (using its PR number)

List PRs → Fuzzy Search → Checkout PR 

For the fuzzy component, we will of course use any self respecting commandline ninja’s favourite buddy `fzf` 

## The Implementation

```bash
gh pr list 
| fzf 
| sed -E 's/^([0-9]+).*/\1/' 
| xargs gh pr checkout
```

<aside>
🤔 The `sed` part is just picking out the first set of numbers in each line, which in our case will be the PR number.

</aside>

I tend to alias this badboy as `checkout` 

```bash
alias checkout="gh pr list | fzf | sed -E 's/^([0-9]+).*/\1/' | xargs gh pr checkout"
```

Now you can just throw down a `checkout` and boom you’re fuzzy searching the repo’s open PR’s 👍
