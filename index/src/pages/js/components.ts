import { h, hs, PropType, idGroup } from "librender";
import { Wheel as EnigmaWheel } from "libenigma";
import * as demos from "../demos.module.scss";
import * as wheelStyles from "./wheel.module.scss";
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

function wheelPositions(letterIndex: number) {
  const halfAngle = 360 / 26 / 2;
  const angle = 360 / 26;
  const index = letterIndex % 26;

  const angleLeft = 180 - angle * index - halfAngle;
  const angleCenter = 180 - angle * index;
  const angleRight = 180 - angle * index + halfAngle;

  return {
    left: {
      x: Math.sin((Math.PI * 2 * angleLeft) / 360),
      y: Math.cos((Math.PI * 2 * angleLeft) / 360),
    },
    center: {
      x: Math.sin((Math.PI * 2 * angleCenter) / 360),
      y: Math.cos((Math.PI * 2 * angleCenter) / 360),
    },
    right: {
      x: Math.sin((Math.PI * 2 * angleRight) / 360),
      y: Math.cos((Math.PI * 2 * angleRight) / 360),
    },
  };
}

export function Wheel(initialRotation: number, initialMapping: EnigmaWheel) {
  const wheelId = idGroup("wheel-cpt");
  const nextBackgroundColor = colorCycle([
    "#bda48c",
    "#c6b19c",
    "#ae8f72",
    "#b69a7f",
  ]);

  const childGroups: SVGElement[] = [];
  const edgeTexts: SVGElement[] = [];
  const links: SVGElement[] = [];

  const labelPathDirections = [
    `M${175 * Math.sin((Math.PI * 2 * 260) / 360)} ${
      175 * Math.cos((Math.PI * 2 * 260) / 360)
    }`,
  ];
  for (let angle = 250; angle > 180; angle -= 10) {
    const handleAngle = (Math.PI * 2 * (angle + 5)) / 360;
    const finalAngle = (Math.PI * 2 * angle) / 360;
    const handleX = 175 * Math.sin(handleAngle);
    const handleY = 175 * Math.cos(handleAngle);
    const finalX = 175 * Math.sin(finalAngle);
    const finalY = 175 * Math.cos(finalAngle);
    labelPathDirections.push(
      `C${handleX} ${handleY} ${handleX} ${handleY} ${finalX} ${finalY}`
    );
  }

  const labelPath = hs("path", {
    id: wheelId("label-path"),
    d: labelPathDirections.join(""),
    fill: "none",
  });
  const label = hs(
    "text",
    {
      class: wheelStyles.wheelLabel,
      width: 200,
    },
    [hs("textPath", { href: `#${labelPath.id}` }, [initialMapping.name])]
  );

  let currentRotation = initialRotation;

  for (let idx = 0; idx < 26; idx += 1) {
    const { left, right, center } = wheelPositions(idx);

    const segment = hs("polyline", {
      class: wheelStyles.segment,
      points: `${200 * left.x},${200 * left.y} 0,0 ${200 * right.x},${
        200 * right.y
      }`,
      stroke: "#3b3734",
      fill: nextBackgroundColor(),
      "stroke-width": "1",
    });
    const outerLabel = hs(
      "text",
      {
        class: wheelStyles.outerLabel,
        x: 220 * center.x,
        y: 220 * center.y,
        fill: "currentColor",
        "text-anchor": "middle",
        "dominant-baseline": "middle",
      },
      [String.fromCharCode(65 + idx)]
    );

    const incomingNode = hs("circle", {
      cx: 150 * center.x,
      cy: 150 * center.y,
      r: 4,
      fill: "currentColor",
    });

    const outgoingNode = hs("circle", {
      cx: 90 * center.x,
      cy: 90 * center.y,
      r: 3,
      fill: "currentColor",
    });

    const { center: endLetter } = wheelPositions(
      initialMapping.encodeForwards(idx, 0)
    );
    const link = hs("path", {
      class: wheelStyles.link,
      d: `M${150 * center.x} ${150 * center.y}C${130 * center.x} ${
        130 * center.y
      } ${60 * endLetter.x} ${60 * endLetter.y} ${90 * endLetter.x} ${
        90 * endLetter.y
      }`,
      stroke: "currentColor",
      fill: "none",
    });

    const group = hs(
      "g",
      {
        class: wheelStyles.segmentGroup,
        style: `transform:rotate(-${initialRotation * (360 / 26)}deg)`,
      },
      [segment, incomingNode, outgoingNode]
    );

    group.addEventListener("mouseenter", () => {
      group.classList.add(wheelStyles.hover);
      link.classList.add(wheelStyles.hover);
    });
    group.addEventListener("mouseleave", () => {
      group.classList.remove(wheelStyles.hover);
      link.classList.remove(wheelStyles.hover);
    });

    childGroups.push(group);
    links.push(link);
    edgeTexts.push(outerLabel);
  }

  const diagram = hs(
    "svg",
    { class: wheelStyles.wheel, viewBox: "-200 -200 400 400" },
    [childGroups, links, edgeTexts, labelPath, label]
  );

  diagram.addEventListener("mouseenter", () => {
    diagram.classList.add(wheelStyles.hover);
  });
  diagram.addEventListener("mouseleave", () => {
    diagram.classList.remove(wheelStyles.hover);
  });

  function rotate(position: string | number = 0) {
    const index =
      typeof position === "string" ? charToIndex(position) : position;
    if (index == null) return;
    currentRotation = index;

    label.style.transform = `rotate(-${currentRotation * (360 / 26)}deg)`;

    for (let idx = 0; idx < 26; idx++) {
      links[idx].style.transform = `rotate(-${
        currentRotation * (360 / 26)
      }deg)`;
      childGroups[idx].style.transform = `rotate(-${
        currentRotation * (360 / 26)
      }deg)`;
    }
  }

  function highlightLetter(position: string | number) {
    let index = typeof position === "string" ? charToIndex(position) : position;
    if (index == null) return;

    const rotatedIndex = (index + currentRotation) % 26;
    const outputIndex = initialMapping.encodeForwards(index, currentRotation);

    for (let idx = 0; idx < 26; idx++) {
      if (idx === rotatedIndex) {
        childGroups[idx].classList.add(wheelStyles.highlighted);
        links[idx].classList.add(wheelStyles.highlighted);
      } else {
        childGroups[idx].classList.remove(wheelStyles.highlighted);
        links[idx].classList.remove(wheelStyles.highlighted);
      }

      if (idx === outputIndex) {
        edgeTexts[idx].classList.add(wheelStyles.highlightedOutput);
      } else {
        edgeTexts[idx].classList.remove(wheelStyles.highlightedOutput);
      }

      if (idx === index) {
        edgeTexts[idx].classList.add(wheelStyles.highlighted);
      } else {
        edgeTexts[idx].classList.remove(wheelStyles.highlighted);
      }
    }
  }

  function resetHighlight() {
    for (let idx = 0; idx < 26; idx++) {
      childGroups[idx].classList.remove(wheelStyles.highlighted);
      links[idx].classList.remove(wheelStyles.highlighted);
      edgeTexts[idx].classList.remove(
        wheelStyles.highlighted,
        wheelStyles.highlightedOutput
      );
    }
  }

  return {
    element: diagram,
    rotate,
    highlightLetter,
    resetHighlight,
  };
}
