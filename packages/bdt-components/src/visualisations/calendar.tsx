import React from "react";
import {
  CalendarDatum,
  ResponsiveCalendar,
  Calendar as NivoCalendar,
  Datum,
} from "@nivo/calendar";

const gradients = ["#dfcc4c", "#daa525", "#d27d01", "#c75100", "#b81007"];

const Calendar = ({
  data,
  from,
  to,
  responsive = true,
  onClick,
}: {
  data: CalendarDatum[];
  from: Date | string;
  to: Date | string;
  responsive?: Boolean;
  onClick?: (
    datum: Datum,
    e: React.MouseEvent<SVGRectElement, MouseEvent>
  ) => void;
}) => (
  <div style={{ width: "100%", height: "280px" }}>
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
        colors={gradients}
        onClick={onClick}
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
        colors={gradients}
        onClick={onClick}
      />
    )}
  </div>
);

export default Calendar;
