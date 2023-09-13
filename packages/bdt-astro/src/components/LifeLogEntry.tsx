import React from "react";
import { type Film, type Podcast, type Weighin } from "@bdt-types/bdt";
import { FilmEntry } from "./FilmEntry";
import { PodcastEntry } from "./PodcastEntry";
import { WeighinEntry } from "./WeighinEntry";

interface LifeLogProps {
  entry: Weighin | Podcast | Film;
}

const isPodcast = (entry: Weighin | Podcast | Film): entry is Podcast =>
  (entry as Podcast).episodeURL !== undefined;

const isFilm = (entry: Weighin | Podcast | Film): entry is Film =>
  (entry as Film).watchedDate !== undefined;

const isWeighin = (entry: Weighin | Podcast | Film): entry is Weighin =>
  (entry as Weighin).weighinTime !== undefined;

export const LifeLogEntry = ({ entry }: LifeLogProps): JSX.Element => {
  if (isFilm(entry)) return <FilmEntry film={entry} />;
  if (isPodcast(entry)) return <PodcastEntry podcast={entry} />;
  if (isWeighin(entry)) return <WeighinEntry weighin={entry} />;
};
