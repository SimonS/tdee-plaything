import getPages, { getAllPages } from "./getPages";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

test("with no additional parameters, returns any pages where playground is 'true' and basic meta object", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        pages: {
          nodes: [
            {
              title: "page 1",
              content: "page 1 contents",
              slug: "page1",
            },
            {
              title: "page 2",
              content: "page 2 contents",
              slug: "page2",
            },
            {
              title: "page 3",
              content: "page 3 contents",
              slug: "page3",
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
  const { pages, meta } = await getPages();

  expect(pages).toHaveLength(3);
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
        pages: {
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

  const { meta } = await getPages(after);

  expect(meta.hasPreviousPage).toBeTruthy();
});

test("getAllPages accepts a parameter and returns paginated object", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        pages: {
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

  const result = await getAllPages(10);

  expect(result).toHaveLength(1);
});

test("when more pages available, getAllPages returns them with the relevant after prop", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        pages: {
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
        pages: {
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

  const result = await getAllPages(10);

  expect(result).toHaveLength(2);
  expect(result[1].props.after).toBe("123");
});
