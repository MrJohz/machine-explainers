import { Wheel as EnigmaWheel } from "libenigma";
import { hs } from "librender";

import * as styles from "./rotor-column.module.scss";

export function RotorColumn(
  initialRotation: number,
  initialMapping: EnigmaWheel
) {
  return {
    element: hs("svg", { class: styles.container, viewBox: "0 0 200 200" }, []),
  };
}
