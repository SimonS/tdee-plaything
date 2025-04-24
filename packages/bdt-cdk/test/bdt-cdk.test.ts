import { Template, Match } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { test } from "@jest/globals";

import * as BdtCdk from "../lib/bdt-cdk-stack";
import { Runtime } from "aws-cdk-lib/aws-lambda";

const synthesiseTestStack = (): Template => {
  const app = new cdk.App();
  const stack = new BdtCdk.BdtCdkStack(app, "TestStack");
  return Template.fromStack(stack);
};

test("creates and wires up an overcast lambda", () => {
  const template = synthesiseTestStack();

  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "overcastLambda",
    MemorySize: 512,
    Runtime: "nodejs18.x",
  });
});

test("adds a rule to run lambda on cronjob", () => {
  const app = new cdk.App();
  const stack = new BdtCdk.BdtCdkStack(app, "MyTestStack");

  const lambdaId = stack.getLogicalId(
    stack.node.findChild("OvercastLambda").node.defaultChild as cdk.CfnElement
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
  const template = synthesiseTestStack();

  template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
    ProtocolType: "HTTP",
  });
});

test("Stack should contain the Strava Webhook Receiver Lambda function", () => {
  const template = synthesiseTestStack();

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
  const template = synthesiseTestStack();

  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "stravaEventProcessorLambda",
    Runtime: Runtime.NODEJS_22_X.name,
    Handler: "index.handler",
  });
});

test("Event source mapping between Queue and Processor", () => {
  const template = synthesiseTestStack();

  template.hasResourceProperties("AWS::Lambda::EventSourceMapping", {
    EventSourceArn: { 
      "Fn::GetAtt": [
        Match.stringLikeRegexp("StravaWebhookQueue*"),
        "Arn"
      ]
    },
    FunctionName: {
      "Ref": Match.stringLikeRegexp("StravaEventProcessorLambda*")
    },
  });
});

test("point the Strava Webhook API Gateway to the Strava Receiver Lambda", () => {
  const template = synthesiseTestStack();

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
});

test("Stack should contain the Strava Webhook SQS Queue", () => {
  const template = synthesiseTestStack();

  template.hasResourceProperties("AWS::SQS::Queue", {
    QueueName: "strava-webhook-queue",
  });
});

test("Receiver Lambda Role should have SendMessage permission for Webhook Queue", () => {
  const template = synthesiseTestStack();

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
