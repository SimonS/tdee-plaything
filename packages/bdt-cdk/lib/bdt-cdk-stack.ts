import { Stack, App, StackProps, Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export class BdtCdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const overcastLambda = new NodejsFunction(this, "OvercastLambda", {
      entry: "./lambda/overcast.ts",
      functionName: "overcastLambda",
      handler: "handler",
      memorySize: 512,
      timeout: Duration.seconds(30),
    });

    const eventRule = new Rule(this, "scheduleRule", {
      schedule: Schedule.cron({ minute: "4", hour: "3" }),
    });

    eventRule.addTarget(new LambdaFunction(overcastLambda));
  }
}
