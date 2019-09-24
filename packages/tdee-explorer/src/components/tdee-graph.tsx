import React from "react";
import * as d3 from "d3";
import { Line } from "d3";

const width = 400;
const height = 400;

interface ICheckin {
  date: Date;
  weight: number;
  calories: number;
}

interface ITDEEProps {
  checkIns: {
    date: Date;
    weight: number;
    calories: number;
  }[];
}

const TDEEGraph: React.FunctionComponent<ITDEEProps> = ({ checkIns }) => {
  // prep data
  const xScale = d3
    .scaleTime()
    .range([0, width])
    .domain(d3.extent(checkIns, d => d.date));

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(checkIns, d => d.weight))
    .range([height, 0]);

  //   var line = d3.line<ICheckin>().x(d => d.date);
  // .curve(d3.curveMonotoneX);

  return (
    <svg width={width} height={height}>
      {checkIns.map((d, i) => (
        <rect />
      ))}
    </svg>
  );
};

export default TDEEGraph;
