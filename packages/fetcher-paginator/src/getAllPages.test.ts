import getAllPages from "./getAllPages";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

test("getAllPages returns a paginated object", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        films: {
          nodes: [],
          pageInfo: {
            endCursor: "123",
            startCursor: "321",
            hasNextPage: false,
            hasPreviousPage: true,
          },
        },
      },
    });

  const result = await getAllPages(
    10,
    "films",
    "{ orderby: { field: DATE_WATCHED, order: DESC } }"
  );

  expect(result).toHaveLength(1);
});

test("when more pages available, getAllPages returns them with the relevant after prop", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        films: {
          nodes: [],
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
        films: {
          nodes: [],
          pageInfo: {
            endCursor: "456",
            startCursor: "321",
            hasNextPage: false,
            hasPreviousPage: true,
          },
        },
      },
    });

  const result = await getAllPages(
    10,
    "films",
    "{ orderby: { field: DATE_WATCHED, order: DESC } }"
  );

  expect(result).toHaveLength(2);
  expect(result[1].props.after).toBe("123");
});
