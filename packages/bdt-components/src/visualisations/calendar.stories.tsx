import { Meta } from "@storybook/react";
import Calendar from "./calendar";

export default {
  title: "Visualisations/Calendar",
  component: Calendar,
} as Meta;

export const calendar = (): JSX.Element => <Calendar />;
