import { ResponsiveLine } from "@nivo/line";
import { Weighin } from "@tdee/types/src/bdt";

const WeightGraph = ({ weighins }: { weighins: Weighin[] }) => {
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

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{
          type: "time",
          format: "%Y-%m-%d",
          useUTC: false,
          precision: "day",
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
        }}
        axisBottom={{
          format: "%b %d",
          tickValues: "every 2 days",
        }}
        curve="monotoneX"
      />
    </div>
  );
};

export default WeightGraph;
