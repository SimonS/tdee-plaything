import { Podcast } from "@tdee/types/src/bdt";
import getPodcasts from "./getPodcasts";

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
  podcasts.reduce<GroupedPodcasts>((acc, podcast) => {
    const date = podcast.listenDate.split("T")[0];

    if (acc[date] === undefined) acc[date] = [];
    acc[date].push({ ...podcast });

    return acc;
  }, {});

const aggregatePodcasts = (groupedPodcasts: GroupedPodcasts) =>
  Object.entries(groupedPodcasts).map(([day, podcasts]) => ({
    day,
    value: podcasts.length,
  }));

export { groupPodcastsByDate, aggregatePodcasts };

export default getAllPodcasts;
