import React from "react";
import { PodcastEntry } from "./podcast-entry";

import { useStore } from "@nanostores/react";
import { podcasts as podcastsStore } from "../stores/podcasts";

export const Podcasts = (): JSX.Element => {
  const { podcasts } = useStore(podcastsStore);
  if (podcasts.length === 0)
    return <div>Click a date to show listened podcasts for that day</div>;

  return (
    <>
      {podcasts.map((podcast, i) => (
        <PodcastEntry key={`podcast-${i}`} podcast={podcast} />
      ))}
    </>
  );
};

export default Podcasts;
