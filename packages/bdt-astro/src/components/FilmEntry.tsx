import { Film } from "@bdt-types/bdt";

interface FilmProps {
  film: Film;
}

export const FilmEntry = ({ film }: FilmProps): JSX.Element => {
  return (
    <article className="sidebar right">
      <div>
        <div>
          <div className="h-entry stack compressed">
            <header>
              <h2>
                {film.filmTitle} ({film.year})
              </h2>
            </header>
            <dl>
              <dt>Viewed</dt>
              <dd>
                <time className="dt-published" dateTime={film.watchedDate}>
                  {new Date(film.watchedDate).toDateString()}
                </time>
              </dd>
              {film.rating && (
                <>
                  <dt>Rated</dt>
                  <dd>{film.rating}/5</dd>
                </>
              )}
            </dl>
            {film.content && (
              <a href={film.reviewLink}>I wrote some thoughts on Letterboxd</a>
            )}
          </div>
        </div>
        <div style={{ maxWidth: "154px" }}>
          <img
            src={film.meta.image}
            alt={`Poster for '${film.filmTitle}'`}
            className="poster-image"
          />
        </div>
      </div>
    </article>
  );
};
