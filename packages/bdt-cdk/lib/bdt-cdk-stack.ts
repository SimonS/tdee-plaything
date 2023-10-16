import { Stack, App, StackProps, Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

export class BdtCdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Overcast cron job
    const overcastLambda = new NodejsFunction(this, "OvercastLambda", {
      entry: "./lambda/overcast.ts",
      functionName: "overcastLambda",
      handler: "handler",
      memorySize: 512,
      timeout: Duration.seconds(30),
      bundling: {
        externalModules: ["deasync"],
      },
    });

    const eventRule = new Rule(this, "scheduleRule", {
      schedule: Schedule.cron({ minute: "4", hour: "3" }),
    });

    eventRule.addTarget(new LambdaFunction(overcastLambda));

    // GitHub Webhook handler
    const api = new RestApi(this, "BdtGateway", {
      deployOptions: {
        stageName: "prod",
      },
    });

    const gitHubLambda = new NodejsFunction(this, "GitHubLambda", {
      entry: "./lambda/github.ts",
      functionName: "gitHubLambda",
      handler: "handler",
    });

    const integration = new LambdaIntegration(gitHubLambda);

    const webhookResource = api.root.addResource("webhook");
    webhookResource.addMethod("POST", integration);

    const rule = new Rule(this, "GitHubWebhookEventRule", {
      eventPattern: {
        source: ["aws.events"],
        detail: {
          eventSource: ["execute-api.amazonaws.com"],
          eventName: ["Invoke"],
          requestContext: {
            httpMethod: ["POST"],
            resourceId: [webhookResource.resourceId],
            stage: ["prod"],
          },
        },
      },
    });

    rule.addTarget(new LambdaFunction(gitHubLambda));
  }
}
