import React from "react";
import { Meta } from "@storybook/react";
import Podcasts from "./podcasts";
import { podcasts as podcastsStore } from "../stores/podcasts";
import { Podcast } from "@tdee/types/src/bdt";

export default {
  title: "Media/Podcasts",
  component: Podcasts,
  argTypes: {
    podcasts: { control: "object" },
  },
} as Meta;

export const DefaultPodcasts = ({
  podcasts,
}: {
  podcasts: Podcast[];
}): JSX.Element => {
  podcastsStore.set({ ...podcastsStore.get(), podcasts });
  return <Podcasts />;
};

DefaultPodcasts.args = {
  podcasts: [
    {
      listenDate: "2022-01-01",
      content: "content",
      podcastTitle: "Podcast #1",
      overcastURL: "",
      feedURL: "",
      episodeURL: "",
      feedTitle: "Podcast",
      feedImage: "",
    },
    {
      listenDate: "2022-01-01",
      content: "content",
      podcastTitle: "Podcast #2",
      overcastURL: "",
      feedURL: "",
      episodeURL: "",
      feedTitle: "Podcast",
      feedImage: "",
    },
  ],
};
