import { Podcast } from "@bdt-types/bdt";

export const PodcastEntry = (props: { podcast: Podcast }): JSX.Element => {
  const { podcast } = props;

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
            src={podcast.feedImage}
            alt={podcast.feedTitle}
            className="poster-image"
          />
        </div>
      </div>
    </article>
  );
};