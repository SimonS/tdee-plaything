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
import { Topic } from "aws-cdk-lib/aws-sns";
import {
  Alarm,
  ComparisonOperator,
  IMetric,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import * as path from "path";
import {
  BATCH_SIZE,
  PROCESSOR_TIMEOUT_MS,
} from "../lambda/strava-processor/limits";

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

    const overcastEmailParamName = "/overcast/email";
    const overcastPasswordParamName = "/overcast/password";
    const overcastBdtAuthTokenParamName = "/bdt/auth_token";

    const overcastEmailParamArn = `arn:${this.partition}:ssm:${this.region}:${this.account}:parameter${overcastEmailParamName}`;
    const overcastPasswordParamArn = `arn:${this.partition}:ssm:${this.region}:${this.account}:parameter${overcastPasswordParamName}`;
    const overcastBdtAuthTokenParamArn = `arn:${this.partition}:ssm:${this.region}:${this.account}:parameter${overcastBdtAuthTokenParamName}`;

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

    const processorTimeout = Duration.millis(PROCESSOR_TIMEOUT_MS);

    const webhookDeadLetterQueue = new Queue(this, "StravaWebhookDLQ", {
      queueName: "strava-webhook-dlq",
      retentionPeriod: Duration.days(14),
    });

    const webhookQueue = new Queue(this, "StravaWebhookQueue", {
      queueName: "strava-webhook-queue",
      visibilityTimeout: Duration.seconds(processorTimeout.toSeconds() * 6),
      deadLetterQueue: { queue: webhookDeadLetterQueue, maxReceiveCount: 5 },
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
        timeout: processorTimeout,
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

    processorLambda.addEventSource(
      new SqsEventSource(webhookQueue, {
        batchSize: BATCH_SIZE,
        reportBatchItemFailures: true,
      }),
    );

    const overcastErrorTopic = Topic.fromTopicArn(
      this,
      "OvercastErrorTopic",
      `arn:${this.partition}:sns:eu-west-1:${this.account}:Overcast_Error`,
    );
    const errorAlarmAction = new SnsAction(overcastErrorTopic);

    const alarmWhenAboveZero = (
      id: string,
      alarmDescription: string,
      metric: IMetric,
    ) =>
      new Alarm(this, id, {
        alarmDescription,
        metric,
        comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
        threshold: 0,
        evaluationPeriods: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      }).addAlarmAction(errorAlarmAction);

    alarmWhenAboveZero(
      "StravaWebhookDLQAlarm",
      "A Strava event is waiting in strava-webhook-dlq.",
      webhookDeadLetterQueue.metricApproximateNumberOfMessagesVisible({
        period: Duration.minutes(5),
        statistic: "Maximum",
      }),
    );

    alarmWhenAboveZero(
      "StravaEventProcessorErrorsAlarm",
      "stravaEventProcessorLambda threw or timed out.",
      processorLambda.metricErrors({
        period: Duration.minutes(5),
        statistic: "Sum",
      }),
    );

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
