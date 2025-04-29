import {
  jest,
  expect,
  test,
  afterEach,
  beforeEach,
  afterAll,
} from "@jest/globals";

import { handler } from "../lambda/strava-receiver/index";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";

const sqsMock = mockClient(SQSClient);

const originalQueueUrl = process.env.QUEUE_URL;
const testQueueUrl =
  "https://sqs.eu-west-2.amazonaws.com/123456789012/strava-webhook-queue-test";

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

afterAll(() => {
  consoleLogSpy.mockRestore();
  consoleErrorSpy.mockRestore();
});

beforeEach(() => {
  process.env.QUEUE_URL = testQueueUrl;
  sqsMock.reset();
});

afterEach(() => {
  process.env.QUEUE_URL = originalQueueUrl;
});

test("return 500 error if QUEUE_URL environment variable is not set", async () => {
  delete process.env.QUEUE_URL;
  const mockEvent = createMockApiGatewayEvent("error");

  const result = await handler(mockEvent as APIGatewayProxyEventV2);

  expect(result).toBeDefined();
  expect(result.statusCode).toBe(500);
  expect(result.body).toContain("Internal configuration error");
});

test("attempt to send event body to SQS queue specified by env var", async () => {
  const testBody = { webhook_id: 123, data: "some Strava data" };
  const mockEvent = createMockApiGatewayEvent(testBody);
  sqsMock.on(SendMessageCommand).resolves({
    $metadata: { httpStatusCode: 200 },
    MessageId: "mock-message-id-abc-123",
  });

  const result = await handler(mockEvent as APIGatewayProxyEventV2);

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("Message received and queued.");
  expect(sqsMock.calls()).toHaveLength(1);
  expect(sqsMock).toHaveReceivedCommandWith(SendMessageCommand, {
    QueueUrl: testQueueUrl,
    MessageBody: JSON.stringify(testBody),
  });
});

test("returns 500 error if SQS send fails", async () => {
  const mockEvent = createMockApiGatewayEvent({
    message: "trigger SQS failure",
  });

  const sqsError = new Error("AWS SQS simulated error");
  sqsMock.on(SendMessageCommand).rejects(sqsError);

  const result = await handler(mockEvent as APIGatewayProxyEventV2);

  expect(result.statusCode).toBe(500);
  expect(result.body).toBe("Failed to queue message.");
  expect(sqsMock.calls()).toHaveLength(1);
});

test("should return 405 Method Not Allowed for non-POST/GET methods", async () => {
  const mockEvent = createMockApiGatewayEvent(null, "PUT");

  const result = await handler(mockEvent as APIGatewayProxyEventV2);

  expect(result.statusCode).toBe(405);
  expect(sqsMock.calls()).toHaveLength(0);
});

test("should NOT attempt to send to SQS for GET requests (initially)", async () => {
  const mockEvent = createMockApiGatewayEvent(null, "GET");

  const result = await handler(mockEvent as APIGatewayProxyEventV2);

  expect(sqsMock.calls()).toHaveLength(0);
  expect(result.statusCode).toBe(200);
});

test("invalid verification GET request should return 403", async () => {
  const STRAVA_VERIFY_TOKEN = "a very secure token";
  const challenge = `challenge_${Date.now()}`;
  process.env.STRAVA_VERIFY_TOKEN = STRAVA_VERIFY_TOKEN;

  const mockEvent = createMockApiGatewayEvent(null, "GET");
  mockEvent.queryStringParameters = {
    "hub.mode": "subscribe",
    "hub.challenge": challenge,
    "hub.verify_token": "FAKE TOKEN",
  };

  const result = await handler(mockEvent as APIGatewayProxyEventV2);
  expect(result.statusCode).toBe(403);
});

test("invalid verification GET request should return hub.challenge", async () => {
  const STRAVA_VERIFY_TOKEN = "a very secure token";
  const challenge = `challenge_${Date.now()}`;
  process.env.STRAVA_VERIFY_TOKEN = STRAVA_VERIFY_TOKEN;

  const mockEvent = createMockApiGatewayEvent(null, "GET");
  mockEvent.queryStringParameters = {
    "hub.mode": "subscribe",
    "hub.challenge": challenge,
    "hub.verify_token": STRAVA_VERIFY_TOKEN,
  };

  const result = await handler(mockEvent as APIGatewayProxyEventV2);
  expect(result.body).toBe(JSON.stringify({ 'hub.challenge': challenge }));
  expect(result.headers).toEqual({ 'Content-Type': 'application/json' });
});

function createMockApiGatewayEvent(
  eventBody: any,
  method: string = "POST"
): Partial<APIGatewayProxyEventV2> {
  return {
    requestContext: {
      http: {
        method,
        path: "/strava/webhook",
      },
    } as any,
    body: JSON.stringify(eventBody),
  };
}
