import { h, hs, PropType } from "librender";
import { Wheel as EnigmaWheel } from "libenigma";
import * as demos from "../demos.module.scss";
import { charToIndex, getLastAsciiLetter } from "./ascii-utils";

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
        const lastValidLetter = getLastAsciiLetter(
          input.value,
          rootElement.dataset.value
        );
        console.log(rootElement.dataset.value, input.value, lastValidLetter);
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
      const height = `${(count / max) * 8 * 18}px`;
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

function colorCycle(colors: string[]): () => string {
  let state = 87178291199 % 479001599;
  let lastColor = colors[0];

  return () => {
    let nextColor = colors[state % colors.length];
    while (nextColor === lastColor && state % 3 !== 0) {
      state = (state * 87178291199) % 479001599;
      nextColor = colors[state % colors.length];
    }

    state = (state * 87178291199) % 479001599;
    lastColor = nextColor;
    return nextColor;
  };
}

export function Wheel(initialMapping: EnigmaWheel) {
  const nextBackgroundColor = colorCycle([
    "#bda48c",
    "#c6b19c",
    "#ae8f72",
    "#b69a7f",
  ]);
  const halfAngle = 360 / 26 / 2;
  const angle = 360 / 26;

  const segments = [];
  const childGroups = [];
  const links = [];

  for (let idx = 0; idx < 26; idx += 1) {
    const angleLeft = 180 - angle * idx - halfAngle;
    const xLeft = Math.sin((Math.PI * 2 * angleLeft) / 360);
    const yLeft = Math.cos((Math.PI * 2 * angleLeft) / 360);
    const angleCenter = 180 - angle * idx;
    const xCenter = Math.sin((Math.PI * 2 * angleCenter) / 360);
    const yCenter = Math.cos((Math.PI * 2 * angleCenter) / 360);
    const angleRight = 180 - angle * idx + halfAngle;
    const xRight = Math.sin((Math.PI * 2 * angleRight) / 360);
    const yRight = Math.cos((Math.PI * 2 * angleRight) / 360);

    const segment = hs("polyline", {
      points: `${200 * xLeft},${200 * yLeft} 0,0 ${200 * xRight},${
        200 * yRight
      }`,
      stroke: "#3b3734",
      fill: nextBackgroundColor(),
      "stroke-width": "1",
    });
    const innerLabel = hs(
      "text",
      {
        x: 180 * xCenter,
        y: 180 * yCenter,
        "text-anchor": "middle",
        "dominant-baseline": "middle",
      },
      [String.fromCharCode(65 + idx)]
    );
    const outerLabel = hs(
      "text",
      {
        x: 220 * xCenter,
        y: 220 * yCenter,
        "text-anchor": "middle",
        "dominant-baseline": "middle",
      },
      [String.fromCharCode(65 + idx)]
    );

    const incomingNode = hs("circle", {
      cx: 150 * xCenter,
      cy: 150 * yCenter,
      r: 4,
      fill: "currentColor",
    });

    const outgoingNode = hs("circle", {
      cx: 90 * xCenter,
      cy: 90 * yCenter,
      r: 3,
      fill: "currentColor",
    });

    const endLetter = initialMapping.encodeForwards(idx, 0);
    const angleEndLetter = 180 - angle * endLetter;
    const xEndLetter = Math.sin((Math.PI * 2 * angleEndLetter) / 360);
    const yEndLetter = Math.cos((Math.PI * 2 * angleEndLetter) / 360);
    const link = hs("path", {
      d: `M${150 * xCenter} ${150 * yCenter}C${150 * xCenter} ${
        150 * yCenter + 18
      } ${90 * xEndLetter} ${90 * yEndLetter + 18} ${90 * xEndLetter} ${
        90 * yEndLetter
      }`,
      stroke: "currentColor",
      fill: "none",
    });

    segments.push(segment);
    childGroups.push(
      hs("g", [incomingNode, outgoingNode, innerLabel, outerLabel])
    );
    links.push(link);
  }

  return {
    element: hs(
      "svg",
      { className: demos.wheel, viewBox: "-200 -200 400 400" },
      [segments, childGroups, links]
    ),
  };
}
