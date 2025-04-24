import { SQSEvent, SQSRecord } from "aws-lambda";

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log(`Processor Lambda invoked with ${event.Records.length} record.`);

  for (const record of event.Records) {
    console.log("Processing SQS message:", record.messageId);
    console.log("Body:", record.body);
  }

  console.log("Processing complete.");
};
