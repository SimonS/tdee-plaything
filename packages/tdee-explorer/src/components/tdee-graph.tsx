import React, { useState } from 'react';
import * as d3 from 'd3';
import { CheckIn, ComputedCheckIn } from '@tdee/types/src/checkins';
import setDefaultCalories from '@tdee/gsheet-log-fetcher/src/setDefaultCalories';
import calculateRollingAverage from '@tdee/gsheet-log-fetcher/src/calculateRollingAverage';
import calculateBMI from '@tdee/gsheet-log-fetcher/src/calculateBMI';
import Axis from './axis';
import Path from './path';

interface TDEEProps {
  checkIns: CheckIn[];
  width: number;
  height: number;
}

const TDEEGraph: React.FunctionComponent<TDEEProps> = ({
  checkIns,
  width,
  height,
}) => {
  const margins = {
    top: 5, bottom: 40, left: 20, right: 260,
  };
  const [averageOver, setAverage] = useState(21);
  const [activeDate, setActiveDate] = useState(
    checkIns[Math.floor(checkIns.length / 2)].date,
  );

  const weightCheckins: CheckIn[] = checkIns.filter((d) => d.weight);
  const calorieCheckins: CheckIn[] = checkIns.filter((d) => d.calories);

  /* it occurs to me that we will likely have to split this into datasets as
     we add more "computed checkins" and need to filter per-line: */
  const processedCheckIns: ComputedCheckIn[] = calculateBMI(
    calculateRollingAverage(setDefaultCalories(checkIns, 5000), averageOver),
  );

  const BMICheckIns = processedCheckIns.filter((d) => d.BMI);

  const xScale = d3
    .scaleTime()
    .range([margins.left, width - margins.right])
    .domain(d3.extent(checkIns, (d) => d.date));

  const [min, max] = d3.extent(weightCheckins, (d) => d.weight);
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
    .line<CheckIn>()
    .x((d) => xScale(d.date))
    .y((d) => weightScale(d.weight))
    .curve(d3.curveMonotoneX);

  const rollingWeightLine = d3
    .line<ComputedCheckIn>()
    .x((d) => xScale(d.date))
    .y((d) => weightScale(d.averageWeight))
    .curve(d3.curveMonotoneX);

  const calorieLine = d3
    .line<CheckIn>()
    .x((d) => xScale(d.date))
    .y((d) => calorieScale(d.calories))
    .curve(d3.curveMonotoneX);

  const BMILine = d3
    .line<ComputedCheckIn>()
    .x((d) => xScale(d.date))
    .y((d) => BMIScale(d.BMI))
    .curve(d3.curveMonotoneX);

  const legendX = width - margins.right + 50;

  interface PathGenerator {
    line: string;
    color: string;
    threshold?: number;
    text: string;
    initiallyHidden?: boolean;
    dataSource: ComputedCheckIn[];
    yScale: d3.ScaleLinear<number, number>;
    attribute: string;
  }

  const paths: PathGenerator[] = [
    {
      line: calorieLine(processedCheckIns),
      color: '#AB7700',
      text: 'Computed Calories',
      initiallyHidden: true,
      dataSource: processedCheckIns,
      yScale: calorieScale,
      attribute: 'calories',
    },
    {
      line: calorieLine(calorieCheckins),
      color: '#FFB100',
      text: 'Calories',
      dataSource: calorieCheckins,
      yScale: calorieScale,
      attribute: 'calories',
    },
    {
      line: weightLine(weightCheckins),
      color: '#0292B7',
      text: 'Weight (Kg)',
      dataSource: weightCheckins,
      yScale: weightScale,
      attribute: 'weight',
    },
    {
      line: BMILine(BMICheckIns),
      color: '#000',
      threshold: BMIScale(24.99) / height,
      text: 'checked in BMI',
      initiallyHidden: true,
      dataSource: BMICheckIns,
      yScale: BMIScale,
      attribute: 'BMI',
    },
    {
      line: rollingWeightLine(processedCheckIns),
      color: '#DC1900',
      text: `Avg over ${averageOver} days`,
      dataSource: processedCheckIns,
      yScale: weightScale,
      attribute: 'averageWeight',
    },
  ];

  const getActiveValue = (
    dataSource: ComputedCheckIn[],
    date: Date,
    attribute: string,
  ) => (dataSource.filter((checkIn) => checkIn.date === date && checkIn[attribute])
    .length
    ? dataSource.filter(
      (checkIn) => checkIn.date === date && checkIn[attribute],
    )[0][attribute]
    : null);

  const hydratePath = (path: PathGenerator, idx: number) => {
    const activeValue = getActiveValue(
      path.dataSource,
      activeDate,
      path.attribute,
    );

    return (
      <Path
        key={`path-${idx}`}
        line={path.line}
        color={
          [
            '#e41a1c',
            '#377eb8',
            '#4daf4a',
            '#984ea3',
            '#ff7f00',
            '#ffff33',
            '#a65628',
            '#f781bf',
            '#999999',
          ][idx] // colorbrewer set1
        }
        threshold={path.threshold}
        legend={{ x: legendX, y: idx * 30 + 3, text: path.text }}
        initiallyHidden={path.initiallyHidden || false}
        selected={
          activeValue && {
            date: activeValue,
            value: parseFloat(activeValue.toFixed(2)),
            yPosition: path.yScale(activeValue),
            xPosition: xScale(activeDate),
          }
        }
      />
    );
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMin meet">
      {paths.map(hydratePath)}
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
            onChange={(e) => setAverage(parseInt(e.target.value, 10))}
          />
          <label style={{ display: 'block' }} />
        </form>
      </foreignObject>
      <path
        stroke="black"
        strokeWidth="1px"
        d={`M${xScale(activeDate)},${height - margins.bottom} ${xScale(
          activeDate,
        )},0`}
        pointerEvents="none"
      />
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
            onChange={(e): void => setActiveDate(processedCheckIns[e.target.value].date)}
            style={{ width: `${width - margins.right - margins.left - 2}px` }}
          />
        </form>
      </foreignObject>
    </svg>
  );
};

export default TDEEGraph;
