+++
title = "Solid is Solid"
date = 2021-12-04

[extra]
icon = "💪"

[taxonomies]
languages = ["Javascript"]
tags =  ["SolidJS", "React", "UI Frameworks"]
+++

<aside>
🪖 Solid in a good way.
</aside>

No more manually managing dependency arrays to trigger re-renders. 

<!-- more -->

### Clickbait Temptation

I was very tempted to name this article "SolidJS, the React killer?" or some such click-bait title. But does the world need more rhetoric? 

No.

### I'm a React guy

Just to be completely straight here. I'm a React guy. I love React. I'm that cool kid at parties, sat in the kitchen discussing how `useMemo` should be better well known. 

But I'll be the first to say it. React is complicated. 

The hardest part of React is knowing when a re-render will occur, and what caused it. 

### Enter SolidJS

Solid follows a different model. 

Your component is only called once - like any other bog standard regular Javascript function. This component function will auto-magically go through and assign basically event listeners on all of your stateful variables. 

In short this means that you never have to care about where state is being subscribed to. Variables which are derived from other stateful variables are more than capable of looking after themselves. 

<aside>
🕶️ This is very cool

</aside>

However...

## There are footguns

![footgun.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c925e7ee-ab70-4975-a3c4-ae2b6bcef500/footgun.jpg)

If you aren't careful about how you destruct stateful variables, you'll end up with static ones.

This does actually make perfect sense, ultimately these are just JS functions, nothing more. 

### Prop destructuring

In React its pretty much muscle memory to do the following:

```bash
function Component({ onClick, value = 'Some default value' }) {
```

This code could be valid Solid code as well. However, the prop variables for `onClick` or `value` will never change. They will be in effect static values. 

This is because under the hook what is really happening here is something like this

```bash
function Component(props) {
	const onClick = props.onClick
	const value = props.value || 'some default value'
```

So `props.onClick` and `props.value` are assigned to new variables `onClick` and `value`

Solid only knows about and monitors `props`  If we go pulling it apart and assigning variables to things, Solid is not going to know what needs to be done.

So basically, there is some un-learning of habits picked up from React best practices needed. 

But if you weigh up this additional cognitive load against the behemoth that is the React render cycle... well need I even compare?

## Conclusion

Solid is awesome. Well worth a gander. 

Its not just the fact its the fastest JS framework (against some stiff competition). Its model of reactivity is very interesting, and the way everything builds on top of this core primitive is very cool.
