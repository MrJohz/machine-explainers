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
      viewBox: string;
    };
  };
  polyline: {
    element: SVGPolylineElement;
    attrs: {
      style: string;
      class: string;
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
      x: number | string;
      y: number | string;
      fill: string;
      "text-anchor": string;
      "dominant-baseline": string;
    };
  };
  line: {
    element: SVGLineElement;
    attrs: {
      style: string;
      class: string;
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
    };
  };
};
