import getAllPodcasts, {
  groupPodcastsByDate,
  aggregatePodcasts,
} from "./getAllPodcasts";
import * as nock from "nock";
import { Podcast } from "@tdee/types/src/bdt";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

const generatePodcastCollection = (num, reverse = false): Podcast[] =>
  Array(num)
    .fill("")
    .map((_, i) => ({
      listenDate: `2020-01-0${reverse ? num - i : i + 1}T000000`,
      podcastTitle: `Podcast title ${i}`,
      overcastURL: "overcastURL",
      feedURL: "feedURL",
      episodeURL: "episodeURL",
      feedTitle: "feedTitle",
      feedImage: "feedImage.jpg",
      content: "",
    }));

const buildPodcastsResponse = (num, hasNextPage = false, reverse = false) => ({
  data: {
    podcasts: {
      nodes: generatePodcastCollection(num, reverse),
      pageInfo: {
        endCursor: "123",
        startCursor: "321",
        hasNextPage,
        hasPreviousPage: false,
      },
    },
  },
});

test("getAllPodcasts works with a single page", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, buildPodcastsResponse(3));

  const podcasts = await getAllPodcasts();

  expect(podcasts).toHaveLength(3);
});

test("getAllPodcasts returns aggregate of many pages", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, buildPodcastsResponse(1, true))
    .post("/graphql")
    .reply(200, buildPodcastsResponse(1));

  const podcasts = await getAllPodcasts();

  expect(podcasts).toHaveLength(2);
});

test("getAllPodcasts sorts podcasts", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, buildPodcastsResponse(4, false, true));

  const podcasts = await getAllPodcasts();

  expect(podcasts[1].listenDate).toEqual("2020-01-02T000000");
});

test("groupByDate groups podcasts by date", () => {
  const retrievedPodcasts = generatePodcastCollection(3);

  const grouped = groupPodcastsByDate(retrievedPodcasts);

  expect(grouped["2020-01-01"][0].podcastTitle).toEqual("Podcast title 0");
});

test("aggregatePodcasts gets listen counts for a day", () => {
  const retrievedPodcasts = generatePodcastCollection(3);

  const aggregated = aggregatePodcasts(groupPodcastsByDate(retrievedPodcasts));

  expect(aggregated[0]).toMatchObject({ day: "2020-01-01", value: 1 });
});
