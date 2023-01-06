+++
title = "Async Array.reduce"
date = 2020-03-26

[extra]
icon = "♦️"

[taxonomies]
languages = ["Javascript"]
tags = ["Asynchronicity"]
+++

<aside>
🎯 Handling async actions in a reduce function
</aside>

<!-- more -->

### Problem

I have a list of fields which need to be validated against. Dependant on the result of the validation, an action needs to occur. At the end all failed validations need to be collected together and returned for further scrutiny.

### Answer

This article. 

And the star of the show, `Array.reduce`

### Breakdown

So since we need a single list to be returned which could be smaller than the original list we are passing in, the best array function to use is `reduce`. 

For a detailed breakdown of how the reduce function works, check out [Flattening nested objects](https://www.notion.so/Flattening-nested-objects-7d669ab056564e7f892c6bee5a271bea) 

Typically the `reduce` function takes a synchronous function as its first argument, and we might pass in an empty version of the data structure we want to receive as the reduce function's output. So we might think something along the lines of the below would be a good solution to our problem.

```javascript
fields.reduce((acc, field) => {..}, [])
```

However once we introduce `async` as the reducer, we run into issues with the accumulator (aka argument no.1 to the reducer function.

```javascript
// DOESN'T WORK
fields.reduce(async (acc, field) => {
	const { validation, value } = field
	const { passes } = await validation(value)
	return passes ? acc : acc.concat(field) 
}, [])
```

The issue is that the type of the accumulator shifts from `typeof Array` to `typeof Promise` after the first iteration. This is because the async function will always return a `Promise`. So this is fine for the first iteration, but what do you think will happen in pass #2 of the reduce function?

- `acc` will be a Promise, of either `Promise.resolve([])` or `Promise.resolve([lastField])` depending on the result of the validation in the last pass
- `field` will be the same object type as before

So now the `Array` of fields which failed validation is wrapped in a Promise. This is a big issue in our current implementation, as once we reach the call to `acc.concat`, a runtime exception will occur, as type Promise does not have a `concat` method. 

So how can we remedy this?

The secret sauce, is to keep the type of the accumulator constant across all iterations. This means we will need to start with a Promise (as we have no choice but for the accumulator to become a Promise in later iterations). So we need to pass in an empty array wrapped in a Promise

```javascript
fields.reduce(async (acc, field) => {..}, Promise.resolve([]))
```

We then still need to change our `concat` function. So we need a way to access the value wrapped inside the Promise chain. Values can be accessed using the `Promise.then` function, which will accept a function with the values as its argument. 

```javascript
acc.then(fields => fields.concat(field))
```

### Final Result

Pull it all together, and you've got yourself an async reduce function!

```javascript
fields.reduce(async (acc, field) => {
	const { validation, value } = field
	const { passes } = await validation(value)
	return passes ? acc : acc.then(fields => fields.concat(field))
}, Promise.resolve([]))}
```

This code is actually reasonably functional in paradigm, as the Promise is acting as a container for our values, and we only get at those values much later. We're basically going to get back the following.

```javascript
Promise.resolve([])
	.then(x => x.concat(y)
	.then(x => x.concat(y)
	.then(x => x.concat(y)
```

### A Note On Category Theory

Promises are not quite Functors or Monads as they do not conform to the rules required of them from Category Theory. 

```javascript
promise.then(f).then(g) !== promise.then(x => f(g(x)))
```

But dealing with safe containers is still a nice way to go about your day.

