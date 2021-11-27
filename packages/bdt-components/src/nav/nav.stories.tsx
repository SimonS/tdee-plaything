import React from "react";
import Nav from "./nav";
import Stack from "../layouts/stack/stack";

export default {
  title: "Components/Navigation",
  component: Nav,
};

export const navigation = (args: { url?: string }): JSX.Element => {
  return (
    <Stack>
      <Nav {...args} />
    </Stack>
  );
};

navigation.args = {
  url: "/",
};
