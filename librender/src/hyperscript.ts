export type Child = null | string | HTMLElement | Child[];

export function h<T extends keyof HTMLElementTagNameMap>(
  name: T,
  attributes?: Partial<HTMLElementTagNameMap[T]> | Child[],
  children?: Child[]
): HTMLElementTagNameMap[T] {
  let derivedAttributes: Partial<HTMLElementTagNameMap[T]>;
  let derivedChildren: Child[];

  if (Array.isArray(attributes)) {
    derivedAttributes = {};
    derivedChildren = attributes ?? [];
  } else {
    derivedAttributes = attributes ?? {};
    derivedChildren = children ?? [];
  }

  const element = document.createElement(name);
  for (const [key, value] of Object.entries(derivedAttributes)) {
    if (!(key in element)) {
      console.warn(
        `Skipping setting property ${key} on element ${name}, it is not a known property`
      );
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
