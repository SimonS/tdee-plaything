import React from "react";
import * as d3 from "d3";

const width = 800;
const height = 400;

interface ICheckin {
  date: Date;
  weight: number;
  calories: number;
}

interface ITDEEProps {
  checkIns: {
    date: string;
    weight: number;
    calories: number;
  }[];
}

const TDEEGraph: React.FunctionComponent<ITDEEProps> = ({ checkIns }) => {
  const margins = { top: 5, bottom: 20, left: 20, right: 5 };

  const preppedData: ICheckin[] = checkIns
    .filter(d => d.weight)
    .map(d => ({ ...d, date: new Date(d.date) }));

  const xScale = d3
    .scaleTime()
    .range([margins.left, width - margins.right])
    .domain(d3.extent(preppedData, d => d.date));

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(preppedData, d => d.weight))
    .range([height - margins.bottom, margins.top]);

  var line = d3
    .line<ICheckin>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.weight))
    .curve(d3.curveMonotoneX);

  return (
    <svg width={width} height={height}>
      <path fill="none" stroke="blue" strokeWidth="3" d={line(preppedData)} />
    </svg>
  );
};

export default TDEEGraph;
