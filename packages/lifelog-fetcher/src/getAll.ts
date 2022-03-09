import { PageInfo, Film, Podcast, Weighin } from "@tdee/types/src/bdt";
import { request, gql } from "graphql-request";

const getAll = async (
  after?: string
): Promise<{ data: (Film | Podcast | Weighin)[]; meta: PageInfo }> => {
  const query = gql`
    {
      contentNodes(
        where: { contentTypes: [BDT_WEIGHIN, BDT_FILM, BDT_PODCAST] }
      ) {
        nodes {
          ... on Weighin {
            weighinTime
            weight
            bodyFatPercentage
          }
          ... on Podcast {
            listenDate
            podcastTitle
            content(format: RENDERED)
            overcastURL
            feedURL
            episodeURL
            feedTitle
            feedImage
          }
          ... on Film {
            watchedDate
            filmTitle
            year
            rating
            reviewLink
            content
            meta {
              image
              runtime
              original_language
            }
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

  const { data, meta } = await request(
    "https://breakfastdinnertea.co.uk/graphql",
    query
  ).then(
    (data: {
      contentNodes: { nodes: (Film | Podcast | Weighin)[]; pageInfo: PageInfo };
    }) => {
      return {
        data: data.contentNodes.nodes,
        meta: data.contentNodes.pageInfo,
      };
    }
  );

  return {
    data,
    meta,
  };
};

export default getAll;
