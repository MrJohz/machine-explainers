import { letterToRotation, rotationToLetter } from "./letter-utils";
import { Encoding } from "./encoding";

export class Wheel {
  name: string;

  #forward: Encoding;
  #backward: Encoding;
  #notches: number[];

  constructor(name: string, encoding: Encoding, notches: number[]) {
    this.name = name;
    this.#forward = encoding;
    this.#backward = encoding.inverted();
    this.#notches = notches;
  }

  encodeForwards(index: number | string, rotation: number): number {
    return this.#encodeWithRotation(index, rotation, this.#forward);
  }

  encodeBackwards(index: number | string, rotation: number): number {
    return this.#encodeWithRotation(index, rotation, this.#backward);
  }

  #encodeWithRotation(
    index: number | string,
    rotation: number,
    encoding: Encoding
  ): number {
    const realIndex =
      typeof index === "string" ? letterToRotation(index) : index;
    const letterOnWheel = (realIndex + rotation) % 26;
    const encodedLetterOnWheel = encoding.encode(letterOnWheel);
    return (((encodedLetterOnWheel - rotation) % 26) + 26) % 26;
  }

  shouldStepNext(currentRotation: number): boolean {
    return this.#notches.includes(currentRotation);
  }
}

export class EnigmaMachine {
  #wheelBankSize: number;
  #wheels: ([Wheel, number] | undefined)[];
  #reflector: Encoding | undefined;

  constructor(numberOfWheels: number) {
    this.#wheelBankSize = numberOfWheels;
    this.#wheels = new Array(numberOfWheels);
    this.#reflector = undefined;
  }

  isReady(): boolean {
    return (
      this.#reflector !== undefined &&
      this.#wheels.every((each) => each !== undefined)
    );
  }

  setReflector(reflector: Encoding): void {
    this.#reflector = reflector;
  }

  removeReflector(): void {
    this.#reflector = undefined;
  }

  setWheel(position: number, wheel: Wheel, initialRotation: string): void {
    if (position > this.#wheelBankSize - 1 || position < 0) {
      throw new Error(`position must be between 0 and ${this.#wheelBankSize}`);
    }

    this.#wheels[position] = [wheel, letterToRotation(initialRotation)];
  }

  removeWheel(position: number): void {
    if (position > this.#wheelBankSize - 1 || position < 0) {
      throw new Error(`position must be between 0 and ${this.#wheelBankSize}`);
    }

    this.#wheels[position] = undefined;
  }

  type(letter: string): string {
    if (letter.length !== 1)
      throw new Error("can only type one letter at a time");
    if (!this.isReady())
      throw new Error("can only type when ready, missing components");

    let letterIndex = letterToRotation(letter);
    let shouldStepNext = true; // always step on first rotation

    for (const wheel of this.#wheels) {
      if (!wheel) throw new Error("InternalError");

      if (shouldStepNext) {
        const previousRotation = wheel[1];
        wheel[1] = (previousRotation + 1) % 26;
        shouldStepNext = wheel[0].shouldStepNext(previousRotation);
      }

      letterIndex = wheel[0].encodeForwards(letterIndex, wheel[1]);
    }

    const reflector = this.#reflector;
    if (!reflector) throw new Error("InternalError");
    letterIndex = reflector.encode(letterIndex);

    for (let idx = this.#wheels.length - 1; idx >= 0; idx--) {
      const wheel = this.#wheels[idx];
      if (!wheel) throw new Error("InternalError");

      letterIndex = wheel[0].encodeBackwards(letterIndex, wheel[1]);
    }

    return rotationToLetter(letterIndex);
  }
}
