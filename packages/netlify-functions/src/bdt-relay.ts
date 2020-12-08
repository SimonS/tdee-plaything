import { APIGatewayEvent } from "aws-lambda";

import { BDTRequest } from "@tdee/types/src/bdt";

import generateRequest from "./lib/generateRequest";

exports.handler = async (
  event: APIGatewayEvent
): Promise<{ statusCode: number; body: string }> => {
  console.log(event.headers);
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

  // make request to bdt

  // return response
  return { statusCode: 200, body };
};
