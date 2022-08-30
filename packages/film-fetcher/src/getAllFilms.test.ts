import getAllFilms from "./getAllFilms";
import * as nock from "nock";
import { Film } from "@tdee/types/src/bdt";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

test("getAllFilms works with a single page", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        films: {
          nodes: [
            {
              watchedDate: "2020-01-01",
              filmTitle: "Don't Tell Mom The Babysitter's Dead",
              year: "2020",
              rating: "4",
              meta: {
                image: "img/dont-tell-mom-the-babysitters-dead.jpg",
                runtime: "1h 30m",
                original_language: "en",
              },
            },
            {
              watchedDate: "2020-01-01",
              filmTitle: "Don't Tell Mom The Babysitter's Dead",
              year: "2020",
              rating: "4",
              meta: {
                image: "img/dont-tell-mom-the-babysitters-dead.jpg",
                runtime: "1h 30m",
                original_language: "en",
              },
            },
            {
              watchedDate: "2020-01-01",
              filmTitle: "Don't Tell Mom The Babysitter's Dead",
              year: "2020",
              rating: "4",
              meta: {
                image: "img/dont-tell-mom-the-babysitters-dead.jpg",
                runtime: "1h 30m",
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

  const films = await getAllFilms();

  expect(films).toHaveLength(3);
});
