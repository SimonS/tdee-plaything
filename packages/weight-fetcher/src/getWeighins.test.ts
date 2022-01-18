import getWeighins from "./getWeighins";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

test("with no additional parameters, returns most recent weighins and basic meta object", async () => {
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
            hasNextPage: true,
            hasPreviousPage: false,
          },
        },
      },
    });
  const { weighins, meta } = await getWeighins();

  expect(weighins).toHaveLength(3);
  expect(meta.hasNextPage).toBeTruthy();
});

test("accepts 'after' as a parameter and sends it to graphql", async () => {
  const after = "123";

  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql", (body) => {
      return body.query.indexOf(after) !== -1;
    })
    .reply(200, {
      data: {
        weighins: {
          nodes: [],
          pageInfo: {
            endCursor: "123",
            startCursor: "321",
            hasNextPage: true,
            hasPreviousPage: true,
          },
        },
      },
    });

  const { meta } = await getWeighins(after);

  expect(meta.hasPreviousPage).toBeTruthy();
});
