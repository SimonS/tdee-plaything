import React from "react";
import * as d3 from "d3";
import { ICheckIn } from "@tdee/gsheet-log-fetcher/src/getAllCheckins";

const width = 800;
const height = 400;

interface ITDEEProps {
  checkIns: ICheckIn[];
}

const TDEEGraph: React.FunctionComponent<ITDEEProps> = ({ checkIns }) => {
  const margins = { top: 5, bottom: 20, left: 20, right: 5 };
  const weightCheckins: ICheckIn[] = checkIns.filter(d => d.weight);

  const xScale = d3
    .scaleTime()
    .range([margins.left, width - margins.right])
    .domain(d3.extent(weightCheckins, d => d.date));

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(weightCheckins, d => d.weight))
    .range([height - margins.bottom, margins.top]);

  var line = d3
    .line<ICheckIn>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.weight))
    .curve(d3.curveMonotoneX);

  return (
    <svg width={width} height={height}>
      <path
        fill="none"
        stroke="#0292B7"
        strokeWidth="3"
        d={line(weightCheckins)}
      />
    </svg>
  );
};

export default TDEEGraph;
