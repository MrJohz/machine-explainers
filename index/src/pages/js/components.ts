import { h, PropType } from "librender";
import * as demos from "../demos.module.scss";
import { charToIndex, getLastAsciiLetter, isAscii } from "./ascii-utils";

export type Component<T = {}> = HTMLElement & {
  dataset: HTMLElement["dataset"] & T;
};

export function SingleLetterInput(
  initialKey: string,
  props?: PropType<HTMLInputElement>
): Component<{ value: string }> {
  let rootElement: Component<{ value: string }>;

  const cycleInputUp = () => {
    const nextLetter = input.value.charCodeAt(0) + 1;
    if (nextLetter < 65 || nextLetter > 90 || isNaN(nextLetter)) {
      rootElement.dataset.value = "A";
      input.value = "A";
    } else {
      const letter = String.fromCharCode(nextLetter);
      rootElement.dataset.value = letter;
      input.value = letter;
    }
    rootElement.dispatchEvent(new Event("change"));
  };
  const cycleInputDown = () => {
    const prevLetter = input.value.charCodeAt(0) - 1;
    if (prevLetter < 65 || prevLetter > 90 || isNaN(prevLetter)) {
      rootElement.dataset.value = "Z";
      input.value = "Z";
    } else {
      const letter = String.fromCharCode(prevLetter);
      rootElement.dataset.value = letter;
      input.value = letter;
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
        rootElement.dataset.value = lastValidLetter;
        rootElement.dispatchEvent(new Event("change"));
      },
      onkeydown: (e) => {
        if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          input.value = "";
          rootElement.dataset.value = "";
          rootElement.dispatchEvent(new Event("change"));
        } else if (e.key === "PageUp") {
          e.preventDefault();
          input.value = "A";
          rootElement.dataset.value = "A";
          rootElement.dispatchEvent(new Event("change"));
        } else if (e.key === "PageDown") {
          e.preventDefault();
          input.value = "Z";
          rootElement.dataset.value = "Z";
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

  rootElement = h("div", { className: demos.singleLetterInputContainer }, [
    h(
      "button",
      {
        className: demos.singleLetterInputChangers,
        onclick: cycleInputUp,
        "aria-hidden": "true",
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
        "aria-hidden": "true",
        tabIndex: -1,
      },
      ["-"]
    ),
  ]) as unknown as Component<{ value: string }>;

  rootElement.dataset.value = initialKey.toUpperCase();
  return rootElement;
}

type Histogram = { element: Component; updateHeight: (text: string) => void };

export function Histogram(): Histogram {
  const bars: HTMLElement[] = [];
  const labels: HTMLElement[] = [];
  for (let idx = 0; idx < 26; idx++) {
    bars.push(h("div"));
    labels.push(h("div", [String.fromCharCode(65 + idx)]));
  }

  // create the counts array once here,
  // rather than creating it again each time
  // we want to update the heights of the bars
  const counts = new Array(26).fill(0);

  function updateHeight(text: string) {
    for (const letter of text) {
      const index = charToIndex(letter);
      if (index == null) continue;

      counts[index] += 1;
    }

    const max = Math.max(...counts);

    for (let idx = 0; idx < 26; idx++) {
      const count = counts[idx];
      const height = `${(count / max) * 100}%`;
      bars[idx].style.height = height;
      // because the counts array is reused between calls to `updateHeight`,
      // we need to make sure we reset it after every call
      counts[idx] = 0;
    }
  }

  return {
    element: h("div", { className: demos.histogram, "aria-hidden": "true" }, [
      h("div", { className: demos.histogramBars }, bars),
      h("div", { className: demos.histogramLabels }, labels),
    ]),
    updateHeight,
  };
}
