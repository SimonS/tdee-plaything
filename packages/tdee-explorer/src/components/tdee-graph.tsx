import React from "react";
import * as d3 from "d3";
import { ICheckIn } from "@tdee/types/src/checkins";
import setDefaultCalories from "@tdee/gsheet-log-fetcher/src/setDefaultCalories";
import Axis from "./axis";

interface ITDEEProps {
  checkIns: ICheckIn[];
  width: number;
  height: number;
}

const TDEEGraph: React.FunctionComponent<ITDEEProps> = ({
  checkIns,
  width,
  height,
}) => {
  const margins = { top: 5, bottom: 20, left: 20, right: 40 };
  const weightCheckins: ICheckIn[] = checkIns.filter(d => d.weight);
  const calorieCheckins: ICheckIn[] = checkIns.filter(d => d.calories);
  const impliedCalorieCheckins: ICheckIn[] = setDefaultCalories(checkIns, 5000);

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

  const weightLine = d3
    .line<ICheckIn>()
    .x(d => xScale(d.date))
    .y(d => weightScale(d.weight))
    .curve(d3.curveMonotoneX);

  const calorieLine = d3
    .line<ICheckIn>()
    .x(d => xScale(d.date))
    .y(d => calorieScale(d.calories))
    .curve(d3.curveMonotoneX);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMin meet">
      <path
        fill="none"
        stroke="#1AC8DB"
        strokeWidth="3"
        d={calorieLine(impliedCalorieCheckins)}
      />
      <path
        fill="none"
        stroke="#0292B7"
        strokeWidth="3"
        d={weightLine(weightCheckins)}
      />
      <Axis
        orientation="bottom"
        margin={height - margins.bottom}
        scale={xScale}
      />
      <Axis orientation="left" margin={margins.left} scale={weightScale} />
      <Axis
        orientation="right"
        margin={width - margins.right}
        scale={calorieScale}
      />
    </svg>
  );
};

export default TDEEGraph;
