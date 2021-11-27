import React from "react";
import { Bin } from "./bin";
import { BinType } from "@tdee/bin-day-fetcher/src/getBinDays";

export default {
  title: "Components/Bin",
  component: Bin,
};

export const bin = (args: { bin: BinType }): JSX.Element => <Bin {...args} />;

bin.args = {
  bin: "Food",
};
