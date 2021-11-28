import React from "react";
import { Bin } from "./bin";

export default {
  title: "Components/Bin",
  component: Bin,
};

export const bin = (args): JSX.Element => <Bin {...args} />;

bin.args = {
  bin: "Food",
};
