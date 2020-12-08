import { APIGatewayEvent } from "aws-lambda";

import { BDTRequest } from "@tdee/types/src/bdt";

import generateRequest from "./lib/generateRequest";
import postToBDT from "./lib/postToBDT";

exports.handler = async (
  event: APIGatewayEvent
): Promise<{ statusCode: number; body: string }> => {
  if (!event.body || event.httpMethod !== "POST") {
    return {
      statusCode: 400,
      body: "Expected a POST request containing data in body",
    };
  }

  const {
    authToken,
    endpoint,
    body,
  }: { authToken: string; endpoint: string; body: string } = generateRequest(
    JSON.parse(event.body) as BDTRequest
  );

  const response = await postToBDT(body, endpoint, authToken);
  const responseBody = await response.json();

  return { statusCode: response.status, body: JSON.stringify(responseBody) };
};
