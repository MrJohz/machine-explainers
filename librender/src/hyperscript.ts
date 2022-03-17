import { AriaAttributes, SvgTagNameMap } from "./element-types";

export type Child = null | string | HTMLElement | SVGElement | Child[];

export type SvgPropType<T extends keyof SvgTagNameMap> = {
  [K in keyof SvgTagNameMap[T]["attrs"]]?: SvgTagNameMap[T]["attrs"][K];
};

export function hs<T extends keyof SvgTagNameMap>(
  name: T,
  attributes?: SvgPropType<T> | Child[],
  children?: Child[]
): SvgTagNameMap[T]["element"] {
  let derivedAttributes: SvgPropType<T>;
  let derivedChildren: Child[];

  if (Array.isArray(attributes)) {
    derivedAttributes = {};
    derivedChildren = (attributes ?? []).slice();
  } else {
    derivedAttributes = attributes ?? {};
    derivedChildren = (children ?? []).slice();
  }

  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(derivedAttributes)) {
    if (key === "className") {
      element.setAttribute("class", "" + value);
      continue;
    }
    element.setAttribute(key, "" + value);
  }

  while (derivedChildren.length) {
    const child = derivedChildren.shift();

    if (child == null) {
      continue;
    } else if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else if (Array.isArray(child)) {
      derivedChildren.unshift(...child);
    } else {
      element.appendChild(child);
    }
  }

  return element;
}

export type PropType<T extends HTMLElement = HTMLElement> = Partial<T> &
  Partial<AriaAttributes>;

export function h<T extends keyof HTMLElementTagNameMap>(
  name: T,
  attributes?: PropType<HTMLElementTagNameMap[T]> | Child[],
  children?: Child[]
): HTMLElementTagNameMap[T] {
  let derivedAttributes: Partial<HTMLElementTagNameMap[T]>;
  let derivedChildren: Child[];

  if (Array.isArray(attributes)) {
    derivedAttributes = {};
    derivedChildren = (attributes ?? []).slice();
  } else {
    derivedAttributes = attributes ?? {};
    derivedChildren = (children ?? []).slice();
  }

  const element = document.createElement(name);
  for (const [key, value] of Object.entries(derivedAttributes)) {
    if (key.startsWith("aria-")) {
      element.setAttribute(key, value);
      continue;
    }
    (element as any)[key] = value;
  }

  while (derivedChildren.length) {
    const child = derivedChildren.shift();

    if (child == null) {
      continue;
    } else if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else if (Array.isArray(child)) {
      derivedChildren.unshift(...child);
    } else {
      element.appendChild(child);
    }
  }

  return element;
}

export function render(parent: HTMLElement, child: HTMLElement) {
  while (parent.firstChild) {
    parent.firstChild.remove();
  }

  parent.appendChild(child);
}
