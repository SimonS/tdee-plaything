import {
  expect,
  test,
  beforeAll,
  afterAll,
  afterEach,
  jest,
} from "@jest/globals";
import * as nock from "nock";

import {
  postExerciseToWordpress,
  WordPressExercisePayload,
} from "../lambda/strava-processor/index";
import { REQUEST_TIMEOUT_MS } from "../lambda/strava-processor/limits";

const payload: WordPressExercisePayload = {
  title: "Evening Run",
  content: "",
  status: "publish",
  meta: {
    source_platform: "strava",
    source_id: "17954327092",
    activity_type: "Run",
    distance_meters: 5040.2,
    moving_time_seconds: 1956,
    elapsed_time_seconds: 1956,
    total_elevation_gain_meters: 46,
    start_date_local_iso: "2026-04-02T20:30:39Z",
    map_summary_polyline: "",
    _raw_data_json: "{}",
  },
};

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

beforeAll(() => {
  nock.disableNetConnect();
  process.env.WORDPRESS_API_BASE_URL = "https://example.com/wp-json/wp/v2";
});

afterEach(() => {
  nock.cleanAll();
});

afterAll(() => {
  delete process.env.WORDPRESS_API_BASE_URL;
  nock.enableNetConnect();
  consoleLogSpy.mockRestore();
});

test("a WordPress request that never responds fails at the request timeout", async () => {
  nock("https://example.com")
    .post("/wp-json/wp/v2/bdt_exercises")
    .delay(REQUEST_TIMEOUT_MS * 2)
    .reply(201, { id: 999 });
  const started = Date.now();

  await expect(postExerciseToWordpress(payload, "token")).rejects.toMatchObject(
    { code: "ECONNABORTED" },
  );

  const elapsed = Date.now() - started;
  expect(elapsed).toBeGreaterThanOrEqual(REQUEST_TIMEOUT_MS - 100);
  expect(elapsed).toBeLessThan(REQUEST_TIMEOUT_MS + 1_000);
}, 30_000);
