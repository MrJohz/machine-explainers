import { h, render, idGroup } from "librender";
import { Encoding, Wheel as EnigmaWheel } from "libenigma";

import * as demos from "./demos.module.scss";

import {
  charToIndex,
  getLastAsciiLetter,
  indexToChar,
  isAscii,
} from "./js/ascii-utils";
import { Histogram, SingleLetterInput, Wheel } from "./js/components";

const TEXT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

(() => {
  const id = idGroup();

  const keyInput = SingleLetterInput("D", { id: id("key") });
  const plaintextInput = h("textarea", {
    id: id("plain"),
    className: `${demos.inputBox}`,
    value: TEXT,
  });
  const cypherInput = h("textarea", {
    id: id("cypher"),
    readOnly: true,
    className: `${demos.inputBox}`,
  });

  const plaintextHistogram = Histogram();
  const cyphertextHistogram = Histogram();

  function encrypt() {
    const keyCode = (keyInput.dataset.value || "A").charCodeAt(0);

    const result = [];
    for (const char of plaintextInput.value) {
      if (!isAscii(char)) {
        result.push(char);
        continue;
      }

      const charCode = char.toUpperCase().charCodeAt(0);
      const newCode = charCode + (keyCode - 64);

      if (newCode > 90) {
        result.push(String.fromCharCode(newCode - 26));
      } else {
        result.push(String.fromCharCode(newCode));
      }
    }

    cypherInput.value = result.join("");
    plaintextHistogram.updateHeight(plaintextInput.value);
    cyphertextHistogram.updateHeight(cypherInput.value);
  }

  plaintextInput.addEventListener("input", encrypt);
  keyInput.addEventListener("change", encrypt);
  encrypt();

  render(
    document.getElementById("caeser-demo")!,
    h("div", [
      h("div", { className: demos.inputRow }, [
        h("div", { className: demos.helpText }, [
          h("p", ["Use the buttons or your keyboard to change the key input."]),
          h("p", [
            "Change the plaintext to see how the cyphertext and letter distributions change.",
          ]),
        ]),
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: id("key") }, ["Key"]),
          keyInput,
        ]),
      ]),
      h("div", { className: demos.inputRow }, [
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: plaintextInput.id }, [
            "Plaintext",
          ]),
          plaintextInput,
          plaintextHistogram.element,
        ]),
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: cypherInput.id }, [
            "Cyphertext",
          ]),
          cypherInput,
          cyphertextHistogram.element,
        ]),
      ]),
    ])
  );
})();

(() => {
  const id = idGroup();

  const INPUT_LETTERS = ["E", "N", "I", "G", "M", "A"];

  const keyInputs = [
    SingleLetterInput(INPUT_LETTERS[0], { "aria-labelledby": id("key") }),
    SingleLetterInput(INPUT_LETTERS[1], { "aria-labelledby": id("key") }),
    SingleLetterInput(INPUT_LETTERS[2], { "aria-labelledby": id("key") }),
  ];
  const plaintextInput = h("textarea", {
    id: id("plain"),
    className: `${demos.inputBox}`,
    value: TEXT,
  });
  const cypherInput = h("textarea", {
    id: id("cypher"),
    readOnly: true,
    className: `${demos.inputBox}`,
  });

  const plaintextHistogram = Histogram();
  const cyphertextHistogram = Histogram();

  const keyInputsContainer = h("div", { className: demos.keyGroup }, keyInputs);

  const addKeyButton = h("button", { className: demos.button }, ["Add Key"]);
  const removeKeyButton = h("button", { className: demos.button }, [
    "Remove Key",
  ]);

  function encrypt() {
    let keyIndex = 0;
    const keyCodes = keyInputs.map(
      (input) => (input.dataset.value || "A").charCodeAt(0) - 64
    );

    const result = [];
    for (const char of plaintextInput.value) {
      if (!isAscii(char)) {
        result.push(char);
        continue;
      }

      const charCode = char.toUpperCase().charCodeAt(0);
      const newCode = charCode + keyCodes[keyIndex];
      keyIndex = (keyIndex + 1) % keyCodes.length;

      if (newCode > 90) {
        result.push(String.fromCharCode(newCode - 26));
      } else {
        result.push(String.fromCharCode(newCode));
      }
    }

    cypherInput.value = result.join("");
    plaintextHistogram.updateHeight(plaintextInput.value);
    cyphertextHistogram.updateHeight(cypherInput.value);
  }

  plaintextInput.addEventListener("input", encrypt);
  for (const keyInput of keyInputs) {
    keyInput.addEventListener("change", encrypt);
  }

  addKeyButton.addEventListener("click", () => {
    if (keyInputs.length === INPUT_LETTERS.length) return;

    const newInput = SingleLetterInput(INPUT_LETTERS[keyInputs.length], {
      "aria-labelledby": id("key"),
    });
    newInput.addEventListener("change", encrypt);
    keyInputs.push(newInput);
    keyInputsContainer.appendChild(newInput);
    encrypt();
  });

  removeKeyButton.addEventListener("click", () => {
    if (keyInputs.length === 1) return;
    const oldInput = keyInputs.pop();
    oldInput?.remove();
    encrypt();
  });

  encrypt();

  render(
    document.getElementById("long-key-demo")!,
    h("div", [
      h("div", { className: demos.inputRow }, [
        h("div", { className: demos.inputColumn }, [
          h("label", { id: id("key"), className: demos.label }, ["Key"]),
          keyInputsContainer,
        ]),
        h(
          "div",
          { className: `${demos.inputColumn} ${demos.addButtonColumn}` },
          [addKeyButton, removeKeyButton]
        ),
      ]),
      h("div", { className: demos.inputRow }, [
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: plaintextInput.id }, [
            "Plaintext",
          ]),
          plaintextInput,
          plaintextHistogram.element,
        ]),
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: cypherInput.id }, [
            "Cyphertext",
          ]),
          cypherInput,
          cyphertextHistogram.element,
        ]),
      ]),
    ])
  );
})();

(() => {
  const id = idGroup();

  const encoder = new EnigmaWheel("ROTOR I", Encoding.ROTOR_I, []);

  const wheel = Wheel(0, encoder);
  const input = h("input", {
    id: id("input"),
    className: demos.lineInput,
    placeholder: "...",
  });
  const output = h("input", {
    id: id("output"),
    className: demos.lineInput,
  });

  input.addEventListener("input", () => {
    const lastLetter = getLastAsciiLetter(input.value, "");
    const result = [];
    let rotation = 0;
    for (const letter of input.value) {
      if (!isAscii(letter)) {
        result.push(letter);
        continue;
      }

      rotation += 1;
      result.push(
        indexToChar(encoder.encodeForwards(charToIndex(letter)!, rotation))
      );
    }
    output.value = result.join("");
    output.scrollLeft = output.scrollWidth;
    if (lastLetter === "") {
      wheel.rotate(rotation);
      wheel.resetHighlight();
    } else {
      wheel.rotate(rotation);
      wheel.highlightLetter(lastLetter);
    }
  });

  render(
    document.getElementById("single-wheel-demo")!,
    h("div", [
      h("div", { className: demos.inputRow }, [wheel.element]),
      h("div", { className: demos.inputRow }, [
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: input.id }, [
            "Plaintext",
          ]),
          input,
        ]),
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: input.id }, [
            "Plaintext",
          ]),
          output,
        ]),
      ]),
    ])
  );
})();
