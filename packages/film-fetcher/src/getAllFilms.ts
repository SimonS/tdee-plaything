import { Film } from "@tdee/types/src/bdt";
import getFilms from "./getFilms";
import { groupBy } from "@tdee/data-wranglers/src/collections";

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
    } = await getFilms(next);

    allFilms = [...allFilms, ...films];
    morePages = meta.hasNextPage;
    next = meta.endCursor;
  }

  allFilms.sort((a, b) => (a.watchedDate < b.watchedDate ? -1 : 1));

  return allFilms;
};

type GroupedFilms = {
  [key: string]: Film[];
};

const groupFilmsByDate = (films: Film[]) => groupBy(films, "watchedDate");

const aggregateFilms = (groupedFilms: GroupedFilms) =>
  Object.entries(groupedFilms).map(([day, films]) => ({
    day,
    value: films.length,
  }));

export { groupFilmsByDate, aggregateFilms };

export default getAllFilms;
