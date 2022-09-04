import { Meta } from "@storybook/react";
import { GroupedFilms } from "@tdee/types/src/bdt";
import FilmCalendar from "./films";

export default {
  title: "Interactions/Films",
  component: FilmCalendar,
} as Meta;

const Template = (args: {
  aggregated: { day: string; value: number }[];
  grouped: GroupedFilms;
}) => <FilmCalendar {...args} />;

export const MovieCalendar = Template.bind({});
MovieCalendar.args = {
  aggregated: [
    { day: "2022-06-04", value: 1 },
    { day: "2022-06-05", value: 4 },
    { day: "2022-06-07", value: 3 },
  ],
  grouped: {},
};
