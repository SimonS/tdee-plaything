import getAllPodcasts, {
  groupPodcastsByDate,
  aggregatePodcasts,
} from "./getAllPodcasts";
import * as nock from "nock";
import { Podcast } from "@tdee/types/src/bdt";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

const generatePodcastCollection = (num: number, reverse = false): Podcast[] =>
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

const buildPodcastsResponse = (
  num: number,
  hasNextPage = false,
  reverse = false
) => ({
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
    .persist() // persist interceptor to catch infinite loops
    .post("/graphql")
    .reply(200, function (_, requestBody) {
      const query: string = requestBody["query"];
      const after = [...query.matchAll(/after: "(\w*)"/g)][0][1];

      if (after === "") return buildPodcastsResponse(1, true);

      return buildPodcastsResponse(1);
    });

  const podcasts = await getAllPodcasts();

  expect(podcasts).toHaveLength(2);
});

test("getAllPodcasts paginates 100 at a time", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .persist() // persist interceptor to catch infinite loops
    .post("/graphql")
    .reply(200, function (_, requestBody) {
      const query: string = requestBody["query"];
      const after = [...query.matchAll(/after: "(\w*)"/g)][0][1];
      const first = [...query.matchAll(/first: (\d*)/g)][0][1];

      if (after === "") return buildPodcastsResponse(parseInt(first, 10), true);

      return buildPodcastsResponse(parseInt(first, 10));
    });

  const podcasts = await getAllPodcasts();

  expect(podcasts).toHaveLength(200);
});

test("getAllPodcasts sorts podcasts", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, buildPodcastsResponse(4, false, true));

  const podcasts = await getAllPodcasts();

  expect(podcasts[1].listenDate).toEqual("2020-01-02T000000");
});

test("getAllPodcasts has option not to sort podcasts", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, buildPodcastsResponse(4, false, true));

  const podcasts = await getAllPodcasts(false, false);

  expect(podcasts[0].listenDate).toEqual("2020-01-04T000000");
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
