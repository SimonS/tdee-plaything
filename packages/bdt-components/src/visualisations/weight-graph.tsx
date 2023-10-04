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
import { format } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default ({
  weighins,
  responsive = true,
  filter,
}: {
  weighins: Weighin[] | CalculatedWeighin[];
  responsive?: boolean;
  filter?: { from?: string; to?: string };
}) => {
  if (weighins.length === 0) return <div>No data to display</div>;

  weighins.sort((a, b) =>
    new Date(a.weighinTime) < new Date(b.weighinTime) ? -1 : 1
  );

  const defaultSelected: DateRange = {
    from: filter?.from ? new Date(filter?.from) : undefined,
    to: filter?.to ? new Date(filter?.to) : undefined,
  };

  type Filters = {
    weight: boolean;
    weightTrend: boolean;
    bodyFatPercentage: boolean;
  };

  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
  const [showDatePicker, setShowDatePicker] = useState<Boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    weight: true,
    weightTrend: true,
    bodyFatPercentage: false,
  });

  const filterDates = (
    weighins: Weighin[] | CalculatedWeighin[]
  ): Weighin[] | CalculatedWeighin[] =>
    weighins
      .filter((weighin) => {
        return range?.from ? new Date(weighin.weighinTime) >= range.from : true;
      })
      .filter((weighin) => {
        let toDate = range?.to || new Date();
        toDate.setHours(23);
        toDate.setMinutes(59);
        toDate.setSeconds(59);
        return range?.to ? new Date(weighin.weighinTime) <= toDate : true;
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

  const formatted = window.map((weighin) => ({
    ...weighin,
    weighinTime: new Date(weighin.weighinTime).getTime(),
  }));

  return (
    <div className="stack">
      <form className="dp-form">
        <div className="dp-input">
          <label htmlFor="date-from">From</label>
          <input
            type="text"
            id="date-from"
            value={range?.from ? format(range?.from, "dd/MM/yyyy") : ""}
            readOnly
          />
        </div>
        <div className="dp-input">
          <label htmlFor="date-to">To</label>
          <input
            type="text"
            id="date-to"
            value={range?.to ? format(range?.to, "dd/MM/yyyy") : ""}
            readOnly
          />
        </div>
        <div className="picker">
          <input
            type="button"
            value="Change dates"
            onClick={() => setShowDatePicker(!showDatePicker)}
          />
          {showDatePicker && (
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              defaultMonth={range?.from}
            />
          )}
        </div>
      </form>
      <form className="line-selector-form">
        <div className="line-selector-cb">
          <input
            type="checkbox"
            name="show-weight"
            id="show-weight"
            checked={filters.weight}
            onChange={() =>
              setFilters({
                ...filters,
                weight: !filters.weight,
              })
            }
          />
          <label htmlFor="show-weight">Weight</label>
        </div>
        <div className="line-selector-cb">
          <input
            type="checkbox"
            name="show-weight-trend"
            id="show-weight-trend"
            checked={filters.weightTrend}
            onChange={() =>
              setFilters({
                ...filters,
                weightTrend: !filters.weightTrend,
              })
            }
          />
          <label htmlFor="show-weight-trend">Weight Trend</label>
        </div>
        <div className="line-selector-cb">
          <input
            type="checkbox"
            name="show-bfp"
            id="show-bfp"
            checked={filters.bodyFatPercentage}
            onChange={() =>
              setFilters({
                ...filters,
                bodyFatPercentage: !filters.bodyFatPercentage,
              })
            }
          />
          <label htmlFor="show-bfp">Bodyfat</label>
        </div>
      </form>
      <div>
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
              yAxisId="weight"
            />
            <YAxis
              type="number"
              domain={["dataMin-0.1", "dataMax+0.1"]}
              tickFormatter={tickWeightFormatter}
              yAxisId="bfp"
              orientation="right"
            />
            <Tooltip
              labelFormatter={(value) =>
                new Date(value as string).toLocaleDateString("en-gb")
              }
            />
            <Legend />
            {filters.weight && (
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#b81007"
                activeDot={{ r: 8 }}
                strokeWidth={2}
                isAnimationActive={responsive}
                yAxisId="weight"
                dot={formatted.length <= 31}
              />
            )}
            {filters.weightTrend && (
              <Line
                type="monotone"
                dataKey="weightTrend"
                stroke="#345693"
                activeDot={{ r: 8 }}
                strokeWidth={2}
                strokeDasharray="12 4"
                dot={formatted.length <= 31 ? { strokeDasharray: "" } : false}
                isAnimationActive={responsive}
                yAxisId="weight"
              />
            )}
            {filters.bodyFatPercentage && (
              <Line
                type="monotone"
                dataKey="bodyFatPercentage"
                stroke="#dfcc4c"
                activeDot={{ r: 8 }}
                strokeWidth={2}
                dot={formatted.length <= 31}
                isAnimationActive={responsive}
                yAxisId="bfp"
                data-testId="bfp-line"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
