import { Podcast } from "@tdee/types/src/bdt";
import getPodcasts from "./getPodcasts";
import { groupBy } from "@tdee/data-wranglers/src/collections";

interface GraphQLMeta {
  hasNextPage: boolean;
  endCursor: string;
}

const getAllPodcasts = async (byDate = false) => {
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
    } = await getPodcasts(next);

    allPodcasts = [...allPodcasts, ...podcasts];
    morePages = meta.hasNextPage;
    next = meta.endCursor;
  }

  allPodcasts.sort((a, b) => (a.listenDate < b.listenDate ? -1 : 1));

  return allPodcasts;
};

type GroupedPodcasts = {
  [key: string]: Podcast[];
};

const groupPodcastsByDate = (podcasts: Podcast[]) =>
  groupBy(
    podcasts.map((pod) => ({
      ...pod,
      listenDate: pod.listenDate.split("T")[0],
    })),
    "listenDate"
  );

const aggregateData = <T>(data: { [key: string]: T[] }) =>
  Object.entries(data).map(([day, items]) => ({
    day,
    value: items.length,
  }));

const aggregatePodcasts = (groupedPodcasts: GroupedPodcasts) =>
  aggregateData(groupedPodcasts);

export { groupPodcastsByDate, aggregatePodcasts };

export default getAllPodcasts;