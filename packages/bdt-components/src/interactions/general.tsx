import React from "react";
import { CalendarDatum } from "@nivo/calendar";
import Calendar from "../visualisations/calendar";
import { WritableAtom } from "nanostores";

import { useStore } from "@nanostores/react";
import { allFormats } from "../stores/allFormats";

const GeneralCalendar = ({
  formatName,
  aggregated,
  grouped,
  responsive = true,
  store,
}: {
  formatName: string;
  aggregated: CalendarDatum[];
  grouped: Record<string, any[]>;
  responsive?: Boolean;
  store: WritableAtom;
}) => {
  const formats = useStore(allFormats);
  if (formats.formatName === "") {
    allFormats.set({ formatName, aggregated, grouped, store });
  }

  const {
    aggregated: a,
    grouped: g,
    store: s,
    formatName: name,
  } = useStore(allFormats);

  return (
    <>
      <h2>{name}</h2>
      <Calendar
        data={a}
        responsive={responsive}
        from={a[0].day}
        to={a[a.length - 1].day}
        onClick={(datum) => {
          s.set({
            ...s.get(),
            selected: datum.day,
            films: g[datum.day] ? g[datum.day] : [],
          });
        }}
      />
    </>
  );
};

export default GeneralCalendar;
