import { expect, test, afterEach, jest, afterAll, beforeEach } from "@jest/globals";

import { handler } from "../lambda/strava-processor/index";
import { SQSEvent, SQSRecord } from "aws-lambda";
import {
  SSMClient,
  GetParametersCommand,
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
const mockedAxiosPost = axios.post as jest.Mock;
const mockedAxiosGet = axios.get as jest.Mock;

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
  };

  process.env.STRAVA_CLIENT_ID_PARAM_NAME = paramNames.clientId;
  process.env.STRAVA_SECRET_PARAM_NAME = paramNames.clientSecret;
  process.env.STRAVA_REFRESH_TOKEN_PARAM_NAME = paramNames.refreshToken;

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
};

mockStravaAuth();

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

const createPartialMockSqsRecord = (
  body: string,
  messageId: string = `test-partial-msg-${Math.random().toString(36).substring(7)}`
): Partial<SQSRecord> => {
  return {
    messageId: messageId,
    body: body,
  };
};

const createPartialSqsEventWithBodies = (
  bodies: string[]
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

test("log the body of each received SQS message", async () => {
  const testBody1 = JSON.stringify({ activityId: 123, detail: "message one" });
  const testBody2 = JSON.stringify({ activityId: 456, detail: "message two" });
  const mockEvent = createPartialSqsEventWithBodies([testBody1, testBody2]);

  await handler(mockEvent as SQSEvent);

  expect(consoleLogSpy).toHaveBeenCalledWith("Body:", testBody1);
  expect(consoleLogSpy).toHaveBeenCalledWith("Body:", testBody2);

  expect(consoleLogSpy).toHaveBeenCalledWith(
    "Processing SQS message:",
    expect.any(String)
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
    })
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

  mockedAxiosGet.mockImplementation(async (url, config) => {
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
    owner_id: 12345
  });
  const mockEvent = createPartialSqsEventWithBodies([sqsMessageBody]);

  await handler(mockEvent as SQSEvent);

  expect(consoleLogSpy).toHaveBeenCalledWith("Fetched Strava activity data:", dummyActivityData);

  expect(consoleLogSpy).toHaveBeenCalledWith("Processing complete.");

});
