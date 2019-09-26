import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ICheckIn } from "@tdee/gsheet-log-fetcher/src/getAllCheckins";

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
  const xRef = useRef();
  const weightRef = useRef();
  const calorieRef = useRef();

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
    .domain([0, 8000])
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

  const xAxis = d3.axisBottom(xScale);
  const weightAxis = d3.axisLeft(weightScale);
  const calorieAxis = d3.axisRight(calorieScale);

  useEffect(() => {
    d3.select(xRef.current).call(xAxis);
    d3.select(weightRef.current).call(weightAxis);
    d3.select(calorieRef.current).call(calorieAxis);
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMin meet">
      <path
        fill="none"
        stroke="#1AC8DB"
        strokeWidth="3"
        d={calorieLine(calorieCheckins)}
      />
      <path
        fill="none"
        stroke="#0292B7"
        strokeWidth="3"
        d={weightLine(weightCheckins)}
      />
      <g ref={xRef} transform={`translate(0, ${height - margins.bottom})`} />
      <g ref={weightRef} transform={`translate(${margins.left}, 0)`} />
      <g
        ref={calorieRef}
        transform={`translate(${width - margins.right}, 0)`}
      />
    </svg>
  );
};

export default TDEEGraph;
