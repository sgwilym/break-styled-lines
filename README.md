# break-styled-lines

This package is useful for when you want to know where linebreaks will occur in text given a font style (e.g. `16pt italic Georgia`) and the width of its container. Uses the Canvas API to measure text, so it's quite fast. Uses an OffscreenCanvas if the browser supports it.

## Example

```
import breakLines from 'break-styled-lines';

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

```
breakLines(
  // The string you'd like to break into lines. Can also be an array of strings, which will be treated as a single run of text, and then split back apart again.
  text: string | string[]
  // The width constraining the text
  width: number
  // The style of the text (a value of the CSS font property e.g. 10px bold serif)
  style: string
): string | string[]
```
