import React from "react";
import { Film } from "@tdee/types/src/bdt";

interface FilmProps {
  film: Film;
}

export const FilmEntry = ({ film }: FilmProps): JSX.Element => {
  return (
    <article className="sidebar left">
      <div>
        <div style={{ maxWidth: "154px" }}>
          <img
            src={
              film.meta.image
                ? film.meta.image
                : `https://placekitten.com/154/154?pod=${film.filmTitle}`
            }
            alt={`poster for ${film.filmTitle}`}
            className="poster-image"
            width={154}
            height={154}
          />
        </div>
        <div>
          <div className="h-entry stack compressed">
            <p>
              {film.filmTitle} ({film.year}) <br />
              {film.rating && `Rated: ${film.rating}/5`}
              <br />
              {film.reviewLink && (
                <a href={film.reviewLink}>reviewed on Letterboxd</a>
              )}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
