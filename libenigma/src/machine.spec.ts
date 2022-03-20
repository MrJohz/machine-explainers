import { Encoding } from "./encoding";
import { letterToRotation } from "./letter-utils";
import { EnigmaMachine, Wheel } from "./machine";

describe("EnigmaMachine", () => {
  describe("type", () => {
    it("runs through a sample encoding successfully", () => {
      const ROTOR_I = new Wheel(
        "ROTOR I",
        Encoding.fromString("EKMFLGDQVZNTOWYHXUSPAIBRCJ"),
        [letterToRotation("Q")]
      );
      const ROTOR_II = new Wheel(
        "ROTOR II",
        Encoding.fromString("AJDKSIRUXBLHWTMCQGZNPYFVOE"),
        [letterToRotation("E")]
      );
      const ROTOR_III = new Wheel(
        "ROTOR III",
        Encoding.fromString("BDFHJLCPRTXVZNYEIWGAKMUSQO"),
        [letterToRotation("V")]
      );

      const REFLECTOR = Encoding.fromString("YRUHQSLDPXNGOKMIEBFZCWVJAT");

      const machine = new EnigmaMachine(3);
      machine.setReflector(REFLECTOR);
      machine.setWheel(0, ROTOR_III, "A");
      machine.setWheel(1, ROTOR_II, "A");
      machine.setWheel(2, ROTOR_I, "A");

      expect(machine.type("A")).toBe("B");
      expect(machine.type("A")).toBe("D");
      expect(machine.type("A")).toBe("Z");
      expect(machine.type("A")).toBe("G");
      expect(machine.type("A")).toBe("O");
    });
  });
});
