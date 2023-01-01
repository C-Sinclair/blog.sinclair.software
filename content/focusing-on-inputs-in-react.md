+++
title = "Focusing on inputs in react"
icon = "🎯"
date = 2020-04-09

[taxonomies]
languages = ["Javascript"]
tags = ["React"]
+++

<aside>
🎯 Inputs can require focus...
</aside>

Focusing the user onto an input is usually pretty simple

<!-- more -->

```javascript
// standard DOM
document.querySelector("input").focus()
```

However in React you need a reference to this element as it may change over time. This is done with the `ref` prop. 

```javascript
// inside a React functional component
const input = useRef()
...
return (
	<input ref={input} />
)
...
```

Now we've got a variable which will always point to this element, even between renders. The input tag can be assessed via

```javascript
input.current.focus()
```

The `current` object on the ref will always be updated, so you can be sure you are hitting the current element.

<aside>
🎯 Hint: if using Material UI, the TextField component actually requires the ref to be set against the `inputRef` prop, not `ref`
</aside>

