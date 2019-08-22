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
});
