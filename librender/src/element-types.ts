export type AriaAttributes = {
  "aria-role": string;
  "aria-hidden": string;
  "aria-labelledby": string;
};

export type SvgTagNameMap = {
  svg: { attrs: {}; element: SVGSVGElement };
  polyline: {
    element: SVGPolylineElement;
    attrs: {
      points: string;
      stroke: string;
      fill: string;
      "stroke-width": number | string;
    };
  };
  text: {
    element: SVGTextElement;
    attrs: {
      x: number | string;
      y: number | string;
      "text-anchor": string;
      "dominant-baseline": string;
    };
  };
  line: {
    element: SVGLineElement;
    attrs: {
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
      d: string;
      stroke: string;
      fill: string;
    };
  };
  g: {
    element: SVGGElement;
    attrs: {};
  };
};
