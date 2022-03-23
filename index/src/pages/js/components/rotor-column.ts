import { Wheel as EnigmaWheel } from "libenigma";
import { hs } from "librender";
import { charToIndex, indexToChar } from "../ascii-utils";

import * as styles from "./rotor-column.module.scss";

export function RotorColumn(
  initialRotation: number,
  initialMapping: EnigmaWheel
) {
  const inputTexts: SVGElement[] = [];
  const outputTexts: SVGElement[] = [];
  const links: SVGPathElement[] = [];

  let currentRotation = initialRotation;

  for (let idx = 0; idx < 26; idx++) {
    const left = -30;
    const right = 130;

    const y = (idx / 26) * 475 - 175;
    const otherY =
      (initialMapping.encodeForwards(idx, initialRotation) / 26) * 475 - 175;

    const textAttrs = {
      "text-anchor": "middle",
      "dominant-baseline": "middle",
    };
    inputTexts.push(
      hs("text", { x: left, y, ...textAttrs }, [indexToChar(idx)])
    );

    outputTexts.push(
      hs("text", { x: right, y, ...textAttrs }, [indexToChar(idx)])
    );

    links.push(
      hs("path", {
        class: styles.link,
        d: `M${left + 30} ${y}C${left + 50} ${y} ${right - 50} ${otherY} ${
          right - 30
        } ${otherY}`,
        stroke: "currentColor",
        fill: "none",
      })
    );
  }

  return {
    element: hs("svg", { class: styles.container, viewBox: "0 0 100 100" }, [
      inputTexts,
      outputTexts,
      links,
    ]),
    rotate(position: string | number = 0) {
      console.log("rottain");
      const index =
        typeof position === "string" ? charToIndex(position) : position;
      if (index == null) return;

      currentRotation = index;

      for (let idx = 0; idx < 26; idx++) {
        const left = -30;
        const right = 130;

        const y = (idx / 26) * 475 - 175;
        const otherY =
          (initialMapping.encodeForwards(idx, currentRotation) / 26) * 475 -
          175;

        links[idx].setAttribute(
          "d",
          `M${left + 30} ${y}C${left + 50} ${y} ${right - 50} ${otherY} ${
            right - 30
          } ${otherY}`
        );
      }
    },
    highlightLetter(letter: string) {
      const index = charToIndex(letter);
      if (index == null) return;

      const outputIndex = initialMapping.encodeForwards(index, currentRotation);

      for (let idx = 0; idx < 26; idx++) {
        if (idx === index) {
          inputTexts[idx].classList.add(styles.highlighted);
          links[idx].classList.add(styles.highlighted);
        } else {
          inputTexts[idx].classList.remove(styles.highlighted);
          links[idx].classList.remove(styles.highlighted);
        }

        if (idx === outputIndex) {
          outputTexts[idx].classList.add(styles.highlighted);
        } else {
          outputTexts[idx].classList.remove(styles.highlighted);
        }
      }
    },
    resetHighlight() {
      for (let idx = 0; idx < 26; idx++) {
        inputTexts[idx].classList.remove(styles.highlighted);
        links[idx].classList.remove(styles.highlighted);
        outputTexts[idx].classList.remove(styles.highlighted);
      }
    },
  };
}
