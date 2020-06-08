import React from "react";
import { withKnobs, text } from "@storybook/addon-knobs";
import Nav from "./nav";
import Stack from "../../layouts/stack";

export default {
  title: "Navigation",
  component: Nav,
  decorators: [withKnobs],
};

export const navigation = (): JSX.Element => {
  return (
    <Stack>
      <Nav url={text("URL", "/")} />
    </Stack>
  );
};
