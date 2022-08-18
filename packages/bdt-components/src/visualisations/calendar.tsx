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
      <ResponsiveCalendar
        data={data}
        from={from}
        to={to}
        margin={{ top: 20, right: 0, bottom: 20, left: 20 }}
        monthBorderColor="#fff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        emptyColor="#eeeeee"
      />
    ) : (
      <NivoCalendar
        data={data}
        from={from}
        to={to}
        height={600}
        width={600}
        margin={{ top: 20, right: 0, bottom: 20, left: 20 }}
        monthBorderColor="#fff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        emptyColor="#eeeeee"
      />
    )}
  </div>
);

export default Calendar;
