+++
title = "Git Squash in style"
date = 2020-02-13

[extra]
icon = "🐿️"

[taxonomies]
languages = ["Shell"]
tags = ["Git"]
+++

<aside>
🔥 Instructions on how to implement single commit branches
</aside>
<!-- more -->

Get commit SHA of the point where the feature started, this will usually be where you branched off of development.

The below displays a list of commits from newest to oldest with their SHA's

```bash
git log --oneline --max-count=20 \
	| nl -v0 \
	| sed 's/^ \+/&HEAD~/'
```

On feature branch

```bash
git rebase --interactive [COMMIT_SHA]
```

This will open up vim with a list similar to:

```bash
pick asjhdjabndakjhsd "my commit message"
pick 90a89sdjkasdhasd "my really awesome commit"
pick a0089df87sasd9as "my nan writes better code than this commit"
pick 90asdadas8d7ajsd "initial commit"
```

Run the vim command `:%s/pick/s` This will change all those picks to *squashes*. Then go to the first commit by running `gg` followed by `r` (replace mode) and then `p` so that only this commit is picked. `wq` to save and exit.

Next you'll be prompted to decide on a commit message, so a new vim environment will appear. `dG` will delete everything in the file `i` for insert mode, and then write your desired commit message. `wq` to save and exit.

Phew, with all that done we can overwrite the changes in the remote repo

```bash
git push -f origin HEAD
```

Finally (and I mean finally) we can merge our branch into development once again (remember to pull first!)

```bash
git checkout development
git pull
git merge [FEATURE_BRANCH]
git push
```
