+++
title = "Debugging Tailwind's Language Server Protocol"
date = 2023-02-09

[extra]
icon = "🪲"

[taxonomies]
tags = ["Tailwind", "Neovim", "Elixir"]
languages = ["Lua"]
+++

I use [Neovim](/tags/neovim) as my code editing driver. At work, our tech stack revolves around the Phoenix framework on
top of [Elixir](/languages/elixir)

Recently we've made the move to incorporate [TailwindCSS](https://tailwindcss.com/) into the mix - hardly a
controversial decision since TW is basically bundled into Phoenix at this point!

<!-- more -->

Anyway, I've previously had the [Tailwind
LSP](https://github.com/tailwindlabs/tailwindcss-intellisense/tree/master/packages/tailwindcss-language-server) set up
to good effect in other hobby projects, but in my work repo nothing seems to work correctly.

## Installing the language server

The go to place for install instructions for any new language server is the [LSPConfig](https://github.com/neovim/nvim-lspconfig) repo's
[server_configurations.md](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md) file.

Here's the snippet relating to Tailwind to save you a click:

Tailwind CSS Language Server can be installed via npm:

```bash
# heads up, a better way coming up below
npm install -g @tailwindcss/language-server
```

Snippet to enable the language server:

```lua
require'lspconfig'.tailwindcss.setup{}
```

## An alternative to installing globally

The `npm` command above is the default option for installing the language server, but it has the downside of requiring your `npm` to be configured correctly, and the global installs directory to be on your path so that you can run `tailwindcss-language-server` as a shell command.

There is a _better_ way.

Enter [Mason](https://github.com/williamboman/mason.nvim).

Mason will install whatever language servers/linting tooling/basically any third party binary, in a single deterministic place on your Neovim path.

What kinds of binaries you install is split into sub packages, the one we're interested in for this use case is the [mason-lspconfig](https://github.com/williamboman/mason-lspconfig.nvim) package.

Lets install both packages using our Neovim package manager (I use [Packer](https://github.com/wbthomason/packer.nvim) but there's also the new kid on the block [Lazy](https://github.com/folke/lazy.nvim) which has a slightly different configuration pattern)

```lua
  use "williamboman/mason.nvim"
  use {
    "williamboman/mason-lspconfig.nvim",
    requires = {
      "williamboman/mason.nvim",
      "neovim/nvim-lspconfig",
    },
    config = function()
      require("mason-lspconfig").setup {
        ensure_installed = {
          "sumneko_lua",
          "tailwindcss",
          -- any other language servers you want to explicitly install
        },
      }
    end,
  }
```

When you run a `:PackerSync` the explicitly defined language servers will be installed.

> But where doth they go you ask?

```lua
print(vim.fn.stdpath("data") .. "/mason/bin/")
-- ~/.local/share/nvim/mason/bin
```

## Setting up the tailwind language server

The LSP needs to be told to start the tailwind language server when you enter a buffer of a file type which Tailwind would be interested in.

```lua
-- same as above 
require'lspconfig'.tailwindcss.setup{
  -- tell vim lsp where the binary lives
  cmd = { vim.fn.stdpath "data" .. "/mason/bin/tailwindcss-language-server" },
}
```

## First failed attempt

At this point, I thought all was golden and I would get that sweet sweet LSP goodness in my heex templates.

I thought wrong.

I hop into a heex template, and trigger my keybinding for `vim.lsp.buf.hover()` (in my case its mapped to "K"), nothing. No feedback whatsoever.

A handy tool when debugging why a language server isn't working is the `:LspLog` command. This will open a new vim tab with the default log for LSP servers to dump their logs. _Sometimes_ you'll find a key piece of info, like missing binaries etc.

In this instance though, it was of no help. No errors. Nada.

Another handy one is `:LspInfo`. Here you'll see a popup with whether each server has been loaded and the workspace path. Again, for this issue all seemed fine there.

## Could it be subdirectory related?

My first thought was whether the fact that the `tailwind.config.js` being in a nested directory (`assets/`) was causing the issue. The TW language server states that this file is a requirement for it to function.

A quick test to disprove this theory was to run `tailwind --init` at the root of the project and fire up nvim again.

Nope.

## Manually changing the file type

To cut a long and confusing story short, I was able to find out what the cause of the issue was by manually changing the file type of the buffer.

```vim
:set filetype=html
```

Now try your `hover` command. It works!

So the issue is the heex filetype not trigger Tailwind to start.

Luckily there is an option which can be passed to the LSP, `init_options`. This is a standard option from lspconfig which does what it says on the tin.

For our issue, we need to change the `userLanguages` TW option, like so:

```lua
require'lspconfig'.tailwindcss.setup{
  -- other options
  init_options = {
    userLanguages = {
      elixir = "phoenix-heex",
      eruby = "erb",
      heex = "phoenix-heex",
      svelte = "html",
    },
  },
  filetypes = {
    "css",
    "scss",
    "sass",
    "html",
    "heex",
    "elixir",
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "svelte",
  },
}
```

The `filetypes` option also tells the vim lsp when to attempt loading of this server. So basically, and heex filetypes will trigger the `tailwindcss` lsp client, and that filetype translates to `phoenix-heex` - which is already supported internally in the language server.

## Conclusion

There we have it. I hope this helps some other lowly vim adventurers.

I found this area to be very sparsely documented, so I hope stumbling across this post helps others with their setting of _the ultimate webdev_ editing experience!

## References

<https://github.com/tailwindlabs/tailwindcss-intellisense/blob/master/packages/tailwindcss-language-service/src/util/languages.ts>

<https://elixirforum.com/t/how-to-use-phoenix-heex-templates-in-vscode/42461/25>

<https://pragmaticstudio.com/tutorials/formatting-heex-templates-in-vscode>
