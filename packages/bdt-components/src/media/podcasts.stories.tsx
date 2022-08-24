import React from "react";
import { Meta } from "@storybook/react";
import Podcasts from "./podcasts";

// TODO: make this do something

export default {
  title: "Media/Podcasts",
  component: Podcasts,
} as Meta;

export const DefaultPodcasts = (): JSX.Element => {
  return <Podcasts />;
};
