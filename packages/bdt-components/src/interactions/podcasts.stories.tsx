import React from "react";
import { Meta } from "@storybook/react";
import { GroupedPodcasts } from "@tdee/types/src/bdt";
import PodcastCalendar from "./podcasts";

export default {
  title: "Interactions/Podcasts",
  component: PodcastCalendar,
} as Meta;

const Template = (args: {
  aggregated: { day: string; value: number }[];
  grouped: GroupedPodcasts;
}) => <PodcastCalendar {...args} />;

export const PodCalendar = Template.bind({});
PodCalendar.args = {
  aggregated: [
    { day: "2022-06-04", value: 1 },
    { day: "2022-06-05", value: 4 },
    { day: "2022-06-07", value: 3 },
  ],
  grouped: {},
};
