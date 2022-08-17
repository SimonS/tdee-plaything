import { Podcast } from "@tdee/types/src/bdt";
import getPodcasts from "./getPodcasts";

interface GraphQLMeta {
  hasNextPage: boolean;
  endCursor: string;
}

const getAllPodcasts = async (processWeights = false) => {
  let morePages = true;
  let allPodcasts: Podcast[] = [];
  let next;

  while (morePages) {
    const {
      podcasts,
      meta,
    }: {
      podcasts: Podcast[];
      meta: GraphQLMeta;
    } = await getPodcasts();

    allPodcasts = [...allPodcasts, ...podcasts];
    morePages = meta.hasNextPage;
    next = meta.endCursor;
  }

  return allPodcasts;
};

export default getAllPodcasts;
