import { Template, Match } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { describe, expect, test, beforeAll } from "@jest/globals";
import * as BdtCdk from "../lib/bdt-cdk-stack";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  REQUEST_TIMEOUT_MS,
  REQUESTS_PER_BATCH,
} from "../lambda/strava-processor/limits";

let template: Template;
let stack: BdtCdk.BdtCdkStack;

beforeAll(() => {
  const app = new cdk.App({
    context: {
      "aws:cdk:bundling-stacks": [],
    },
  });
  stack = new BdtCdk.BdtCdkStack(app, "TestStack");
  template = Template.fromStack(stack);
});

test("creates and wires up an overcast lambda", () => {
  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "overcastLambda",
    MemorySize: 512,
    Runtime: Runtime.NODEJS_22_X.name,
  });
});

test("Overcast Lambda uses param name env vars for SSM credentials", () => {
  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "overcastLambda",
    Environment: Match.objectLike({
      Variables: Match.objectLike({
        OVERCAST_EMAIL_PARAM_NAME: "/overcast/email",
        OVERCAST_PASSWORD_PARAM_NAME: "/overcast/password",
        BDT_AUTH_TOKEN_PARAM_NAME: "/bdt/auth_token",
      }),
    }),
  });
});

test("Overcast Lambda Role has permission to read secrets from SSM", () => {
  const makeParamArn = (paramPath: string) => ({
    "Fn::Join": [
      "",
      [
        "arn:",
        { Ref: "AWS::Partition" },
        ":ssm:",
        { Ref: "AWS::Region" },
        ":",
        { Ref: "AWS::AccountId" },
        `:parameter${paramPath}`,
      ],
    ],
  });

  template.hasResourceProperties("AWS::IAM::Policy", {
    Roles: Match.arrayWith([
      { Ref: Match.stringLikeRegexp("OvercastLambdaServiceRole*") },
    ]),
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({
          Effect: "Allow",
          Action: Match.arrayWith(["ssm:GetParameter", "ssm:GetParameters"]),
          Resource: Match.arrayWith([
            makeParamArn("/overcast/email"),
            makeParamArn("/overcast/password"),
            makeParamArn("/bdt/auth_token"),
          ]),
        }),
        Match.objectLike({
          Effect: "Allow",
          Action: "kms:Decrypt",
          Resource: "*",
        }),
      ]),
    },
  });
});

test("adds a rule to run lambda on cronjob", () => {
  const app = new cdk.App({
    context: {
      "aws:cdk:bundling-stacks": [],
    },
  });
  const stack = new BdtCdk.BdtCdkStack(app, "TestStack");

  const lambdaId = stack.getLogicalId(
    stack.node.findChild("OvercastLambda").node.defaultChild as cdk.CfnElement,
  );

  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::Events::Rule", {
    ScheduleExpression: "cron(4 3 * * ? *)",
    Targets: [
      {
        Arn: {
          "Fn::GetAtt": [lambdaId, "Arn"],
        },
      },
    ],
  });
});

test("creates an HTTP API Gateway resource", () => {
  template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
    ProtocolType: "HTTP",
  });
});

test("Stack should contain the Strava Webhook Receiver Lambda function", () => {
  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "stravaWebhookReceiverLambda",
    Runtime: Runtime.NODEJS_22_X.name,
    Handler: "index.handler",
    Environment: Match.objectLike({
      Variables: Match.objectLike({
        QUEUE_URL: {
          Ref: Match.stringLikeRegexp("StravaWebhookQueue*"),
        },
      }),
    }),
  });
});

test("Stack should contain the Strava Event Processor Lambda function", () => {
  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "stravaEventProcessorLambda",
    Runtime: Runtime.NODEJS_22_X.name,
    Handler: "index.handler",
  });
});

test("Event source mapping between Queue and Processor", () => {
  template.hasResourceProperties("AWS::Lambda::EventSourceMapping", {
    EventSourceArn: {
      "Fn::GetAtt": [Match.stringLikeRegexp("StravaWebhookQueue*"), "Arn"],
    },
    FunctionName: {
      Ref: Match.stringLikeRegexp("StravaEventProcessorLambda*"),
    },
  });
});

test("point the Strava Webhook API Gateway to the Strava Receiver Lambda", () => {
  template.hasResourceProperties("AWS::ApiGatewayV2::Integration", {
    ApiId: { Ref: Match.stringLikeRegexp("StravaWebhookApi*") },
    IntegrationType: "AWS_PROXY",
    IntegrationUri: Match.objectLike({
      "Fn::GetAtt": [
        Match.stringLikeRegexp("StravaWebhookReceiverLambda*"),
        "Arn",
      ],
    }),
    PayloadFormatVersion: "2.0",
  });

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    ApiId: { Ref: Match.stringLikeRegexp("StravaWebhookApi*") },
    RouteKey: "POST /strava/webhook",
    Target: Match.objectLike({
      "Fn::Join": [
        "",
        [
          "integrations/",
          { Ref: Match.stringLikeRegexp("StravaWebhookIntegration*") },
        ],
      ],
    }),
  });

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    ApiId: { Ref: Match.stringLikeRegexp("StravaWebhookApi*") },
    RouteKey: "GET /strava/webhook",
    Target: Match.objectLike({
      "Fn::Join": [
        "",
        [
          "integrations/",
          { Ref: Match.stringLikeRegexp("StravaWebhookIntegration*") },
        ],
      ],
    }),
  });
});

test("Stack should contain the Strava Webhook SQS Queue", () => {
  template.hasResourceProperties("AWS::SQS::Queue", {
    QueueName: "strava-webhook-queue",
  });
});

test("Receiver Lambda Role should have SendMessage permission for Webhook Queue", () => {
  template.hasResourceProperties("AWS::IAM::Policy", {
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({
          Action: Match.arrayWith([
            "sqs:SendMessage",
            "sqs:GetQueueAttributes",
            "sqs:GetQueueUrl",
          ]),
          Effect: "Allow",
          Resource: {
            "Fn::GetAtt": [
              Match.stringLikeRegexp("StravaWebhookQueue*"),
              "Arn",
            ],
          },
        }),
      ]),
    },
    Roles: Match.arrayWith([
      {
        Ref: Match.stringLikeRegexp("StravaWebhookReceiverLambdaServiceRole*"),
      },
    ]),
  });
});

test("Processor Lambda Role should have permissions to read SSM params", () => {
  template.hasResourceProperties("AWS::IAM::Policy", {
    Roles: Match.arrayWith([
      { Ref: Match.stringLikeRegexp("StravaEventProcessorLambdaServiceRole*") },
    ]),
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({
          Effect: "Allow",
          Action: Match.arrayWith(["ssm:GetParameter", "ssm:GetParameters"]),
        }),
        Match.objectLike({
          Effect: "Allow",
          Action: "kms:Decrypt",
          Resource: "*",
        }),
      ]),
    },
  });
});

test("Processor Lambda use environment variables for SSM parameter names", () => {
  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "stravaEventProcessorLambda",
    Environment: Match.objectLike({
      Variables: Match.objectLike({
        STRAVA_CLIENT_ID_PARAM_NAME: "/strava/client_id",
        STRAVA_SECRET_PARAM_NAME: "/strava/client_secret",
        STRAVA_REFRESH_TOKEN_PARAM_NAME: "/strava/refresh_token",
      }),
    }),
  });
});

test("Processor Lambda has WordPress env vars configured", () => {
  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "stravaEventProcessorLambda",
    Environment: Match.objectLike({
      Variables: Match.objectLike({
        WORDPRESS_API_BASE_URL:
          "https://breakfastdinnertea.co.uk/wp-json/wp/v2",
      }),
    }),
  });
});

test("Processor Lambda uses BDT_AUTH_TOKEN_PARAM_NAME env var (not plaintext token)", () => {
  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "stravaEventProcessorLambda",
    Environment: Match.objectLike({
      Variables: Match.objectLike({
        BDT_AUTH_TOKEN_PARAM_NAME: "/bdt/auth_token",
      }),
    }),
  });
});

test("Processor Lambda Role has permission to read BDT auth token from SSM", () => {
  const bdtAuthTokenParamArn = {
    "Fn::Join": [
      "",
      [
        "arn:",
        { Ref: "AWS::Partition" },
        ":ssm:",
        { Ref: "AWS::Region" },
        ":",
        { Ref: "AWS::AccountId" },
        ":parameter/bdt/auth_token",
      ],
    ],
  };

  template.hasResourceProperties("AWS::IAM::Policy", {
    Roles: Match.arrayWith([
      { Ref: Match.stringLikeRegexp("StravaEventProcessorLambdaServiceRole*") },
    ]),
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({
          Effect: "Allow",
          Action: Match.arrayWith(["ssm:GetParameter", "ssm:GetParameters"]),
          Resource: Match.arrayWith([bdtAuthTokenParamArn]),
        }),
      ]),
    },
  });
});

test("the Strava Webhook Queue sends a message to a 14-day dead-letter queue after 5 receives", () => {
  template.hasResourceProperties("AWS::SQS::Queue", {
    QueueName: "strava-webhook-dlq",
    MessageRetentionPeriod: 1_209_600,
  });
  template.hasResourceProperties("AWS::SQS::Queue", {
    QueueName: "strava-webhook-queue",
    RedrivePolicy: {
      deadLetterTargetArn: {
        "Fn::GetAtt": [Match.stringLikeRegexp("StravaWebhookDLQ*"), "Arn"],
      },
      maxReceiveCount: 5,
    },
  });
});

test("the Strava Webhook Queue's visibility timeout is at least 6 times the processor's 120-second timeout", () => {
  const [processor] = Object.values(
    template.findResources("AWS::Lambda::Function", {
      Properties: { FunctionName: "stravaEventProcessorLambda" },
    }),
  );
  const [queue] = Object.values(
    template.findResources("AWS::SQS::Queue", {
      Properties: { QueueName: "strava-webhook-queue" },
    }),
  );

  expect(processor.Properties.Timeout).toBe(120);
  expect(queue.Properties.VisibilityTimeout).toBeGreaterThanOrEqual(
    6 * processor.Properties.Timeout,
  );
});

test("the processor takes 5 messages at a time and reports which ones failed", () => {
  template.hasResourceProperties("AWS::Lambda::EventSourceMapping", {
    EventSourceArn: {
      "Fn::GetAtt": [Match.stringLikeRegexp("StravaWebhookQueue*"), "Arn"],
    },
    BatchSize: 5,
    FunctionResponseTypes: ["ReportBatchItemFailures"],
  });
});

describe("Strava processor alarms notify the Overcast_Error topic", () => {
  const overcastErrorTopicArn = [
    {
      "Fn::Join": [
        "",
        [
          "arn:",
          { Ref: "AWS::Partition" },
          ":sns:eu-west-1:",
          { Ref: "AWS::AccountId" },
          ":Overcast_Error",
        ],
      ],
    },
  ];

  test("when a message is in the dead-letter queue", () => {
    template.hasResourceProperties("AWS::CloudWatch::Alarm", {
      Namespace: "AWS/SQS",
      MetricName: "ApproximateNumberOfMessagesVisible",
      Dimensions: [
        {
          Name: "QueueName",
          Value: {
            "Fn::GetAtt": [
              Match.stringLikeRegexp("StravaWebhookDLQ*"),
              "QueueName",
            ],
          },
        },
      ],
      Statistic: "Maximum",
      Period: 300,
      EvaluationPeriods: 1,
      ComparisonOperator: "GreaterThanThreshold",
      Threshold: 0,
      TreatMissingData: "notBreaching",
      AlarmActions: overcastErrorTopicArn,
    });
  });

  test("when the processor errors", () => {
    template.hasResourceProperties("AWS::CloudWatch::Alarm", {
      Namespace: "AWS/Lambda",
      MetricName: "Errors",
      Dimensions: [
        {
          Name: "FunctionName",
          Value: { Ref: Match.stringLikeRegexp("StravaEventProcessorLambda*") },
        },
      ],
      Statistic: "Sum",
      Period: 300,
      EvaluationPeriods: 1,
      ComparisonOperator: "GreaterThanThreshold",
      Threshold: 0,
      TreatMissingData: "notBreaching",
      AlarmActions: overcastErrorTopicArn,
    });
  });

  test("and the stack leaves the topic itself unmanaged", () => {
    template.resourceCountIs("AWS::SNS::Topic", 0);
  });
});

test("the processor's timeout outlasts a token refresh and a full batch whose every request hangs", () => {
  const [processor] = Object.values(
    template.findResources("AWS::Lambda::Function", {
      Properties: { FunctionName: "stravaEventProcessorLambda" },
    }),
  );

  expect(processor.Properties.Timeout * 1000).toBeGreaterThan(
    REQUESTS_PER_BATCH * REQUEST_TIMEOUT_MS,
  );
});
