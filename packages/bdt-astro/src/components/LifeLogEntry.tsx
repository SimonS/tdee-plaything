import { Film, Podcast, Weighin } from "@bdt-types/bdt";
import { PodcastEntry } from "./PodcastEntry";

const isPodcast = (entry: Weighin | Podcast | Film): entry is Podcast =>
  (entry as Podcast).episodeURL !== undefined;

const isFilm = (entry: Weighin | Podcast | Film): entry is Film =>
  (entry as Film).watchedDate !== undefined;

const isWeighin = (entry: Weighin | Podcast | Film): entry is Weighin =>
  (entry as Weighin).weighinTime !== undefined;

export const LifeLogEntry = (props: {
  entry: Film | Podcast | Weighin;
}): JSX.Element => {
  const { entry } = props;

  if (isFilm(entry)) return <div>Film</div>;
  if (isPodcast(entry)) return <PodcastEntry podcast={entry} />;
  if (isWeighin(entry)) return <div>Weighin</div>;
};
