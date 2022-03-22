import React, { useState } from "react";
import {
  Line,
  ResponsiveLine,
  LineSvgProps,
  CustomLayerProps,
  DatumValue,
} from "@nivo/line";
import { Pagination } from "../pagination/pagination";
import { CalculatedWeighin, Weighin } from "@tdee/types/src/bdt";

interface FixedCustomLayerProps
  extends Omit<CustomLayerProps, "xScale" | "yScale"> {
  xScale: (x: DatumValue) => DatumValue;
  yScale: (y: DatumValue) => DatumValue;
}

const WeightGraph = ({
  weighins,
  responsive = true,
  filter,
}: {
  weighins: Weighin[] | CalculatedWeighin[];
  responsive?: boolean;
  filter?: { from?: string; displayDatesAtATime?: number | undefined };
}) => {
  if (weighins.length === 0) return <div>No data to display</div>;

  weighins.sort((a, b) =>
    new Date(a.weighinTime) < new Date(b.weighinTime) ? -1 : 1
  );

  const isCalculated = (
    weighins: Weighin[] | CalculatedWeighin[]
  ): weighins is CalculatedWeighin[] =>
    (weighins[0] as CalculatedWeighin).weightTrend !== undefined;

  const [from, setFrom] = useState(filter?.from);

  const formatTime = (time: string) =>
    new Date(time).toISOString().split("T")[0];

  const filterDates = (
    weighins: Weighin[] | CalculatedWeighin[]
  ): Weighin[] | CalculatedWeighin[] =>
    weighins
      .filter((weighin) => {
        return from ? weighin.weighinTime >= from : true;
      })
      .filter((_, i) => {
        return filter?.displayDatesAtATime !== undefined
          ? i < filter?.displayDatesAtATime
          : true;
      });

  const data = [
    {
      id: "Weight",
      label: "Weight",
      data: filterDates(weighins).map((w) => ({
        x: formatTime(w.weighinTime),
        y: w.weight,
      })),
    },
  ];

  if (isCalculated(weighins)) {
    data.push({
      id: "Weight Trend",
      label: "Weight Trend",
      data: filterDates(weighins).map((w: CalculatedWeighin) => ({
        x: formatTime(w.weighinTime),
        y: w.weightTrend,
      })),
    });
  }

  const allWeights = data.flatMap((d) => d.data.map((d) => d.y));

  const maxWeight = Math.max(...allWeights);
  const minWeight = Math.min(...allWeights);

  // 9 is a bit of a magic number, I don't want to reverse engineer
  // yScale too much though, we'll see how it goes.
  const weightDiff = (maxWeight - minWeight) / 9;

  const styleById = {
    "Weight Trend": {
      strokeDasharray: "12, 6",
      strokeWidth: 2,
    },
    default: {
      strokeWidth: 2,
    },
  };

  const DashedLine = ({
    series,
    lineGenerator,
    xScale,
    yScale,
  }: FixedCustomLayerProps) => {
    return series.map(({ id, data, color }) => (
      <path
        key={id}
        d={lineGenerator(
          data.map((d) => ({
            x: xScale(d.data.x ?? 1),
            y: yScale(d.data.y ?? 1),
          }))
        )}
        fill="none"
        stroke={color}
        style={styleById[id] || styleById.default}
      />
    ));
  };

  const graphProps: LineSvgProps = {
    data,
    margin: { top: 50, right: 110, bottom: 50, left: 60 },
    xScale: {
      type: "time",
      format: "%Y-%m-%d",
      useUTC: false,
      precision: "day",
    },
    xFormat: "time:%Y-%m-%d",
    yScale: {
      type: "linear",
      min: minWeight - weightDiff,
      max: maxWeight + weightDiff,
    },
    pointLabelYOffset: 0,
    curve: "monotoneX",
    axisBottom: {
      format: "%b %d",
      tickValues: "every 2 days",
    },
    layers: [
      "grid",
      "markers",
      "areas",
      DashedLine,
      "slices",
      "points",
      "axes",
      isCalculated(weighins) ? "legends" : "mesh",
    ],
    colors: { scheme: "set1" },
    legends: [
      {
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemWidth: 100,
        itemHeight: 20,
        itemsSpacing: 2,
        itemTextColor: "#000",
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "#000",
            },
          },
        ],
      },
    ],
  };

  // Nav Logic:
  const weighinData = data[0].data;
  const isWindowed = weighinData.length !== weighins.length;

  const hasNext =
    weighinData.length > 0
      ? weighinData[weighinData.length - 1].x !==
        formatTime(weighins[weighins.length - 1].weighinTime)
      : false;

  const hasPrevious =
    weighinData.length > 0
      ? weighinData[0].x !== formatTime(weighins[0].weighinTime)
      : true;

  const changeFromBy = (days: number) => {
    if (from) {
      let newDate = new Date(from);
      newDate.setDate(newDate.getDate() + days);
      setFrom(newDate.toISOString());
    }
  };

  const showEarlier = () => {
    changeFromBy(0 - (filter?.displayDatesAtATime || 7));
  };

  const showLater = () => {
    changeFromBy(filter?.displayDatesAtATime || 7);
  };

  /**
   * `responsive` is horrible. In reality, we only ever use the Responsive version.
   * However, JSDom doesn't like ResizeObserver, it's tightly coupled into the
   * component, and so mocking doesn't really work either (it always sees the
   * height & width as 0). Fortunately, ResponsiveLine is a wrapper around Line,
   * so we use that in our tests, ensuring the props are always the same.
   */
  return (
    <div style={{ height: "400px", width: "100%" }}>
      {responsive ? (
        <ResponsiveLine {...graphProps} />
      ) : (
        <Line {...graphProps} height={300} width={300} />
      )}
      {isWindowed && (
        <Pagination
          tag={`button`}
          pageInfo={{ hasNextPage: hasNext, hasPreviousPage: hasPrevious }}
          previousPageEvent={showEarlier}
          nextPageEvent={showLater}
        />
      )}
    </div>
  );
};

export default WeightGraph;
