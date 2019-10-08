import React, { useState } from "react";
import * as d3 from "d3";
import { ICheckIn, IComputedCheckIn } from "@tdee/types/src/checkins";
import setDefaultCalories from "@tdee/gsheet-log-fetcher/src/setDefaultCalories";
import calculateRollingAverage from "@tdee/gsheet-log-fetcher/src/calculateRollingAverage";
import calculateBMI from "@tdee/gsheet-log-fetcher/src/calculateBMI";
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
  const [averageOver, setAverage] = useState(21);
  const [lineX, setLineX] = useState({ visible: false, x: 0 });

  const weightCheckins: ICheckIn[] = checkIns.filter(d => d.weight);
  const calorieCheckins: ICheckIn[] = checkIns.filter(d => d.calories);

  /* it occurs to me that we will likely have to split this into datasets as 
     we add more "computed checkins" and need to filter per-line: */
  const processedCheckIns: IComputedCheckIn[] = calculateBMI(
    calculateRollingAverage(setDefaultCalories(checkIns, 5000), averageOver)
  ).filter(d => d.BMI);

  const xScale = d3
    .scaleTime()
    .range([margins.left, width - margins.right])
    .domain(d3.extent(checkIns, d => d.date));

  const [min, max] = d3.extent(weightCheckins, d => d.weight);
  const weightScale = d3
    .scaleLinear()
    .domain([Math.floor(min) - 0.5, Math.ceil(max) + 0.5])
    .range([height - margins.bottom, margins.top]);

  const calorieScale = d3
    .scaleLinear()
    .domain([0, 6000])
    .range([height - margins.bottom, margins.top]);

  const BMIScale = d3
    .scaleLinear()
    .domain([15, 35])
    .range([height - margins.bottom, margins.top]);

  const weightLine = d3
    .line<ICheckIn>()
    .x(d => xScale(d.date))
    .y(d => weightScale(d.weight))
    .curve(d3.curveMonotoneX);

  const rollingWeightLine = d3
    .line<IComputedCheckIn>()
    .x(d => xScale(d.date))
    .y(d => weightScale(d.averageWeight))
    .curve(d3.curveMonotoneX);

  const calorieLine = d3
    .line<ICheckIn>()
    .x(d => xScale(d.date))
    .y(d => calorieScale(d.calories))
    .curve(d3.curveMonotoneX);

  const BMILine = d3
    .line<IComputedCheckIn>()
    .x(d => xScale(d.date))
    .y(d => BMIScale(d.BMI))
    .curve(d3.curveMonotoneX);

  const legendX = width - margins.right + 50;

  const paths = [
    {
      line: calorieLine(processedCheckIns),
      color: "#AB7700",
      text: "Calories + defaults",
      initiallyHidden: true,
    },
    {
      line: calorieLine(calorieCheckins),
      color: "#FFB100",
      text: "Calories",
    },
    {
      line: weightLine(weightCheckins),
      color: "#0292B7",
      text: "Weight (Kg)",
    },
    {
      line: BMILine(processedCheckIns),
      color: "#000",
      text: `checked in BMI`,
      initiallyHidden: true,
    },
    {
      line: rollingWeightLine(processedCheckIns),
      color: "#DC1900",
      text: `Avg over ${averageOver} days`,
    },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMin meet">
      <rect
        width={width}
        height={height}
        fill="transparent"
        onMouseMove={e => {
          const target = e.target as HTMLElement;
          const x = e.clientX - (target.getBoundingClientRect() as DOMRect).x;
          setLineX({
            visible: x > margins.left && x < width - margins.right,
            x,
          });
        }}
        onMouseOut={e => {
          setLineX({ visible: false, x: 0 });
        }}
      />
      {paths.map((path, i) => (
        <Path
          key={`path-${i}`}
          line={path.line}
          color={path.color}
          legend={{ x: legendX, y: i * 30 + 3, text: path.text }}
          initiallyHidden={path.initiallyHidden || false}
        />
      ))}
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
      <foreignObject x={legendX - 3} y={150} width={250} height={150}>
        <form>
          <input
            type="range"
            min="3"
            max="28"
            defaultValue={averageOver.toString()}
            onChange={e => setAverage(parseInt(e.target.value, 10))}
          />
          <label style={{ display: "block" }}></label>
        </form>
      </foreignObject>
      <path
        stroke="black"
        strokeWidth="1px"
        opacity={lineX.visible ? 1 : 0}
        d={`M${lineX.x},${height} ${lineX.x},0`}
        pointerEvents="none"
      />
    </svg>
  );
};

export default TDEEGraph;
