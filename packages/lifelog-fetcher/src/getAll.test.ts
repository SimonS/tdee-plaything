import getAll from "./getAll";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

test("with no additional parameters, returns most recent entries and basic meta object", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        contentNodes: {
          nodes: [
            {
              id: "cG9zdDo0MjA5",
              uri: "/weighin/4209/",
              weighinTime: "2022-03-09T08:01:00+0000",
              weight: 75.3,
              bodyFatPercentage: 19.67,
            },
            {
              id: "cG9zdDo0MjA3",
              uri: "/podcast_listen/4207/",
              listenDate: "2022-03-08T20:35:16.000Z",
              podcastTitle:
                "Rangnick’s Manchester United, The ‘Michail Antonio Role’ & Can Arsenal Win the League in 4 years?",
              content: null,
              overcastURL: "https://overcast.fm/+jeHKLUpqA",
              feedURL: "https://feeds.megaphone.fm/tamc3533486765",
              episodeURL:
                "https://theathletic.com/podcast/197-the-tifo-football-podcast/?episode=171",
              feedTitle: "",
              feedImage: "",
            },
            {
              id: "cG9zdDo0MTky",
              uri: "/film_watch/watch-of-hello-my-name-is-doris/",
              watchedDate: "2022-03-06",
              filmTitle: "Hello, My Name Is Doris",
              year: 2015,
              rating: 4,
              reviewLink:
                "https://letterboxd.com/simonscarfe/film/hello-my-name-is-doris/",
              content: null,
              meta: {
                image:
                  "https://image.tmdb.org/t/p/w154/iYRpTDqZgA3rsRh4EIkWHsMjAKd.jpg",
                runtime: 95,
                original_language: "en",
              },
            },
          ],
          pageInfo: {
            endCursor: "123",
            startCursor: "321",
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    });
  const { data, meta } = await getAll();

  expect(data).toHaveLength(3);
  expect(meta.hasNextPage).not.toBeTruthy();
});
