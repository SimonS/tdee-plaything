import { Film } from "@tdee/types/src/bdt";
import getFilms from "./getFilms";
import { groupBy, aggregateData } from "@tdee/data-wranglers/src/collections";

interface GraphQLMeta {
  hasNextPage: boolean;
  endCursor: string;
}

const getAllFilms = async () => {
  let morePages = true;
  let allFilms: Film[] = [];
  let next;

  while (morePages) {
    const {
      films,
      meta,
    }: {
      films: Film[];
      meta: GraphQLMeta;
    } = await getFilms(next, "100");

    allFilms = [...allFilms, ...films];
    morePages = meta.hasNextPage;
    next = meta.endCursor;
  }

  return allFilms;
};

const sortFilms = (films: Film[]) => {
  films.sort((a, b) => (a.watchedDate < b.watchedDate ? -1 : 1));
  return films;
};

type GroupedFilms = {
  [key: string]: Film[];
};

const groupFilmsByDate = (films: Film[]) => groupBy(films, "watchedDate");

const aggregateFilms = (groupedFilms: GroupedFilms) =>
  aggregateData(groupedFilms);

export { groupFilmsByDate, aggregateFilms, sortFilms };

export default getAllFilms;
