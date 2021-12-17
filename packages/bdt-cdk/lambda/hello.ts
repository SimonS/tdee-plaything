import { APIGatewayEvent } from "aws-lambda";

export const handler = async function (event: APIGatewayEvent) {
  console.log("event", JSON.stringify(event, null, 2));

  return {
    statusCode: 200,
    headers: { "content-type": "text/plain" },
    body: `"It works." - ${event.path}`,
  };
};
