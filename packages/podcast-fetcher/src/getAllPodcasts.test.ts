import getAllPodcasts from "./getAllPodcasts";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

const buildPodcastsResponse = (num, hasNextPage = false, reverse = false) => {
  const podcasts = Array(num)
    .fill("")
    .map((_, i) => ({
      listenDate: `2020-01-0${reverse ? num - i : num + i}`,
      podcastTitle: "Podcast title",
      overcastURL: "overcastURL",
      feedURL: "feedURL",
      episodeURL: "episodeURL",
      feedTitle: "feedTitle",
      feedImage: "feedImage.jpg",
    }));

  return {
    data: {
      podcasts: {
        nodes: podcasts,
        pageInfo: {
          endCursor: "123",
          startCursor: "321",
          hasNextPage,
          hasPreviousPage: false,
        },
      },
    },
  };
};

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

  expect(podcasts[1].listenDate).toEqual("2020-01-02");
});
