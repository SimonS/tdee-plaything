import getAllPosts from "./getAllPosts";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());
afterEach(() => nock.cleanAll());

const makePost = (suffix: string) => ({
  id: `id-${suffix}`,
  title: `Post ${suffix}`,
  slug: `post-${suffix}`,
  date: "2016-02-15T10:00:00",
  excerpt: "<p>excerpt</p>",
  content: "<p>content</p>",
});

const makePage = (
  nodes: object[],
  endCursor: string,
  hasNextPage: boolean,
) => ({
  data: {
    posts: {
      nodes,
      pageInfo: {
        endCursor,
        startCursor: "start",
        hasNextPage,
        hasPreviousPage: false,
      },
    },
  },
});

test("collects all posts across multiple pages", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, makePage([makePost("one"), makePost("two")], "cursor1", true))
    .post("/graphql")
    .reply(200, makePage([makePost("three")], "cursor2", false));

  const posts = await getAllPosts();

  expect(posts).toHaveLength(3);
  expect(posts[0].slug).toBe("post-one");
  expect(posts[2].slug).toBe("post-three");
});

test("returns empty array when there are no posts", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, makePage([], "cursor1", false));

  const posts = await getAllPosts();

  expect(posts).toHaveLength(0);
});
