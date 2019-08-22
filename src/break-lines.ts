/**
 * Breaks a string into lines given a width and style for the text.
 *
 * @param string - The text to be broken into lines
 * @param width - The width in pixels for the text to fit into
 * @param font - The style of the text expressed as a value of the CSS font property, e.g. '12pt bold serif'
 * @returns The given string with newlines inserted
 */
function breakLines(string: string, width: number, font: string): string {
  const supportsOffscreenCanvas = "OffscreenCanvas" in window;

  const canvasEl = document.createElement("canvas");

  const canvas = supportsOffscreenCanvas
    ? canvasEl.transferControlToOffscreen()
    : canvasEl;

  canvas.width = width;
  const ctx = canvas.getContext("2d") as (
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D);

  if (ctx) {
    ctx.font = font;

    const brokenWords = string.split(" ").reduce(
      (accumulator: string[][], word: string) => {
        // get the last element of the accumulator
        const [lastLine] = accumulator.slice(-1);

        // add the word to it
        const maybeNextLine = [...lastLine, word].join(" ");

        // see if it fits within the width
        let { width: textWidth } = ctx.measureText(maybeNextLine);

        // if it does, append to the last element
        if (textWidth <= width) {
          return [...accumulator.slice(0, -1), [...lastLine, word]];
        }

        if (lastLine.length === 0) {
          return [...accumulator.slice(0, -1), [word]];
        }

        // if not, create a new array containing the word as the last element
        return [...accumulator, [word]];
      },
      [[]]
    );

    return brokenWords.map(line => line.join(" ")).join("\n");
  }

  console.warn("No canvas context was found, so the string was left as is!");
  return string;
}

export default breakLines;
