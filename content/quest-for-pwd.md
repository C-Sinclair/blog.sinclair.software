+++
title = "The Quest For PWD In A Fresh Shell"
icon = "🏈"
date = 2020-09-25

[taxonomies]
languages = ["Zsh"]
tags = ["Terminal Tweaks"]
+++

<aside>
🔥 I open a new shell. I'm greeted by the home directory. Dang! I wanted to be back in pwd.

</aside>

With the power of zsh on our side we will conquer this worthy challenge!

<!-- more -->

### Step One

Save the current directory in a file somewhere. The catch is this needs to happen every time the shell moves to a new directory.

My first thought was to make a wrapper around `cd` which would report the new location and then move your shell forward. Alas this is not possible, because although you can pick up the command and log where you intend to go, the final line will throw you off. `cd $LOCATION` This will change the directory of the subprocess which the shell script is running in. *Not your process.* So this basically leaves you unable to move around your filesystem ...So not great!

Fortunately there is a different tactic we can take! In `zsh` there is a command which will run before every shell command. This magic function is called `preexec` - imaginative name right? 

So in your `.zshrc` bang a cheeky one of these: 

```bash
preexec() {
	# This is where will plan to log our current directory
} 
```

Awesome so this will run on every shell command, thats most of the way there, surely. 

Warning failed attempt below:

```bash
echo pwd >> ~/.shell_local
```

This code will work perfectly ...once. And only once. Anything you place in your zsh config files will be run at shell startup, not dynamically when we want it to. 

What will work? 

Placing the command in `'` apparently.

Warning working example below:

```bash
alias save_pwd='echo $PWD >> ~/.shell_local' 
preexec() {
	save_pwd
}
```

Notice I had to use the `$PWD` variable rather than the `pwd` function. Once again `$PWD` is updated dynamically, so it will contain the current value we want.

Ok so start a new shell and move arround a bit with `cd`. Now check the contents of `~/.shell_local` We have those full paths listed! 

### Step Two

Now that we are saving our current working directory, we need a way of listing them out and selecting one to change to. Enter `fzf` onto the scene. If you don't know get to know. 

So `fzf` takes a stream of text and allows you to fuzzy search over the result, and to top it off, it returns the user's selection after. Perfect!

So how to get that stream? 

Lets go for a good ol' `tail` which is nice because it returns a stream from the bottom of the file up. We can also decide how many lines we want `tail` to return by adding the flag `-NUMBER` Where NUMBER is the number of lines we want. I'm going for 1000 because why not. 

Those possessing hawk eyes and keen spirits will notice that there is the potential for a lot of duplicates to be hanging around this list when you run `tail -1000 ~/.shell_local` Kein problem. `uniq` does exactly what it says on the tin - `uniq`ue values. It can be prone to allowing duplicates through however so a `sort` beforehand will help. 

That should produce our searchable list. Lets pass it to `fzf` 

```bash
tail -1000 ~/.shell_local | sort | uniq | fzf 
```

You should be fuzzy searching that list at this point. And when you hit enter. Boom, list entry returned. 

So lets wrap that in a `cd` command and alias it in the `zshrc` and we should be golden.

```bash
alias cz='cd $(tail -1000 ~/.shell_local | sort - | uniq | fzf)'
```

Notice the single quotes again. 

And there we have it. `cz` and we can quickly get back to where we were in a previous shell!
