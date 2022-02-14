import getAllWeighins from "./getAllWeighins";
import * as nock from "nock";
import { CalculatedWeighin } from "@tdee/types/src/bdt";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

test("getAllWeighins works with a single page", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        weighins: {
          nodes: [
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

  const weighins = await getAllWeighins();

  expect(weighins).toHaveLength(3);
});

test("getAllWeighins returns aggregate of many pages", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        weighins: {
          nodes: [
            {
              bodyFatPercentage: 18.37,
              weighinTime: "2022-01-18T07:38:00+0000",
              weight: 76.642,
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
        weighins: {
          nodes: [
            {
              bodyFatPercentage: 19.37,
              weighinTime: "2022-01-19T07:38:00+0000",
              weight: 77.642,
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

  const weighins = await getAllWeighins();

  expect(weighins).toHaveLength(2);
});

test("optionally calculate trends", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        weighins: {
          nodes: [
            {
              bodyFatPercentage: 18.37,
              weighinTime: "2022-01-18T07:38:00+0000",
              weight: 76.642,
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

  const weighins = await getAllWeighins(true);

  expect((weighins[0] as CalculatedWeighin).weightTrend).toEqual(76.6);
});
