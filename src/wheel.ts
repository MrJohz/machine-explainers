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

export class Wheel {
  #encoding: number[];
  #reverseEncoding: number[];

  constructor(encoding: number[]) {
    this.#encoding = encoding;
    this.#reverseEncoding = reverseEncoding(encoding);
  }

  encode(index: number, rotation: number): number {
    return this.#applyEncoding(index, rotation, this.#encoding);
  }

  reverseEncode(index: number, rotation: number): number {
    return this.#applyEncoding(index, rotation, this.#reverseEncoding);
  }

  #applyEncoding(index: number, rotation: number, encoder: number[]): number {
    const letterOnWheel = (index + rotation) % 26;
    const encodedLetterOnWheel = encoder[letterOnWheel];
    return (((encodedLetterOnWheel - rotation) % 26) + 26) % 26;
  }
}
