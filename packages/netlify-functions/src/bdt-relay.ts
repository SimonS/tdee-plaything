import { APIGatewayEvent, Context } from "aws-lambda";

import { BDTRequest } from "@tdee/types/src/bdt";

import generateRequest from "./lib/generateRequest";

exports.handler = async (event: APIGatewayEvent, context: Context) => {
  console.log(event.headers);
  if (!event.body || event.httpMethod !== "POST") {
    return {
      statusCode: 400,
      body: "Expected a POST request containing data in body",
    };
  }

  const { authToken, endPoint, body } = generateRequest(
    JSON.parse(event.body) as BDTRequest
  );

  // make request to bdt

  // return response
  return { statusCode: 200, body };
};
