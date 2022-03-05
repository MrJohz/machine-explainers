import { Wheel } from "./wheel";

const NULL_ENCODER = new Array(26).fill(0).map((_, idx) => idx);
const ROT1_ENCODER = new Array(26).fill(0).map((_, idx) => (idx + 1) % 26);
const ANY_ENCODER = [
  // a -> f, b -> e, c -> d
  5, 4, 3, 2, 1, 0,

  // g -> l, h -> k, i -> j
  11, 10, 9, 8, 7, 6,

  // m -> r, n -> q, o -> p
  17, 16, 15, 14, 13, 12,

  // s -> x, t -> w, u -> v
  23, 22, 21, 20, 19, 18,

  // y -> z
  25, 24,
];

describe("Wheel", () => {
  describe("encode", () => {
    it("encodes characters with no change if the null encoder is used with no offset", () => {
      const wheel = new Wheel(NULL_ENCODER);
      expect(wheel.encode(0, 0)).toBe(0);
      expect(wheel.encode(12, 0)).toBe(12);
    });

    it("encodes characters with changes if the ROT1 encode is used with no offset", () => {
      const wheel = new Wheel(ROT1_ENCODER);
      expect(wheel.encode(0, 0)).toBe(1);
      expect(wheel.encode(12, 0)).toBe(13);
    });

    it("encodes characters with changes if the ANY encoder is used with no offset", () => {
      const wheel = new Wheel(ANY_ENCODER);
      expect(wheel.encode(0, 0)).toBe(5);
      expect(wheel.encode(12, 0)).toBe(17);
    });

    it("encodes characters with no changes if the null encoder is used with an offset", () => {
      const wheel = new Wheel(NULL_ENCODER);
      expect(wheel.encode(0, 1)).toBe(0);
      expect(wheel.encode(12, 5)).toBe(12);
    });

    it("encodes characters with the same changes if the ROT1 encode is used with an offset", () => {
      const wheel = new Wheel(ROT1_ENCODER);
      expect(wheel.encode(0, 1)).toBe(1);
      expect(wheel.encode(12, 5)).toBe(13);
    });

    it("encodes characters with different changes if the ANY encode is used with an offset", () => {
      const wheel = new Wheel(ANY_ENCODER);
      expect(wheel.encode(0, 1)).toBe(3);
      expect(wheel.encode(1, 1)).toBe(2);
      expect(wheel.encode(12, 5)).toBe(7);
    });
  });

  describe("reverseEncode", () => {
    it("encodes characters with no change if the null encoder is used with no offset", () => {
      const wheel = new Wheel(NULL_ENCODER);
      expect(wheel.reverseEncode(0, 0)).toBe(0);
      expect(wheel.reverseEncode(12, 0)).toBe(12);
    });

    it("encodes characters with changes if the ROT1 encode is used with no offset", () => {
      const wheel = new Wheel(ROT1_ENCODER);
      expect(wheel.reverseEncode(1, 0)).toBe(0);
      expect(wheel.reverseEncode(13, 0)).toBe(12);
    });

    it("encodes characters with changes if the ANY encoder is used with no offset", () => {
      const wheel = new Wheel(ANY_ENCODER);
      expect(wheel.reverseEncode(5, 0)).toBe(0);
      expect(wheel.reverseEncode(17, 0)).toBe(12);
    });

    it("encodes characters with no changes if the null encoder is used with an offset", () => {
      const wheel = new Wheel(NULL_ENCODER);
      expect(wheel.reverseEncode(0, 1)).toBe(0);
      expect(wheel.reverseEncode(12, 5)).toBe(12);
    });

    it("encodes characters with the same changes if the ROT1 encode is used with an offset", () => {
      const wheel = new Wheel(ROT1_ENCODER);
      expect(wheel.reverseEncode(1, 1)).toBe(0);
      expect(wheel.reverseEncode(13, 5)).toBe(12);
    });

    it("encodes characters with different changes if the ANY encode is used with an offset", () => {
      const wheel = new Wheel(ANY_ENCODER);
      expect(wheel.reverseEncode(3, 1)).toBe(0);
      expect(wheel.reverseEncode(2, 1)).toBe(1);
      expect(wheel.reverseEncode(7, 5)).toBe(12);
    });
  });
});
