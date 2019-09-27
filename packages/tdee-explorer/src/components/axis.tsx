import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface IAxisProps {
  orientation: "bottom" | "left" | "right";
  margin: number;
  scale: d3.AxisScale<d3.AxisDomain>;
}

const Axis: React.FunctionComponent<IAxisProps> = ({
  orientation,
  margin,
  scale,
}) => {
  const axisRef = useRef();
  let axis: d3.Axis<d3.AxisDomain>;
  let translation = `${margin}, 0`;

  switch (orientation) {
    case "bottom":
      axis = d3.axisBottom(scale);
      translation = `0, ${margin}`;
      break;
    case "left":
      axis = d3.axisLeft(scale);
      break;
    case "right":
      axis = d3.axisRight(scale);
      break;
  }

  useEffect(() => {
    d3.select(axisRef.current).call(axis);
  });

  return <g ref={axisRef} transform={`translate(${translation})`} />;
};

export default Axis;
