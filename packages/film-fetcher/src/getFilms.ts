import { PageInfo, Film } from "@tdee/types/src/bdt";
import getData from "@tdee/graphql-fetcher/src/getData";

export const whereClause = "{orderby: {field: DATE_WATCHED, order: DESC}}";

const getFilms = async (
  after?: string,
  first?: string
): Promise<{ films: Film[]; meta: PageInfo }> => {
  const nodeName = "films";
  const fields = [
    "watchedDate",
    "filmTitle",
    "year",
    "rating",
    "reviewLink",
    "content",
    "meta { image runtime original_language }", // I know, not pretty
  ];

  const { data: films, meta } = await getData<Film>(
    nodeName,
    fields,
    after,
    whereClause,
    first ?? "10"
  );

  return {
    films,
    meta,
  };
};

export default getFilms;
