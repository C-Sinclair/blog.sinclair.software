+++
title = "Comparing a file with master branch"
date = 2023-01-09

[extra]
icon = "🕊️"

[taxonomies]
tags = ["Git", "GH", "Neovim"]
languages = ["Shell", "Lua"]

+++

I find myself very regularly needing to understand what has changed in a specific file compared to (most commonly `master`) another Git branch.

There's no quickfire `git` command which will just take the file and branch you want and hand you back the file unfortunately, so we are left to come up with other means.

<!-- more -->

## GH to the rescue

If I haven't said it already, `gh` is _freaking awesome_!

I don't know how many times I use the `gh pr checkout` command in a day, but dang its sure to be a lot.

There's no command in `gh` to query for the file directly either, _but_ we can get the raw file from the Github API pretty easily.

Let's start with querying for the file:

```bash
gh api /repos/$OWNER/$REPO/contents/$FILEPATH
```

As an example I'll ping the repo for the `gh` CLI itself

```bash
gh api /repos/cli/cli/contents/docs/install_linux.md
```

```json
{
  "name": "install_linux.md",
  "path": "docs/install_linux.md",
  "sha": "4e0a7aa39466280b5de7c229b6d1ac9a5e00d87b",
  "size": 6497,
  "url": "https://api.github.com/repos/cli/cli/contents/docs/install_linux.md?ref=trunk",
  "html_url": "https://github.com/cli/cli/blob/trunk/docs/install_linux.md",
  "git_url": "https://api.github.com/repos/cli/cli/git/blobs/4e0a7aa39466280b5de7c229b6d1ac9a5e00d87b",
  "download_url": "https://raw.githubusercontent.com/cli/cli/trunk/docs/install_linux.md",
  "type": "file",
  "content": "...",
  "encoding": "base64",
  "_links": {
    "self": "https://api.github.com/repos/cli/cli/contents/docs/install_linux.md?ref=trunk",
    "git": "https://api.github.com/repos/cli/cli/git/blobs/4e0a7aa39466280b5de7c229b6d1ac9a5e00d87b",
    "html": "https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
  }
}
```

There's a nice little trick you can do with the `gh api` subcommand instead of needing to pipe the response onto `jq`, you can just pass the `--jq` flag, like this

```bash
gh api /repos/cli/cli/contents/docs/install_linux.md --jq ".download_url"
#  https://raw.githubusercontent.com/cli/cli/trunk/docs/install_linux.md
```

The above snippet returns us the raw url of the file hosted on Github. Perfect!

## Curling it all together

A cheeky `curl` and there we have it.

```bash
curl --silent $(gh api /repos/cli/cli/contents/docs/install_linux.md --jq ".download_url")
```

You could pipe that output to a pager like `less` or `bat` if you wanted very easily.

## Other branches

So far we've been querying for the default branch of the repo (normally `main` or `master`) but you can change that like so

```bash
gh api /repos/cli/cli/contents/docs/install_linux.md?ref=trunk --jq ".download_url"
```

Where `trunk` is the branch name of your choice.

## Combining it with Neovim

In Vim you have the handy `:.!` command which, followed by a CLI command, will replace the current line with the result of the command. Pretty dang handy that one!

But we can go further!

Neovim ships with a very clean and simple lua based configuration and API. So let's wrap this functionality up into a [user command](https://github.com/nanotee/nvim-lua-guide/blob/master/README.md#defining-user-commands).

We'll need a few pieces to do this:

- First off `vim.fn.expand "%"` which returns the absolute file path of the current buffer
- `vim.fn.fnamemodify` to pick out a relative path for the project
- `io.popen` for executing an external CLI command
- And finally `vim.api.create_user_command` which will let us call a Lua function when a vim command is called

## A generic lua `exec` command

Let's begin with a nice `exec` function to keep our main function nice and clean.

```lua
local function exec(cmd)
    -- blow up if the command fails
    local handle = assert(io.popen(cmd))
    local output = handle:read "*a"
    handle:close()
    -- return the output of the command
    return output
end
```

We're close to having everything we need, there's just one more issue which will block us.

{% question() %}

How will we know the `$OWNER` and `$REPO` name from the current project?

{% end %}

This information isn't stored anywhere locally or in git. It's purely a "Github thing". So, we can use `gh` to retrieve that information!

```bash
gh repo view --json nameWithOwner
# { "nameWithOwner": "cli/cli" }

gh repo view --json nameWithOwner --jq .nameWithOwner
# cli/cli
```

## View master file `lua` function

Here we go, its time for some Lua scripting action.

Just a quick side note that you'll need to put this function somewhere on your [Neovim RTP (Runtime Path)](https://neovim.io/doc/user/options.html#'runtimepath') for the Lua to be executed when you start Neovim.

```lua
local function view_master_file()
    -- get the current file path relative to the project
    local filepath = vim.fn.fnamemodify(vim.fn.expand "%", ":p:~:.")

    -- get the owner/repo
    -- need to cut off the final \n, hence the split
    local owner_repo = exec("gh repo view --json nameWithOwner"):split("\n")[1]

    -- run the external gh command from above
    local master_file = exec("curl --silent $(gh api /repos/" .. owner_repo .. "/contents/" .. filepath .." --jq .download_url)")

    -- open a new buffer
    vim.api.nvim_command('botright vsplit new')
    local bufnr = vim.api.nvim_win_get_buf(0)

    -- split master_file into array of lines
    local master_file_lines = master_file:split("\n")

    -- set the new buffer to display the lines
    vim.api.nvim_buf_set_lines(bufnr, 0, 0, false, master_file_lines)
end
```

## Attach view master file function to user command

```lua
vim.api.create_user_command("ViewMasterFile", view_master_file, {})
```

Now you should be able to call the vim command `:ViewMasterFile` in any project which has a Github remote repository and it will open a new vertical split with the current file as it appears on `master` branch!

So this works, which is great... _BUT_ you'll notice there's no syntax highlighting. I don't know about you, but this is an issue for me!

## A change of implementation

Treesitter is responsible for syntax highlighting in Neovim. But it needs to know what the file type is of the current buffer, and as far as I could tell it will hook into the attach hook of Neovim, so you need to reopen a file in order to get it to highlight.

This means we need to save the master file to disk before we open it.

```lua
    -- We swap out any /'s to avoid the need to create nested directories
    local tmp_file_path = "/tmp/" .. filepath:gsub("/", "_")
    exec("curl --silent $(gh api /repos/" .. owner_repo .. "/contents/" .. filepath .." --jq .download_url) > " .. tmp_file_path)
    -- now just open the file in a vertical split
    vim.api.nvim_command("botright vsplit " .. tmp_file_path)
```

This way is actually quite a bit cleaner as we don't need to mess around with the buffer once the file is opened.

## Final implementation

```lua
local function exec(cmd)
    -- blow up if the command fails
    local handle = assert(io.popen(cmd))
    local output = handle:read "*a"
    handle:close()
    -- return the output of the command
    return output
end

local function view_master_file()
  -- get the current file path relative to the project
  local filepath = vim.fn.fnamemodify(vim.fn.expand "%", ":p:~:.")
  -- get the owner/repo
  local owner_repo = exec.gh([[ repo view --json nameWithOwner --jq .nameWithOwner]]):split("\n")[1]
  local tmp_file_path = "/tmp/" .. filepath:gsub("/", "_")
  exec(
    "curl --silent $(gh api /repos/" .. owner_repo .. "/contents/" .. filepath .. " --jq .download_url) > " .. tmp_file_path
  )
  -- now just open the file in a vertical split
  vim.api.nvim_command("botright vsplit " .. tmp_file_path)
end

vim.api.nvim_create_user_command("ViewMasterFile", view_master_file, {})
```

As you can see, once you start combining the flexibility of great command line tooling with Lua/Neovim, you can do a crazy amount of improvements to your development workflow!
