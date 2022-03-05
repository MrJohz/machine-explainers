export function reverseEncoding(encoding: number[]): number[] {
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
  #encoding: number[];

  constructor(encoding: number[]) {
    this.#encoding = encoding;
  }

  encode(index: number): number {
    return this.#encoding[index];
  }

  inverted(): Encoding {
    return new Encoding(reverseEncoding(this.#encoding));
  }
}
