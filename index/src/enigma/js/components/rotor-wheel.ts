import { Wheel as EnigmaWheel } from "libenigma";
import { idGroup, hs } from "librender";
import { charToIndex } from "../ascii-utils";
import * as styles from "./rotor-wheel.module.scss";

export function RotorWheel(
  initialRotation: number,
  initialMapping: EnigmaWheel
) {
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
      class: styles.wheelLabel,
      width: 200,
    },
    [hs("textPath", { href: `#${labelPath.id}` }, [initialMapping.name])]
  );

  let currentRotation = initialRotation;

  for (let idx = 0; idx < 26; idx += 1) {
    const { left, right, center } = wheelPositions(idx);

    const segment = hs("polyline", {
      class: styles.segment,
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
        class: styles.outerLabel,
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
      class: styles.link,
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
        class: styles.segmentGroup,
        style: `transform:rotate(-${initialRotation * (360 / 26)}deg)`,
      },
      [segment, incomingNode, outgoingNode]
    );

    group.addEventListener("mouseenter", () => {
      group.classList.add(styles.hover);
      link.classList.add(styles.hover);
    });
    group.addEventListener("mouseleave", () => {
      group.classList.remove(styles.hover);
      link.classList.remove(styles.hover);
    });

    childGroups.push(group);
    links.push(link);
    edgeTexts.push(outerLabel);
  }

  const diagram = hs(
    "svg",
    { class: styles.wheel, viewBox: "-200 -200 400 400" },
    [childGroups, links, edgeTexts, labelPath, label]
  );

  diagram.addEventListener("mouseenter", () => {
    diagram.classList.add(styles.hover);
  });
  diagram.addEventListener("mouseleave", () => {
    diagram.classList.remove(styles.hover);
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
        childGroups[idx].classList.add(styles.highlighted);
        links[idx].classList.add(styles.highlighted);
      } else {
        childGroups[idx].classList.remove(styles.highlighted);
        links[idx].classList.remove(styles.highlighted);
      }

      if (idx === outputIndex) {
        edgeTexts[idx].classList.add(styles.highlightedOutput);
      } else {
        edgeTexts[idx].classList.remove(styles.highlightedOutput);
      }

      if (idx === index) {
        edgeTexts[idx].classList.add(styles.highlighted);
      } else {
        edgeTexts[idx].classList.remove(styles.highlighted);
      }
    }
  }

  function resetHighlight() {
    for (let idx = 0; idx < 26; idx++) {
      childGroups[idx].classList.remove(styles.highlighted);
      links[idx].classList.remove(styles.highlighted);
      edgeTexts[idx].classList.remove(
        styles.highlighted,
        styles.highlightedOutput
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
