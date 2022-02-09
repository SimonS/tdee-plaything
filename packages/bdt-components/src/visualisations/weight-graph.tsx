import React from "react";
import { Line, ResponsiveLine, LineSvgProps } from "@nivo/line";
import { Pagination } from "../pagination/pagination";
import { Weighin } from "@tdee/types/src/bdt";

const WeightGraph = ({
  weighins,
  responsive = true,
  filter,
  displayDatesAtATime = false,
}: {
  weighins: Weighin[];
  responsive?: boolean;
  filter?: { from?: string };
  displayDatesAtATime?: boolean | number;
}) => {
  weighins.sort((a, b) =>
    new Date(a.weighinTime) < new Date(b.weighinTime) ? -1 : 1
  );
  const formatTime = (time: string) =>
    new Date(time).toISOString().split("T")[0];
  const data = [
    {
      id: "weight",
      label: "Weight",
      data: weighins
        .filter((weighin) => {
          return filter?.from ? weighin.weighinTime >= filter.from : true;
        })
        .filter((_, i) => {
          return displayDatesAtATime !== false ? i < displayDatesAtATime : true;
        })
        .map((w) => ({
          x: formatTime(w.weighinTime),
          y: w.weight,
        })),
    },
  ];

  const maxWeight = Math.max(...data[0].data.map((d) => d.y));
  const minWeight = Math.min(...data[0].data.map((d) => d.y));
  // 9 is a bit of a magic number, I don't want to reverse engineer
  // yScale too much though, we'll see how it goes.
  const weightDiff = (maxWeight - minWeight) / 9;

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
  };
  const weighinData = data[0].data;
  const isWindowed = weighinData.length !== weighins.length;
  const hasNext =
    weighinData[weighinData.length - 1].x !==
    formatTime(weighins[weighins.length - 1].weighinTime);
  const hasPrevious = weighinData[0].x !== formatTime(weighins[0].weighinTime);

  /**
   * The following is horrible. In reality, we only use the Responsive version.
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
        />
      )}
    </div>
  );
};

export default WeightGraph;
