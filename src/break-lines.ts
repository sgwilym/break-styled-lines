type TextDescriptor = { text: string; font?: string };

function isStringArray(
  text: string | string[] | TextDescriptor[]
): text is string[] {
  return (
    Array.isArray(text) &&
    (text.length > 0 ? typeof text[0] === "string" : true)
  );
}

function isTextDescriptorArray(
  text: string | string[] | TextDescriptor[]
): text is TextDescriptor[] {
  return Array.isArray(text) && (text.length > 0 ? !isStringArray(text) : true);
}

function withNewLines(
  descriptor: { text: string; font: string },
  width: Number,
  startingX: number,
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
): { lastLineWidth: number; text: string } {
  // Break up all the parts into whitespace and words
  const elements = descriptor.text
    .split("")
    .reduce((elements: string[], char: string) => {
      const runningElement = elements[elements.length - 1] || "";
      const lastChar = runningElement.slice(-1);

      if (char === " " && lastChar !== " ") {
        return [...elements, char];
      }

      if (char !== " " && lastChar === " ") {
        return [...elements, char];
      }

      return [...elements.slice(0, -1), `${runningElement}${char}`];
    }, []);

  const { lastLineWidth, lines } = elements.reduce(
    (result, element: string) => {
      ctx.font = descriptor.font;
      const { width: elementWidth } = ctx.measureText(element);
      const completeTextWidth = result.lastLineWidth + elementWidth;

      const itFits = completeTextWidth <= width;

      // If it fits, remove the last line from current results
      // append the current element into it
      // and insert it back in
      if (itFits) {
        const appendedLine = [...result.lines.slice(-1), element].join("");

        return {
          lastLineWidth: completeTextWidth,
          lines: [...result.lines.slice(0, -1), appendedLine]
        };
      }

      // Now it doesn't fit.

      // If the element itself didn't fit on a line
      // Then we should force a break
      if (elementWidth > width && result.lastLineWidth === 0) {
        return {
          lastLineWidth: elementWidth,
          lines: [...result.lines.slice(0, -1), element]
        };
      }

      // Trim any whitespace at the end of the line
      // which is being broken.
      const previousLine = result.lines.slice(-1).join("");
      const precedingLines = [
        ...result.lines.slice(0, -1),
        previousLine.trimEnd()
      ];

      // If the element that doesn't fit is a whitespace
      // we should just insert a newline
      if (element.trim().length === 0) {
        return {
          lastLineWidth: 0,
          lines: [...precedingLines, ""]
        };
      }

      // Otherwise we should just start a new line with the element
      return {
        lastLineWidth: elementWidth,
        lines: [...precedingLines, element]
      };
    },
    { lastLineWidth: startingX, lines: [] as string[] }
  );

  return { lastLineWidth, text: lines.join("\n") };
}

function breakLines(
  descriptors: { text: string; font: string }[],
  width: number
): string[] {
  const supportsOffscreenCanvas = "OffscreenCanvas" in window;

  const canvasEl = document.createElement("canvas");

  const canvas = supportsOffscreenCanvas
    ? canvasEl.transferControlToOffscreen()
    : canvasEl;

  canvas.width = width;
  const ctx = canvas.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;

  if (ctx) {
    return descriptors.reduce(
      (result, descriptor) => {
        const { lastLineWidth, text } = withNewLines(
          descriptor,
          width,
          result.lastLineWidth,
          ctx
        );

        return {
          lastLineWidth,
          lines: [...result.lines, text]
        };
      },
      { lastLineWidth: 0, lines: [] as string[] }
    ).lines;
  }

  console.warn("No canvas context was found, so the string was left as is!");
  return descriptors.map(({ text }) => text);
}

function toTextDescriptors(
  text: string | string[] | TextDescriptor[],
  defaultFont: string
): { text: string; font: string }[] {
  if (isTextDescriptorArray(text)) {
    return text.map(({ text, font }) => ({
      text: stripNewlines(text),
      font: font || defaultFont
    }));
  }

  if (isStringArray(text)) {
    return text.map(member => ({
      text: stripNewlines(member),
      font: defaultFont
    }));
  }

  return [{ text: stripNewlines(text), font: defaultFont }];
}

const newlineRegex = /(\r\n|\n|\r)/gm;

function stripNewlines(text: string) {
  return text.replace(newlineRegex, " ");
}

function breakLinesEntry(text: string, width: number, font: string): string;
function breakLinesEntry(text: string[], width: number, font: string): string[];
function breakLinesEntry(
  text: TextDescriptor[],
  width: number,
  font: string
): string[];
/**
 * Breaks a string into lines given a width and style for the text.
 *
 * @param string - The text to be broken into lines
 * @param width - The width in pixels for the text to fit into
 * @param font - The style of the text expressed as a value of the CSS font property, e.g. '12pt bold serif'
 * @returns The given string with newlines inserted
 */
function breakLinesEntry(
  text: string | string[] | TextDescriptor[],
  width: number,
  font: string
): string | string[] {
  const descriptors = toTextDescriptors(text, font);

  if (isStringArray(text)) {
    return breakLines(descriptors, width);
  }

  if (isTextDescriptorArray(text)) {
    return breakLines(descriptors, width);
  }

  return breakLines(descriptors, width)[0];
}

export default breakLinesEntry;
