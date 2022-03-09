import { h, render } from "librender";

import * as demos from "./demos.module.scss";

const TEXT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

let previousId = 0;
function demoId(): (name: string) => string {
  const prefix = `demo_${++previousId}_`;

  return (name: string): string => {
    return prefix + name;
  };
}

function isAscii(char: string) {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) return true;
  if (code >= 97 && code <= 122) return true;

  return false;
}

function getLastAsciiLetter(text: string): string {
  for (let idx = text.length - 1; idx >= 0; idx--) {
    if (isAscii(text[idx])) {
      return text[idx].toUpperCase();
    }
  }

  return "";
}

function singleLetterInput(
  initialKey: string,
  props?: Partial<HTMLInputElement>
) {
  let rootElement: HTMLElement;

  const cycleInputUp = () => {
    const nextLetter = input.value.charCodeAt(0) + 1;
    if (nextLetter < 65 || nextLetter > 90 || isNaN(nextLetter)) {
      input.value = "A";
    } else {
      input.value = String.fromCharCode(nextLetter);
    }
    rootElement.dispatchEvent(new Event("change"));
  };
  const cycleInputDown = () => {
    const prevLetter = input.value.charCodeAt(0) - 1;
    if (prevLetter < 65 || prevLetter > 90 || isNaN(prevLetter)) {
      input.value = "Z";
    } else {
      input.value = String.fromCharCode(prevLetter);
    }
    rootElement.dispatchEvent(new Event("change"));
  };
  const input = h(
    "input",
    {
      ...props,
      value: initialKey.toUpperCase(),
      className: demos.singleLetterInput,
      oninput: () => {
        const lastValidLetter = getLastAsciiLetter(input.value);
        if (input.value === lastValidLetter) return;

        input.value = lastValidLetter;
        rootElement.dispatchEvent(new Event("change"));
      },
      onkeydown: (e) => {
        if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          input.value = "";
          rootElement.dispatchEvent(new Event("change"));
        } else if (e.key === "PageUp") {
          e.preventDefault();
          input.value = "A";
          rootElement.dispatchEvent(new Event("change"));
        } else if (e.key === "PageDown") {
          e.preventDefault();
          input.value = "Z";
          rootElement.dispatchEvent(new Event("change"));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          cycleInputUp();
          rootElement.dispatchEvent(new Event("change"));
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          cycleInputDown();
          rootElement.dispatchEvent(new Event("change"));
        }
      },
    },
    []
  );

  return (rootElement = h(
    "div",
    { className: demos.singleLetterInputContainer },
    [
      h(
        "button",
        {
          className: demos.singleLetterInputChangers,
          onclick: cycleInputUp,
          tabIndex: -1,
        },
        ["+"]
      ),
      input,
      h(
        "button",
        {
          className: demos.singleLetterInputChangers,
          onclick: cycleInputDown,
          tabIndex: -1,
        },
        ["-"]
      ),
    ]
  ));
}

(() => {
  const id = demoId();

  function encrypt(text: string, key: string): string {
    const keyCode = key.charCodeAt(0);

    const result = [];
    for (const char of text) {
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

    return result.join("");
  }

  const keyInput = singleLetterInput("D", { id: id("key") });
  const plaintextInput = h(
    "textarea",
    { id: id("plain"), className: `${demos.inputBox}` },
    [TEXT]
  );
  const cypherInput = h("textarea", {
    id: id("cypher"),
    readOnly: true,
    className: `${demos.inputBox}`,
  });

  render(
    document.getElementById("caeser-demo")!,
    h("div", {}, [
      h("div", { className: demos.inputRow }, [
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: plaintextInput.id }, [
            "Plaintext",
          ]),
          plaintextInput,
        ]),
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: keyInput.id }, ["Key"]),
          keyInput,
        ]),
        h("div", { className: demos.inputColumn }, [
          h("label", { className: demos.label, htmlFor: cypherInput.id }, [
            "Cyphertext",
          ]),
          cypherInput,
        ]),
      ]),
    ])
  );

  plaintextInput.addEventListener("input", () => {
    cypherInput.value = encrypt(
      plaintextInput.value,
      (keyInput.children[1] as HTMLInputElement).value || "A"
    );
  });

  keyInput.addEventListener("change", () => {
    cypherInput.value = encrypt(
      plaintextInput.value,
      (keyInput.children[1] as HTMLInputElement).value || "A"
    );
  });

  cypherInput.value = encrypt(
    plaintextInput.value,
    (keyInput.children[1] as HTMLInputElement).value || "A"
  );
})();
