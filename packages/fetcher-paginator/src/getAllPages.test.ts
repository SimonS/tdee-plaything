import { Podcast, Weighin, Film } from "@tdee/types/src/bdt";
import getAllPages from "./getAllPages";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

test("getAllPages returns every data type", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        contentNodes: {
          nodes: [
            {
              id: "weight",
              uri: "/weighin/4209/",
              weighinTime: "2022-03-09T08:01:00+0000",
              weight: 75.3,
              bodyFatPercentage: 19.67,
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
    })
    .post("/graphql")
    .reply(200, {
      data: {
        contentNodes: {
          nodes: [
            {
              id: "podcast",
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
          ],
          pageInfo: {
            endCursor: "123",
            startCursor: "321",
            hasNextPage: true,
            hasPreviousPage: true,
          },
        },
      },
    })
    .post("/graphql")
    .reply(200, {
      data: {
        contentNodes: {
          nodes: [
            {
              id: "film",
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
            hasPreviousPage: true,
          },
        },
      },
    });

  const result = await getAllPages(1);

  expect(result).toHaveLength(3);

  expect((result[0] as Weighin).weight).toEqual(75.3);
  expect((result[1] as Podcast).podcastTitle).toEqual(
    "Rangnick’s Manchester United, The ‘Michail Antonio Role’ & Can Arsenal Win the League in 4 years?"
  );
  expect((result[2] as Film).filmTitle).toEqual("Hello, My Name Is Doris");
});
