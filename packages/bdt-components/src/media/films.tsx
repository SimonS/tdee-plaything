import React from "react";
import { FilmEntry } from "./film-entry";

import { useStore } from "@nanostores/react";
import { films as filmsStore } from "../stores/films";

export const Films = (): JSX.Element => {
  const { films, selected } = useStore(filmsStore);

  if (selected === undefined)
    return <p>Click a date to show films watched that day</p>;

  return (
    <div className="stack selected-media">
      <h2>Date: {new Date(selected).toDateString()}</h2>
      {films.length ? (
        films.map((film, i) => <FilmEntry key={`podcast-${i}`} film={film} />)
      ) : (
        <p>No films watched</p>
      )}
    </div>
  );
};

export default Films;
