export type AriaAttributes = {
  "aria-role": string;
  "aria-hidden": string;
  "aria-labelledby": string;
};

export type SvgTagNameMap = {
  svg: {
    element: SVGSVGElement;
    attrs: {
      style: string;
      class: string;
      id: string;
      viewBox: string;
    };
  };
  polyline: {
    element: SVGPolylineElement;
    attrs: {
      style: string;
      class: string;
      id: string;
      points: string;
      stroke: string;
      fill: string;
      "stroke-width": number | string;
    };
  };
  text: {
    element: SVGTextElement;
    attrs: {
      style: string;
      class: string;
      id: string;
      x: number | string;
      y: number | string;
      fill: string;
      width: number | string;
      "text-anchor": string;
      "dominant-baseline": string;
    };
  };
  line: {
    element: SVGLineElement;
    attrs: {
      style: string;
      class: string;
      id: string;
      x1: number | string;
      x2: number | string;
      y1: number | string;
      y2: number | string;
      stroke: string;
    };
  };
  circle: {
    element: SVGCircleElement;
    attrs: {
      style: string;
      class: string;
      id: string;
      cx: number | string;
      cy: number | string;
      r: number | string;
      pathLength: number | string;
      fill: string;
    };
  };
  path: {
    element: SVGPathElement;
    attrs: {
      style: string;
      class: string;
      id: string;
      d: string;
      stroke: string;
      fill: string;
    };
  };
  g: {
    element: SVGGElement;
    attrs: {
      style: string;
      class: string;
      id: string;
    };
  };
  textPath: {
    element: SVGTextPathElement;
    attrs: {
      style: string;
      class: string;
      id: string;
      href: string;
    };
  };
  rect: {
    element: SVGRectElement;
    attrs: {
      style: string;
      class: string;
      id: string;
      x: number | string;
      y: number | string;
      width: number | string;
      height: number | string;
      rx: number | string;
      ry: number | string;
      fill: string;
    };
  };
};
