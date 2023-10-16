import { APIGatewayProxyEvent } from "aws-lambda";

const AWS = require("aws-sdk");
new AWS.CloudWatchLogs();

exports.handler = async (event: APIGatewayProxyEvent) => {
  // Log the entire event payload to CloudWatch Logs
  console.log(JSON.stringify(event));

  // Return a response if needed (e.g., for API Gateway integrations)
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Webhook received successfully" }),
  };
};
