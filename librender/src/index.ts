export { h, hs, render } from "./hyperscript";
export type { PropType } from "./hyperscript";
export type { AriaAttributes, SvgTagNameMap } from "./element-types";

let previousId = 0;
export function idGroup(name = "demo"): (name: string) => string {
  const prefix = `${name}_${++previousId}_`;

  return (name: string): string => {
    return prefix + name;
  };
}
