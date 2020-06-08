import React, { ReactText } from "react";
import { withKnobs, radios } from "@storybook/addon-knobs";
import Logo, { LogoState } from "./logo";

export default { title: "Logo", component: Logo, decorators: [withKnobs] };

export const AutomatedHighlighting = (): JSX.Element => {
  return <Logo />;
};

export const ManualHighlighting = (): JSX.Element => {
  const states: Record<ReactText, LogoState> = {
    Breakfast: "Breakfast",
    Dinner: "Dinner",
    Tea: "Tea",
  };
  return <Logo highlight={radios("Highlight", states, "Breakfast")} />;
};
