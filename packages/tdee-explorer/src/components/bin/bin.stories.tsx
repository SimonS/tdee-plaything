import React from "react";
import { withKnobs, radios } from "@storybook/addon-knobs";
import { Bin } from "./bin";
import { BinType } from "@tdee/bin-day-fetcher/src/getBinDays";

export default {
  title: "Bin",
  component: Bin,
  decorators: [withKnobs],
};

export const BinStory = (): JSX.Element => (
  <Bin bin={radios("Bin Type", BinType, BinType.FOOD)} />
);
