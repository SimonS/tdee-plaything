import getData from "./getData";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

afterEach(() => nock.cleanAll());

test("with no additional parameters, returns most recent podcasts and basic meta object", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        podcasts: {
          nodes: [
            {
              listenDate: "2020-01-01",
              podcastTitle: "Podcast title",
              overcastURL: "overcastURL",
              feedURL: "feedURL",
              episodeURL: "episodeURL",
              feedTitle: "feedTitle",
              feedImage: "feedImage.jpg",
            },
            {
              listenDate: "2020-01-01",
              podcastTitle: "Podcast title",
              overcastURL: "overcastURL",
              feedURL: "feedURL",
              episodeURL: "episodeURL",
              feedTitle: "feedTitle",
              feedImage: "feedImage.jpg",
            },
            {
              listenDate: "2020-01-01",
              podcastTitle: "Podcast title",
              overcastURL: "overcastURL",
              feedURL: "feedURL",
              episodeURL: "episodeURL",
              feedTitle: "feedTitle",
              feedImage: "feedImage.jpg",
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

  const nodeName = "podcasts";
  const whereClause = "{ orderby: { field: LISTEN_DATE, order: DESC } }";
  const fields = [
    "listenDate",
    "podcastTitle",
    "content(format: RENDERED)",
    "overcastURL",
    "feedURL",
    "episodeURL",
    "feedTitle",
    "feedImage",
  ];

  interface Podcast {
    podcastTitle: string;
  }

  const { data, meta } = await getData<Podcast>(nodeName, fields, whereClause);

  expect(data).toHaveLength(3);
  expect(meta.hasNextPage).toBeTruthy();
});

test("make where optional", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, {
      data: {
        podcasts: {
          nodes: [
            {
              listenDate: "2020-01-01",
              podcastTitle: "Podcast title",
              overcastURL: "overcastURL",
              feedURL: "feedURL",
              episodeURL: "episodeURL",
              feedTitle: "feedTitle",
              feedImage: "feedImage.jpg",
            },
            {
              listenDate: "2020-01-01",
              podcastTitle: "Podcast title",
              overcastURL: "overcastURL",
              feedURL: "feedURL",
              episodeURL: "episodeURL",
              feedTitle: "feedTitle",
              feedImage: "feedImage.jpg",
            },
            {
              listenDate: "2020-01-01",
              podcastTitle: "Podcast title",
              overcastURL: "overcastURL",
              feedURL: "feedURL",
              episodeURL: "episodeURL",
              feedTitle: "feedTitle",
              feedImage: "feedImage.jpg",
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

  const nodeName = "podcasts";
  const fields = [
    "listenDate",
    "podcastTitle",
    "content(format: RENDERED)",
    "overcastURL",
    "feedURL",
    "episodeURL",
    "feedTitle",
    "feedImage",
  ];

  interface Podcast {
    podcastTitle: string;
  }

  const { data, meta } = await getData<Podcast>(nodeName, fields);

  expect(data).toHaveLength(3);
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
        podcasts: {
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

  const nodeName = "podcasts";
  const whereClause = "{ orderby: { field: LISTEN_DATE, order: DESC } }";
  const fields = [
    "listenDate",
    "podcastTitle",
    "content(format: RENDERED)",
    "overcastURL",
    "feedURL",
    "episodeURL",
    "feedTitle",
    "feedImage",
  ];

  const { meta } = await getData(nodeName, fields, whereClause, after);

  expect(meta.hasPreviousPage).toBeTruthy();
});
