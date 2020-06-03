import breakLines from "./break-lines";

describe("breakLines", () => {
  it("breaks lines", () => {
    const brokenLines = breakLines(
      "Good day to you my friends! What ails you on this day?",
      100,
      "bold 12pt arial"
    );
    expect(brokenLines).toEqual(`Good day to
you my
friends!
What ails
you on this
day?`);
  });
  it("breaks long lines", () => {
    const brokenLines = breakLines(
      "Goooooooooooooooooood day to you my friendoreenos! What ails you on this day?",
      100,
      "bold 12pt arial"
    );
    expect(brokenLines).toEqual(`Goooooooooooooooooood
day to you
my
friendoreenos!
What ails
you on this
day?`);
  });
  it("breaks lines with starting and trailing whitespace", () => {
    const brokenLines = breakLines(
      " Good day to you my friends! What ails you on this day? ",
      100,
      "bold 12pt arial"
    );
    expect(brokenLines).toEqual(` Good day to
you my
friends!
What ails
you on this
day? `);
  });
  it("breaks arrays of text", () => {
    const brokenLines = breakLines(
      [
        "Having held the house for who knows how long",
        "when at last trouble came along,",
        "their grasp was loosened almost instantly."
      ],
      100,
      "10px Arial"
    );

    expect(brokenLines).toEqual([
      `Having held the
house for who knows
how long`,
      `when at last
trouble came
along,`,
      `their grasp was
loosened almost
instantly.`
    ]);
  });

  it("preserves whitespace on the ends of members", () => {
    const brokenLines = breakLines(
      [
        " Having held the house for who knows how long ",
        " when at last trouble came along, ",
        " their grasp was loosened almost instantly. "
      ],
      100,
      "10px Arial"
    );

    expect(brokenLines).toEqual([
      ` Having held the
house for who knows
how long `,
      ` when at
last trouble came
along, `,
      ` their grasp
was loosened almost
instantly. `
    ]);
  });
});
