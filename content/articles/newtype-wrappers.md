+++
title = "Exploring Haskell’s `newtype` as a type wrapper"
date = 2022-10-07

[extra]
icon = "🌯"

[taxonomies]
languages = ["Haskell", "Kotlin", "Javascript"]
tags = ["Type Manipulation"]
+++

Sometimes when programming in various languages, it can be incredibly useful to be able to adapt the core primitive or third party types in your platform. 

A particular library’s API not quite to your liking? Need an additional sorting function on that damned list type? 

Sounds like a nice, ergonomic way of wrapping that external type to provide more functionality is in order.  
<!-- more -->

## Kotlin’s Extensions

[https://kotlinlang.org/docs/extensions.html](https://kotlinlang.org/docs/extensions.html)

In Kotlin, there is the concept of “Extensions”, which allow you to do exactly what they say on the tin: *Extend* a given type. This could be one of the built in platform primitives, or a third party library’s.  

This can be a pretty handy escape hatch, if ever your application needs to tweak a basic type provided by the platform (like `MutableList` for instance in the Kotlin doc’s examples), without going through the ceremony of writing a whole class to wrap the type.  

## Prototypes in Javascript

Javascript as well has a way of extending any given base type via the prototype. Since basically everything in Javascript is an object and objects have prototypes, you can adapt the prototype 

This “prototype pollution” is generally seen as a bad idea. Unlike the Kotlin example, changes to the prototype are **global.** So any future object/type created will inherit the mutated prototype. In Kotlin, extensions are only scoped to the module they are declared in, and have to be manually imported to gain that functionality.

## Haskell’s `newtype`

Haskell has a different solution. 

Everything in Haskell is immutable. There is no state, and you can’t go around redefining functions the platform gives you. 

To help us lowly mortals, Haskell gives us the `newtype`. At it’s simplest it could just be a “redefinition” of an existing type

```haskell
newtype ReverseString = ReverseString String

instance Show ReverseString where
	show (ReverseString s) = reverse s
```

In this very contrived example, any `ReverseString` which we ask Haskell to print in GHCi will be the reverse of the underlying string’s value. Let’s see it in use

```haskell
-- create a normal string
str = "Hello Mate"
-- wrap it, and GHCi will print it back using show
ReverseString str
-- "etaM olleH" 
```

Pretty cool huh. Apparently these `newtypes` disappear at runtime as well, leaving no trace of their wrapper abstractions!
