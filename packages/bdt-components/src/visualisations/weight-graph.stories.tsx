import { Meta } from "@storybook/react";
import WeightGraph from "./weight-graph";
import { Weighin } from "@tdee/types/src/bdt";

export default {
  title: "Visualisations/WeightGraph",
  component: WeightGraph,
} as Meta;

export const weightGraph = (args: { weighins: Weighin[] }): JSX.Element => (
  <WeightGraph {...args} />
);

weightGraph.args = {
  weighins: [
    {
      weighinTime: "2022-01-11T07:21:00+0000",
      weight: 76.262,
      bodyFatPercentage: 20.01,
    },
    {
      weighinTime: "2022-01-10T07:58:00+0000",
      weight: 75.228,
      bodyFatPercentage: 20.27,
    },
    {
      weighinTime: "2022-01-08T08:34:00+0000",
      weight: 75.859,
      bodyFatPercentage: 20.06,
    },
    {
      weighinTime: "2022-01-07T08:05:00+0000",
      weight: 76.068,
      bodyFatPercentage: 21.03,
    },
    {
      weighinTime: "2022-01-06T07:18:00+0000",
      weight: 76.049,
      bodyFatPercentage: 21.34,
    },
    {
      weighinTime: "2022-01-05T08:41:00+0000",
      weight: 77.068,
      bodyFatPercentage: 20.1,
    },
    {
      weighinTime: "2022-01-04T08:33:00+0000",
      weight: 78.397,
      bodyFatPercentage: 19.96,
    },
    {
      weighinTime: "2022-01-03T10:07:00+0000",
      weight: 79.341,
      bodyFatPercentage: 19.21,
    },
    {
      weighinTime: "2021-12-22T08:02:00+0000",
      weight: 75.706,
      bodyFatPercentage: 17.48,
    },
    {
      weighinTime: "2021-12-21T08:08:00+0000",
      weight: 76.092,
      bodyFatPercentage: 18.64,
    },
  ],
  filter: {
    from: "2021-12-23T08:08:00+0000",
    displayDatesAtATime: 5,
  },
};
