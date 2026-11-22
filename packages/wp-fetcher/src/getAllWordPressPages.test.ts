import getAllWordPressPages from "./getAllWordPressPages";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());
afterEach(() => nock.cleanAll());

const makePage = (slug: string) => ({
  id: `id-${slug}`,
  title: `Page ${slug}`,
  content: `<p>${slug} content</p>`,
  slug,
});

const makeResponse = (
  nodes: object[],
  endCursor: string,
  hasNextPage: boolean,
) => ({
  data: {
    pages: {
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

test("collects every page, starting from no cursor and following endCursor", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql", (body) => /after:\s*""/.test(body.query))
    .reply(200, makeResponse([makePage("now"), makePage("about")], "c1", true))
    .post("/graphql", (body) => /after:\s*"c1"/.test(body.query))
    .reply(200, makeResponse([makePage("uses")], "c2", false));

  const pages = await getAllWordPressPages();

  expect(pages.map((page) => page.slug)).toEqual(["now", "about", "uses"]);
  expect(nock.isDone()).toBe(true);
});

test("stops after a response with no next page", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, makeResponse([makePage("now")], "c1", false));

  const pages = await getAllWordPressPages();

  expect(pages).toEqual([makePage("now")]);
});
