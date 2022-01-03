import { request, gql } from "graphql-request";
import { PageInfo } from "@bdt-types/bdt";

interface Podcast {
  title: string;
}

const getPodcasts = async (
  after?: string
): Promise<{ podcasts: Podcast[]; meta: PageInfo }> => {
  const query = gql`
  {
    podcasts(where: {orderby: {field: LISTEN_DATE, order: DESC}}, first: 10, after: "${
      after ? after : ""
    }") {
      nodes {
        listenDate
        podcastTitle
        content(format: RENDERED)
        overcastURL
        feedURL
        episodeURL
        feedTitle
        feedImage
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

  const { podcasts, meta } = await request(
    "https://breakfastdinnertea.co.uk/graphql",
    query
  ).then((data: { podcasts: { nodes: Podcast[]; pageInfo: PageInfo } }) => {
    return { podcasts: data.podcasts.nodes, meta: data.podcasts.pageInfo };
  });

  return {
    podcasts,
    meta,
  };
};

export const getAllPages = async (
  pageSize: number
): Promise<{ params: { pagenum: string }; props?: { after: string } }[]> => {
  const query = gql`
    query nextPage($first: Int, $after: String) {
      podcasts(
        where: { orderby: { field: LISTEN_DATE, order: DESC } }
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
      return { meta: data.podcasts.pageInfo };
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

export default getPodcasts;
