import { CalculatedWeighin, Weighin } from "@tdee/types/src/bdt";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Pagination } from "../pagination/pagination";

export default ({
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

  const [from, setFrom] = useState(filter?.from);

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

  const tickWeightFormatter = (value: unknown) => {
    return (value as number).toFixed(1);
  };

  const tickDateFormatter = (value: unknown) => {
    const date = new Date(value as string);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    return `${day}/${month}`;
  };

  const window = filterDates(weighins);

  const hasNext =
    window.length > 0
      ? window[window.length - 1].weighinTime !==
        weighins[weighins.length - 1].weighinTime
      : false;

  const hasPrevious =
    window.length > 0
      ? window[0].weighinTime !== weighins[0].weighinTime
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

  const formatted = filterDates(weighins).map((weighin) => ({
    ...weighin,
    weighinTime: new Date(weighin.weighinTime).getTime(),
  }));
  return (
    <>
      <ResponsiveContainer
        minWidth={200}
        minHeight={200}
        width="100%"
        height={400}
      >
        <LineChart width={500} height={300} data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="weighinTime"
            domain={[
              formatted[0]?.weighinTime,
              formatted[formatted.length - 1]?.weighinTime,
            ]}
            type="number"
            scale="time"
            tickFormatter={tickDateFormatter}
          />
          <YAxis
            type="number"
            domain={["dataMin-0.1", "dataMax+0.1"]}
            tickFormatter={tickWeightFormatter}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#b81007"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            isAnimationActive={responsive}
          />
          <Line
            type="monotone"
            dataKey="weightTrend"
            stroke="#345693"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            strokeDasharray="12 4"
            dot={{ strokeDasharray: "" }}
            isAnimationActive={responsive}
          />
        </LineChart>
      </ResponsiveContainer>
      <Pagination
        tag={`button`}
        pageInfo={{ hasNextPage: hasNext, hasPreviousPage: hasPrevious }}
        previousPageEvent={showEarlier}
        nextPageEvent={showLater}
      />
    </>
  );
};
