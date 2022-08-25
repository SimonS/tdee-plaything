import React from "react";
import { CalendarDatum } from "@nivo/calendar";
import { GroupedPodcasts } from "@tdee/types/src/bdt";
import Calendar from "../visualisations/calendar";
import { podcasts } from "../stores/podcasts";

const PodcastCalendar = ({
  aggregated,
  grouped,
  responsive = true,
}: {
  aggregated: CalendarDatum[];
  grouped: GroupedPodcasts;
  responsive?: Boolean;
}) => (
  <Calendar
    data={aggregated}
    responsive={responsive}
    from={aggregated[0].day}
    to={aggregated[aggregated.length - 1].day}
    onClick={(datum) => {
      podcasts.set({
        ...podcasts.get(),
        selected: datum.day,
        podcasts: grouped[datum.day] ? grouped[datum.day] : [],
      });
    }}
  />
);

export default PodcastCalendar;
