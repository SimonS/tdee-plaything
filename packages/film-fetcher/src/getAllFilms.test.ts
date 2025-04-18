import getAllFilms, {
  groupFilmsByDate,
  aggregateFilms,
  sortFilms,
} from "./getAllFilms";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

const generateFilmCollection = (num: number, reverse = false) =>
  Array(num)
    .fill("")
    .map((_, i) => ({
      watchedDate: `2020-01-0${reverse ? num - i : i + 1}`,
      filmTitle: `Film #${i}`,
      year: 2020,
      rating: 4,
      meta: {
        image: "img/dont-tell-mom-the-babysitters-dead.jpg",
        runtime: 90,
        original_language: "en",
      },
      reviewLink: "",
      content: "",
    }));

const buildFilmsResponse = (
  num: number,
  hasNextPage = false,
  reverse = false
) => ({
  data: {
    films: {
      nodes: generateFilmCollection(num, reverse),
      pageInfo: {
        endCursor: "123",
        startCursor: "321",
        hasNextPage,
        hasPreviousPage: false,
      },
    },
  },
});

test("getAllFilms works with a single page", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, buildFilmsResponse(3));

  const films = await getAllFilms();

  expect(films).toHaveLength(3);
});

test("getAllFilms returns aggregate of many pages", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .persist() // persist interceptor to catch infinite loops
    .post("/graphql")
    .reply(200, function (_, requestBody) {
      const query: string = requestBody["query"];
      const after = [...query.matchAll(/after: "(\w*)"/g)][0][1];

      if (after === "") return buildFilmsResponse(1, true);

      return buildFilmsResponse(1);
    });

  const films = await getAllFilms();

  expect(films).toHaveLength(2);
});

test("getAllFilms forces pagination of 100", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .persist() // persist interceptor to catch infinite loops
    .post("/graphql")
    .reply(200, function (_, requestBody) {
      const query: string = requestBody["query"];
      const after = [...query.matchAll(/after: "(\w*)"/g)][0][1];
      const first = [...query.matchAll(/first: (\d*)/g)][0][1];

      if (after === "") return buildFilmsResponse(parseInt(first, 10), true);

      return buildFilmsResponse(parseInt(first, 10));
    });

  const films = await getAllFilms();

  expect(films).toHaveLength(200);
});

test("sortFilms sorts films", () => {
  const retrievedFilms = generateFilmCollection(3, true);

  const sorted = sortFilms(retrievedFilms);

  expect(sorted[0].watchedDate).toEqual("2020-01-01");
});

test("groupFilmsByDate groups Films by date", () => {
  const retrievedFilms = generateFilmCollection(3);

  const grouped = groupFilmsByDate(retrievedFilms);

  expect(grouped["2020-01-01"][0].filmTitle).toEqual("Film #0");
});

test("aggregateFilms gets listen counts for a day", () => {
  const retrievedFilms = generateFilmCollection(3);

  const aggregated = aggregateFilms(groupFilmsByDate(retrievedFilms));

  expect(aggregated[0]).toMatchObject({ day: "2020-01-01", value: 1 });
});
