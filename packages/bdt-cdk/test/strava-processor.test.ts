import { expect, test, afterEach, jest, afterAll } from "@jest/globals";

import { handler } from "../lambda/strava-processor/index";
import { SQSEvent, SQSRecord } from "aws-lambda";

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

  expect(consoleLogSpy).toHaveBeenCalledWith('Processing SQS message:', expect.any(String));
  expect(consoleLogSpy).toHaveBeenCalledWith("Processing complete.");

});
