import React from "react";
import { Line, ResponsiveLine, LineSvgProps } from "@nivo/line";
import { Weighin } from "@tdee/types/src/bdt";

const WeightGraph = ({
  weighins,
  responsive = true,
}: {
  weighins: Weighin[];
  responsive?: boolean;
}) => {
  const data = [
    {
      id: "weight",
      label: "Weight",
      data: weighins.map((w) => ({
        x: new Date(w.weighinTime).toISOString().split("T")[0],
        y: w.weight,
      })),
    },
  ];

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
      min: "auto",
      max: "auto",
    },
    pointLabelYOffset: 0,
    curve: "monotoneX",
    axisBottom: {
      format: "%b %d",
      tickValues: "every 2 days",
    },
  };

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
    </div>
  );
};

export default WeightGraph;
