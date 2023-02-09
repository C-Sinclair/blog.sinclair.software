+++
title = "Metaprogramming in Elixir with macros"
date = 2023-01-27

[extra]
icon = "🤖"

[taxonomies]
languages = ["Elixir"]
tags = ["Metaprogramming", "Macros"]
+++

Macros are one of the most powerful concepts in Elixir. Its what differentiates the language from the underlying Erlang BEAM your code is compiled to run upon.

<!-- more -->

## What is a macro?

A macro is a piece of code which maps some input code into some replacement output code.

It takes code, and gives you back ...code.

This is a very powerful and confusing concept. Its code which runs when the program is being compiled, _not_ when its being run.

Macros often serve to remove the necessity to write copious amounts of boilerplate.

This dark art of transforming code into other code is called metaprogramming.

Lots of programming languages have Macros, but when it comes to Elixir specifically, it is arguably the most important feature.

Elixir macros provide the developer with a nice high level abstraction to work with, removing the need to explicitly operate all the underlying Erlang BEAM machinery your code is compile to turn into.

## What can you do in a macro?

You can do basically anything in a macro. Any arbritrary Elixir code can be run at compile time of your application. That means everything and anything is possible, from network requests to filesystem operations, all of it can take place _before_ your application ever runs.

However, although you _can_ do anything, the question should always be whether you should. Macros add a high degree of complexity to your code, and debugging them is more difficult than standard runtime Elixir code.

## The most used macro

There's one macro which is used so heavily it feels more like its part of the language than a macro in its own right, but like a lot of things in Elixir its just another abstraction over the underlying system.

I'm talking of course about [_use_](https://elixir-lang.org/getting-started/alias-require-and-import.html#use).

Really all `use` is doing is `require`-ing the module you specify, and immediately calling that module's `__using__` macro. I know, macros on top of macros.

```elixir
use MyModule
# Basically equivalent to this
require MyModule
MyModule.__using__([])
```

Use also takes a keyword list as an optional second argument, which is passed straight to the `__using__` macro. So calls to `TestCase` for instance can be thought of like this.

```elixir
use TestCase, async: true
# Can be thought of like this
require TestCase
TestCase.__using__(async: true)
```

## Module Attributes

{% hint() %}

They're those funny `@variable_name` things which you find in Elixir modules.

{% end %}

You've likely used [module attributes](https://elixir-lang.org/getting-started/module-attributes.html) plenty of times already, but have you wondered where they come from?

> Well wonder no longer!

These attributes are set during compilation with the handy function [`Module.put_attribute/3`](https://hexdocs.pm/elixir/1.13.4/Module.html#put_attribute/3).

One interesting way to think of them is as the "state" for your module, which can be mutated at compile time, and then become constant values at runtime.

For instance, from inside a macro you can add attributes on the caller's module and then access them at runtime as static values

```elixir
defmacro get_files() do
  # list of files determined at compile time
  files = ["test/123.ex"]
  # place the list back on the caller's module attributes
  Module.put_attribute(__CALLER__.module, :files, files)
end

# in the caller
def random_file_stuff() do
    @files # This attribute will contain ["test/123.ex"] from the macro
end
```

## A medium strength macro

So let's put this newfound knowledge to use!

In [Phoenix Liveview](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html) there is a common pattern of placing templates for view components alongside their view module counterparts. Something like this

```
# filesystem
📁 live/
    🗂️ index_live.ex
    🗂️ index_live.html.heex
```

Here, Phoenix knows that if a `render/1` function is not defined in the module inside `index_live.ex` to instead use the `index_live.html.heex` file as the view's template.

Lets compose a macro which will check for the existence of that template file, and produce a friendly error message to the developer who has forgotten to create on.

{% note() %}

Phoenix already issues a compile time warning, but for our trivial example we will be raising this to a full blown compile time error.

{% end %}

### The Macros module

Let's kick this off by defining the module which the new macro itself will live

```elixir
defmodule Demo.Macros do
  # We provide a nice easy way for our consumer module to use our Macros module
  defmacro __using__(opts) do
    quote do
      import Demo.Macros
    end
  end

  defmacro ensure_live_template() do
    ...
  end

  # A little helper function for errors to be uniform
  defp compile_error!(msg) do
    raise CompileError, description: msg
  end
end
```

And then in the consuming module, we can just add the following

```elixir
defmodule DemoWeb.IndexLive do
    use Demo.Macros
    ensure_live_template()
    ...
end
```

### Referencing the calling module

Elixir provides us with a helpful way of accessing details about the module which is invoking our macro.

`__CALLER__` <- Struct containing metadata about the module which invoked the macro.

This data will be essential for us to get the path to the module's file for instance, as well as assigning module attributes or functions.

```elixir
defmacro ensure_live_template do
  # first off check render/1 is not defined in the caller
  if not Module.defines?(__CALLER__.module, {:render, 1}) do
    # __CALLER__.file contains the full filepath to the module
    caller_dir = __CALLER__.file |> Path.dirname()
    filename = __CALLER__.file |> Path.basename() |> String.split(".ex") |> hd()
    # the template should be the same as the module filename, but with .html.heex instead of .ex
    expected_template_name = filename <> ".html.heex"

    # list out all files in the same directory as the module
    caller_dir
    |> File.ls!()
    # check the expected template name isn't already there
    |> Enum.find(&(&1 == expected_template_name))
    |> case do
      nil ->
        # raise a friendly error message
        compile_error!("""
        🙈 No liveview template foooool!!!

        Create a file at #{caller_dir}/#{expected_template_name}

        """)
      _ ->
          nil
    end
  end
end
```

And there we have it, try adding that macro to a module which doesn't sit next to a heex template and try and compile and out friendly error will prevent compilation from continuing.

Pretty cool eh!

## Transforming code

So far we've only really touched the surface on what you _could_ do at compile time with Elixir's macro system.

Far more commonly macros will be leveraged to take code written by the end user (developer user that is 🤓) and transform it into often far more verbose output.

To show off this capability, let's implement a macro which will define "safe" functions instead of the default pattern match failure raising functions which Elixir will define for us by default.

In the end we want something which looks like this:

```elixir
# input
defsafe my_fun(:foo) do
  ...
end
# output
def my_fun(:foo) do
  ...
end
def my_fun(_), do: :error
```

First off we'll need to define the macro

```elixir
defmacro defsafe(call, do: expr) do
  ...
end
```

Inside the `call` argument will be the name and arguments of the function we are defining. Try `IO.inspect`ing the value and you will find it to

```elixir
{:my_fun, [line: 6], [:foo]}
```

A tuple!

This we can work with!

{% note() %}
This tuple is a representation of the Abstract Syntax Tree (AST) which defines our function definition.

The `expr` argument contains the AST representation of the `do` block which comes after in our example.
{% end %}

```elixir
# pattern match to get the function name and arguments
defmacro defsafe({name, _, args}, expr \\ nil) do
  quote do
    def unquote(name)(unquote(args)) do
      unquote(expr)
    end

    # easter egg for whoever finds it
    def unquote(name)(:monkey), do: :"🐒"

    def unquote(name)(_), do: :error
  end
end
```

> That's a whole lot of quoting!

The `quote` and `unquote` keywords are special forms which are used to interact with the AST, they translate from code to AST so you can mix and match which form you are working with.

`defmacro` - arguments are in AST form and expect AST to be returned
`quote` - accepts code forms and returns AST version
`unquote` - does the reverse, taking AST and returning code version

The Elixir docs for [quote](https://hexdocs.pm/elixir/1.12/Kernel.SpecialForms.html#quote/2) and [unquote](https://hexdocs.pm/elixir/1.12/Kernel.SpecialForms.html#unquote/1) nails the distiction pretty dang well so I'd recommend perusing those!

### Back to our example

With the fancy new `defsafe` macro in place, we can call it from our module.

```elixir
defmodule Demo.MacrosTest do
  defsafe my_fun(:foo) do
    :baz
  end
end
```

And we can see it has worked correctly when we try to invoke the module's `my_fun` function

```elixir
Demo.MacrosTest.my_fun(:foo)
# => :baz
Demo.MacrosTest.my_fun(:bar)
# => :error
Demo.MacrosTest.my_fun(:monkey)
# => :"🐒"
```

## Conclusion

Well done on sticking with me though to the end. Macros are a confusing topic, but I hope my ramblings have inspired you with what _could_ be possible for the master metaprogrammer!

Happy Macroing!
