# break-styled-lines

This package is useful for when you want to know where linebreaks will occur in text given a font style (e.g. `16pt italic Georgia`) and the width of its container.

This utility also supports some more complex use-cases:

- Adding linebreaks to a list of strings as though they were a single string, and returning the text back as arrays.
- Adding linebreaks to a body of text which does not have consistent styling throughout (e.g. one much larger word in the middle of a sentence).

Uses the Canvas API to measure text, so it's quite fast. Uses an OffscreenCanvas if the browser supports it.

Comes with typescript types.

## Basic example

```ts
import breakLines from "break-styled-lines";

const textWithLineBreaks = breakLines(
  "Good day to you my friends! What ails you on this day?",
  100,
  "bold 12pt arial"
);
```

The result of the above usage would be:

```
/*
Good day to
you my
friends!
What ails
you on this
day?
*/
```

## Installation

`yarn add break-styled-lines`

## Usage

The single `breakLines` export supports three different cases:

### Single string

```ts
breakLines(
  // The text you'd like to insert newlines into
  text: string
  // The width constraining the text
  width: number
  // The font style of the text (a value of the CSS font property e.g. 10px bold serif)
  style: string
): string | string[]
```

```ts
breakLines("Good morrow my good man!", 100, "16pt serif");
```

### Array of strings

```ts
breakLines(
  // An array of strings, which will be treated as a single run of text, and then split back apart again before being returned.
  text: string[]
  // The width constraining the text
  width: number
  // The font style of the text (a value of the CSS font property e.g. 10px bold serif)
  style: string
): string | string[]
```

````ts
breakLines(["Good morrow my good man!", " What brings you to our corner of the world?"], 100, "16pt serif")
```ts

### Text descriptors

```ts
breakLines(
  // An array of descriptors, which will be treated as a single run of text, and then split back apart again before being returned.
  // { text: string, font?: string }
  text: TextDescriptor[]
  // The width constraining the text
  width: number
  // The default font style of the text which will be used if the descriptor is not provided one (a value of the CSS font property e.g. 10px bold serif)
  style: string
): string | string[]
````

```ts
breakLines(
  [
    { text: "Good morrow my good man!" },
    { text: " What brings you to our corner of the world?" },
    {
      text: " Our selection of the finest smoked cheeses, you say?!",
      font: "36pt bold Impact",
    },
  ],
  100,
  "16pt serif"
);
```
