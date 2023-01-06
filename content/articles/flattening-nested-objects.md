+++
title = "Flattening nested objects"
date = 2020-04-06

[extra]
icon = "😳"

[taxonomies]
languages = ["Javascript"]
tags = ["Object Manipulation"]
+++

<aside>
🎯 When your object has nested objected, sometimes you just need to flatten that s**t down!
</aside>

<!-- more -->

### Problem

You have an object with a load of deeply nested child objects within it

### Answer

Everyone's favourite `Array.reduce` to the rescue

### Breakdown

So we need a way of iterating over all of the fields inside the object. This can be done very simply with the `Object.keys` function. This little beauty passes you back an `Array` of each key which exists in your object. This will allow us to iterate over each field. Check.

Overall we need to turn this array into a new flattened object. Many items into one item. That sounds like a reduction, so lets use `reduce`

<aside>
🎯 In some languages `reduce` is called `fold` which might help you model in your mind better what is happening. The list of items is folding into a new item.

</aside>

Reduce accepts a function. This function takes as its arguments `(accumulator, item, index)`

- `accumulator` is the value returned from the previous iteration of the function.
- `item` is the item in the array currently being actioned on
- `index` is the index of the item in the array currently being actioned on. (The index isnt actually neccessary in this context so we'll ignore it from now on, but it can come in very handy!)

So reduce is going to work basically like `Array.map` its going to iterate over each item in the array it is called on, and call your function using that item. Except, with this function instead you have reference to the previously returned value. The acculumated value.

With our array of keys of the object we can then run reduce over it, so that it calls our function for each key. This will then allow us to check if the value at that key is an object or just a regular value. If it is an object then we get grab all of its properties and spread them out into the new object we want to return.

```javascript
Object.keys(obj).reduce((acc, key) => {
  const value = obj[key];
  return typeof value === "object"
    ? { ...acc, ...value }
    : { ...acc, key: value };
});
```

One other thing to note is that we want to return a new object, so it makes sense to start with an empty object, which we will then fill up with key, value pairs. Reduce takes a second argument which is the initial value of the `accumulator` so in our case it will be `{}`

### The Final Product

```javascript
const flatten = (obj) =>
  Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    return typeof value === "object"
      ? { ...acc, ...flatten(value) }
      : { ...acc, key: value };
  }, {});
```

### Beware

There is one big problem with this implementation. If the names of 2 keys are the same, the second will overwrite the first! A bonus for YOU the reader will be to adapt this cheeky `flatten` function to allow it to accept conflicting names. Accept the challenge at your own peril!
