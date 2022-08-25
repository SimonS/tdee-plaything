import React from "react";
import { Podcast } from "@tdee/types/src/bdt";

interface PodcastProps {
  podcast: Podcast;
}

export const PodcastEntry = ({ podcast }: PodcastProps): JSX.Element => {
  return (
    <article className="sidebar left">
      <div>
        <div style={{ maxWidth: "154px" }}>
          <img
            src={
              podcast.feedImage
                ? podcast.feedImage
                : `https://placekitten.com/154/154?pod=${podcast.episodeURL}`
            }
            alt={podcast.feedTitle}
            className="poster-image"
            width={154}
            height={154}
          />
        </div>
        <div>
          <div className="h-entry stack compressed">
            <p>
              {podcast.feedTitle} /{" "}
              <a href={podcast.episodeURL}>{podcast.podcastTitle}</a>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
