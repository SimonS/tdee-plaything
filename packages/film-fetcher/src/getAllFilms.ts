import { Film } from "@tdee/types/src/bdt";
import getFilms from "./getFilms";

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

const groupFilmsByDate = (films: Film[]) =>
  films.reduce<GroupedFilms>((acc, film) => {
    const date = film.watchedDate.split("T")[0];

    if (acc[date] === undefined) acc[date] = [];
    acc[date].push({ ...film });

    return acc;
  }, {});

export { groupFilmsByDate };

export default getAllFilms;
