import { request, gql } from "graphql-request";
const query = gql`
  {
    films(where: { orderby: { field: DATE_WATCHED, order: DESC } }, first: 10) {
      nodes {
        watchedDate
        filmTitle
        year
        rating
        reviewLink
        content(format: RENDERED)
        meta {
          image
          runtime
          original_language
        }
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

interface Film {
  title: string;
}

interface PageInfo {
  endCursor: string;
  startCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const getFilms = async (): Promise<{ films: Film[]; meta: PageInfo }> => {
  const { films, meta } = await request(
    "https://breakfastdinnertea.co.uk/graphql",
    query
  ).then((data: { films: { nodes: Film[]; pageInfo: PageInfo } }) => {
    return { films: data.films.nodes, meta: data.films.pageInfo };
  });

  return {
    films,
    meta,
  };
};

export default getFilms;
