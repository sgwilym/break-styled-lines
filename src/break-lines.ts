type TextDescriptor = { text: string, font?: string }

function isStringArray(text: string | string[] | TextDescriptor[]): text is string[] {
  return Array.isArray(text) && text.every((member: string | TextDescriptor) => typeof member === 'string');
}

function isTextDescriptorArray(text: string | string[] | TextDescriptor[]): text is TextDescriptor[] {
  return Array.isArray(text) && !isStringArray(text)
}

function breakLines(descriptors: {text: string, font: string}[], width: number): string[] {
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
    return descriptors.reduce((result, {text, font}, descIndex) => {
      const lastLine = result[result.length - 1];
      const lastLineSplit = lastLine ? lastLine.split('\n') : [];
      const runningLine = lastLineSplit.length > 0 ? lastLineSplit[lastLineSplit.length - 1]: "";
      const prevFont = descriptors[descIndex - 1] ? descriptors[descIndex - 1].font : font;
      
      const brokenWords = text.split(" ").reduce(
        (accumulator: string[][], word: string, i) => {
          // get the last element of the accumulator
          const [lastLine] = accumulator.slice(-1);
  
          // add the word to it
          const maybeNextLine = [...lastLine, word].join(" ");
  
          // see if it fits within the width
          ctx.font = prevFont;
          const { width: prevTextWidth } = ctx.measureText(runningLine);
             
          ctx.font = font
          const { width: textWidth } = ctx.measureText(maybeNextLine);
              
          const totalWidth = i === 0 ? prevTextWidth + textWidth : textWidth
  
          // if it does, append to the last element
          if (totalWidth <= width) {
            return [...accumulator.slice(0, -1), [...lastLine, word]];
          }
          
          // Handle case of the first word being too long for a line
          if (totalWidth > width && i === 0 && runningLine === "") {
            return [...accumulator.slice(0, -1), [...lastLine, word]];
          }
          
          // if not, create a new array containing the word as the last element
          return [...accumulator, [word]];
        },
        [[]]
      );
  
      return [...result, brokenWords.map(line => line.join(" ")).join("\n")];
    }, [] as string[])
  }

  console.warn("No canvas context was found, so the string was left as is!");
  return descriptors.map(({text}) => text);
}

function toTextDescriptors(text: string | string[] | TextDescriptor[], defaultFont: string): { text: string, font: string}[] {
  if (isTextDescriptorArray(text)) {
    return text.map(({text, font}) => ({text, font: font || defaultFont}));
  }
  
  if (isStringArray(text)) {
    return text.map((member) => ({text: member, font: defaultFont }))
  }
  
  return [{text, font: defaultFont}]
}

function breakLinesEntry(text: string, width: number, font: string): string;
function breakLinesEntry(text: string[], width: number, font: string): string[];
function breakLinesEntry(text: TextDescriptor[], width: number, font: string): string[];
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
