import { h, render } from "librender";

import * as demos from "./demos.module.scss";

import { isAscii } from "./js/ascii-utils";
import { Histogram, SingleLetterInput } from "./js/components";

const TEXT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

let previousId = 0;
function demoId(): (name: string) => string {
  const prefix = `demo_${++previousId}_`;

  return (name: string): string => {
    return prefix + name;
  };
}

(() => {
  const id = demoId();

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
      const newCode = charCode + (keyCode - 65);

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
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: plaintextInput.id }, [
            "Plaintext",
          ]),
          plaintextInput,
        ]),
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: id("key") }, ["Key"]),
          keyInput,
        ]),
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: cypherInput.id }, [
            "Cyphertext",
          ]),
          cypherInput,
        ]),
      ]),
      h("div", { className: demos.inputRow }, [
        plaintextHistogram.element,
        cyphertextHistogram.element,
      ]),
    ])
  );
})();
