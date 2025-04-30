import { Stack, App, StackProps, Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Queue } from "aws-cdk-lib/aws-sqs";
import path = require("path");


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

    const httpApi = new HttpApi(this, "StravaWebhookApi", {
      apiName: "StravaWebhookApi",
    });

    const webhookQueue = new Queue(this, "StravaWebhookQueue", {
      queueName: "strava-webhook-queue",
    });
    
    const receiverLambda = new NodejsFunction(
      this,
      "StravaWebhookReceiverLambda",
      {
        entry: path.join(__dirname, "../lambda/strava-receiver/index.ts"),
        functionName: "stravaWebhookReceiverLambda",
        runtime: Runtime.NODEJS_22_X,
        handler: "handler",
        environment: {
          QUEUE_URL: webhookQueue.queueUrl,
          STRAVA_VERIFY_TOKEN: "averysecuretokenwithnospaces",
        },
      }
    );

    webhookQueue.grantSendMessages(receiverLambda);

    const stravaWebhookIntegration = new HttpLambdaIntegration(
      "StravaWebhookIntegration",
      receiverLambda
    );

    httpApi.addRoutes({
      path: "/strava/webhook",
      methods: [HttpMethod.POST, HttpMethod.GET],
      integration: stravaWebhookIntegration,
    });

    const processorLambda = new NodejsFunction(this, 'StravaEventProcessorLambda', {
      entry: path.join(__dirname, '../lambda/strava-processor/index.ts'),
      functionName: 'stravaEventProcessorLambda',
      runtime: Runtime.NODEJS_22_X,
      handler: 'index.handler',
    });

    processorLambda.addEventSource(new SqsEventSource(webhookQueue));
  }
}
