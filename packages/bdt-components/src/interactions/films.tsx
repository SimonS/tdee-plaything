import React from "react";
import { CalendarDatum } from "@nivo/calendar";
import { GroupedFilms } from "@tdee/types/src/bdt";
import Calendar from "../visualisations/calendar";

const FilmCalendar = ({
  aggregated,
  grouped,
  responsive = true,
}: {
  aggregated: CalendarDatum[];
  grouped: GroupedFilms;
  responsive?: Boolean;
}) => (
  <Calendar
    data={aggregated}
    responsive={responsive}
    from={aggregated[0].day}
    to={aggregated[aggregated.length - 1].day}
  />
);

export default FilmCalendar;
