import getActivities from "./getActivities";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());
afterEach(() => nock.cleanAll());

const makeResponse = (nodes: object[] = [], hasNextPage = false) => ({
  data: {
    exercises: {
      nodes,
      pageInfo: {
        endCursor: "cursor-end",
        startCursor: "cursor-start",
        hasNextPage,
        hasPreviousPage: false,
      },
    },
  },
});

test("returns activities and page info", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(
      200,
      makeResponse([
        {
          title: "Morning Run",
          activityType: "Run",
          distanceMeters: 5012.3,
          movingTimeSeconds: 1620,
          startDateLocalIso: "2024-03-15T07:30:00",
        },
      ]),
    );

  const { activities, meta } = await getActivities();

  expect(activities).toHaveLength(1);
  expect(activities[0].title).toBe("Morning Run");
  expect(activities[0].activityType).toBe("Run");
  expect(meta.hasNextPage).toBe(false);
});

test("passes 'after' cursor to GraphQL query", async () => {
  const after = "cursor-123";

  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql", (body) => body.query.includes(after))
    .reply(200, makeResponse([]));

  const { meta } = await getActivities(after);

  expect(meta.hasPreviousPage).toBe(false);
});

test("requests all activity fields in GraphQL query", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post(
      "/graphql",
      (body) =>
        body.query.includes("title") &&
        body.query.includes("activityType") &&
        body.query.includes("distanceMeters") &&
        body.query.includes("movingTimeSeconds") &&
        body.query.includes("startDateLocalIso") &&
        body.query.includes("mapSummaryPolyline"),
    )
    .reply(200, makeResponse([]));

  await getActivities();
});

test("uses default page size of 10 when first is not specified", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql", (body) => body.query.includes("first: 10"))
    .reply(200, makeResponse([]));

  await getActivities();
});

test("requests activities ordered by start date descending", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post(
      "/graphql",
      (body) =>
        body.query.includes("START_DATE_LOCAL_ISO") &&
        body.query.includes("DESC"),
    )
    .reply(200, makeResponse([]));

  await getActivities();
});
