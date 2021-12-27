import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda-nodejs";
import * as targets from "@aws-cdk/aws-events-targets";
import * as events from "@aws-cdk/aws-events";

export class BdtCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const overcastLambda = new lambda.NodejsFunction(this, "OvercastLambda", {
      entry: "./lambda/overcast.ts",
      functionName: "overcastLambda",
      handler: "handler",
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
    });

    const eventRule = new events.Rule(this, "scheduleRule", {
      schedule: events.Schedule.cron({ minute: "4", hour: "14" }),
    });

    eventRule.addTarget(new targets.LambdaFunction(overcastLambda));
  }
}
