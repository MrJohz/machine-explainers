import { Encoding } from "./encoding";

const NULL_ENCODER = new Array(26).fill(0).map((_, idx) => idx);
const ROT1_ENCODER = new Array(26).fill(0).map((_, idx) => (idx + 1) % 26);
const ROTOR_III = Encoding.fromString("BDFHJLCPRTXVZNYEIWGAKMUSQO");

describe("Encoder", () => {
  describe("encode", () => {
    it("encodes characters with no change if the null encoder is used", () => {
      const encoder = new Encoding(NULL_ENCODER);
      expect(encoder.encode(0)).toBe(0);
      expect(encoder.encode(12)).toBe(12);
    });

    it("encodes characters with changes if the ROT1 encode is used", () => {
      const encoder = new Encoding(ROT1_ENCODER);
      expect(encoder.encode(0)).toBe(1);
      expect(encoder.encode(12)).toBe(13);
    });

    it("encodes rotor III as expected", () => {
      expect(ROTOR_III.encode(0)).toBe(1);
      expect(ROTOR_III.encode(12)).toBe(25);
    });
  });

  describe("inverted", () => {
    it("returns a rotor that does the opposite transformations", () => {
      const inverseRotorIII = ROTOR_III.inverted();

      expect(inverseRotorIII.encode(1)).toBe(0);
      expect(inverseRotorIII.encode(25)).toBe(12);
    });
  });
});
