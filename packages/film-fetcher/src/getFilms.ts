import { request, gql } from "graphql-request";
import { PageInfo } from "@tdee/types/src/bdt";
import { default as getAllPages2 } from "@tdee/fetcher-paginator/src/getAllPages";

interface Film {
  title: string;
}

const getFilms = async (
  after?: string
): Promise<{ films: Film[]; meta: PageInfo }> => {
  const query = gql`
  {
    films(where: {orderby: {field: DATE_WATCHED, order: DESC}}, first: 10, after: "${
      after ? after : ""
    }") {
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
