import { expect, jest, test, afterEach } from "@jest/globals";

import { handler } from "../lambda/strava-receiver/index";
import { APIGatewayProxyEventV2 } from "aws-lambda";

const originalQueueUrl = process.env.QUEUE_URL;

afterEach(() => {
  process.env.QUEUE_URL = originalQueueUrl;
});

test("should return a 200 OK response on basic invocation", async () => {
  process.env.QUEUE_URL = "https://fake-queue-url.com";

  const mockEvent: Partial<APIGatewayProxyEventV2> = {
    requestContext: {
      http: {
        method: "POST",
        path: "/strava/webhook",
      },
    } as any,
    body: JSON.stringify({ message: "test payload" }),
  };

  const result = await handler(mockEvent as APIGatewayProxyEventV2);

  expect(result).toBeDefined();
  expect(result.statusCode).toBe(200);
});

test('return 500 error if QUEUE_URL environment variable is not set', async () => {
    delete process.env.QUEUE_URL

    const mockEvent: Partial<APIGatewayProxyEventV2> = {
        requestContext: {
          http: {
            method: "POST",
            path: "/strava/webhook",
          },
        } as any,
        body: JSON.stringify({ message: "error" }),
      };

    const result = await handler(mockEvent as APIGatewayProxyEventV2);

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(500);
    expect(result.body).toContain('Internal configuration error');
});
