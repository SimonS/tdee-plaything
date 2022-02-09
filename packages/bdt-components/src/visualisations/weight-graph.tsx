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
          x: new Date(w.weighinTime).toISOString().split("T")[0],
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

  const isWindowed = data[0].data.length !== weighins.length;

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
          pageInfo={{ hasNextPage: true, hasPreviousPage: true }}
        />
      )}
    </div>
  );
};

export default WeightGraph;
