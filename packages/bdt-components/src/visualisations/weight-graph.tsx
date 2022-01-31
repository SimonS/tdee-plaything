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
