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
  const margins = { top: 5, bottom: 40, left: 20, right: 200 };
  const [averageOver, setAverage] = useState(21);
  const [activeDate, setActiveDate] = useState(
    checkIns[Math.floor(checkIns.length / 2)].date
  );

  const weightCheckins: ICheckIn[] = checkIns.filter(d => d.weight);
  const calorieCheckins: ICheckIn[] = checkIns.filter(d => d.calories);

  /* it occurs to me that we will likely have to split this into datasets as 
     we add more "computed checkins" and need to filter per-line: */
  const processedCheckIns: IComputedCheckIn[] = calculateBMI(
    calculateRollingAverage(setDefaultCalories(checkIns, 5000), averageOver)
  );

  const BMICheckIns = processedCheckIns.filter(d => d.BMI);

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
      text: "Computed Calories",
      initiallyHidden: true,
      activeValue:
        processedCheckIns.filter(
          checkIn =>
            checkIn.date === activeDate &&
            checkIn.calories !== undefined &&
            checkIn.calories
        ).length &&
        processedCheckIns.filter(checkIn => checkIn.date === activeDate)[0]
          .calories,
      yPosition: calorieScale(
        processedCheckIns.filter(checkIn => checkIn.date === activeDate)
          .length &&
          processedCheckIns.filter(checkIn => checkIn.date === activeDate)[0]
            .calories
      ),
      xPosition: xScale(activeDate),
    },
    {
      line: calorieLine(calorieCheckins),
      color: "#FFB100",
      text: "Calories",
      activeValue:
        calorieCheckins.filter(
          checkIn => checkIn.date === activeDate && checkIn.calories
        ).length &&
        processedCheckIns.filter(checkIn => checkIn.date === activeDate)[0]
          .calories,
      yPosition:
        (calorieCheckins.filter(
          checkIn => checkIn.date === activeDate && checkIn.calories
        ).length &&
          calorieScale(
            calorieCheckins.filter(
              checkIn => checkIn.date === activeDate && checkIn.calories
            )[0].calories
          )) ||
        null,
      xPosition: xScale(activeDate),
    },
    {
      line: weightLine(weightCheckins),
      color: "#0292B7",
      text: "Weight (Kg)",
      activeValue:
        weightCheckins.filter(
          checkIn => checkIn.date === activeDate && checkIn.weight
        ).length &&
        weightCheckins.filter(checkIn => checkIn.date === activeDate)[0].weight,
      yPosition:
        weightCheckins.filter(
          checkIn => checkIn.date === activeDate && checkIn.weight
        ).length &&
        weightScale(
          weightCheckins.filter(checkIn => checkIn.date === activeDate)[0]
            .weight
        ),
      xPosition: xScale(activeDate),
    },
    {
      line: BMILine(BMICheckIns),
      color: "#000",
      text: `checked in BMI`,
      initiallyHidden: true,
      activeValue:
        BMICheckIns.filter(
          checkIn => checkIn.date === activeDate && checkIn.BMI
        ).length &&
        BMICheckIns.filter(checkIn => checkIn.date === activeDate)[0].BMI,
      yPosition:
        BMICheckIns.filter(
          checkIn => checkIn.date === activeDate && checkIn.BMI
        ).length &&
        BMIScale(
          BMICheckIns.filter(checkIn => checkIn.date === activeDate)[0].BMI
        ),
      xPosition: xScale(activeDate),
    },
    {
      line: rollingWeightLine(processedCheckIns),
      color: "#DC1900",
      text: `Avg over ${averageOver} days`,
      activeValue:
        processedCheckIns.filter(
          checkIn => checkIn.date === activeDate && checkIn.averageWeight
        ).length &&
        processedCheckIns.filter(checkIn => checkIn.date === activeDate)[0]
          .averageWeight,
      yPosition:
        processedCheckIns.filter(
          checkIn => checkIn.date === activeDate && checkIn.averageWeight
        ).length &&
        weightScale(
          processedCheckIns.filter(checkIn => checkIn.date === activeDate)[0]
            .averageWeight
        ),
      xPosition: xScale(activeDate),
    },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMin meet">
      {paths.map((path, i) => (
        <Path
          key={`path-${i}`}
          line={path.line}
          color={path.color}
          legend={{ x: legendX, y: i * 30 + 3, text: path.text }}
          initiallyHidden={path.initiallyHidden || false}
          selected={
            path.activeValue
              ? {
                  date: activeDate,
                  value: path.activeValue,
                  yPosition: path.yPosition,
                  xPosition: path.xPosition,
                }
              : null
          }
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
      <g>
        <path
          stroke="black"
          strokeWidth="1px"
          d={`M${xScale(activeDate)},${height - margins.bottom} ${xScale(
            activeDate
          )},0`}
          pointerEvents="none"
        />
      </g>
      <foreignObject
        x={margins.left}
        y={height - margins.bottom + 20}
        width={width - margins.right - 20}
        height={150}
      >
        <form>
          <input
            type="range"
            min="0"
            max={checkIns.length - 1}
            defaultValue={Math.floor(processedCheckIns.length / 2).toString()}
            onChange={e =>
              setActiveDate(processedCheckIns[e.target.value].date)
            }
            style={{ width: `${width - margins.right - margins.left - 2}px` }}
          />
        </form>
      </foreignObject>
    </svg>
  );
};

export default TDEEGraph;
