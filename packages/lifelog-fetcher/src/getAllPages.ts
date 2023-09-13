import { request, gql } from "graphql-request";
import { PageInfo, Film, Podcast, Weighin } from "@tdee/types/src/bdt";

export const getAllPages = async (
  pageSize: number
): Promise<(Film | Podcast | Weighin)[]> => {
  const query = gql`
    query nextPage($first: Int, $after: String) {
      contentNodes(
        where: { contentTypes: [BDT_WEIGHIN, BDT_FILM, BDT_PODCAST] }
        first: $first
        after: $after
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

  const getNextPage = async (after?: string) =>
    await request("https://breakfastdinnertea.co.uk/graphql", query, {
      first: pageSize,
      after: after ? after : "",
    }).then(
      (data: {
        contentNodes: {
          nodes: (Film | Podcast | Weighin)[];
          pageInfo: PageInfo;
        };
      }) => {
        return {
          data: data.contentNodes?.nodes,
          meta: data.contentNodes?.pageInfo,
        };
      }
    );

  let { data, meta } = await getNextPage();

  let results: (Film | Podcast | Weighin)[] = [...data];

  while (meta.hasNextPage) {
    const next = await getNextPage(meta.endCursor);
    results = results.concat(...next.data);
    meta = next.meta;
  }

  return results;
};

export default getAllPages;
