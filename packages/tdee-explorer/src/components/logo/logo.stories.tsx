import React from "react";
import Logo from "./logo";

export default { title: "Logo", component: Logo };

export const ManualHighlighting = (args): JSX.Element => {
  return <Logo {...args} />;
};

ManualHighlighting.args = {
  highlight: "Breakfast",
};

export const AutomatedHighlighting = (): JSX.Element => {
  return <Logo />;
};
