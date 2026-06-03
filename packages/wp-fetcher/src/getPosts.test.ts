import getPosts from "./getPosts";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());
afterEach(() => nock.cleanAll());

const mockPost = {
  id: "cG9zdDoxMjM=",
  title: "Jinteki.net Plugin: Jankteki",
  slug: "jinteki-net-plugin-jankteki",
  date: "2016-02-15T10:00:00",
  excerpt: "<p>A short excerpt.</p>",
  content: "<p>The full post content.</p>",
  tags: { nodes: [{ name: "Netrunner", slug: "netrunner" }] },
  categories: { nodes: [{ name: "Tech", slug: "tech" }] },
};

test("returns posts and meta with expected fields", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        posts: {
          nodes: [mockPost],
          pageInfo: {
            endCursor: "cursor123",
            startCursor: "cursor000",
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    });

  const { posts, meta } = await getPosts();

  expect(posts).toHaveLength(1);
  expect(posts[0]).toMatchObject({
    id: mockPost.id,
    title: mockPost.title,
    slug: mockPost.slug,
    date: mockPost.date,
    excerpt: mockPost.excerpt,
    content: mockPost.content,
    tags: mockPost.tags,
    categories: mockPost.categories,
  });
  expect(meta.hasNextPage).toBe(false);
  expect(meta.endCursor).toBe("cursor123");
});

test("includes all required fields in the GraphQL query", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql", (body) =>
      [
        "id",
        "title",
        "slug",
        "date",
        "excerpt",
        "content",
        "tags",
        "categories",
      ].every((f) => body.query.includes(f)),
    )
    .reply(200, {
      data: {
        posts: {
          nodes: [],
          pageInfo: {
            endCursor: "cursor1",
            startCursor: "cursor0",
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    });

  await getPosts();

  expect(nock.isDone()).toBe(true);
});

test("includes taxonomy sub-fields in the GraphQL query", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql", (body) =>
      [
        "tags { nodes { name slug } }",
        "categories { nodes { name slug } }",
      ].every((f) => body.query.includes(f)),
    )
    .reply(200, {
      data: {
        posts: {
          nodes: [],
          pageInfo: {
            endCursor: "cursor1",
            startCursor: "cursor0",
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    });

  await getPosts();

  expect(nock.isDone()).toBe(true);
});

test("includes ordering clause in the GraphQL query", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql", (body) => body.query.includes("DATE"))
    .reply(200, {
      data: {
        posts: {
          nodes: [],
          pageInfo: {
            endCursor: "cursor1",
            startCursor: "cursor0",
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    });

  await getPosts();

  expect(nock.isDone()).toBe(true);
});

test("passes 'after' cursor to GraphQL query", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql", (body) => body.query.includes("cursor123"))
    .reply(200, {
      data: {
        posts: {
          nodes: [],
          pageInfo: {
            endCursor: "cursor456",
            startCursor: "cursor123",
            hasNextPage: false,
            hasPreviousPage: true,
          },
        },
      },
    });

  const { meta } = await getPosts("cursor123");

  expect(meta.hasPreviousPage).toBe(true);
  expect(nock.isDone()).toBe(true);
});
