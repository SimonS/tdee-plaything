import { Template, Match } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { test, beforeAll } from "@jest/globals";
import * as BdtCdk from "../lib/bdt-cdk-stack";
import { Runtime } from "aws-cdk-lib/aws-lambda";

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
    Runtime: "nodejs18.x",
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

test("Processor Lambda Role should have permissions to read Strava creds from SSM", () => {
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
