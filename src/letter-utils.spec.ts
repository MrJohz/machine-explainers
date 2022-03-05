import { letterToPosition, positionToLetter } from "./letter-utils";

describe("letterToPosition", () => {
  it("encodes uppercase letters to their equivalent position numbers", () => {
    expect(letterToPosition("A")).toBe(0);
    expect(letterToPosition("B")).toBe(1);
    expect(letterToPosition("Z")).toBe(25);
  });

  it("encodes lowercase letters to their equivalent position numbers", () => {
    expect(letterToPosition("a")).toBe(0);
    expect(letterToPosition("b")).toBe(1);
    expect(letterToPosition("z")).toBe(25);
  });

  it("throws an error if the letter is non-encodable", () => {
    expect(() => letterToPosition("ü")).toThrowError();
    expect(() => letterToPosition(" ")).toThrowError();
  });
});

describe("positionToLetter", () => {
  it("encodes position to their equivalent letters", () => {
    expect(positionToLetter(0)).toBe("A");
    expect(positionToLetter(1)).toBe("B");
    expect(positionToLetter(25)).toBe("Z");
  });

  it("throws an error if the number is non-encodable", () => {
    expect(() => positionToLetter(-1)).toThrowError();
    expect(() => positionToLetter(26)).toThrowError();
  });
});
