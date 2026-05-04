import getAllActivities from "./getAllActivities";
import * as nock from "nock";

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());
afterEach(() => nock.cleanAll());

const makeActivity = (date: string, title = "Activity") => ({
  title,
  activityType: "Run",
  distanceMeters: 5000,
  movingTimeSeconds: 1800,
  startDateLocalIso: date,
});

const makeResponse = (nodes: object[], hasNextPage = false) => ({
  data: {
    exercises: {
      nodes,
      pageInfo: {
        endCursor: "end",
        startCursor: "start",
        hasNextPage,
        hasPreviousPage: false,
      },
    },
  },
});

test("returns all activities from a single page", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(
      200,
      makeResponse([
        makeActivity("2024-03-15T07:30:00"),
        makeActivity("2024-03-16T07:30:00"),
      ]),
    );

  const activities = await getAllActivities();

  expect(activities).toHaveLength(2);
});

test("aggregates activities across multiple pages", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, makeResponse([makeActivity("2024-03-15T07:30:00")], true))
    .post("/graphql")
    .reply(200, makeResponse([makeActivity("2024-03-16T07:30:00")]));

  const activities = await getAllActivities();

  expect(activities).toHaveLength(2);
});

test("sorts activities by date ascending (oldest first)", async () => {
  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(
      200,
      makeResponse([
        makeActivity("2024-03-16T07:30:00", "Newer"),
        makeActivity("2024-03-15T07:30:00", "Older"),
      ]),
    );

  const activities = await getAllActivities();

  expect(activities[0].title).toBe("Older");
  expect(activities[1].title).toBe("Newer");
});

test("passes the endCursor from page 1 as the after cursor on page 2", async () => {
  let capturedAfter = "";

  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, makeResponse([makeActivity("2024-03-15T07:30:00")], true))
    .post("/graphql")
    .reply(200, function (_, requestBody) {
      const query: string = (requestBody as Record<string, string>)["query"];
      const match = query.match(/after: "([^"]*)"/);
      capturedAfter = match ? match[1] : "";
      return makeResponse([makeActivity("2024-03-16T07:30:00")]);
    });

  await getAllActivities();

  expect(capturedAfter).toBe("end");
});

test("paginates 100 items per page", async () => {
  let capturedFirst = "";

  nock("https://breakfastdinnertea.co.uk")
    .post("/graphql")
    .reply(200, function (_, requestBody) {
      const query: string = (requestBody as Record<string, string>)["query"];
      capturedFirst = Array.from(query.matchAll(/first: (\d*)/g))[0][1];
      return makeResponse([makeActivity("2024-03-15T07:30:00")]);
    });

  await getAllActivities();

  expect(capturedFirst).toBe("100");
});
