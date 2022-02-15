import getAllWeighins from "./getAllWeighins";
import * as nock from "nock";
import { CalculatedWeighin } from "@tdee/types/src/bdt";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

const buildGraphQLResponse = (nodes, hasNextPage = false) => ({
  data: {
    weighins: {
      nodes,
      pageInfo: {
        endCursor: "123",
        startCursor: "321",
        hasNextPage,
        hasPreviousPage: false,
      },
    },
  },
});

test("getAllWeighins works with a single page", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(
      200,
      buildGraphQLResponse([
        {
          bodyFatPercentage: 18.37,
          weighinTime: "2022-01-18T07:38:00+0000",
          weight: 76.642,
        },
        {
          bodyFatPercentage: 19.71,
          weighinTime: "2022-01-17T07:40:00+0000",
          weight: 74.892,
        },
        {
          bodyFatPercentage: 19.82,
          weighinTime: "2022-01-15T08:33:00+0000",
          weight: 75.48,
        },
      ])
    );

  const weighins = await getAllWeighins();

  expect(weighins).toHaveLength(3);
});
test("getAllWeighins sorts the results", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(
      200,
      buildGraphQLResponse([
        {
          bodyFatPercentage: 18.37,
          weighinTime: "2022-01-14T07:38:00+0000",
          weight: 76.642,
        },
        {
          bodyFatPercentage: 19.71,
          weighinTime: "2022-01-17T07:40:00+0000",
          weight: 74.892,
        },
        {
          bodyFatPercentage: 19.82,
          weighinTime: "2022-01-15T08:33:00+0000",
          weight: 75.48,
        },
      ])
    );

  const weighins = await getAllWeighins();

  expect(weighins[2].weight).toBe(74.892);
});

test("getAllWeighins returns aggregate of many pages", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(
      200,
      buildGraphQLResponse(
        [
          {
            bodyFatPercentage: 18.37,
            weighinTime: "2022-01-18T07:38:00+0000",
            weight: 76.642,
          },
        ],
        true
      )
    )
    .post("/graphql")
    .reply(
      200,
      buildGraphQLResponse([
        {
          bodyFatPercentage: 19.37,
          weighinTime: "2022-01-19T07:38:00+0000",
          weight: 77.642,
        },
      ])
    );

  const weighins = await getAllWeighins();

  expect(weighins).toHaveLength(2);
});

test("optionally calculate trends", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(
      200,
      buildGraphQLResponse([
        {
          bodyFatPercentage: 18.37,
          weighinTime: "2022-01-18T07:38:00+0000",
          weight: 76.642,
        },
      ])
    );

  const weighins = await getAllWeighins(true);

  expect((weighins[0] as CalculatedWeighin).weightTrend).toEqual(76.6);
});
