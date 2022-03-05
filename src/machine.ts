import { letterToPosition } from "./letter-utils";
import { Wheel } from "./wheel";

export class EnigmaMachine {
  #wheelBankSize: number;
  #wheels: ([Wheel, number] | undefined)[];
  #reflector: Wheel | undefined;

  constructor(numberOfWheels: number) {
    this.#wheelBankSize = numberOfWheels;
    this.#wheels = new Array(numberOfWheels);
    this.#reflector = undefined;
  }

  isValid(): boolean {
    return (
      this.#reflector !== undefined &&
      this.#wheels.every((each) => each !== undefined)
    );
  }

  setWheel(position: number, wheel: Wheel, initialPosition: string): void {
    if (position > this.#wheelBankSize - 1 || position < 0) {
      throw new Error(`position must be between 0 and ${this.#wheelBankSize}`);
    }

    this.#wheels[position] = [wheel, letterToPosition(initialPosition)];
  }

  removeWheel(position: number): void {
    if (position > this.#wheelBankSize - 1 || position < 0) {
      throw new Error(`position must be between 0 and ${this.#wheelBankSize}`);
    }

    this.#wheels[position] = undefined;
  }
}
