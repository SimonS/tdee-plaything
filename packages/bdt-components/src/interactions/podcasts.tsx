import React from "react";
import { CalendarDatum } from "@nivo/calendar";
import { Podcast, GroupedPodcasts } from "@tdee/types/src/bdt";
import Calendar from "../visualisations/calendar";

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
  />
);

export default PodcastCalendar;
