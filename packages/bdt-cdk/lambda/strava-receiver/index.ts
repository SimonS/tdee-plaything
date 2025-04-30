import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({});

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> => {
  console.log("Strava Receiver Lambda invoked");

  const httpMethod = event.requestContext.http.method;

  if (httpMethod === "GET") {
    console.log(
      "Strava webhook verification successful. Responding with challenge."
    );

    const queryParams = event.queryStringParameters || {};
    const challenge = queryParams["hub.challenge"];
    const verifyToken = queryParams["hub.verify_token"];

    const expectedVerifyToken = process.env.STRAVA_VERIFY_TOKEN;

    if (verifyToken === expectedVerifyToken) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "hub.challenge": challenge }),
      };
    } else {
      console.error(
        "Strava webhook verification failed. Invalid verify token."
      );
      return {
        statusCode: 403,
        body: "Forbidden",
      };
    }
  } else if (httpMethod === "POST") {
    const queueUrl = process.env.QUEUE_URL;

    if (!queueUrl) {
      console.error(
        "Configuration Error: QUEUE_URL environment variable not set."
      );
      return {
        statusCode: 500,
        body: "Internal configuration error.",
      };
    }

    try {
      const messageBody =
        event.body ??
        JSON.stringify({
          warning: "Received event with no body",
          receivedAt: new Date().toISOString(),
        });

      const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: messageBody,
      });

      const sqsResult = await sqsClient.send(command);
      console.log("Successfully sent message to SQS:", sqsResult.MessageId);

      return {
        statusCode: 200,
        body: "Message received and queued.",
      };
    } catch (error) {
      console.error("Error sending message to SQS:", error);

      return {
        statusCode: 500,
        body: "Failed to queue message.",
      };
    }
  }

  return {
    statusCode: 405,
    body: "Method Not Allowed",
  };
};
