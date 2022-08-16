import { PageInfo, Podcast } from "@tdee/types/src/bdt";
import getPodcasts from "./getPodcasts";

export const whereClause = "{ orderby: { field: LISTEN_DATE, order: DESC } }";

const getAllPodcasts = async () => {
  let morePages = true;
  let allPodcasts: Podcast[] = [];
  let next;

  while (morePages) {
    const { podcasts, meta } = await getPodcasts(next);

    allPodcasts = [...allPodcasts, ...podcasts];
    morePages = meta.hasNextPage;
    next = meta.endCursor;
  }

  return allPodcasts;
};

export default getAllPodcasts;
