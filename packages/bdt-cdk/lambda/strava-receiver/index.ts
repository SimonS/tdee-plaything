import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> => {
  console.log("Strava Receiver Lambda invoked");

  const queueUrl = process.env.QUEUE_URL;

  if (!queueUrl || queueUrl === undefined) {
    console.error(
      "Configuration Error: QUEUE_URL environment variable not set."
    );
    return {
      statusCode: 500,
      body: "Internal configuration error.",
    };
  }
  
  const response: APIGatewayProxyStructuredResultV2 = {
    statusCode: 200,
    body: "OK",
  };

  return response;
};
