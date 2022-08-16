import React from "react";
import {
  CalendarDatum,
  ResponsiveCalendar,
  Calendar as NivoCalendar,
} from "@nivo/calendar";

const Calendar = ({
  data,
  from,
  to,
  responsive = true,
}: {
  data: CalendarDatum[];
  from: Date;
  to: Date;
  responsive?: Boolean;
}) => (
  <div style={{ width: "100%", height: "100vh" }}>
    {responsive ? (
      <ResponsiveCalendar data={data} from={from} to={to} />
    ) : (
      <NivoCalendar data={data} from={from} to={to} height={600} width={600} />
    )}
  </div>
);

export default Calendar;
