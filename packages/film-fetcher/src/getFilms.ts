import { request, gql } from "graphql-request";
import { PageInfo } from "@tdee/types/src/bdt";

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

export const getAllPages = async (
  pageSize: number
): Promise<{ params: { pagenum: string }; props?: { after: string } }[]> => {
  const query = gql`
    query nextPage($first: Int, $after: String) {
      films(
        where: { orderby: { field: DATE_WATCHED, order: DESC } }
        first: $first
        after: $after
      ) {
        pageInfo {
          endCursor
          startCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `;

  const getNextPage = async (after?: string) =>
    await request("https://breakfastdinnertea.co.uk/graphql", query, {
      first: pageSize,
      after: after ? after : "",
    }).then((data) => {
      return { meta: data.films.pageInfo };
    });

  const countToObject = (count: number, meta: { endCursor: string }) => {
    return {
      params: { pagenum: count.toString() },
      props: { after: meta.endCursor },
    };
  };

  let count = 2;
  let { meta } = await getNextPage();

  const paths = [];
  paths.push({ params: { pagenum: "1" } });

  while (meta.hasNextPage) {
    paths.push(countToObject(count++, meta));
    ({ meta } = await getNextPage(meta.endCursor));
  }

  return paths;
};

export default getFilms;
