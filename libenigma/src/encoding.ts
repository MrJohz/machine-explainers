import { letterToRotation } from "./letter-utils";

export function reverseEncoding(encoding: ReadonlyArray<number>): number[] {
  if (encoding.length !== 26)
    throw new Error("Encoding array must be 26 elements long");

  const result = new Array(26);
  for (let idx = 0; idx < encoding.length; idx++) {
    const encoded = encoding[idx];
    result[encoded] = idx;
  }

  return result;
}

export class Encoding {
  #encoding: ReadonlyArray<number>;

  constructor(encoding: number[]) {
    this.#encoding = encoding;
  }

  static fromIndices(encoding: number[]) {
    return new Encoding(encoding);
  }

  static fromString(encoding: string) {
    return new Encoding(Array.from(encoding, letterToRotation));
  }

  static get ROTOR_I(): Encoding {
    return Encoding.fromString("EKMFLGDQVZNTOWYHXUSPAIBRCJ");
  }

  static get ROTOR_II(): Encoding {
    return Encoding.fromString("AJDKSIRUXBLHWTMCQGZNPYFVOE");
  }

  encode(index: number): number {
    return this.#encoding[index];
  }

  inverted(): Encoding {
    return new Encoding(reverseEncoding(this.#encoding));
  }
}
