import {
  expect,
  test,
  afterEach,
  jest,
  afterAll,
  beforeEach,
} from "@jest/globals";

import {
  handler,
  stravaToWordpress,
  postExerciseToWordpress,
  StravaActivity,
  WordPressExercisePayload,
} from "../lambda/strava-processor/index";
import { SQSEvent, SQSRecord } from "aws-lambda";
import {
  SSMClient,
  GetParametersCommand,
  GetParameterCommand,
  Parameter,
} from "@aws-sdk/client-ssm";

import axios from "axios";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";

jest.mock("axios", () => {
  const mockPost = jest.fn();
  const mockGet = jest.fn();
  return {
    __esModule: true,

    default: { post: mockPost, get: mockGet },
    post: mockPost,
    get: mockGet,
  };
});
const mockedAxiosPost = axios.post as jest.Mock<any>;
const mockedAxiosGet = axios.get as jest.Mock<any>;

beforeEach(() => {
  jest.clearAllMocks();
});

const dummyCredentials = {
  clientId: "TEST_CLIENT_ID",
  clientSecret: "TEST_CLIENT_SECRET",
  refreshToken: "TEST_REFRESH_TOKEN",
};

const mockStravaAuth = () => {
  const paramNames = {
    clientId: "/strava/client_id",
    clientSecret: "/strava/client_secret",
    refreshToken: "/strava/refresh_token",
    bdtAuthToken: "/bdt/auth_token",
  };

  process.env.STRAVA_CLIENT_ID_PARAM_NAME = paramNames.clientId;
  process.env.STRAVA_SECRET_PARAM_NAME = paramNames.clientSecret;
  process.env.STRAVA_REFRESH_TOKEN_PARAM_NAME = paramNames.refreshToken;
  process.env.BDT_AUTH_TOKEN_PARAM_NAME = paramNames.bdtAuthToken;

  const dummyAccessToken = "DUMMY_ACCESS_TOKEN_456";

  mockedAxiosPost.mockImplementation(async () => {
    return Promise.resolve({
      data: { access_token: dummyAccessToken },
      status: 200,
      statusText: "OK",
      headers: { "content-type": "application/json" },
      config: {} as any,
    });
  });

  const ssmMock = mockClient(SSMClient);
  ssmMock.on(GetParametersCommand).resolves({
    Parameters: [
      {
        Name: paramNames.clientId,
        Value: dummyCredentials.clientId,
        Type: "String",
      },
      {
        Name: paramNames.clientSecret,
        Value: dummyCredentials.clientSecret,
        Type: "SecureString",
      },
      {
        Name: paramNames.refreshToken,
        Value: dummyCredentials.refreshToken,
        Type: "SecureString",
      },
    ] as Parameter[],
    InvalidParameters: [],
  });
  ssmMock.on(GetParameterCommand).resolves({
    Parameter: {
      Name: paramNames.bdtAuthToken,
      Value: "dummy-bdt-token",
      Type: "SecureString",
    } as Parameter,
  });
};

mockStravaAuth();

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

const createPartialMockSqsRecord = (
  body: string,
  messageId: string = `test-partial-msg-${Math.random().toString(36).substring(7)}`,
): Partial<SQSRecord> => {
  return {
    messageId: messageId,
    body: body,
  };
};

const createPartialSqsEventWithBodies = (
  bodies: string[],
): Partial<SQSEvent> => {
  const records = bodies.map((body) => createPartialMockSqsRecord(body));
  return { Records: records as SQSRecord[] };
};

afterEach(() => {
  consoleLogSpy.mockClear();
});

afterAll(() => {
  consoleLogSpy.mockRestore();
});

const exampleStravaActivity: StravaActivity = {
  id: 17954327092,
  name: "Evening Run",
  description: "",
  distance: 5040.2,
  moving_time: 1956,
  elapsed_time: 1956,
  total_elevation_gain: 46,
  type: "Run",
  sport_type: "Run",
  start_date: "2026-04-02T19:30:39Z",
  start_date_local: "2026-04-02T20:30:39Z",
  map: { summary_polyline: "encodedPolyline123" },
};

test("stravaToWordpress maps Strava fields to WordPress exercise payload", () => {
  const result = stravaToWordpress(exampleStravaActivity);
  expect(result.title).toBe("Evening Run");
  expect(result.status).toBe("publish");
  expect(result.meta.source_platform).toBe("strava");
  expect(result.meta.source_id).toBe("17954327092");
  expect(result.meta.activity_type).toBe("Run");
  expect(result.meta.distance_meters).toBe(5040.2);
  expect(result.meta.moving_time_seconds).toBe(1956);
  expect(result.meta.elapsed_time_seconds).toBe(1956);
  expect(result.meta.total_elevation_gain_meters).toBe(46);
  expect(result.meta.start_date_local_iso).toBe("2026-04-02T20:30:39Z");
  expect(result.meta.map_summary_polyline).toBe("encodedPolyline123");
  expect(result.meta._raw_data_json).toBe(
    JSON.stringify(exampleStravaActivity),
  );
});

test("stravaToWordpress uses activity id as fallback title when name is absent", () => {
  const result = stravaToWordpress({ ...exampleStravaActivity, name: "" });
  expect(result.title).toBe("Strava Activity 17954327092");
});

test("stravaToWordpress uses type (not sport_type) as activity_type", () => {
  const result = stravaToWordpress({
    ...exampleStravaActivity,
    type: "Ride",
    sport_type: "MountainBikeRide",
  });
  expect(result.meta.activity_type).toBe("Ride");
});

test("stravaToWordpress uses empty string for map_summary_polyline when map is absent", () => {
  const result = stravaToWordpress({
    ...exampleStravaActivity,
    map: undefined,
  });
  expect(result.meta.map_summary_polyline).toBe("");
});

describe("postExerciseToWordpress", () => {
  const wpPayload: WordPressExercisePayload = {
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
      map_summary_polyline: "encodedPolyline123",
      _raw_data_json: "{}",
    },
  };

  beforeEach(() => {
    process.env.WORDPRESS_API_BASE_URL = "https://example.com/wp-json/wp/v2";
  });

  afterEach(() => {
    delete process.env.WORDPRESS_API_BASE_URL;
  });

  test("POSTs the exercise payload to WordPress with Bearer auth", async () => {
    mockedAxiosPost.mockResolvedValueOnce({ data: { id: 999 }, status: 201 });
    await postExerciseToWordpress(wpPayload, "test-wp-token");
    expect(mockedAxiosPost).toHaveBeenCalledWith(
      "https://example.com/wp-json/wp/v2/bdt_exercises",
      wpPayload,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-wp-token",
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  test("throws if WORDPRESS_API_BASE_URL env var is missing", async () => {
    delete process.env.WORDPRESS_API_BASE_URL;
    await expect(
      postExerciseToWordpress(wpPayload, "test-wp-token"),
    ).rejects.toThrow("Missing WordPress configuration.");
  });
});

test("log the body of each received SQS message", async () => {
  const testBody1 = JSON.stringify({ activityId: 123, detail: "message one" });
  const testBody2 = JSON.stringify({ activityId: 456, detail: "message two" });
  const mockEvent = createPartialSqsEventWithBodies([testBody1, testBody2]);

  await handler(mockEvent as SQSEvent);

  expect(consoleLogSpy).toHaveBeenCalledWith("Body:", testBody1);
  expect(consoleLogSpy).toHaveBeenCalledWith("Body:", testBody2);

  expect(consoleLogSpy).toHaveBeenCalledWith(
    "Processing SQS message:",
    expect.any(String),
  );
  expect(consoleLogSpy).toHaveBeenCalledWith("Processing complete.");
});

test("Processor Lambda attempts Strava token refresh using credentials from SSM", async () => {
  const mockEvent = createPartialSqsEventWithBodies([
    '{"message":"trigger auth"}',
  ]);

  await handler(mockEvent as SQSEvent);

  const expectedTokenUrl = "https://www.strava.com/oauth/token";
  const expectedFormData = new URLSearchParams();
  expectedFormData.append("client_id", dummyCredentials.clientId);
  expectedFormData.append("client_secret", dummyCredentials.clientSecret);
  expectedFormData.append("refresh_token", dummyCredentials.refreshToken);
  expectedFormData.append("grant_type", "refresh_token");

  expect(mockedAxiosPost).toHaveBeenCalledWith(
    expectedTokenUrl,
    expectedFormData,
    expect.objectContaining({
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }),
  );
});

test("fetches activity details from Strava API", async () => {
  const activityId = 9876543210;
  const dummyActivityData = {
    id: activityId,
    name: "Test Activity for Logging",
    distance: 1609,
    moving_time: 300,
    type: "Run",
    start_date_local: new Date().toISOString(),
  };

  mockedAxiosGet.mockImplementation(async (url: string, _config: unknown) => {
    console.log(`--- MOCK GET returning data for ${url} ---`);
    return Promise.resolve({
      data: dummyActivityData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });
  });

  const sqsMessageBody = JSON.stringify({
    object_type: "activity",
    object_id: activityId,
    aspect_type: "update",
    owner_id: 12345,
  });
  const mockEvent = createPartialSqsEventWithBodies([sqsMessageBody]);

  await handler(mockEvent as SQSEvent);

  expect(consoleLogSpy).toHaveBeenCalledWith(
    "Fetched Strava activity data:",
    dummyActivityData,
  );

  expect(consoleLogSpy).toHaveBeenCalledWith("Processing complete.");
});

test("handler fetches Strava activity and posts it to WordPress", async () => {
  process.env.WORDPRESS_API_BASE_URL = "https://example.com/wp-json/wp/v2";

  mockedAxiosPost.mockResolvedValueOnce({
    data: { access_token: "DUMMY_ACCESS_TOKEN_456" },
    status: 200,
  });
  mockedAxiosPost.mockResolvedValueOnce({ data: { id: 999 }, status: 201 });

  mockedAxiosGet.mockResolvedValueOnce({
    data: exampleStravaActivity,
    status: 200,
  });

  const sqsMessageBody = JSON.stringify({
    object_type: "activity",
    object_id: exampleStravaActivity.id,
    aspect_type: "create",
    owner_id: 12345,
  });
  await handler(createPartialSqsEventWithBodies([sqsMessageBody]) as SQSEvent);

  expect(mockedAxiosGet).toHaveBeenCalledWith(
    `https://www.strava.com/api/v3/activities/${exampleStravaActivity.id}`,
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: expect.stringContaining("Bearer"),
      }),
    }),
  );
  expect(mockedAxiosPost).toHaveBeenCalledWith(
    "https://example.com/wp-json/wp/v2/bdt_exercises",
    expect.objectContaining({
      title: "Evening Run",
      meta: expect.objectContaining({ source_platform: "strava" }),
    }),
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: "Bearer dummy-bdt-token",
      }),
    }),
  );

  delete process.env.WORDPRESS_API_BASE_URL;
});
