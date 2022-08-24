import React from "react";
import { Podcast } from "@tdee/types/src/bdt";

interface PodcastProps {
  podcast: Podcast;
}

export const PodcastEntry = ({ podcast }: PodcastProps): JSX.Element => {
  return (
    <article className="sidebar right">
      <div>
        <div>
          <div className="h-entry stack compressed">
            <header>
              <h2>{podcast.podcastTitle}</h2>
            </header>
            <dl>
              <dt>Listened</dt>
              <dd>
                <time className="dt-published" dateTime={podcast.listenDate}>
                  {new Date(podcast.listenDate).toDateString()}
                </time>
              </dd>
              <dt>Podcast</dt>
              <dd>
                <a href={podcast.episodeURL}>{podcast.feedTitle}</a>
              </dd>
            </dl>
          </div>
        </div>
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
      </div>
    </article>
  );
};
