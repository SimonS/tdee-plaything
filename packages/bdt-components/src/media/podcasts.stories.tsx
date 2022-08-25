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
  selected,
}: {
  podcasts: Podcast[];
  selected?: string;
}): JSX.Element => {
  podcastsStore.set({
    ...podcastsStore.get(),
    podcasts,
    selected,
  });
  return <Podcasts />;
};

export const NoPodcastListens = (): JSX.Element => {
  podcastsStore.set({
    ...podcastsStore.get(),
    podcasts: [],
    selected: "2022-01-01",
  });
  return <Podcasts />;
};

export const NoDateSelected = (): JSX.Element => {
  podcastsStore.set({
    ...podcastsStore.get(),
    podcasts: [],
    selected: undefined,
  });
  return <Podcasts />;
};

DefaultPodcasts.args = {
  selected: "2022-01-01",
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
