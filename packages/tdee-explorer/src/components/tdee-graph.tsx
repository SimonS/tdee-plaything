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
  const calorieCheckins: ICheckIn[] = checkIns.filter(d => d.calories);

  const xScale = d3
    .scaleTime()
    .range([margins.left, width - margins.right])
    .domain(d3.extent(checkIns, d => d.date));

  const weightScale = d3
    .scaleLinear()
    .domain(d3.extent(weightCheckins, d => d.weight))
    .range([height - margins.bottom, margins.top]);

  const calorieScale = d3
    .scaleLinear()
    .domain([0, 6000])
    .range([height - margins.bottom, margins.top]);

  var weightLine = d3
    .line<ICheckIn>()
    .x(d => xScale(d.date))
    .y(d => weightScale(d.weight))
    .curve(d3.curveMonotoneX);

  var calorieLine = d3
    .line<ICheckIn>()
    .x(d => xScale(d.date))
    .y(d => calorieScale(d.calories))
    .curve(d3.curveMonotoneX);

  return (
    <svg width={width} height={height}>
      <path
        fill="none"
        stroke="#0292B7"
        strokeWidth="3"
        d={weightLine(weightCheckins)}
      />
      <path
        fill="none"
        stroke="red"
        strokeWidth="3"
        d={calorieLine(calorieCheckins)}
      />
    </svg>
  );
};

export default TDEEGraph;
