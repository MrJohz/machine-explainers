import { letterToRotation, rotationToLetter } from "./letter-utils";

describe("letterToRotation", () => {
  it("encodes uppercase letters to their equivalent position numbers", () => {
    expect(letterToRotation("A")).toBe(0);
    expect(letterToRotation("B")).toBe(1);
    expect(letterToRotation("Z")).toBe(25);
  });

  it("encodes lowercase letters to their equivalent position numbers", () => {
    expect(letterToRotation("a")).toBe(0);
    expect(letterToRotation("b")).toBe(1);
    expect(letterToRotation("z")).toBe(25);
  });

  it("throws an error if the letter is non-encodable", () => {
    expect(() => letterToRotation("ü")).toThrowError();
    expect(() => letterToRotation(" ")).toThrowError();
  });
});

describe("rotationToLetter", () => {
  it("encodes position to their equivalent letters", () => {
    expect(rotationToLetter(0)).toBe("A");
    expect(rotationToLetter(1)).toBe("B");
    expect(rotationToLetter(25)).toBe("Z");
  });

  it("throws an error if the number is non-encodable", () => {
    expect(() => rotationToLetter(-1)).toThrowError();
    expect(() => rotationToLetter(26)).toThrowError();
  });
});
