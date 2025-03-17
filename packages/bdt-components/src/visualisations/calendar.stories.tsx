import React from "react";
import { Meta } from "@storybook/react";
import Calendar from "./calendar";

export default {
  title: "Visualisations/Calendar",
  component: Calendar,
} as Meta;

const Template = (args: {
  data: { day: string; value: number }[];
  from: Date;
  to: Date;
}) => <Calendar {...args} />;

export const ExampleCalendar = Template.bind({});
ExampleCalendar.args = {
  data: [
    { day: "2022-06-04", value: 1 },
    { day: "2022-06-05", value: 4 },
    { day: "2022-06-07", value: 3 },
  ],
  from: "2020-01-01",
  to: "2022-12-31",
};
