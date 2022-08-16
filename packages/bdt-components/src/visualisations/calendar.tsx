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
  <div style={{ height: "280px" }}>
    {responsive ? (
      <ResponsiveCalendar
        margin={{ top: 20, right: 0, bottom: 20, left: 20 }}
        monthBorderColor="#fff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        emptyColor="#eeeeee"
        data={data}
        from={from}
        to={to}
      />
    ) : (
      <NivoCalendar data={data} from={from} to={to} height={600} width={600} />
    )}
  </div>
);

export default Calendar;
