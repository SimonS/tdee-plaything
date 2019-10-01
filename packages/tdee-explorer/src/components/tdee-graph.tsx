import React from "react";
import * as d3 from "d3";
import { ICheckIn } from "@tdee/types/src/checkins";
import setDefaultCalories from "@tdee/gsheet-log-fetcher/src/setDefaultCalories";
import Axis from "./axis";
import Path from "./path";

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
  const margins = { top: 5, bottom: 20, left: 20, right: 200 };
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

  const legendX = width - margins.right + 50;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMin meet">
      <Path
        line={calorieLine(impliedCalorieCheckins)}
        color="#1AC8DB"
        legend={{ x: legendX, y: 3, text: "Calories + defaults" }}
        initiallyHidden
      />
      <Path
        line={calorieLine(calorieCheckins)}
        color="#1AC8DB"
        legend={{ x: legendX, y: 33, text: "Calories" }}
      />
      <Path
        line={weightLine(weightCheckins)}
        color="#0292B7"
        legend={{ x: legendX, y: 63, text: "Weight" }}
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
