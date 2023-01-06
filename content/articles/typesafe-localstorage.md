+++
title = "Type safe local storage"
date = 2022-07-28

[extra]
icon = "🗳️"

[taxonomies]
languages = ["Typescript"]
tags = ["React", "Typesafety", "Zod", "Data Validation"]
+++

In my day job we were continually hitting an error with users whenever we rolled out changes to a particular form based feature.
<!-- more -->

## The Feature

So the feature in question is a rather complex search form, with many bespoke fields and possible permutations. When the feature is loaded into the app, the first thing which happens is a call to the browser `localStorage` API, to retrieve the user’s previous form field values. 

The stored value is this huge blob of JSON, loads of stuff in there. The values then get applied to the React-handled form. 

When a developer in our team makes a change to the datastructure which powers the form (and is stored in localstorage), this can break our users, as the previous value has to be handled in the new implementation, and all too often this is not considered by the humble feature dev. 

We need a more graceful way of checking that the values retrieved from localstorage are safe for use in our application.

## Enter Zod

Zod is awesome. Its a data validation library for Typescript which allows you to do runtime checks of values, and assure that those values are typesafe.

In Zod, you define a schema, something like so:

```tsx
import { z } from 'zod'

const schema = z.object({
	name: z.string(),
})
```

You can do some much more powerful validations with Zod schemas, but I’ll keep this super simple for educational purposes.

You would then use this schema to validate against a runtime type, like so:

```tsx
const value = { name: 'foo' }
// will throw if the value doesn't match the schema
schema.parse(value) 
// won't throw and will instead give back a "success" field
const { data, success } = schema.safeParse(value)
```

Possibly the best part about Zod is its inferred typesafety. 

```tsx
type Value = z.infer<typeof schema>
// equivalent to 
type Value = {
	name: string
}
```

Notice we haven’t written a single Typescript type from scratch, yet we have type safety via inference. Very nice! 

## Our Hook

In React, everyone love the feel of a `[value, setValue]` style API.

`value` ⇒ a React flavoured variable containing the typesafe current value, validated against our schema

`setValue` ⇒ a setter which you can either pass a value, or a callback to make use of the current value

The type signature of `setValue` could be roughly summed up as

```tsx
type ValueSetter = (value: Value) => void
type SetValue = (value: Value | ValueSetter) => void
```

## Flexibility Using Generics

We want our hook to be able to handle ANY kind of schema. To do this we’ll need to use Typescript’s generics.

To start with we’ll need some type helpers:

```tsx
import { z, ZodType } from "zod";

type Value<S extends ZodType> = z.infer<S>;
type ValueSetter<S extends ZodType> = (currentValue: Value<S>) => void; 
```

Knowing what we want our hook’s API to look like, we can sculpt the return type now

```tsx
type UseZodls<S extends ZodType> = [
  /**
   * The current value of the data from local storage
   * Will default to the defaultValue if not found in local storage
   */
  value: Value<S>,
  /**
   * Updates localStorage with the new value
   * @throws if the provided value does not pass the type check
   */
  set: (value: Value<S> | ValueSetter<S>) => void
];
```

We know what we want returned now, but what do we need to pass into the hook?

We’ll need:

- the localstorage key
- the Zod schema to validate against
- a default fallback value for if validation fails, or no value is found

Knowing these pieces we can throw together a function signature.

```tsx
export function useZodls<S extends ZodType>(
  key: string,
  schema: S,
  defaultValue: Value<S>
): UseZodls<S> {...}
// this means we can call the hook live so
const schema = z.object({...})
const [storedValue, setStoredValue] = useZodls("my-key", schema, {})
```

<aside>
👆 Notice that in the example, the generic is inferred by Typescript, we don’t need to explicitly pass in the schema’s type into the hook’s generic

</aside>

Now we have Typescript defined for our hook’s inputs and outputs, we just have to implement the internals.

We need a function to get values from localstorage (for use only internally), this is where we will do the validation

```tsx
const get = useCallback(() => {
    const stored = JSON.parse(localStorage.getItem(key));
    const parsed = schema.safeParse(stored);
    if (parsed.success) {
      return parsed.data;
    }
    return defaultValue;
})
```

We’ll need a piece of React state to handle the in memory values

```tsx
const [value, setValue] = useState<Value<S> | undefined>(get);
```

And finally a setter function, for when the user wants to insert values into localstorage

```tsx
const set = useCallback(
    (value: Value<S> | ValueSetter<S>) => {
      let newValue: Value<S> = value;
			// handle the case when we use the callback with current value style
      if (typeof value === "function") {
        const valueSetter = value as ValueSetter<S>;
        const current = get();
        newValue = valueSetter(current);
      }
      // might throw
      schema.parse(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    },
    [setValue, get, schema, key]
  );
```

We wrap the `get` and `set` in `useCallback` so that when we return the `setter` , it is render-safe - able to be safely added to `useEffect` dependency arrays, without the risk of re-rendering constantly (this a whole ‘nother topic!)

## Handle Invalid JSON

In my first pass I made the assumption that only valid JSON would be stored in `localStorage` When you challenge a QA to break your implementation, this turns out to be a very poor assumption! The first thing my colleague did was enter `000` as the only value in an array (when it expected an object). 

Although this case is pretty dang unlikely, we should still handle it robustly. 

It turns out its as simple as adding a try/catch block around the `JSON.parse` part

```tsx
const get = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key));
      const parsed = schema.safeParse(stored);
      if (parsed.success) {
        return parsed.data;
      }
      return defaultValue;
    } catch (e) {
      // if the JSON.parse fails we still want to return the defaultValue
      return defaultValue;
    }
  }, [key, schema, defaultValue]);
```

## The Finished Hook

Here’s a link to a Gist of the finished hook in all of its glory!  

[https://gist.github.com/C-Sinclair/fe4d1db8e6c44912424ea6f04708d303](https://gist.github.com/C-Sinclair/fe4d1db8e6c44912424ea6f04708d303)

Overall this was a nice little challenge to mix Zod and the localstorage API into a slick hook with a clean API. I hope this inspires you to protect YOUR application boundaries with clean typesafe validation.
