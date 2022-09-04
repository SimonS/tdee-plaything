import React from "react";
import { CalendarDatum } from "@nivo/calendar";
import { GroupedFilms } from "@tdee/types/src/bdt";
import Calendar from "../visualisations/calendar";
import { films } from "../stores/films";

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
    onClick={(datum) => {
      films.set({
        ...films.get(),
        selected: datum.day,
        films: grouped[datum.day] ? grouped[datum.day] : [],
      });
    }}
  />
);

export default FilmCalendar;
