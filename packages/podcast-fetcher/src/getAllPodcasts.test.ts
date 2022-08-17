import getAllPodcasts from "./getAllPodcasts";
import * as nock from "nock";
import { Podcast } from "@tdee/types/src/bdt";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

test("getAllPodcasts works with a single page", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        podcasts: {
          nodes: [
            {
              listenDate: "2020-01-01",
              podcastTitle: "Podcast title",
              overcastURL: "overcastURL",
              feedURL: "feedURL",
              episodeURL: "episodeURL",
              feedTitle: "feedTitle",
              feedImage: "feedImage.jpg",
            },
            {
              listenDate: "2020-01-01",
              podcastTitle: "Podcast title",
              overcastURL: "overcastURL",
              feedURL: "feedURL",
              episodeURL: "episodeURL",
              feedTitle: "feedTitle",
              feedImage: "feedImage.jpg",
            },
            {
              listenDate: "2020-01-01",
              podcastTitle: "Podcast title",
              overcastURL: "overcastURL",
              feedURL: "feedURL",
              episodeURL: "episodeURL",
              feedTitle: "feedTitle",
              feedImage: "feedImage.jpg",
            },
          ],
          pageInfo: {
            endCursor: "123",
            startCursor: "321",
            hasNextPage: true,
            hasPreviousPage: false,
          },
        },
      },
    });

  const podcasts = await getAllPodcasts();

  expect(podcasts).toHaveLength(3);
});
