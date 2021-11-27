import React from "react";
import { Meta } from "@storybook/react";
import Logo, { LogoProps } from "./logo";

export default {
  title: "Components/Logo",
  component: Logo,
} as Meta;

export const ManualHighlighting = (args: LogoProps): JSX.Element => {
  return <Logo {...args} />;
};

ManualHighlighting.args = {
  highlight: "Dinner",
};

export const AutomatedHighlighting = (): JSX.Element => {
  return <Logo />;
};
