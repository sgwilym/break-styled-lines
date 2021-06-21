import breakLines from "../src/break-lines";

function widthOfText(text: string, width: number, style: string) {
  const canvas = document.createElement("canvas");

  canvas.width = width;
  const ctx = canvas.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
  ctx.font = style;

  return ctx.measureText(text).width;
}

const STYLE = "12pt monospace";
const WIDTH = 100;

describe("breakLines", () => {
  it("breaks lines", () => {
    const brokenLines = breakLines(
      "Good day to you my friends! What ails you on this day?",
      WIDTH,
      STYLE
    );
    expect(brokenLines).toEqual(`Good day
to you my
friends!
What ails
you on
this day?`);
    expect(widthOfText(brokenLines, WIDTH, STYLE)).toBeLessThan(100);
  });

  it("breaks long lines", () => {
    const brokenLines = breakLines(
      `Goooooooooooooooooood day
to you my friendoreenos! What ails you on this day?`,
      WIDTH,
      STYLE
    );
    expect(brokenLines).toEqual(
      `Goooooooooooooooooood
day to you
my
friendoreenos!
What ails
you on
this day?`
    );
  });

  it("breaks lines with starting and trailing whitespace", () => {
    const brokenLines = breakLines(
      " Good day to you my friends! What ails you on this day? ",
      WIDTH,
      STYLE
    );

    expect(brokenLines).toEqual(
      ` Good day
to you my
friends!
What ails
you on
this day? `
    );
    expect(widthOfText(brokenLines, WIDTH, STYLE)).toBeLessThanOrEqual(WIDTH);
  });

  it("breaks arrays of text", () => {
    const brokenLines = breakLines(
      [
        "Having held the house for who knows how long",
        "when at last trouble came along,",
        "their grasp was loosened almost instantly."
      ],
      WIDTH,
      STYLE
    );

    expect(brokenLines).toEqual([
      `Having
held the
house for
who knows
how long`,
      `
when at
last
trouble
came
along,`,
      `
their
grasp was
loosened
almost
instantly.`
    ]);

    // passes if join element is a newline.
    //
    expect(widthOfText(brokenLines.join(""), WIDTH, STYLE)).toBeLessThanOrEqual(
      WIDTH
    );
  });

  it("preserves whitespace on the ends of members", () => {
    const brokenLines = breakLines(
      [
        " Having held the house for who knows how long ",
        " when at last trouble came along, ",
        " their grasp was loosened almost instantly. "
      ],
      WIDTH,
      STYLE
    );

    expect(brokenLines).toEqual([
      ` Having
held the
house for
who knows
how long `,
      `
when at
last
trouble
came
along, `,
      `
their
grasp was
loosened
almost
instantly.
`
    ]);

    expect(widthOfText(brokenLines.join(""), WIDTH, STYLE)).toBeLessThanOrEqual(
      WIDTH
    );
  });

  it("can break lines with variable font styles", () => {
    const brokenLines = breakLines(
      [
        { text: "There once was an irrascible, fearsome," },
        { text: "HUNGRY BEASTIE", font: "36px Impact" },
        { text: "and when all was said, that was that" }
      ],
      WIDTH,
      STYLE
    );

    expect(brokenLines).toEqual([
      "There once\nwas an\nirrascible,\nfearsome,",
      "\nHUNGRY\nBEASTIE",
      "\nand when\nall was\nsaid, that\nwas that"
    ]);
  });
  
  it('warns when BlinkMacSystemFont is used', () => {
    let warnings: string[] = [];
    console.warn = (warning: string) => warnings.push(warning)
    
    
     breakLines("Hello there.", 200, '16px system-ui, BlinkMacSystemFont, Helvetica');
    
    expect(warnings[0]).toBe("break-styled-lines: Using BlinkMacSystemFont can cause Chrome to crash in certain environments!")
  })
});
