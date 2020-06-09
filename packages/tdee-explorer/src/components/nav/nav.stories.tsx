import React from "react";
import Nav from "./nav";
import Stack from "../../layouts/stack";

export default {
  title: "Navigation",
  component: Nav,
};

export const navigation = (args): JSX.Element => {
  return (
    <Stack>
      <Nav {...args} />
    </Stack>
  );
};

navigation.args = {
  url: "/",
};
