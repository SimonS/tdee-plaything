import React from "react";
import { PodcastEntry } from "./podcast-entry";

import { useStore } from "@nanostores/react";
import { podcasts as podcastsStore } from "../stores/podcasts";

export const Podcasts = (): JSX.Element => {
  const { podcasts, selected } = useStore(podcastsStore);

  if (selected === undefined)
    return <p>Click a date to show listened podcasts for that day</p>;

  return (
    <div className="stack selected-media">
      <h2>Date: {new Date(selected).toDateString()}</h2>
      {podcasts.length ? (
        podcasts.map((podcast, i) => (
          <PodcastEntry key={`podcast-${i}`} podcast={podcast} />
        ))
      ) : (
        <p>No listens recorded</p>
      )}
    </div>
  );
};

export default Podcasts;
