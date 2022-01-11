import { request, gql } from "graphql-request";
import { PageInfo } from "@tdee/types/src/bdt";

interface Podcast {
  title: string;
}

export const whereClause = "{ orderby: { field: LISTEN_DATE, order: DESC } }";

const getPodcasts = async (
  after?: string
): Promise<{ podcasts: Podcast[]; meta: PageInfo }> => {
  const query = gql`
  {
    podcasts(where: ${whereClause}, first: 10, after: "${after ? after : ""}") {
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

export default getPodcasts;
