import { Stack, App, StackProps, Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class BdtCdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const overcastLambda = new NodejsFunction(this, "OvercastLambda", {
      entry: "./lambda/overcast.ts",
      functionName: "overcastLambda",
      handler: "handler",
      memorySize: 512,
      runtime: Runtime.NODEJS_18_X,
      timeout: Duration.seconds(60),
      bundling: {
        externalModules: ["deasync"],
      },
    });

    const eventRule = new Rule(this, "scheduleRule", {
      schedule: Schedule.cron({ minute: "4", hour: "3" }),
    });

    eventRule.addTarget(new LambdaFunction(overcastLambda));

    const httpApi = new HttpApi(this, 'StravaWebhookApi', {
      apiName: 'StravaWebhookApi'
    });
  }
}
