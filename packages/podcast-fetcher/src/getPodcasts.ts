import { PageInfo, Podcast } from "@tdee/types/src/bdt";
import getData from "@tdee/graphql-fetcher/src/getData";

export const whereClause = "{ orderby: { field: LISTEN_DATE, order: DESC } }";

const getPodcasts = async (
  after?: string,
  first?: string
): Promise<{ podcasts: Podcast[]; meta: PageInfo }> => {
  const nodeName = "podcasts";
  const fields = [
    "listenDate",
    "podcastTitle",
    "content(format: RENDERED)",
    "overcastURL",
    "feedURL",
    "episodeURL",
    "feedTitle",
    "feedImage",
  ];

  const { data: podcasts, meta } = await getData<Podcast>(
    nodeName,
    fields,
    after,
    whereClause,
    first ?? "10"
  );

  return {
    podcasts,
    meta,
  };
};

export default getPodcasts;
