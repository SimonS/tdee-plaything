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
    return verifySubscription(event);
  } 
  if (httpMethod === "POST") {
    return receiveEvent(event);
  }

  return respondWith(405, "Method Not Allowed");
};

const respondWith = (statusCode: number, body: string) => {
  return { statusCode, body, headers: { "Content-Type": "application/json" } };
};

const verifySubscription = (event: APIGatewayProxyEventV2) => {
  console.log(
    "Strava webhook verification successful. Responding with challenge."
  );

  const queryParams = event.queryStringParameters || {};
  const challenge = queryParams["hub.challenge"];
  const verifyToken = queryParams["hub.verify_token"];

  const expectedVerifyToken = process.env.STRAVA_VERIFY_TOKEN;

  if (verifyToken === expectedVerifyToken) {
    return respondWith(200, JSON.stringify({ "hub.challenge": challenge }));
  } else {
    console.error(
      "Strava webhook verification failed. Invalid verify token."
    );
    return respondWith(403, "Forbidden");
  }
}

const receiveEvent = async (event: APIGatewayProxyEventV2) => {
  const queueUrl = process.env.QUEUE_URL;

    if (!queueUrl) {
      console.error(
        "Configuration Error: QUEUE_URL environment variable not set."
      );
      return respondWith(500, "Internal configuration error");
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body ? event.body : "");
    } catch (error) {
      console.error("Error parsing JSON body:", error);
      return respondWith(400, "Invalid JSON body.");
    }
    console.log("Successfully parsed body:", parsedBody);

    const { object_type, object_id, aspect_type, owner_id } = parsedBody || {};

    type StravaEvent = {
      object_type: string;
      object_id: string;
      aspect_type: string;
      owner_id: string;
    };
    
    const messageForQueue: StravaEvent = {
      object_type,
      object_id,
      aspect_type,
      owner_id,
    };

    try {
      const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(messageForQueue),
      });

      const sqsResult = await sqsClient.send(command);

      console.log("Successfully sent message to SQS:", sqsResult.MessageId);
      return respondWith(200, "Message received and queued.");
    } catch (error) {
      console.error("Error sending message to SQS:", error);
      return respondWith(500, "Failed to queue message.");
    }
}
