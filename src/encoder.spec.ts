import { Encoding } from "./encoding";

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

describe("Encoder", () => {
  describe("encode", () => {
    it("encodes characters with no change if the null encoder is used with no offset", () => {
      const encoder = new Encoding(NULL_ENCODER);
      expect(encoder.encode(0)).toBe(0);
      expect(encoder.encode(12)).toBe(12);
    });

    it("encodes characters with changes if the ROT1 encode is used with no offset", () => {
      const encoder = new Encoding(ROT1_ENCODER);
      expect(encoder.encode(0)).toBe(1);
      expect(encoder.encode(12)).toBe(13);
    });

    it("encodes characters with changes if the ANY encoder is used with no offset", () => {
      const encoder = new Encoding(ANY_ENCODER);
      expect(encoder.encode(0)).toBe(5);
      expect(encoder.encode(12)).toBe(17);
    });
  });
});
