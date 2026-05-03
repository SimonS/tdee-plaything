import { Stack, App, StackProps, Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as path from "path";

export class BdtCdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const overcastLambda = new NodejsFunction(this, "OvercastLambda", {
      entry: "./lambda/overcast.ts",
      functionName: "overcastLambda",
      handler: "handler",
      memorySize: 512,
      runtime: Runtime.NODEJS_22_X,
      timeout: Duration.seconds(60),
      bundling: {
        externalModules: ["deasync"],
      },
      environment: {
        OVERCAST_EMAIL_PARAM_NAME: "/overcast/email",
        OVERCAST_PASSWORD_PARAM_NAME: "/overcast/password",
        BDT_AUTH_TOKEN_PARAM_NAME: "/bdt/auth_token",
      },
    });

    const eventRule = new Rule(this, "scheduleRule", {
      schedule: Schedule.cron({ minute: "4", hour: "3" }),
    });

    eventRule.addTarget(new LambdaFunction(overcastLambda));

    const overcastEmailParamArn = `arn:${this.partition}:ssm:${this.region}:${this.account}:parameter/overcast/email`;
    const overcastPasswordParamArn = `arn:${this.partition}:ssm:${this.region}:${this.account}:parameter/overcast/password`;
    const overcastBdtAuthTokenParamArn = `arn:${this.partition}:ssm:${this.region}:${this.account}:parameter/bdt/auth_token`;

    overcastLambda.addToRolePolicy(
      new PolicyStatement({
        sid: "ReadOvercastSSMParams",
        effect: Effect.ALLOW,
        actions: ["ssm:GetParameter", "ssm:GetParameters"],
        resources: [
          overcastEmailParamArn,
          overcastPasswordParamArn,
          overcastBdtAuthTokenParamArn,
        ],
      }),
    );

    overcastLambda.addToRolePolicy(
      new PolicyStatement({
        sid: "DecryptOvercastSecureParams",
        effect: Effect.ALLOW,
        actions: ["kms:Decrypt"],
        resources: ["*"],
      }),
    );

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
      },
    );

    webhookQueue.grantSendMessages(receiverLambda);

    const stravaWebhookIntegration = new HttpLambdaIntegration(
      "StravaWebhookIntegration",
      receiverLambda,
    );

    httpApi.addRoutes({
      path: "/strava/webhook",
      methods: [HttpMethod.POST, HttpMethod.GET],
      integration: stravaWebhookIntegration,
    });

    const processorLambda = new NodejsFunction(
      this,
      "StravaEventProcessorLambda",
      {
        entry: path.join(__dirname, "../lambda/strava-processor/index.ts"),
        functionName: "stravaEventProcessorLambda",
        runtime: Runtime.NODEJS_22_X,
        handler: "index.handler",
        environment: {
          STRAVA_CLIENT_ID_PARAM_NAME: "/strava/client_id",
          STRAVA_SECRET_PARAM_NAME: "/strava/client_secret",
          STRAVA_REFRESH_TOKEN_PARAM_NAME: "/strava/refresh_token",
          BDT_AUTH_TOKEN_PARAM_NAME: "/bdt/auth_token",
          WORDPRESS_API_BASE_URL:
            "https://breakfastdinnertea.co.uk/wp-json/wp/v2",
        },
      },
    );

    processorLambda.addEventSource(new SqsEventSource(webhookQueue));

    const clientIdParamName = "/strava/client_id";
    const clientSecretParamName = "/strava/client_secret";
    const refreshTokenParamName = "/strava/refresh_token";
    const bdtAuthTokenParamName = "/bdt/auth_token";

    const clientIdParamArn = `arn:${this.partition}:ssm:${this.region}:${this.account}:parameter${clientIdParamName}`;
    const clientSecretParamArn = `arn:${this.partition}:ssm:${this.region}:${this.account}:parameter${clientSecretParamName}`;
    const refreshTokenParamArn = `arn:${this.partition}:ssm:${this.region}:${this.account}:parameter${refreshTokenParamName}`;
    const bdtAuthTokenParamArn = `arn:${this.partition}:ssm:${this.region}:${this.account}:parameter${bdtAuthTokenParamName}`;

    processorLambda.addToRolePolicy(
      new PolicyStatement({
        sid: "ReadProcessorSSMParams",
        effect: Effect.ALLOW,
        actions: ["ssm:GetParameter", "ssm:GetParameters"],
        resources: [
          clientIdParamArn,
          clientSecretParamArn,
          refreshTokenParamArn,
          bdtAuthTokenParamArn,
        ],
      }),
    );

    processorLambda.addToRolePolicy(
      new PolicyStatement({
        sid: "DecryptStravaSecureParams",
        effect: Effect.ALLOW,
        actions: ["kms:Decrypt"],
        resources: ["*"],
      }),
    );
  }
}
