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

  return allFilms;
};

export default getAllFilms;
